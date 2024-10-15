import type { IQuery } from '.'
import type { IMenuType } from '..'

export interface IMenuQuery extends IQuery {
  type?: IMenuType | null
}

export interface IMenuListItem {
  /**
   * 菜单ID
   */
  id: number
  /**
   * 菜单路径
   */
  path?: string
  /**
   * 父菜单id
   */
  pid?: number
  /**
   * 菜单名称
   */
  name: string
  /**
   * 菜单类型
   */
  type: IMenuType
  /**
   * 权限字符串
   */
  permission?: string
  /**
   * 菜单icon名
   */
  icon?: string
  /**
   * 是否禁用
   */
  disabled: boolean
  /**
   * 排序, 越大越靠前
   */
  sort: number
  /**
   * 添加时间
   */
  createdAt: string
  children?: IMenuTreeItem[]
}

export interface IMenuTree {
  id: number
  name: string
  type: IMenuType
  disabled: boolean
  children?: IMenuTree[]
}

export interface IMenuParam {
  /**
   * 父级菜单ID
   */
  pid?: number
  /**
   * 是否缓存，菜单选填
   */
  cache?: boolean
  /**
   * 组件路径，views文件夹下的路径，最多150个字符，只支持字母与‘/’符号，类型为菜单时必填
   */
  component?: string
  /**
   * 是否禁用
   */
  disabled?: boolean
  /**
   * 是否在侧边菜单栏隐藏，目录、菜单选填
   */
  hidden?: boolean
  /**
   * 菜单图标名称，目录、菜单选填
   */
  icon?: string
  /**
   * 菜单路径，1-26个小写字母与‘/:’。 目录、菜单选填
   */
  path?: string
  /**
   * 菜单权限字符串，只支持冒号与字母，最多50个字符
   */
  permission?: string
  /**
   * 路由传参，菜单选填
   */
  props?: boolean
  /**
   * 重定向地址，进入目录重定向到菜单，目录、菜单选填
   */
  redirect?: string
  /**
   * 菜单名称，2-16个字符。
   */
  name?: string
  /**
   * 菜单类型
   */
  type?: IMenuType
  /**
   * 菜单排序，目录、菜单选填
   */
  sort?: number
}
