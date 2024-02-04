<script lang="ts" setup>
import TFilter from './components/TFilter.vue'
import RoleStateEdit from './components/RoleStateEdit.vue'
import RoleAdd from './components/RoleAdd.vue'
import RoleEdit from './components/RoleEdit.vue'
import RoleDelete from './components/RoleDelete.vue'

import { usePageRequest } from '@/hooks/usePageRequest'
import { getRoleList } from '@/api/role'

import type { IRoleQuery, IRoleList } from '@/types/api/role'
import type { TableColumnProps } from 'ant-design-vue'

defineOptions({
  name: 'systemRole'
})

const requestData = async (params: IRoleQuery) => {
  const { result } = await getRoleList(params)

  return {
    data: result?.data.list ?? [],
    total: result?.data.total ?? 0
  }
}

const columns: (TableColumnProps & { dataIndex?: keyof IRoleList })[] = [
  {
    align: 'center',
    title: '角色ID',
    dataIndex: 'id',
    width: 100
  },
  {
    align: 'center',
    title: '角色标识',
    dataIndex: 'name'
  },
  {
    align: 'center',
    title: '角色昵称',
    dataIndex: 'nickName'
  },
  {
    align: 'center',
    title: '角色描述',
    dataIndex: 'description',
    ellipsis: true
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
  },
  {
    align: 'center',
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 160
  }
]

const { page, pageSize, total, loading, list, getList, lastPage } = usePageRequest(requestData)

const query = ref<IRoleQuery>({})
const handleQuery = (data?: IRoleQuery) => {
  query.value = data ?? {}

  getList(query.value)
}

const handleSort = (fieldName: keyof IRoleList, order?: 'descend' | 'ascend' | null) => {
  if (fieldName === 'createTime') {
    query.value.isDesc = order === 'ascend' ? 0 : 1
    getList(query.value)
    return
  }
}

const checkedIds = ref<number[]>([])
const deleteSuccess = () => {
  if (page.value < lastPage.value) {
    checkedIds.value = []
    getList()
    return
  }

  const deleteNum = checkedIds.value.length || 1
  const lastPageSize = total.value % pageSize.value || pageSize.value
  if (deleteNum >= lastPageSize) {
    checkedIds.value = []
    if (page.value > 1) {
      page.value -= 1
      return
    }
    getList()
    return
  }
}
</script>

<template>
  <div class="st-container">
    <t-filter :loading="loading" @handle-search="handleQuery" @handle-reset="handleQuery" />

    <div class="tool">
      <a-space>
        <role-add @handle-success="getList" />
        <role-delete :id="checkedIds" @handle-success="deleteSuccess" />
      </a-space>
    </div>

    <base-table
      :columns="columns"
      :default-show-operation="false"
      :loading="loading"
      :list="list"
      default-row-selection
      v-model:checked="checkedIds"
      @handle-sort="handleSort"
    >
      <template #default="{ column, record }">
        <template v-if="column.dataIndex === 'disabled'">
          <role-state-edit v-model="record.disabled" :id="record.id" />
        </template>
        <template v-if="column.key === 'operation'">
          <a-space>
            <role-edit :id="record.id" @handle-success="getList" />
            <role-delete :id="record.id" @handle-success="deleteSuccess" />
          </a-space>
        </template>
      </template>
    </base-table>

    <base-pagination v-model:page="page" v-model:page-size="pageSize" :total="total" />
  </div>
</template>

<style lang="scss" scoped>
.tool {
  margin-top: 20px;
}
</style>
