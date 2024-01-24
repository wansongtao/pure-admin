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
