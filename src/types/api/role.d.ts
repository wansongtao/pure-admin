export interface IRoleQuery {
  disabled?: 0 | 1
  endTime?: string
  sort?: 'asc' | 'desc'
  keyword?: string
  page?: number
  pageSize?: number
  beginTime?: string
}

export interface IRoleList {
  id: number
  name: string
  description?: string
  disabled: boolean
  createdAt: string
  updatedAt: string
}

export interface IRoleEditParam {
  description?: string
  disabled?: boolean
  permissions?: number[]
  name?: string
}

export interface IRoleDetail {
  id: number
  name: string
  permissions: number[]
  disabled: boolean
  description?: string
}

export interface IRoleTree {
  id: number
  name: string
}
