export interface IUserQuery {
  endTime?: string
  sort?: 'asc' | 'desc'
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
  beginTime?: string
}

export interface IUserList {
  avatar?: string
  disabled: boolean
  id: string
  nickName?: string
  userName: string
  createdAt: string
  updatedAt: string
  roleNames?: string[]
}

export interface IUserEdit {
  avatar?: string
  disabled?: boolean
  nickName?: string
  roles?: number[]
}

export interface IUserDetail {
  avatar?: string
  disabled: boolean
  id: number
  nickName?: string
  roles?: number[]
  userName: string
}
