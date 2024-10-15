import { getDataType } from '@/utils'

import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export interface IOptions<
  T extends AxiosError = AxiosError,
  U extends AxiosResponse = AxiosResponse
> {
  maxRetryCount: number
  retryDelay: number
  request: (config: InternalAxiosRequestConfig) => Promise<AxiosResponse>
  isRetry: (error?: T, res?: U) => boolean
  beforeRetry?: (retryCount: number, error?: T, res?: U) => void
  failed?: (retryCount: number, error?: T, res?: U) => void
}

export type IConfig = Partial<IOptions> & Pick<IOptions, 'request'>

export class AxiosRetryRequestPlugin {
  private options: IOptions
  private histories: Map<string, number>

  constructor(options: IConfig) {
    this.options = {
      maxRetryCount: options.maxRetryCount ?? 3,
      retryDelay: options.retryDelay ?? 1000,
      request: options.request,
      isRetry:
        options.isRetry ??
        ((err) => {
          if (err) {
            return true
          }

          return false
        })
    }

    this.histories = new Map()
  }

  static generateRequestKey(config: InternalAxiosRequestConfig): string {
    const { method, url, data, params } = config
    let key = `${method}-${url}`

    try {
      switch (getDataType(data)) {
        case 'object':
          key += `-${JSON.stringify(data)}`
          break
        case 'formdata':
          for (const [k, v] of data.entries()) {
            if (v instanceof Blob) {
              continue
            }
            key += `-${k}-${v}`
          }
          break
        default:
          break
      }

      if (getDataType(params) === 'object') {
        key += `-${JSON.stringify(params)}`
      }
    } catch (e) {
      /* empty */
    }

    return key
  }

  private fetch(config: InternalAxiosRequestConfig, beforeRetry?: () => void) {
    return new Promise<AxiosResponse>((resolve, reject) => {
      if (!this.options.retryDelay || this.options.retryDelay < 0) {
        beforeRetry && beforeRetry()
        this.options.request(config).then(resolve).catch(reject)
        return
      }

      setTimeout(() => {
        beforeRetry && beforeRetry()
        this.options.request(config).then(resolve).catch(reject)
      }, this.options.retryDelay)
    })
  }

  private retryRequest(error: AxiosError): Promise<AxiosResponse>
  private retryRequest(error: undefined, res: AxiosResponse): AxiosResponse
  private retryRequest(error?: AxiosError, res?: AxiosResponse) {
    if (!this.options.isRetry(error, res)) {
      if (error) {
        return Promise.reject(error)
      }

      return res!
    }

    let config: InternalAxiosRequestConfig
    if (error) {
      if (!error.config) {
        return Promise.reject(error)
      }
      config = error.config
    } else {
      config = res!.config
    }

    const key = AxiosRetryRequestPlugin.generateRequestKey(config)
    const retryCount = this.histories.get(key) || 0

    if (retryCount >= this.options.maxRetryCount) {
      this.options.failed?.(retryCount, error, res)
      this.histories.delete(key)

      if (error) {
        return Promise.reject(error)
      }
      return res!
    }

    const newCount = retryCount + 1
    this.histories.set(key, newCount)

    return this.fetch(config, () => {
      this.options.beforeRetry?.(newCount, error, res)
    })
  }

  responseInterceptorFulfilled(response: AxiosResponse) {
    return this.retryRequest(undefined, response)
  }

  responseInterceptorRejected(error: AxiosError) {
    return this.retryRequest(error)
  }
}

export default function createAxiosRetryRequestPlugin(config: IConfig) {
  const instance = new AxiosRetryRequestPlugin(config)

  return {
    responseInterceptorFulfilled: instance.responseInterceptorFulfilled.bind(instance),
    responseInterceptorRejected: instance.responseInterceptorRejected.bind(instance)
  }
}
