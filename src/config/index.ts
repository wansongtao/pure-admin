import type { IQueryMenuParam } from '@/types/api/menu'

export const ALL_PERMISSION = '*:*:*'

export const MENU_STATUS: { label: string; value: IQueryMenuParam['disabled'] }[] = [
  {
    label: '启用',
    value: 1
  },
  {
    label: '禁用',
    value: 0
  }
]
