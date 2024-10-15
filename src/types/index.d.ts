import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'
import type { FormItemRule, DataTableColumn } from 'naive-ui'
import type { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider'

declare global {
  interface Window {
    $message: MessageApiInjection
    $dialog: DialogApiInjection
  }
}

export interface IMenubarItem {
  label: string
  key: string
  hiddenCloseIcon?: boolean
  checked?: boolean
}

export type IMenuType = 'DIRECTORY' | 'MENU' | 'BUTTON'

export type IRule<T extends Record> = {
  [key in keyof T]: FormItemRule | FormItemRule[]
}

export type IColumn<T = {}> = DataTableColumn<T> & { key?: keyof T | 'action' }

/**
 * 性别 MA 男，FE 女，OT 其他
 */
export type IGender = 'MA' | 'FE' | 'OT'
