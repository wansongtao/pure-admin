import request from '@/utils/request'
import axios from 'axios'

import type { IBaseResponse } from '@/types/index'
import type {
  ILoginParams,
  IUserInfo,
  IProfile,
  IProfileParam
} from '@/types/api/common'

export const uploadFile = (url: string, file: File) => {
  return axios.put(url, file, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const getPresignedUrl = (filename: string) => {
  return request<IBaseResponse<string>>({
    url: '/upload/presigned',
    method: 'get',
    params: {
      filename: filename
    }
  })
}

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
  return request<IBaseResponse<{ token: string; refreshToken: string; }>>({
    url: '/auth/login',
    method: 'POST',
    headers: {
      isToken: false
    },
    data
  })
}

export const refreshToken = (refreshToken: string) => {
  return request<IBaseResponse<{ token: string; refreshToken: string }>>({
    url: '/auth/refresh_token',
    method: 'get',
    params: {
      refreshToken
    }
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

export const getProfile = () => {
  return request<IBaseResponse<IProfile>>({
    url: '/users/profile',
    method: 'get'
  })
}

export const updateProfile = (data: IProfileParam) => {
  return request<IBaseResponse>({
    url: '/users/profile',
    method: 'patch',
    data
  })
}

export const updatePassword = (data: { oldPassword: string; newPassword: string }) => {
  return request<IBaseResponse>({
    url: '/auth/password',
    method: 'post',
    data
  })
}
