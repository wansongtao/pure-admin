import instance from '@/utils/request'
import type { IBaseResponse } from '@/types/index'

export const getMenuTypes = () => {
  return instance.request<any, IBaseResponse<{ id: number; name: string }[]>>({
    url: '/admin/menu/type',
    method: 'GET'
  })
}
