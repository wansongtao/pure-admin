import { IGender } from '@/types'

export interface ILoginParams {
  userName: string
  password: string
  captcha: string
}

export interface ITokenData {
  accessToken: string
  refreshToken: string
}

export interface IUserInfo {
  avatar: string
  name: string
  permissions: string[]
  roles: string[]
  menus?: IMenuItem[]
}

export interface IMenuItem {
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
  children?: IMenuItem[]
}

export interface IProfileParam {
  avatar?: string
  birthday?: string | null
  description?: string | null
  email?: string | null
  nickName?: string | null
  phone?: string | null
  gender?: IGender
}

export interface IProfile extends IProfileParam {
  roles: string[]
  userName: string
}

export interface IPasswordParam {
  oldPassword: string
  newPassword: string
}
