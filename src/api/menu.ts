import instance from '@/utils/request'

import type { IBaseList, IBaseResponse } from '@/types/index'
import type { IMenuListItem, IQueryMenuParam, IMenuTree, IMenuParam } from '@/types/api/menu'

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
