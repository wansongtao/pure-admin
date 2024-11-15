import request from '@/utils/axiosRequest'

import type {
  ILoginParams,
  IPasswordParam,
  IProfile,
  IProfileParam,
  IUserInfo,
  ITokenData
} from '@/types/api/common'

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
  return request<ITokenData>({
    url: '/auth/login',
    method: 'POST',
    headers: {
      isToken: false
    },
    data
  })
}

export const setLogout = () => {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

export const getNewToken = (refreshToken: string) => {
  return request<ITokenData>({
    url: '/auth/refresh-token',
    method: 'post',
    data: {
      refreshToken
    }
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

export const updatePassword = (data: IPasswordParam) => {
  return request({
    url: '/auth/password',
    method: 'post',
    data
  })
}
