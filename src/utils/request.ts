import axios, { AxiosError, type AxiosResponse, type AxiosRequestConfig } from 'axios'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'
import { getDataType } from '@/utils/index'
import EventBus from '@/event/eventBus'

import type { IBaseResponse } from '@/types/index'

const goToLogin = (seconds = 2) => {
  setTimeout(() => {
    const store = useUserStore()
    store.removeToken()

    const loginPath = `/login?redirect=${encodeURIComponent(location.pathname + location.search)}`
    location.href = location.origin + loginPath
  }, seconds * 1000)
}

const getKey = (config: AxiosRequestConfig) => {
  const { method, url, data, params } = config
  let key = `${method}-${url}`

  try {
    if (data && getDataType(data) === 'object') {
      key += `-${JSON.stringify(data)}`
    }
    if (params && getDataType(params) === 'object') {
      key += `-${JSON.stringify(params)}`
    }
  } catch (e) {
    console.error(e)
  }

  return key
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json;'
  }
})

const historyRequests = new Map<string, number>()
instance.interceptors.request.use(
  (config) => {
    // 防止重复请求
    const key = getKey(config)
    config.headers.key = key
    if (historyRequests.has(key)) {
      config.headers.requestTime = Date.now()
      return Promise.reject(new AxiosError('Redundant request', 'ERR_REPEATED', config))
    }
    historyRequests.set(key, 1)

    if (config.headers?.isToken !== false) {
      const store = useUserStore()
      const token = store.getToken()

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
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

  if (data instanceof Blob || data.code === 200) {
    result[0] = res
  } else {
    if (data.code === 300 || data.code === 401) {
      message.error(data.msg, 2)
      goToLogin()
    } else {
      message.error(data.msg)
    }
    result[1] = new AxiosError(data.msg)
  }

  return result
}

const eventBus = new EventBus<{
  [key: string]: (data?: AxiosResponse<IBaseResponse | Blob>, error?: AxiosError) => void
}>()

instance.interceptors.response.use(
  (res: AxiosResponse<IBaseResponse | Blob>) => {
    const [data, error] = responseInterceptor(res)

    // 如果存在重复请求，则触发事件，将结果返回给请求
    const key = res.config.headers.key as string
    if (historyRequests.has(key)) {
      historyRequests.delete(key)
      eventBus.$emit(key, data, error)
    }

    return data !== undefined ? data : Promise.reject(error)
  },
  (error: AxiosError) => {
    // 处理重复请求
    if (error.code === 'ERR_REPEATED') {
      return new Promise((resolve, reject) => {
        const config = error.config!
        const key = config.headers.key as string
        const callback = (res?: AxiosResponse<IBaseResponse | Blob>, err?: AxiosError) => {
          res ? resolve(res) : reject(err)
          eventBus.$off(key, callback)
        }
        eventBus.$on(key, callback)

        const timeout = config.timeout || 5000
        const requestTime = config.headers.requestTime as number
        const now = Date.now()
        if (now - requestTime > timeout) {
          historyRequests.delete(key)
          const error = new AxiosError(`timeout of ${timeout}ms exceeded`, 'ECONNABORTED', config)
          error.name = 'AxiosError'
          eventBus.$emit(key, undefined, error)
        }
      })
    }

    if (error.code === 'ERR_CANCELED') {
      return Promise.reject(error)
    }

    if (error.response?.status === 401) {
      goToLogin()
      message.error(error.response?.statusText || error.message, 2)
      return Promise.reject(error)
    }

    message.error(error.response?.statusText || error.message)
    return Promise.reject(error)
  }
)

export const request = <T extends IBaseResponse | Blob, C = any>(config: AxiosRequestConfig<C>) => {
  return new Promise<{ result?: T; error?: AxiosError }>((resolve) => {
    instance
      .request<IBaseResponse | Blob>(config)
      .then((res) => {
        resolve({ result: res.data as T })
      })
      .catch((error: AxiosError) => {
        resolve({ error })
      })
  })
}

export default instance
