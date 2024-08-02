import request from '@/utils/request'

import type { IBaseList, IBaseResponse } from '@/types'
import type { IUserQuery, IUserList, IUserEdit, IUserDetail } from '@/types/api/user'
import type { IExportProfile } from '@/types/api/common'

export const getUserList = (params: IUserQuery) => {
  return request<IBaseResponse<IBaseList<IUserList>>>({
    url: '/users',
    method: 'get',
    params
  })
}

export const deleteUser = (id: string) => {
  return request<IBaseResponse>({
    url: `/users/${id}`,
    method: 'delete'
  })
}

export const deleteUsers = (ids: string[]) => {
  return request<IBaseResponse>({
    url: '/users/batch-delete',
    method: 'post',
    data: {
      ids
    }
  })
}

export const updateUser = (id: string, data: IUserEdit) => {
  return request<IBaseResponse>({
    url: `/users/${id}`,
    method: 'patch',
    data
  })
}

export const getUserDetail = (id: string) => {
  return request<IBaseResponse<IUserDetail>>({
    url: `/users/${id}`,
    method: 'get'
  })
}

export const addUser = (data: IUserEdit) => {
  return request<IBaseResponse>({
    url: '/users',
    method: 'post',
    data
  })
}

export const exportUserInfo = () => {
  return request<IBaseResponse<IExportProfile[]>>({
    url: '/users/export',
    method: 'get'
  })
}

export const resetUserPassword = (id: string) => {
  return request<IBaseResponse>({
    url: `/users/reset-password`,
    method: 'post',
    data: {
      id
    }
  })
}
