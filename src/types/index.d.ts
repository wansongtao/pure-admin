export type ITheme = 'light' | 'dark'

/**
 * 200 成功 | 300 token过期 | 400 参数错误 | 401 未登录 | 403 无权限 | 404 未找到 | 500 服务器错误
 */
export type ICode = 200 | 300 | 400 | 401 | 403 | 404 | 500

export interface IBaseResponse<T = unknown> {
  code: ICode
  msg: string
  data: T
}

export interface IMenuItem {
  key: string
  icon?: () => VNode
  label?: string
  path: string
  children?: IMenuItem[]
}

export interface ITagLinkItem {
  title: string
  path: string
  checked?: boolean
  hiddenCloseIcon?: boolean
}
