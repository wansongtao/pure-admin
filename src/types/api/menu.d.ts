export type IMenuType = 'directory' | 'menu' | 'button'

export interface IQueryMenuParam {
  title?: string
  startTime?: string
  endTime?: string
  type?: IMenuType
  disabled?: 0 | 1
  page?: number
  pageSize?: number
  isDesc?: 0 | 1
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
  title: string
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
   * 是否隐藏菜单
   */
  hidden?: boolean
  /**
   * 添加时间
   */
  createTime: string
  children?: IMenuTreeItem[]
}

/**
 * 新增/编辑菜单参数类型
 */
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
  title?: string
  /**
   * 菜单类型
   */
  type?: IMenuType
}

export interface IMenuTree {
  /**
   * 菜单ID
   */
  id: number
  /**
   * 菜单名称
   */
  name: string
  /**
   * 菜单类型
   */
  type: IMenuType
  children?: IMenuTree[]
}
