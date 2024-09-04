import request from '@/utils/request'

import type { IBaseList } from '@/types/index'
import type {
  IMenuListItem,
  IMenuQuery,
  IMenuTree,
  IMenuParam,
  IMenuDetail
} from '@/types/api/menu'

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

export const addMenu = (data: IMenuParam) => {
  return request({
    url: '/permissions',
    method: 'post',
    data
  })
}

export const getMenuDetail = (id: number) => {
  return request<IMenuDetail>({
    url: `/permissions/${id}`,
    method: 'get'
  })
}

export const updateMenu = (id: number, data: IMenuParam) => {
  return request({
    url: `/permissions/${id}`,
    method: 'patch',
    data
  })
}

export const deleteMenu = (id: number) => {
  return request({
    url: `/permissions/${id}`,
    method: 'delete'
  })
}

export const deleteMenus = (ids: number[]) => {
  return request({
    url: '/permissions/batch-delete',
    method: 'post',
    data: {
      ids
    }
  })
}
