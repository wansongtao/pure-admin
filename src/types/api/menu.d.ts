export interface IQueryMenuParam {
  title?: string
  startTime?: string
  endTime?: string
  type?: number
  disabled?: 0 | 1
  page?: number
  pageSize?: number
  isDesc?: 0 | 1
}

export interface IMenuTreeItem {
  id: string
  /**
   * 菜单路径
   */
  path: string
  /**
   * 父菜单id
   */
  pid?: string
  /**
   * 菜单名称
   */
  title: string
  /**
   * 菜单类型名
   */
  typeName: string
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
  hidden: boolean
  /**
   * 添加时间
   */
  createTime: string
  children?: IMenuTreeItem[]
}
