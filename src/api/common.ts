import request from '@/utils/request'

import type { IBaseResponse } from '@/types/index'
import type {
  ILoginParams,
  IUserInfo,
  IProfile,
  IProfileParam
} from '@/types/api/common'

export const getCaptcha = () => {
  return request<IBaseResponse<{ captcha: string }>>({
    url: '/auth/captcha',
    method: 'GET',
    headers: {
      isToken: false
    }
  })
}

export const setLogin = (data: ILoginParams) => {
  return request<IBaseResponse<{ token: string }>>({
    url: '/auth/login',
    method: 'POST',
    headers: {
      isToken: false
    },
    data
  })
}

export const setLogout = () => {
  return request<IBaseResponse<null>>({
    url: '/auth/logout',
    method: 'get'
  })
}

export const getUserInfo = () => {
  return request<IBaseResponse<IUserInfo>>({
    url: '/auth/userinfo',
    method: 'GET'
  })
}

export const uploadFile = (file: File) => {
  const data = new FormData()
  data.append('file', file)

  return request<IBaseResponse<string>>({
    url: '/upload',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export const getProfile = () => {
  return request<IBaseResponse<IProfile>>({
    url: '/users/profile',
    method: 'get'
  })
}

export const updateProfile = (data: IProfileParam) => {
  return request<IBaseResponse>({
    url: '/profile',
    method: 'put',
    data
  })
}

export const updatePassword = (data: { oldPassword: string; newPassword: string }) => {
  return request<IBaseResponse>({
    url: '/auth/password',
    method: 'put',
    data
  })
}
