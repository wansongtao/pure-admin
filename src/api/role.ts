import request from '@/utils/request'

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
    url: '/roles',
    method: 'GET',
    params
  })
}

export const updateRole = (id: number, data: IRoleEditParam) => {
  return request<IBaseResponse>({
    url: `/roles/${id}`,
    method: 'patch',
    data
  })
}

export const addRole = (data: IRoleEditParam) => {
  return request<IBaseResponse>({
    url: '/roles',
    method: 'post',
    data
  })
}

export const getRoleDetail = (id: number) => {
  return request<IBaseResponse<IRoleDetail>>({
    url: `/roles/${id}`,
    method: 'get'
  })
}

export const deleteRole = (id: number) => {
  return request<IBaseResponse>({
    url: `/roles/${id}`,
    method: 'delete'
  })
}

export const deleteRoles = (id: number[]) => {
  return request<IBaseResponse>({
    url: '/roles/batch-delete',
    method: 'post',
    data: {
      ids: id
    }
  })
}

export const getRoleTree = () => {
  return request<IBaseResponse<IRoleTree[]>>({
    url: '/roles/tree',
    method: 'get'
  })
}
