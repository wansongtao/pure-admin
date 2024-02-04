export interface IRoleQuery {
  /**
   * 0=false，1=true
   */
  disabled?: 0 | 1
  endTime?: string
  /**
   * 0 false，1 true 是否按添加时间降序，默认true
   */
  isDesc?: 0 | 1
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
  description: string
  disabled: boolean
  id: number
  /**
   * 角色名称
   */
  name: string
}
