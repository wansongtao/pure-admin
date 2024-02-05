export interface IUserQuery {
  endTime?: string
  isDesc?: 0 | 1
  /**
   * 0=false，1=true
   */
  disabled?: 0 | 1
  /**
   * 用户名/昵称
   */
  keyword?: string
  page?: number
  pageSize?: number
  startTime?: string
}

export interface IUserList {
  /**
   * 用户头像
   */
  avatar?: string
  /**
   * 创建时间
   */
  createTime: string
  /**
   * 是否禁用
   */
  disabled: boolean
  /**
   * 用户id
   */
  id: number
  /**
   * 昵称
   */
  nickName?: string
  /**
   * 用户名
   */
  userName: string
}

export interface IUserEdit {
  avatar?: string
  disabled?: boolean
  nickName?: string
  roles?: number[]
}
