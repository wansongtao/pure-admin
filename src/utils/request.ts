import axios, { type AxiosError, type AxiosResponse, type AxiosRequestConfig } from 'axios'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'
import { getDataType, throttle } from '@/utils/index'

import type { IBaseResponse } from '@/types/index'

const historyRequestMap: Record<string, number> = {}
/**
 * Async clear expired request information every 5 seconds.
 */
const clearHistoryReqMap = throttle((expiredTime: number) => {
  setTimeout(() => {
    const keys = Object.keys(historyRequestMap)
    if (!keys.length) {
      return
    }

    for (const key in keys) {
      if (historyRequestMap[key] < expiredTime) {
        delete historyRequestMap[key]
      }
    }
  }, 0)
}, 5000)
const isDuplicateRequest = (config: AxiosRequestConfig, interval = 400) => {
  const { method, url, data, params } = config
  let key = `${method}-${url}`

  try {
    if (data && getDataType(data) === 'object') {
      key += `-${JSON.stringify(data)}`
    }
    if (params && getDataType(params) === 'object') {
      key += `-${JSON.stringify(params)}`
    }

    const timestamp = Date.now()
    if (historyRequestMap[key] && timestamp - historyRequestMap[key] < interval) {
      return true
    }

    historyRequestMap[key] = timestamp
    clearHistoryReqMap(timestamp - interval)
    return false
  } catch (e) {
    return false
  }
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json;'
  }
})

const goToLogin = (seconds = 2) => {
  setTimeout(() => {
    const store = useUserStore()
    store.removeToken()

    const loginPath = `/login?redirect=${encodeURIComponent(location.pathname + location.search)}`
    location.href = location.origin + loginPath
  }, seconds * 1000)
}

instance.interceptors.request.use(
  (config) => {
    if (config.headers?.isToken !== false) {
      const store = useUserStore()
      const token = store.getToken()

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    if (!config.headers?.allowDuplication && isDuplicateRequest(config)) {
      return Promise.reject({ code: 'ERR_CANCELED', message: 'Duplicate request' })
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (res: AxiosResponse<IBaseResponse | Blob, any>): any => {
    const data = res.data

    if (data instanceof Blob) {
      return data
    }

    if (data.code === 300 || data.code === 401) {
      message.error(data.msg, 2)
      goToLogin()
      return Promise.reject(data.msg)
    }

    if (data.code !== 200) {
      message.error(data.msg)
      return Promise.reject(data.msg)
    }

    return data
  },
  (error: AxiosError) => {
    // Cancel request
    if (error.code === 'ERR_CANCELED') {
      console.warn(error.message)
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
      .request<any, IBaseResponse | Blob>(config)
      .then((res) => {
        resolve({ result: res as T })
      })
      .catch((error: AxiosError | string) => {
        if (typeof error === 'string') {
          resolve({
            error: {
              message: error,
              name: '',
              isAxiosError: false,
              toJSON: () => {
                return { '[Object]': '[Object]' }
              }
            }
          })
          return
        }

        resolve({ error })
      })
  })
}

export default instance
