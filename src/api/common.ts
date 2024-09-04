import request from '@/utils/request'
import axios from 'axios'

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
  return request<string>({
    url: '/upload/presigned',
    method: 'get',
    params: {
      filename: filename
    }
  })
}

export const getCaptcha = () => {
  return request<{ captcha: string }>({
    url: '/auth/captcha',
    method: 'GET',
    headers: {
      isToken: false
    }
  })
}

export const setLogin = (data: ILoginParams) => {
  return request<{ token: string; refreshToken: string; }>({
    url: '/auth/login',
    method: 'POST',
    headers: {
      isToken: false
    },
    data
  })
}

export const refreshToken = (refreshToken: string) => {
  return request<{ token: string; refreshToken: string }>({
    url: '/auth/refresh_token',
    method: 'get',
    params: {
      refreshToken
    }
  })
}

export const setLogout = () => {
  return request<null>({
    url: '/auth/logout',
    method: 'get'
  })
}

export const getUserInfo = () => {
  return request<IUserInfo>({
    url: '/auth/userinfo',
    method: 'GET'
  })
}

export const getProfile = () => {
  return request<IProfile>({
    url: '/users/profile',
    method: 'get'
  })
}

export const updateProfile = (data: IProfileParam) => {
  return request({
    url: '/users/profile',
    method: 'patch',
    data
  })
}

export const updatePassword = (data: { oldPassword: string; newPassword: string }) => {
  return request({
    url: '/auth/password',
    method: 'post',
    data
  })
}
