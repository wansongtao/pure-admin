export interface ILoginParams {
  userName: string
  password: string
  captcha: string
}

export interface IUserInfo {
  /**
   * 用户头像地址
   */
  avatar: string
  /**
   * 用户昵称
   */
  nickName: string
  /**
   * 权限组
   */
  permissions: string[]
  roles: string[]
}

export interface IMenuData {
  /**
   * 菜单路径
   */
  path: string
  /**
   * 菜单名称
   */
  title: string
  /**
   * 组件（路由）名称
   */
  name?: string
  /**
   * 组件路径
   */
  component?: string
  /**
   * 菜单图标
   */
  icon?: string
  /**
   * 是否隐藏
   */
  hidden?: boolean
  /**
   * 重定向地址
   */
  redirect?: string
  /**
   * 路由传参模式
   */
  props?: boolean
  /**
   * 是否缓存
   */
  cache?: boolean
  /**
   * 子菜单
   */
  children?: IMenuData[]
}
