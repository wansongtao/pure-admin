<script lang="ts" setup>
import TFilter from './components/TFilter.vue'
import MENU_ICON_MAP from '@/config/menuIcons'

import { usePageRequest } from '@/hooks/usePageRequest'
import { getMenuTree } from '@/api/menu'

import type { IQueryMenuParam, IMenuTreeItem } from '@/types/api/menu'
import type { TableColumnProps } from 'ant-design-vue'

defineOptions({
  name: 'systemMenu'
})

const columns: (TableColumnProps<IMenuTreeItem> & { dataIndex?: keyof IMenuTreeItem })[] = [
  {
    align: 'center',
    title: '菜单名称',
    dataIndex: 'title'
  },
  {
    align: 'center',
    title: '菜单路径',
    dataIndex: 'path'
  },
  {
    align: 'center',
    title: '菜单类型',
    dataIndex: 'typeName'
  },
  {
    align: 'center',
    title: '菜单图标',
    dataIndex: 'icon'
  },
  {
    align: 'center',
    title: '是否隐藏',
    dataIndex: 'hidden'
  },
  {
    align: 'center',
    title: '是否禁用',
    dataIndex: 'disabled'
  },
  {
    align: 'center',
    title: '添加时间',
    dataIndex: 'createTime',
    sorter: true,
    width: 180
  }
]

const requestData = async (params: IQueryMenuParam) => {
  const result = await getMenuTree(params)

  return {
    data: result.data.list,
    total: result.data.total
  }
}

const { page, pageSize, total, loading, list, getList } = usePageRequest(requestData)

const query = ref<IQueryMenuParam>({})
const handleQuery = (data?: IQueryMenuParam) => {
  query.value = data ?? {}

  getList(query.value)
}

const handleSort = (fieldName: keyof IMenuTreeItem, order?: 'descend' | 'ascend' | null) => {
  if (fieldName === 'createTime') {
    query.value.isDesc = order === 'ascend' ? 0 : 1
    getList(query.value)
    return
  }
}
const handleDelete = (id: string | number) => {
  console.log(id)
}
const handleEdit = (id: string | number) => {
  console.log(id)
}
</script>

<template>
  <div class="st-container">
    <TFilter :loading="loading" @handle-search="handleQuery" @handle-reset="handleQuery" />

    <base-table
      :columns="columns"
      :list="list"
      :loading="loading"
      bordered
      defaultExpandFirstRows
      @handle-sort="handleSort"
      @handle-delete="handleDelete"
      @handle-edit="handleEdit"
    >
      <template #default="{ column, record }">
        <template v-if="column.dataIndex === 'typeName'">
          <a-tag color="success" v-if="record.typeName === '菜单'">{{ record.typeName }}</a-tag>
          <a-tag color="processing" v-if="record.typeName === '按钮'">{{ record.typeName }}</a-tag>
          <a-tag color="default" v-if="record.typeName !== '菜单' && record.typeName !== '按钮'">{{
            record.typeName
          }}</a-tag>
        </template>
        <template v-if="column.dataIndex === 'icon'">
          <component :is="MENU_ICON_MAP[record.icon]" v-if="record.icon" />
        </template>
        <template v-if="column.dataIndex === 'hidden'">
          <a-switch
            v-model:checked="record.hidden"
            checked-children="是"
            un-checked-children="否"
          />
        </template>
        <template v-if="column.dataIndex === 'disabled'">
          <a-switch
            v-model:checked="record.disabled"
            checked-children="是"
            un-checked-children="否"
          />
        </template>
      </template>
    </base-table>

    <BasePagination v-model:page="page" v-model:page-size="pageSize" :total="total" />
  </div>
</template>

<style lang="scss" scoped>

</style>
