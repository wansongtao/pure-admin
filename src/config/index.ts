import type { IQueryMenuParam } from '@/types/api/menu';
import type { ITheme } from '@/types/index'

export const DEFAULT_THEME: ITheme = 'light'

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
