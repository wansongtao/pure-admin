import instance from '@/utils/request'

import type { IBaseList, IBaseResponse } from '@/types/index'
import type {
  IMenuListItem,
  IQueryMenuParam,
  IMenuTree,
  IMenuParam,
  IMenuDetail
} from '@/types/api/menu'

export const getMenuList = (params: IQueryMenuParam) => {
  return instance.request<any, IBaseResponse<IBaseList<IMenuListItem>>>({
    url: '/admin/menu',
    method: 'GET',
    params
  })
}

export const getMenuTree = () => {
  return instance.request<any, IBaseResponse<IMenuTree[]>>({
    url: '/admin/menu/tree',
    method: 'GET'
  })
}

export const addMenu = (data: IMenuParam) => {
  return instance.request<any, IBaseResponse>({
    url: '/admin/menu',
    method: 'post',
    data
  })
}

export const getMenuDetail = (id: number) => {
  return instance.request<any, IBaseResponse<IMenuDetail>>({
    url: `/admin/menu/${id}`,
    method: 'get'
  })
}

export const updateMenu = (id: number, data: IMenuParam) => {
  return instance.request<any, IBaseResponse>({
    url: `/admin/menu/${id}`,
    method: 'put',
    data
  })
}
