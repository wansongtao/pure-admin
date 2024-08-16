import {
  AxiosError,
  type AxiosResponse,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig
} from 'axios'
import { getDataType } from '@/utils'

type IResponseHandler = (res: AxiosResponse) => [AxiosError | undefined, AxiosResponse | undefined]
type IIsAllowRepetition = (config: InternalAxiosRequestConfig) => boolean
type IIsSkipError = (error: AxiosError) => boolean
type ICallback = (data?: AxiosResponse, error?: AxiosError) => void

export class DuplicationRequestHandler {
  private static CODE = 'ERR_REPEATED'
  private static KEY = 'duplication-key'
  private static getRequestKey(config: AxiosRequestConfig) {
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
      console.error(e)
    }

    return key
  }

  private historyRecord: Map<string, 1>
  private waitQueue: Map<string, ICallback[]>
  responseHandler: IResponseHandler
  isAllowRepetition?: IIsAllowRepetition
  isSkipError?: IIsSkipError

  constructor(
    responseHandler: IResponseHandler,
    isAllowRepetition?: IIsAllowRepetition,
    isSkipError?: IIsSkipError
  ) {
    this.historyRecord = new Map()
    this.waitQueue = new Map()
    this.responseHandler = responseHandler
    this.isAllowRepetition = isAllowRepetition
    this.isSkipError = isSkipError
  }

  getDuplicationKey(config: AxiosRequestConfig): string {
    return (
      config.headers![DuplicationRequestHandler.KEY] ??
      DuplicationRequestHandler.getRequestKey(config)
    )
  }

  onFulfilled(config: AxiosRequestConfig, data?: AxiosResponse, error?: AxiosError) {
    const key = this.getDuplicationKey(config)
    if (this.historyRecord.has(key)) {
      this.waitQueue.get(key)?.forEach((cb) => cb(data, error))
      this.historyRecord.delete(key)
      this.waitQueue.delete(key)
    }
  }

  onPending(config: InternalAxiosRequestConfig) {
    return new Promise((resolve, reject) => {
      const delay = config.timeout ?? 5000
      const timer = setTimeout(() => {
        reject(new AxiosError('Request timeout', 'ERR_CANCELED', config))
      }, delay)

      const callback = (res?: AxiosResponse, err?: AxiosError) => {
        res ? resolve(res) : reject(err)
        timer && clearTimeout(timer)
      }

      const key = this.getDuplicationKey(config)
      if (!this.waitQueue.has(key)) {
        this.waitQueue.set(key, [])
      }
      this.waitQueue.get(key)?.push(callback)
    })
  }

  requestInterceptor(config: InternalAxiosRequestConfig) {
    if (this.isAllowRepetition && this.isAllowRepetition(config)) {
      return config
    }

    const key = this.getDuplicationKey(config)
    const historyRecord = this.historyRecord

    if (historyRecord.has(key)) {
      config.headers[DuplicationRequestHandler.KEY] = key
      return Promise.reject(
        new AxiosError('Redundant request', DuplicationRequestHandler.CODE, config)
      )
    }

    historyRecord.set(key, 1)
    return config
  }

  responseInterceptorFulfilled(res: AxiosResponse) {
    const [err] = this.responseHandler(res)
    if (err) {
      this.onFulfilled(res.config, undefined, err)
    } else {
      this.onFulfilled(res.config, res)
    }

    return res
  }

  responseInterceptorRejected(error: AxiosError) {
    if (this.isSkipError && this.isSkipError(error)) {
      const key = this.getDuplicationKey(error.config!)
      this.historyRecord.delete(key)
      return Promise.reject(error)
    }

    if (error.code === DuplicationRequestHandler.CODE) {
      return this.onPending(error.config!)
    }

    // 请求错误时，给其他等待相同请求的请求发送错误信息
    this.onFulfilled(error.config!, undefined, error)
    return Promise.reject(error)
  }
}

export default function createDuplicationRequestHandler(
  responseHandler: IResponseHandler,
  isAllowRepetition?: IIsAllowRepetition,
  isSkipError?: IIsSkipError
) {
  const obj = new DuplicationRequestHandler(responseHandler, isAllowRepetition, isSkipError)

  return {
    requestInterceptor: obj.requestInterceptor.bind(obj),
    responseInterceptorFulfilled: obj.responseInterceptorFulfilled.bind(obj),
    responseInterceptorRejected: obj.responseInterceptorRejected.bind(obj)
  }
}
