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
  name: string
  /**
   * 权限组
   */
  permissions: string[]
  roles: string[]
  menus?: IMenuData[]
}

export interface IMenuData {
  /**
   * 菜单路径
   */
  path: string
  /**
   * 菜单名称
   */
  name: string
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
   * 性别 MA 男，FE 女，OT 其他
   */
  gender?: 'MA' | 'FE' | 'OT'
}

export interface IProfile extends IProfileParam {
  roles: string[]
  userName: string
}

export type IExportProfile = Omit<IProfile, 'roles' | 'avatar' | 'description'>
