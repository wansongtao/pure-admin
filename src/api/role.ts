import { request } from '@/utils/request'

import type { IBaseList, IBaseResponse } from '@/types'
import type {
  IRoleList,
  IRoleQuery,
  IRoleEditParam,
  IRoleDetail,
  IRoleTree
} from '@/types/api/role'

export const getRoleList = (params: IRoleQuery) => {
  return request<IBaseResponse<IBaseList<IRoleList>>>({
    url: '/admin/role',
    method: 'GET',
    params
  })
}

export const updateRole = (id: number, data: IRoleEditParam) => {
  return request<IBaseResponse>({
    url: `/admin/role/${id}`,
    method: 'put',
    data
  })
}

export const addRole = (data: IRoleEditParam) => {
  return request<IBaseResponse>({
    url: '/admin/role',
    method: 'post',
    data
  })
}

export const getRoleDetail = (id: number) => {
  return request<IBaseResponse<IRoleDetail>>({
    url: `/admin/role/${id}`,
    method: 'get'
  })
}

export const deleteRole = (id: number) => {
  return request<IBaseResponse>({
    url: `/admin/role/${id}`,
    method: 'delete'
  })
}

export const deleteRoles = (id: number[]) => {
  return request<IBaseResponse>({
    url: '/admin/role',
    method: 'delete',
    data: {
      id
    }
  })
}

export const getRoleTree = () => {
  return request<IBaseResponse<IRoleTree[]>>({
    url: '/admin/role/tree',
    method: 'get'
  })
}
