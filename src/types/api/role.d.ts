export interface IRoleQuery {
  /**
   * 0=false，1=true
   */
  disabled?: 0 | 1
  endTime?: string
  timeSort?: 'ascend' | 'descend'
  /**
   * 依据name模糊查询
   */
  name?: string
  page?: number
  pageSize?: number
  startTime?: string
}

export interface IRoleList {
  createTime: string
  /**
   * 角色描述
   */
  description?: string
  disabled: boolean
  id: number
  /**
   * 角色标识
   */
  name: string
  /**
   * 角色昵称
   */
  nickName?: string
}

export interface IRoleEditParam {
  description?: string
  disabled?: boolean
  menuIds?: number[]
  name?: string
  nickName?: string
}

export interface IRoleDetail {
  description?: string
  disabled: boolean
  id: number
  menuIds: number[]
  name: string
  nickName?: string
}

export interface IRoleTree {
  id: number
  name: string
}
