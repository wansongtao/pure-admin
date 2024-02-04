import { request } from '@/utils/request'

import type { IBaseList, IBaseResponse } from '@/types'
import type { IRoleList, IRoleQuery } from '@/types/api/role'

export const getRoleList = (params: IRoleQuery) => {
  return request<IBaseResponse<IBaseList<IRoleList>>>({
    url: '/admin/role',
    method: 'GET',
    params
  })
}
