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

export interface IProfile {
  avatar?: string
  birthday?: string
  /**
   * 个人简介
   */
  description?: string
  email?: string
  nickName?: string
  phone?: string
  roles: string[]
  /**
   * 0 女，1 男，2 其他
   */
  sex: 0 | 1 | 2
  userName: string
}

export interface IProfileParam {
  avatar?: string
  birthday?: string
  /**
   * 个人简介
   */
  description?: string
  email?: string
  nickName?: string
  phone?: string
  /**
   * 0 女，1 男，2 其他
   */
  sex?: 0 | 1 | 2
}
