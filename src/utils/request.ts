import axios, {
  AxiosError,
  type AxiosResponse,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig
} from 'axios'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'
import { getDataType } from '@/utils/index'
import EventBus from '@/event/eventBus'
import router from '@/router/index'
import { refreshToken } from '@/api/common'
import { getRefreshToken, setToken, setRefreshToken } from './token'

import type { IBaseResponse, IConfigHeader } from '@/types/index'

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

const goToLogin = (seconds = 2) => {
  setTimeout(() => {
    const store = useUserStore()
    store.reset()

    router.push({
      name: 'Login',
      query: {
        redirect: router.currentRoute.value.fullPath
      }
    })
  }, seconds * 1000)
}

const getKey = (config: AxiosRequestConfig) => {
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

const redundantRequestHandler = {
  eventBus: new EventBus<{
    [key: string]: (data?: AxiosResponse<IBaseResponse | Blob>, error?: AxiosError) => void
  }>(),
  historyRecord: new Map<string, number>(),
  requestInterceptor(config: AxiosRequestConfig) {
    if (config.headers?.isAllowRepetition === true) {
      return
    }

    const key = getKey(config)
    config.headers!.key = key
    const historyRecord = this.historyRecord

    if (historyRecord.has(key)) {
      config.headers!.requestTime = Date.now()
      return new AxiosError(
        'Redundant request',
        'ERR_REPEATED',
        config as InternalAxiosRequestConfig
      )
    }

    historyRecord.set(key, 1)
  },
  emitResult(
    config: AxiosRequestConfig,
    data?: AxiosResponse<IBaseResponse | Blob>,
    error?: AxiosError
  ) {
    const key = config.headers!.key
    const historyRecord = this.historyRecord

    if (key && historyRecord.has(key)) {
      historyRecord.delete(key)

      const eventBus = this.eventBus
      eventBus.$emit(key, data, error)

      eventBus.$off(key)
    }
  },
  addPendingEvent(code: string, config: AxiosRequestConfig) {
    if (code !== 'ERR_REPEATED') {
      return
    }

    return new Promise((resolve, reject) => {
      const key = config.headers!.key as string

      const requestTime = config.headers!.requestTime as number
      const delay = (config.timeout ?? 5000) - (Date.now() - requestTime)
      const timer = setTimeout(() => {
        reject(
          new AxiosError('Request timeout', 'ERR_CANCELED', config as InternalAxiosRequestConfig)
        )
      }, delay)

      const callback = (res?: AxiosResponse<IBaseResponse | Blob>, err?: AxiosError) => {
        res ? resolve(res) : reject(err)
        timer && clearTimeout(timer)
      }
      this.eventBus.$on(key, callback)
    })
  }
}

const eventBus = new EventBus<{
  [key: string]: (data?: AxiosResponse<IBaseResponse | Blob>, error?: AxiosError) => void
}>()

let isRefreshing = false
let isSendedRefreshReq = false
let waitRefreshQueue: string[] = []

const refreshRequest = async (error: AxiosError) => {
  const onError = () => {
    goToLogin()
    message.error(error.response?.statusText || error.message, 2)
    return Promise.reject(error)
  }

  const token = getRefreshToken()
  if (!token) {
    return onError()
  }

  isRefreshing = true
  const [, result] = await refreshToken(token)
  isRefreshing = false
  isSendedRefreshReq = false
  if (!result) {
    return onError()
  }

  const store = useUserStore()
  store.token = result.data.token
  setToken(result.data.token)
  setRefreshToken(result.data.refreshToken)

  waitRefreshQueue.forEach((key) => {
    eventBus.$emit(key)
  })
  waitRefreshQueue = []

  return instance.request(error.config!)
}

instance.interceptors.request.use(
  (config) => {
    if (config.headers?.isToken !== false) {
      const store = useUserStore()
      const token = store.token

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    if (isRefreshing && isSendedRefreshReq) {
      const key = getKey(config)
      config.headers.key = key
      waitRefreshQueue = Array.from(new Set([...waitRefreshQueue, key]))
      return Promise.reject(new AxiosError('Refreshing token', 'ERR_REFRESH', config))
    }
    if (isRefreshing) {
      isSendedRefreshReq = true
    }

    const res = redundantRequestHandler.requestInterceptor(config)
    if (res) {
      return Promise.reject(res)
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

const responseInterceptor = (res: AxiosResponse<IBaseResponse | Blob>) => {
  const data = res.data
  const result: [AxiosResponse<IBaseResponse | Blob> | undefined, AxiosError | undefined] = [
    undefined,
    undefined
  ]

  if (data instanceof Blob || data.statusCode === 200) {
    result[0] = res
    return result
  }

  message.error(data.message)
  result[1] = new AxiosError(data.message)
  return result
}

instance.interceptors.response.use(
  (res: AxiosResponse<IBaseResponse | Blob>) => {
    const [data, error] = responseInterceptor(res)
    redundantRequestHandler.emitResult(res.config, data, error)
    return data !== undefined ? data : Promise.reject(error)
  },
  (error: AxiosError) => {
    const result = redundantRequestHandler.addPendingEvent(error.code!, error.config!)
    if (result) {
      return result
    }
    // 请求错误时，给其他等待相同请求的请求发送错误信息
    redundantRequestHandler.emitResult(error.config!, undefined, error)

    if (error.code === 'ERR_REFRESH') {
      return new Promise((resolve, reject) => {
        const config = error.config!
        const key = config.headers.key as string
        const callback = () => {
          instance
            .request(config)
            .then((res) => {
              resolve(res)
            })
            .catch((err) => {
              reject(err)
            })
          eventBus.$off(key, callback)
        }
        eventBus.$on(key, callback)
      })
    }

    if (error.code === 'ERR_CANCELED') {
      return Promise.reject(error)
    }

    if (error.response?.status === 401) {
      if (isRefreshing === false) {
        return refreshRequest(error)
      }

      goToLogin()
      message.error(error.response?.statusText || error.message, 2)
      return Promise.reject(error)
    }

    message.error(error.response?.statusText || error.message)
    return Promise.reject(error)
  }
)

const request = <T extends IBaseResponse | Blob, C = any>(
  config: AxiosRequestConfig<C> & IConfigHeader
) => {
  return new Promise<[err?: AxiosError, data?: T]>((resolve) => {
    instance
      .request<IBaseResponse | Blob>(config)
      .then((res) => {
        resolve([undefined, res.data as T])
      })
      .catch((error: AxiosError) => {
        resolve([error])
      })
  })
}

export default request
