import request from '@/utils/axiosRequest'

import type { IBaseList, IQuery } from '@/types/api'
import type { IRoleDetail, IRoleListItem, IRoleParam, IRoleTreeItem } from '@/types/api/role'

export const getRoleList = (params: IQuery) => {
  return request<IBaseList<IRoleListItem>>({
    url: '/roles',
    method: 'GET',
    params
  })
}

export const addRole = (data: IRoleParam) => {
  return request({
    url: '/roles',
    method: 'post',
    data
  })
}

export const deleteRole = (id: number) => {
  return request({
    url: `/roles/${id}`,
    method: 'delete'
  })
}

export const deleteRoles = (ids: number[]) => {
  return request({
    url: '/roles/batch-delete',
    method: 'post',
    data: {
      ids
    }
  })
}

export const updateRole = (id: number, data: IRoleParam) => {
  return request({
    url: `/roles/${id}`,
    method: 'patch',
    data
  })
}

export const getRoleDetail = (id: number) => {
  return request<IRoleDetail>({
    url: `/roles/${id}`,
    method: 'get'
  })
}

export const getRoleTree = () => {
  return request<IRoleTreeItem[]>({
    url: '/roles/tree',
    method: 'get'
  })
}
