import instance from '@/utils/request'

import type { IBaseResponse } from '@/types/index'
import type { ILoginParams } from '@/types/api/common'

export const getCaptcha = () => {
  return instance.request<any, IBaseResponse<string>>({
    url: '/admin/captcha',
    method: 'GET',
    headers: {
      isToken: false
    }
  })
}

export const setLogin = (data: ILoginParams) => {
  return instance.request<any, IBaseResponse<string>>({
    url: '/admin/login',
    method: 'POST',
    headers: {
      isToken: false
    },
    data
  })
}

export const setLogout = () => {
  return instance.request<any, IBaseResponse<null>>({
    url: '/admin/logout',
    method: 'POST'
  })
}
