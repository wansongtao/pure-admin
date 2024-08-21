import {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'

type IRequest = (config: AxiosRequestConfig) => Promise<AxiosResponse>
type IRefreshToken = () => Promise<boolean>

export class RefreshTokenPlugin {
  private static CODE = 'ERR_REFRESH'
  private static CODE_FAILED = 'ERR_REFRESH_FAILED'
  private isRefreshing = false
  private isStartedRefresh = false
  private pendingQueue: Function[]
  request: IRequest
  refreshToken: IRefreshToken

  constructor(request: IRequest, refreshToken: IRefreshToken) {
    this.pendingQueue = []
    this.request = request
    this.refreshToken = refreshToken
  }

  addPending(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
    return new Promise((resolve, reject) => {
      const delay = config.timeout ?? 5000
      const timer = setTimeout(() => {
        reject(new AxiosError('Request timeout', 'ERR_CANCELED', config))
      }, delay)

      const callback = () => {
        this.request(config)
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
        timer && clearTimeout(timer)
      }

      this.pendingQueue.push(callback)
    })
  }

  refresh(error: AxiosError): Promise<AxiosResponse> {
    this.isRefreshing = true

    return new Promise((resolve, reject) => {
      this.refreshToken().then((res) => {
        this.isRefreshing = false
        this.isStartedRefresh = false

        if (!res) {
          this.pendingQueue = []
          error.message = 'Refresh token failed'
          error.code = RefreshTokenPlugin.CODE_FAILED
          reject(error)
          return
        }

        this.addPending(error.config!)
          .then((res) => {
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })

        this.pendingQueue.forEach((fn) => {
          fn()
        })
        this.pendingQueue = []
      })
    })
  }

  requestInterceptor(config: InternalAxiosRequestConfig) {
    if (this.isRefreshing && this.isStartedRefresh) {
      return Promise.reject(new AxiosError('Refreshing token', RefreshTokenPlugin.CODE, config))
    }
    if (this.isRefreshing) {
      this.isStartedRefresh = true
    }

    return config
  }

  responseInterceptorRejected(error: AxiosError) {
    if (error.code === RefreshTokenPlugin.CODE) {
      return this.addPending(error.config!)
    }

    if (error.response?.status === 401) {
      return this.refresh(error)
    }

    return Promise.reject(error)
  }
}

export default function createRefreshTokenPlugin(request: IRequest, refreshToken: IRefreshToken) {
  const obj = new RefreshTokenPlugin(request, refreshToken)

  return {
    requestInterceptor: obj.requestInterceptor.bind(obj),
    responseInterceptorRejected: obj.responseInterceptorRejected.bind(obj)
  }
}
