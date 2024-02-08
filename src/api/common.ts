import { request } from '@/utils/request'

import type { IBaseResponse } from '@/types/index'
import type { ILoginParams, IMenuData, IUserInfo } from '@/types/api/common'

export const getCaptcha = () => {
  return request<IBaseResponse<string>>({
    url: '/admin/captcha',
    method: 'GET',
    headers: {
      isToken: false
    }
  })
}

export const setLogin = (data: ILoginParams) => {
  return request<IBaseResponse<string>>({
    url: '/admin/login',
    method: 'POST',
    headers: {
      isToken: false
    },
    data
  })
}

export const setLogout = () => {
  return request<IBaseResponse<null>>({
    url: '/admin/logout',
    method: 'POST'
  })
}

export const getMenus = () => {
  return request<IBaseResponse<IMenuData[]>>({
    url: '/admin/auth/menu',
    method: 'GET'
  })
}

export const getUserInfo = () => {
  return request<IBaseResponse<IUserInfo>>({
    url: '/admin/auth/userinfo',
    method: 'GET'
  })
}

export const uploadFile = (file: File) => {
  const data = new FormData()
  data.append('file', file)

  return request<IBaseResponse<string>>({
    url: '/admin/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}
