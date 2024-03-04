import type { TableColumnProps } from 'ant-design-vue'

export type IBaseColumn<T extends Record> = TableColumnProps & { dataIndex?: keyof T }
