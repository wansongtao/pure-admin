export interface IRoleListItem {
  id: number
  name: string
  description?: string
  disabled: boolean
  createdAt: string
  updatedAt: string
}

export interface IRoleParam {
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

export interface IRoleTreeItem {
  id: number
  name: string
}
