import request from '@/utils/axiosRequest'

import type { IMenuListItem, IMenuParam, IMenuQuery, IMenuTree } from '@/types/api/menu'
import type { IBaseList } from '@/types/api'

export const getMenuList = (params: IMenuQuery) => {
  return request<IBaseList<IMenuListItem>>({
    url: '/permissions',
    method: 'GET',
    params
  })
}

export const getMenuTree = (containButton: boolean = false) => {
  return request<IMenuTree[]>({
    url: '/permissions/tree',
    method: 'GET',
    params: {
      containButton
    }
  })
}

export const getMenuDetail = (id: number) => {
  return request<IMenuParam>({
    url: `/permissions/${id}`,
    method: 'get'
  })
}

export const deleteMenu = (id: number) => {
  return request({
    url: `/permissions/${id}`,
    method: 'delete'
  })
}

export const deleteMenuList = (ids: number[]) => {
  return request({
    url: '/permissions/batch-delete',
    method: 'post',
    data: {
      ids
    }
  })
}

export const addMenu = (data: IMenuParam) => {
  return request({
    url: '/permissions',
    method: 'post',
    data
  })
}

export const updateMenu = (id: number, data: IMenuParam) => {
  return request({
    url: `/permissions/${id}`,
    method: 'patch',
    data
  })
}
