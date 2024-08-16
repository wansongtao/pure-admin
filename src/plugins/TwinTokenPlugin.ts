import {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'

type IRequest = (config: AxiosRequestConfig) => Promise<AxiosResponse>
type IGetNewToken = () => Promise<AxiosError | undefined>

export class TwinTokenPlugin {
  private static CODE = 'ERR_REFRESH'

  private isRefreshing = false
  private isSendedRefreshReq = false
  private waitQueue: Function[]
  request: IRequest
  getNewToken: IGetNewToken

  constructor(
    request: IRequest,
    getNewToken: IGetNewToken
  ) {
    this.waitQueue = []
    this.request = request
    this.getNewToken = getNewToken
  }

  onPending(config: InternalAxiosRequestConfig) {
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

      this.waitQueue.push(callback)
    })
  }

  onFulfilled() {
    this.waitQueue.forEach((fn) => {
      fn()
    })
    this.waitQueue = []
  }

  refreshToken(config: InternalAxiosRequestConfig) {
    return new Promise((resolve, reject) => {
      this.isRefreshing = true

      this.getNewToken().then((err) => {
        this.isRefreshing = false
        this.isSendedRefreshReq = false

        if (err) {
          err.response = {
            status: 401,
            statusText: 'Unauthorized'
          } as any
          reject(err)
          return
        }

        this.request(config).then(resolve).catch(reject)
        this.onFulfilled()
      })
    })
  }

  requestInterceptor(config: InternalAxiosRequestConfig) {
    if (this.isRefreshing && this.isSendedRefreshReq) {
      return Promise.reject(new AxiosError('Refreshing token', TwinTokenPlugin.CODE, config))
    }
    if (this.isRefreshing) {
      this.isSendedRefreshReq = true
    }

    return config
  }

  responseInterceptorRejected(error: AxiosError) {
    if (error.code === TwinTokenPlugin.CODE) {
      return this.onPending(error.config!)
    }

    if (error.response?.status === 401 && !this.isRefreshing) {
      return this.refreshToken(error.config!)
    }

    return Promise.reject(error)
  }
}

export default function createTwinTokenPlugin(
  request: IRequest,
  getNewToken: IGetNewToken
) {
  const obj = new TwinTokenPlugin(request, getNewToken)

  return {
    requestInterceptor: obj.requestInterceptor.bind(obj),
    responseInterceptorRejected: obj.responseInterceptorRejected.bind(obj)
  }
}
