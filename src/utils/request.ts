import axios, { AxiosError, type AxiosResponse, type AxiosRequestConfig } from 'axios'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'
import { getDataType } from '@/utils/index'
import EventBus from '@/event/eventBus'
import router from '@/router/index'

import type { IBaseResponse, IConfigHeader } from '@/types/index'

const goToLogin = (seconds = 2) => {
  setTimeout(() => {
    const store = useUserStore()
    store.removeToken()

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

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

const historyRequests = new Map<string, number>()
instance.interceptors.request.use(
  (config) => {
    if (config.headers?.isAllowRepetition !== true) {
      const key = getKey(config)
      config.headers.key = key
      if (historyRequests.has(key)) {
        config.headers.requestTime = Date.now()
        return Promise.reject(new AxiosError('Redundant request', 'ERR_REPEATED', config))
      }
      historyRequests.set(key, 1)
    }

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

  if (data instanceof Blob || data.statusCode === 200) {
    result[0] = res
    return result
  }

  if (data.statusCode === 401) {
    message.error(data.message, 2)
    goToLogin()
  } else {
    message.error(data.message)
  }
  result[1] = new AxiosError(data.message)

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
      })
    }

    // 如果存在重复请求，则触发事件，将结果返回给请求
    const key = error?.config?.headers.key as string
    if (historyRequests.has(key)) {
      historyRequests.delete(key)
      eventBus.$emit(key, undefined, error)
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
