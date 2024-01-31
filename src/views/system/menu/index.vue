<script lang="ts" setup>
import TFilter from './components/TFilter.vue'
import MENU_ICON_MAP from '@/config/menuIcons'
import ButtonAdd from './components/ButtonAdd.vue'

import { usePageRequest } from '@/hooks/usePageRequest'
import { getMenuList } from '@/api/menu'
import { MENU_TYPES } from '@/config/index'

import type { IQueryMenuParam, IMenuListItem } from '@/types/api/menu'
import type { TableColumnProps } from 'ant-design-vue'

defineOptions({
  name: 'systemMenu'
})

const columns: (TableColumnProps<IMenuListItem> & { dataIndex?: keyof IMenuListItem })[] = [
  {
    align: 'center',
    title: '菜单名称',
    dataIndex: 'title',
    ellipsis: true
  },
  {
    align: 'center',
    title: '菜单路径',
    dataIndex: 'path',
    ellipsis: true
  },
  {
    align: 'center',
    title: '菜单权限',
    dataIndex: 'permission',
    ellipsis: true
  },
  {
    align: 'center',
    title: '菜单类型',
    dataIndex: 'type',
    width: 100
  },
  {
    align: 'center',
    title: '菜单图标',
    dataIndex: 'icon',
    width: 100
  },
  {
    align: 'center',
    title: '是否禁用',
    dataIndex: 'disabled',
    width: 100
  },
  {
    align: 'center',
    title: '添加时间',
    dataIndex: 'createTime',
    sorter: true,
    width: 180
  },
  {
    align: 'center',
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 160
  }
]

const requestData = async (params: IQueryMenuParam) => {
  const result = await getMenuList(params)

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

const handleSort = (fieldName: keyof IMenuListItem, order?: 'descend' | 'ascend' | null) => {
  if (fieldName === 'createTime') {
    query.value.isDesc = order === 'ascend' ? 0 : 1
    getList(query.value)
    return
  }
}
const handleDelete = (id: number) => {
  console.log(id)
}
const handleEdit = (id: number) => {
  console.log(id)
}
</script>

<template>
  <div class="st-container">
    <TFilter :loading="loading" @handle-search="handleQuery" @handle-reset="handleQuery" />

    <div class="tool">
      <a-space>
        <button-add @add-success="getList" />
        <a-button type="primary" danger>删除</a-button>
      </a-space>
    </div>

    <base-table
      :columns="columns"
      :list="list"
      :loading="loading"
      bordered
      defaultExpandFirstRows
      :defaultShowOperation="false"
      @handle-sort="handleSort"
    >
      <template #default="{ column, record }">
        <template v-if="column.dataIndex === 'type'">
          <a-tag color="success" v-if="record.type === 'menu'">{{ MENU_TYPES[record.type] }}</a-tag>
          <a-tag color="processing" v-if="record.type === 'button'">{{
            MENU_TYPES[record.type]
          }}</a-tag>
          <a-tag color="default" v-if="record.type !== 'menu' && record.type !== 'button'">
            {{ MENU_TYPES[record.type] }}
          </a-tag>
        </template>
        <template v-if="column.dataIndex === 'icon'">
          <component :is="MENU_ICON_MAP[record.icon]" v-if="record.icon" />
        </template>
        <template v-if="column.dataIndex === 'disabled'">
          <a-switch
            v-model:checked="record.disabled"
            checked-children="是"
            un-checked-children="否"
          />
        </template>
        <template v-if="column.key === 'operation'">
          <a-space>
            <a-button type="primary" size="small" ghost @click="handleEdit(record.id)"
              >编辑</a-button
            >
            <ButtonDelete @handle-ok="handleDelete(record.id)" />
          </a-space>
        </template>
      </template>
    </base-table>

    <BasePagination v-model:page="page" v-model:page-size="pageSize" :total="total" />
  </div>
</template>

<style lang="scss" scoped>
.tool {
  margin-top: 20px;
}
</style>
