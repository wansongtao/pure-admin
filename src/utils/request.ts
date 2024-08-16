import axios, {
  AxiosError,
  type AxiosResponse,
  type AxiosRequestConfig,
} from 'axios'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'
import router from '@/router/index'
import { refreshToken } from '@/api/common'
import { getRefreshToken, setToken, setRefreshToken } from './token'
import createDuplicationRequestHandler from '@/plugins/duplicationReqInterceptor'
import createTwinTokenPlugin from '@/plugins/TwinTokenPlugin'

import type { IBaseResponse, IConfigHeader } from '@/types/index'

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

const saveToken = (token: string, refreshToken: string) => {
  const store = useUserStore()
  store.token = token
  setToken(token)
  setRefreshToken(refreshToken)
}

const responseInterceptor = (res: AxiosResponse<IBaseResponse | Blob>) => {
  const data = res.data
  const result: [AxiosError | undefined, AxiosResponse<IBaseResponse | Blob> | undefined] = [
    undefined,
    undefined
  ]

  if (data instanceof Blob || data.statusCode === 200) {
    result[1] = res
    return result
  }

  message.error(data.message)
  result[0] = new AxiosError(data.message)
  return result
}

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

const redundantRequestPlugin = createDuplicationRequestHandler(
  responseInterceptor,
  (config: AxiosRequestConfig) => {
    const headers = config.headers as IConfigHeader['headers']
    return headers?.isAllowRepetition === true
  },
  (error: AxiosError) => {
    return error.response?.status === 401
  }
)
instance.interceptors.request.use(redundantRequestPlugin.requestInterceptor)
instance.interceptors.response.use(
  redundantRequestPlugin.responseInterceptorFulfilled,
  redundantRequestPlugin.responseInterceptorRejected
)

const twinTokenPlugin = createTwinTokenPlugin(instance.request, async () => {
  const token = getRefreshToken()
  if (!token) {
    return new AxiosError('No refresh token')
  }

  const [err, res] = await refreshToken(token)
  if (!res) {
    return err
  }

  saveToken(res.data.token, res.data.refreshToken)
})
instance.interceptors.request.use(twinTokenPlugin.requestInterceptor)
instance.interceptors.response.use(undefined, twinTokenPlugin.responseInterceptorRejected)

instance.interceptors.request.use(
  (config) => {
    if (config.headers?.isToken !== false) {
      const store = useUserStore()
      const token = store.token

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
instance.interceptors.response.use(
  (res: AxiosResponse<IBaseResponse | Blob>) => {
    const [error, data] = responseInterceptor(res)
    return data !== undefined ? data : Promise.reject(error)
  },
  (error: AxiosError) => {
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
