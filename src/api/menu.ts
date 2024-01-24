import instance from '@/utils/request'

import type { IBaseList, IBaseResponse } from '@/types/index'
import type { IMenuTreeItem, IQueryMenuParam } from '@/types/api/menu';

export const getMenuTypes = () => {
  return instance.request<any, IBaseResponse<{ id: number; name: string }[]>>({
    url: '/admin/menu/type',
    method: 'GET'
  })
}

export const getMenuTree = (params: IQueryMenuParam) => {
  return instance.request<any, IBaseResponse<IBaseList<IMenuTreeItem>>>({
    url: '/admin/menu',
    method: 'GET',
    params
  })
}
