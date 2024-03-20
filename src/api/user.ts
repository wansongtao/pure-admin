import { request } from '@/utils/request'

import type { IBaseList, IBaseResponse } from '@/types'
import type { IUserQuery, IUserList, IUserEdit, IUserDetail } from '@/types/api/user'

export const getUserList = (params: IUserQuery) => {
  return request<IBaseResponse<IBaseList<IUserList>>>({
    url: '/admin/user',
    method: 'get',
    params
  })
}

export const deleteUser = (id: number) => {
  return request<IBaseResponse>({
    url: `/admin/user/${id}`,
    method: 'delete'
  })
}

export const deleteUsers = (id: number[]) => {
  return request<IBaseResponse>({
    url: '/admin/user',
    method: 'delete',
    data: {
      id
    }
  })
}

export const updateUser = (id: number, data: IUserEdit) => {
  return request<IBaseResponse>({
    url: `/admin/user/${id}`,
    method: 'put',
    data
  })
}

export const getUserDetail = (id: number) => {
  return request<IBaseResponse<IUserDetail>>({
    url: `/admin/user/${id}`,
    method: 'get'
  })
}

export const addUser = (data: IUserEdit) => {
  return request<IBaseResponse>({
    url: '/admin/user',
    method: 'post',
    data
  })
}

export const exportUserInfo = (ids: number[]) => {
  return request<IBaseResponse<IUserList[]>>({
    url: '/admin/user/export',
    method: 'post',
    data: {
      ids
    }
  })
}
