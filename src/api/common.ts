import { request } from '@/utils/request'

import type { IBaseResponse } from '@/types/index'
import type {
  ILoginParams,
  IMenuData,
  IUserInfo,
  IProfile,
  IProfileParam
} from '@/types/api/common'

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

export const getProfile = () => {
  return request<IBaseResponse<IProfile>>({
    url: '/admin/profile',
    method: 'get'
  })
}

export const updateProfile = (data: IProfileParam) => {
  return request<IBaseResponse>({
    url: '/admin/profile',
    method: 'put',
    data
  })
}

export const updatePassword = (data: { oldPassword: string; newPassword: string }) => {
  return request<IBaseResponse>({
    url: '/admin/auth/password',
    method: 'put',
    data
  })
}
