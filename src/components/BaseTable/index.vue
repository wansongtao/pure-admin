<script lang="ts" generic="T extends Record<string, any>, K = TableColumnProps<T>" setup>
import type { TableProps, TableColumnProps } from 'ant-design-vue'
import type { ColumnFilterItem, Key, SorterResult } from 'ant-design-vue/es/table/interface'

defineOptions({
  name: 'BaseTable'
})
defineSlots<{
  default(props: { column: K; record: T; index: number; text: any }): any
  headerCell(props: { column: K; title: any }): any
  emptyText(): any
  customFilterDropdown(props: {
    prefixCls: string
    setSelectedKeys: (selectedKeys: Key[]) => void
    selectedKeys: Key[]
    confirm: (param?: { closeDropdown: boolean }) => void
    clearFilters?: (param?: { confirm?: boolean; closeDropdown?: boolean }) => void
    filters?: ColumnFilterItem[]
    visible: boolean
    column: K
  }): any
  customFilterIcon(props: { filtered: any; column: K }): any
  summary(): any
}>()

const $emits = defineEmits<{
  handleSort: [fieldName: keyof T, order?: 'descend' | 'ascend' | null]
}>()
const $props = withDefaults(
  defineProps<{
    rowKey?: string
    columns: K[] 
    list?: T[]
    loading?: boolean
    scroll?: { scrollToFirstRowOnChange?: boolean; x?: string | number | true; y?: string }
    defaultExpandAllRows?: boolean
    defaultExpandFirstRows?: boolean
    defaultExpandedRowKeys?: string[]
    /**
     * 展示默认选择配置
     */
    defaultRowSelection?: boolean
    rowSelection?: TableProps['rowSelection']
    transformCellText?: (data: {
      text: any
      column: TableColumnProps<T>
      record: T
      index: number
    }) => any
    rowClassName?: (record: T, index: number) => string
  }>(),
  {
    rowKey: 'id',
    scroll: () => ({
      scrollToFirstRowOnChange: true,
      y: 'calc(100vh - var(--st-scrollbar-h) - var(--st-header-h) - 262px)'
    }),
    defaultExpandFirstRows: false,
    defaultRowSelection: false,
    transformCellText: ({
      text,
      column,
      record
    }: {
      text: any
      column: TableColumnProps<T>
      record: T
    }) => {
      // 开启行选择后使用解构会报错
      const dataIndex = column?.dataIndex
      if (
        typeof dataIndex === 'string' &&
        (record[dataIndex] === undefined || record[dataIndex] === null)
      ) {
        return '--'
      }

      return text
    },
    rowClassName: (_record: T, index: number) => (index % 2 === 1 ? 'table-striped' : '')
  }
)

const selectedRowKeys = defineModel<Key[]>('checked', { default: [] })
const rowSelectionConfig = computed(() => {
  const defaultConfig: TableProps['rowSelection'] = {
    selectedRowKeys: selectedRowKeys.value,
    preserveSelectedRowKeys: true,
    onChange: (keys: Key[]) => {
      selectedRowKeys.value = keys
    }
  }

  return $props.defaultRowSelection
    ? { ...defaultConfig, ...$props.rowSelection }
    : $props.rowSelection
})

const expandedRowKeys = ref<string[]>([])
watch([() => $props.list, () => $props.defaultExpandedRowKeys], ([list, keys]) => {
  if (!list?.length) {
    return
  }

  const rowKey = $props.rowKey
  if (keys?.length) {
    expandedRowKeys.value = list.filter((v) => keys?.includes(v[rowKey])).map((v) => v[rowKey])
    return
  }
  if ($props.defaultExpandAllRows) {
    expandedRowKeys.value = list.map((item) => item[rowKey])
    return
  }
  if ($props.defaultExpandFirstRows) {
    expandedRowKeys.value = [list[0][rowKey]]
    return
  }
})

const handleSort = (_p: any, _f: any, sorter: SorterResult | SorterResult[]) => {
  const { field, order } = sorter as SorterResult
  const fieldName = field as keyof T

  $emits('handleSort', fieldName, order)
}
</script>

<template>
  <div class="base_table">
    <a-table
      v-bind="$attrs"
      class="ant-table-striped"
      :row-key="rowKey"
      :columns="columns as TableColumnProps[]"
      :data-source="list"
      v-model:expanded-row-keys="expandedRowKeys"
      :loading="loading"
      :pagination="false"
      :scroll="scroll"
      :row-selection="rowSelectionConfig"
      :row-class-name="rowClassName"
      :transform-cell-text="transformCellText"
      @change="handleSort"
    >
      <template #bodyCell="{ column, record, index, text }">
        <slot :column="column as K" :record="record as T" :index="index" :text="text" />
      </template>

      <template #headerCell="{ column, title }">
        <slot name="headerCell" :column="column as K" :title="title" />
      </template>

      <template #emptyText>
        <slot name="emptyText">
          <a-empty />
        </slot>
      </template>
      <template
        #customFilterDropdown="{
          prefixCls,
          setSelectedKeys,
          selectedKeys,
          confirm,
          clearFilters,
          filters,
          visible,
          column
        }"
      >
        <slot
          name="customFilterDropdown"
          :prefixCls="prefixCls"
          :setSelectedKeys="setSelectedKeys"
          :selectedKeys="selectedKeys"
          :confirm="confirm"
          :clearFilters="clearFilters"
          :filters="filters"
          :visible="visible"
          :column="column"
        />
      </template>
      <template #customFilterIcon="{ filtered, column }">
        <slot name="customFilterIcon" :filtered="filtered" :column="column" />
      </template>
      <template #summary>
        <slot name="summary" />
      </template>
    </a-table>
  </div>
</template>

<style lang="scss" scoped>
.base_table {
  margin: 20px auto;
}

.ant-table-striped :deep(.table-striped) td {
  background-color: var(--st-c-striped);
}

:deep(.ant-table-tbody) {
  height: v-bind('scroll.y');
}
</style>
