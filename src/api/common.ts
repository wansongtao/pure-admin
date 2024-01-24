import instance from '@/utils/request'
import type { IBaseResponse } from '@/types/index'

export const getCaptcha = () => {
  return instance.request<any, IBaseResponse<string>>({
    url: '/admin/captcha',
    method: 'GET',
    headers: {
      isToken: false
    }
  })
}
