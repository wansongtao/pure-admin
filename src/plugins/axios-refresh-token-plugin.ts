import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'

type IRequest = (config: AxiosRequestConfig) => Promise<AxiosResponse>
type IRefreshTokenFn = () => Promise<boolean>
type IsRefreshToken = (error?: AxiosError, res?: AxiosResponse) => boolean
interface IError extends AxiosError {
  config: InternalAxiosRequestConfig
}

export class AxiosRefreshTokenPlugin {
  static CODE = 'ERR_REFRESH'
  static CODE_FAILED = 'ERR_REFRESH_FAILED'
  private isRefreshing = false
  private isStartedRefresh = false
  private pendingQueue: Function[]
  request: IRequest
  refreshTokenFn: IRefreshTokenFn
  isRefreshToken = (error?: AxiosError, res?: AxiosResponse) => {
    if (error) {
      return error.response?.status === 401
    }

    if (res) {
      return res.data?.code === 401
    }

    return false
  }

  constructor(refreshTokenFn: IRefreshTokenFn, request: IRequest, isRefreshToken?: IsRefreshToken) {
    this.pendingQueue = []
    this.request = request
    this.refreshTokenFn = refreshTokenFn
    if (isRefreshToken) {
      this.isRefreshToken = isRefreshToken
    }
  }

  private createError(message: string, code: string, config: InternalAxiosRequestConfig) {
    const error = new Error(message) as IError
    error.code = code
    error.config = config
    error.isAxiosError = false
    error.toJSON = () => ({})
    error.name = 'RefreshTokenPluginError'
    return error
  }

  addPending(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      const delay = config.timeout
      let timer: NodeJS.Timeout | null = null
      if (delay) {
        timer = setTimeout(() => {
          const error = this.createError('Request timeout', 'ERR_CANCELED', config)
          reject(error)
        }, delay)
      }

      const callback = () => {
        this.request(config).then(resolve).catch(reject)
        timer && clearTimeout(timer)
      }

      this.pendingQueue.push(callback)
    })
  }

  refresh(error: AxiosError): Promise<AxiosResponse> {
    this.isRefreshing = true

    return new Promise((resolve, reject) => {
      this.refreshTokenFn().then((res) => {
        this.isRefreshing = false
        this.isStartedRefresh = false

        if (!res) {
          this.pendingQueue = []
          error.message = 'Refresh token failed'
          error.code = AxiosRefreshTokenPlugin.CODE_FAILED
          reject(error)
          return
        }

        this.addPending(error.config!).then(resolve).catch(reject)

        this.pendingQueue.forEach((fn) => {
          fn()
        })
        this.pendingQueue = []
      })
    })
  }

  requestInterceptor(config: InternalAxiosRequestConfig) {
    if (this.isRefreshing && this.isStartedRefresh) {
      const error = this.createError('Refreshing token', AxiosRefreshTokenPlugin.CODE, config)
      return Promise.reject(error)
    }
    if (this.isRefreshing) {
      this.isStartedRefresh = true
    }

    return config
  }

  responseInterceptorFulfilled(response: AxiosResponse) {
    if (this.isRefreshToken(undefined, response)) {
      const error = this.createError('Unauthorized', 'ERR_UNAUTHORIZED', response.config)
      return this.refresh(error)
    }

    return response
  }

  responseInterceptorRejected(error: AxiosError) {
    if (error.code === AxiosRefreshTokenPlugin.CODE) {
      return this.addPending(error.config!)
    }

    if (this.isRefreshToken(error)) {
      return this.refresh(error)
    }

    return Promise.reject(error)
  }
}

export default function createRefreshTokenPlugin(
  refreshToken: IRefreshTokenFn,
  request: IRequest,
  isRefreshToken?: IsRefreshToken
) {
  const obj = new AxiosRefreshTokenPlugin(refreshToken, request, isRefreshToken)

  return {
    requestInterceptor: obj.requestInterceptor.bind(obj),
    responseInterceptorFulfilled: obj.responseInterceptorFulfilled.bind(obj),
    responseInterceptorRejected: obj.responseInterceptorRejected.bind(obj)
  }
}
