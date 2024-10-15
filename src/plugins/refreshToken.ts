import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'

type IRequest = (config: AxiosRequestConfig) => Promise<AxiosResponse>
type IRefreshTokenFn = () => Promise<boolean>
type IsRefresh = (error?: AxiosError, res?: AxiosResponse) => boolean
interface IError extends AxiosError {
  config: InternalAxiosRequestConfig
}

export class AxiosRefreshTokenPlugin {
  static CODE = 'ERR_REFRESH'
  static CODE_FAILED = 'ERR_REFRESH_FAILED'
  private isRefreshing = false
  private isStartedRefresh = false
  pendingQueue: Function[]
  request: IRequest
  refreshTokenFn: IRefreshTokenFn

  constructor(refreshTokenFn: IRefreshTokenFn, request: IRequest, isRefresh?: IsRefresh) {
    this.pendingQueue = []
    this.request = request
    this.refreshTokenFn = refreshTokenFn

    if (isRefresh) {
      this.isRefresh = isRefresh
    }
  }

  static createError(message: string, code: string, config: InternalAxiosRequestConfig) {
    const error = new Error(message) as IError
    error.code = code
    error.config = config
    error.isAxiosError = false
    error.toJSON = () => ({})
    error.name = 'RefreshTokenPluginError'
    return error
  }

  isRefresh(error: AxiosError): boolean
  isRefresh(error: undefined, res: AxiosResponse): boolean
  isRefresh(error?: AxiosError, res?: AxiosResponse) {
    if (error) {
      return error.response?.status === 401
    }
    if (res) {
      return res.data?.code === 401
    }

    return false
  }

  addPending(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      const delay = config.timeout
      let timer: NodeJS.Timeout | null = null
      if (delay) {
        timer = setTimeout(() => {
          const error = AxiosRefreshTokenPlugin.createError(
            'Request timeout',
            'ERR_CANCELED',
            config
          )
          reject(error)
        }, delay)
      }

      const callback = () => {
        timer && clearTimeout(timer)
        this.request(config).then(resolve).catch(reject)
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
      const error = AxiosRefreshTokenPlugin.createError(
        'Refreshing token',
        AxiosRefreshTokenPlugin.CODE,
        config
      )
      return Promise.reject(error)
    }
    if (this.isRefreshing) {
      this.isStartedRefresh = true
    }

    return config
  }

  responseInterceptorFulfilled(response: AxiosResponse) {
    if (this.isRefresh(undefined, response) && !this.isRefreshing) {
      const error = AxiosRefreshTokenPlugin.createError(
        'Unauthorized',
        'ERR_UNAUTHORIZED',
        response.config
      )
      return this.refresh(error)
    }

    return response
  }

  responseInterceptorRejected(error: AxiosError) {
    if (error.code === AxiosRefreshTokenPlugin.CODE) {
      return this.addPending(error.config!)
    }

    if (this.isRefresh(error) && !this.isRefreshing) {
      return this.refresh(error)
    }

    return Promise.reject(error)
  }
}

export default function createRefreshTokenPlugin(
  refreshToken: IRefreshTokenFn,
  request: IRequest,
  isRefresh?: IsRefresh
) {
  const instance = new AxiosRefreshTokenPlugin(refreshToken, request, isRefresh)

  return {
    requestInterceptor: instance.requestInterceptor.bind(instance),
    responseInterceptorFulfilled: instance.responseInterceptorFulfilled.bind(instance),
    responseInterceptorRejected: instance.responseInterceptorRejected.bind(instance)
  }
}
