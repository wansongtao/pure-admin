import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'

export type ICallback = (data?: AxiosResponse, error?: AxiosError) => void

export interface IOptions<
  T extends AxiosRequestConfig = AxiosRequestConfig,
  U extends AxiosError = AxiosError,
  V extends AxiosResponse = AxiosResponse
> {
  timeout?: number
  generateRequestKey: (config: T) => string
  isAllowRepeat?: (config: T) => boolean
  deleteCurrentHistory?: (error?: U, res?: V) => boolean
}

export class AxiosDeduplicatorPlugin {
  static CODE = 'ERR_REPEATED'
  histories: Map<string, 1> = new Map()
  pendingQueue: Map<string, ICallback[]> = new Map()
  options: IOptions = {
    generateRequestKey: AxiosDeduplicatorPlugin.generateRequestKey
  }

  constructor({
    timeout,
    generateRequestKey,
    isAllowRepeat,
    deleteCurrentHistory
  }: Partial<IOptions> = {}) {
    this.options.timeout = timeout
    this.options.isAllowRepeat = isAllowRepeat
    this.options.deleteCurrentHistory = deleteCurrentHistory

    if (generateRequestKey) {
      this.options.generateRequestKey = generateRequestKey
    }
  }

  static getDataType(obj: any) {
    let res = Object.prototype.toString.call(obj).split(' ')[1]
    res = res.substring(0, res.length - 1).toLowerCase()
    return res
  }

  static generateRequestKey(config: AxiosRequestConfig): string {
    const { method, url, data, params } = config
    let key = `${method}-${url}`

    try {
      if (data && AxiosDeduplicatorPlugin.getDataType(data) === 'object') {
        key += `-${JSON.stringify(data)}`
      } else if (AxiosDeduplicatorPlugin.getDataType(data) === 'formdata') {
        for (const [k, v] of data.entries()) {
          if (v instanceof Blob) {
            continue
          }
          key += `-${k}-${v}`
        }
      }

      if (params && AxiosDeduplicatorPlugin.getDataType(params) === 'object') {
        key += `-${JSON.stringify(params)}`
      }

      key = encodeURIComponent(key)
    } catch (e) {
      /* empty */
    }

    return key
  }

  private on(key: string, callback: ICallback) {
    if (!this.pendingQueue.has(key)) {
      this.pendingQueue.set(key, [])
    }

    this.pendingQueue.get(key)!.push(callback)
  }

  private remove(key: string) {
    this.pendingQueue.delete(key)
    this.histories.delete(key)
  }

  private emit(key: string, data?: AxiosResponse, error?: AxiosError) {
    if (this.pendingQueue.has(key)) {
      for (const callback of this.pendingQueue.get(key)!) {
        callback(data, error)
      }
    }

    this.remove(key)
  }

  private addPending(key: string) {
    return new Promise<AxiosResponse>((resolve, reject) => {
      const delay = this.options.timeout
      let timer: NodeJS.Timeout | undefined
      if (delay) {
        timer = setTimeout(() => {
          reject({
            code: 'ERR_CANCELED',
            message: 'Request timeout'
          })
        }, delay)
      }

      const callback = (data?: AxiosResponse, error?: AxiosError) => {
        data ? resolve(data) : reject(error)
        timer && clearTimeout(timer)
      }

      this.on(key, callback)
    })
  }

  requestInterceptor(config: InternalAxiosRequestConfig) {
    const isAllowRepeat = this.options.isAllowRepeat ? this.options.isAllowRepeat(config) : false

    if (!isAllowRepeat) {
      const key = this.options.generateRequestKey(config)

      if (this.histories.has(key)) {
        return Promise.reject({
          code: AxiosDeduplicatorPlugin.CODE,
          message: 'Request repeated',
          config
        })
      }

      this.histories.set(key, 1)
    }

    return config
  }

  responseInterceptorFulfilled(response: AxiosResponse) {
    const key = this.options.generateRequestKey(response.config)
    if (this.options.deleteCurrentHistory && this.options.deleteCurrentHistory(undefined, response)) {
      this.remove(key)
      return response
    }

    this.emit(key, response)
    return response
  }

  responseInterceptorRejected(error: AxiosError) {
    const key = this.options.generateRequestKey(error.config!)
    if (this.options.deleteCurrentHistory && this.options.deleteCurrentHistory(error)) {
      this.remove(key)
      return Promise.reject(error)
    }

    if (error.code === AxiosDeduplicatorPlugin.CODE) {
      return this.addPending(key)
    }

    this.emit(key, undefined, error)

    return Promise.reject(error)
  }
}

export default function createAxiosDeduplicatorPlugin(options: Partial<IOptions> = {}) {
  const obj = new AxiosDeduplicatorPlugin(options)

  return {
    requestInterceptor: obj.requestInterceptor.bind(obj),
    responseInterceptorFulfilled: obj.responseInterceptorFulfilled.bind(obj),
    responseInterceptorRejected: obj.responseInterceptorRejected.bind(obj)
  }
}
