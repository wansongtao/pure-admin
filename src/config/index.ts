import type { IQueryMenuParam, IMenuType } from '@/types/api/menu'

export const ALL_PERMISSION = '*:*:*'

export const STATUS: {
  readonly label: string
  readonly value: IQueryMenuParam['disabled']
}[] = [
  {
    label: '启用',
    value: 1
  },
  {
    label: '禁用',
    value: 0
  }
]

export const MENU_TYPES: { [key in IMenuType]: string } = {
  directory: '目录',
  menu: '菜单',
  button: '按钮'
}
