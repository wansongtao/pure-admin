import request from '@/utils/request'

import type { IBaseList } from '@/types'
import type {
  IRoleList,
  IRoleQuery,
  IRoleEditParam,
  IRoleDetail,
  IRoleTree
} from '@/types/api/role'

export const getRoleList = (params: IRoleQuery) => {
  return request<IBaseList<IRoleList>>({
    url: '/roles',
    method: 'GET',
    params
  })
}

export const updateRole = (id: number, data: IRoleEditParam) => {
  return request({
    url: `/roles/${id}`,
    method: 'patch',
    data
  })
}

export const addRole = (data: IRoleEditParam) => {
  return request({
    url: '/roles',
    method: 'post',
    data
  })
}

export const getRoleDetail = (id: number) => {
  return request<IRoleDetail>({
    url: `/roles/${id}`,
    method: 'get'
  })
}

export const deleteRole = (id: number) => {
  return request({
    url: `/roles/${id}`,
    method: 'delete'
  })
}

export const deleteRoles = (id: number[]) => {
  return request({
    url: '/roles/batch-delete',
    method: 'post',
    data: {
      ids: id
    }
  })
}

export const getRoleTree = () => {
  return request<IRoleTree[]>({
    url: '/roles/tree',
    method: 'get'
  })
}
