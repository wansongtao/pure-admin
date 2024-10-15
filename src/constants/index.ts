import type { IMenuType, IGender } from '@/types'

export const MENU_TYPES: { readonly [key in IMenuType]: string } = {
  DIRECTORY: '目录',
  MENU: '菜单',
  BUTTON: '按钮'
}

export const ACTIVE_STATE: {
  readonly label: string
  readonly value: 0 | 1
}[] = [
  {
    label: '启用',
    value: 0
  },
  {
    label: '禁用',
    value: 1
  }
]

export const ALL_PERMISSION = '*:*:*'

export const GENDER_MAP: { readonly [key in IGender]: string } = {
  MA: '男',
  FE: '女',
  OT: '未知'
}
