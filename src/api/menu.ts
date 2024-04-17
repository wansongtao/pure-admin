import request from '@/utils/request'

import type { IBaseList, IBaseResponse } from '@/types/index'
import type {
  IMenuListItem,
  IMenuQuery,
  IMenuTree,
  IMenuParam,
  IMenuDetail
} from '@/types/api/menu'

export const getMenuList = (params: IMenuQuery) => {
  return request<IBaseResponse<IBaseList<IMenuListItem>>>({
    url: '/admin/menu',
    method: 'GET',
    params
  })
}

export const getMenuTree = () => {
  return request<IBaseResponse<IMenuTree[]>>({
    url: '/admin/menu/tree',
    method: 'GET'
  })
}

export const addMenu = (data: IMenuParam) => {
  return request<IBaseResponse>({
    url: '/admin/menu',
    method: 'post',
    data
  })
}

export const getMenuDetail = (id: number) => {
  return request<IBaseResponse<IMenuDetail>>({
    url: `/admin/menu/${id}`,
    method: 'get'
  })
}

export const updateMenu = (id: number, data: IMenuParam) => {
  return request<IBaseResponse>({
    url: `/admin/menu/${id}`,
    method: 'put',
    data
  })
}

export const deleteMenu = (id: number) => {
  return request<IBaseResponse>({
    url: `/admin/menu/${id}`,
    method: 'delete'
  })
}

export const deleteMenus = (id: number[]) => {
  return request<IBaseResponse>({
    url: '/admin/menu',
    method: 'delete',
    data: {
      id
    }
  })
}
