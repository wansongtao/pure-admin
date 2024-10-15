export interface IUserListItem {
  avatar?: string
  disabled: boolean
  id: string
  nickName?: string
  userName: string
  createdAt: string
  updatedAt: string
  roleNames?: string[]
}

export interface IUserParam {
  userName?: string
  disabled?: boolean
  nickName?: string
  roles?: number[]
}

export interface IUserDetail {
  disabled: boolean
  id: number
  nickName?: string
  roles?: number[]
  userName: string
}
