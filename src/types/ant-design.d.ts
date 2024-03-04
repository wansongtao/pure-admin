import type { TableColumnProps } from 'ant-design-vue'

export type IBaseColumn<T extends Record, K = T> = TableColumnProps<K> & { dataIndex?: keyof T }
