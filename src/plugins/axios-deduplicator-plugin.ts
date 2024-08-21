import { getDataType } from '@/utils'

import type {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'

export type ICallback = (data?: AxiosResponse, error?: AxiosError) => void

export interface IOptions<
  T extends AxiosRequestConfig = AxiosRequestConfig,
  U extends AxiosError = AxiosError
> {
  timeout?: number
  generateRequestKey: (config: T) => string
  isAllowRepeat?: (config: T) => boolean
  isSkipHttpStatusError?: (error: U) => boolean
}

export class AxiosDeduplicatorPlugin {
  static CODE = 'ERR_REPEATED'
  histories: Map<string, 1> = new Map()
  waitQueue: Map<string, ICallback[]> = new Map()
  options: IOptions = {
    generateRequestKey: AxiosDeduplicatorPlugin.generateRequestKey
  }

  constructor({
    timeout,
    generateRequestKey,
    isAllowRepeat,
    isSkipHttpStatusError
  }: Partial<IOptions> = {}) {
    this.options.timeout = timeout
    this.options.generateRequestKey = generateRequestKey || this.options.generateRequestKey
    this.options.isAllowRepeat = isAllowRepeat
    this.options.isSkipHttpStatusError = isSkipHttpStatusError
  }

  static generateRequestKey(config: AxiosRequestConfig): string {
    const { method, url, data, params } = config
    let key = `${method}-${url}`

    try {
      if (data && getDataType(data) === 'object') {
        key += `-${JSON.stringify(data)}`
      } else if (getDataType(data) === 'formdata') {
        for (const [k, v] of data.entries()) {
          if (v instanceof Blob) {
            continue
          }
          key += `-${k}-${v}`
        }
      }

      if (params && getDataType(params) === 'object') {
        key += `-${JSON.stringify(params)}`
      }

      key = encodeURIComponent(key)
    } catch (e) {
      /* empty */
    }

    return key
  }

  private on(key: string, callback: ICallback) {
    if (!this.waitQueue.has(key)) {
      this.waitQueue.set(key, [])
    }

    this.waitQueue.get(key)!.push(callback)
  }

  private remove(key: string) {
    this.waitQueue.delete(key)
    this.histories.delete(key)
  }

  private emit(key: string, data?: AxiosResponse, error?: AxiosError) {
    if (this.waitQueue.has(key)) {
      for (const callback of this.waitQueue.get(key)!) {
        callback(data, error)
      }
    }

    this.remove(key)
  }

  addPending(key: string) {
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
        if (error) {
          reject(error)
        } else {
          resolve(data!)
        }
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

  responseInterceptor(response: AxiosResponse) {
    const key = this.options.generateRequestKey(response.config)
    this.emit(key, response)
    return response
  }

  responseInterceptorError(error: AxiosError) {
    const key = this.options.generateRequestKey(error.config!)
    if (this.options.isSkipHttpStatusError && this.options.isSkipHttpStatusError(error)) {
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
    responseInterceptorFulfilled: obj.responseInterceptor.bind(obj),
    responseInterceptorRejected: obj.responseInterceptorError.bind(obj)
  }
}
