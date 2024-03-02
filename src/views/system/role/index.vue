<script lang="ts" setup>
import TFilter from './components/TFilter.vue'
import RoleStateEdit from './components/RoleStateEdit.vue'
import RoleAdd from './components/RoleAdd.vue'
import RoleEdit from './components/RoleEdit.vue'
import RoleDelete from './components/RoleDelete.vue'

import { usePageRequest } from '@/hooks/usePageRequest'
import { getRoleList } from '@/api/role'
import { useQuery } from '@/hooks/useQuery'

import type { IRoleQuery, IRoleList } from '@/types/api/role'
import type { TableColumnProps } from 'ant-design-vue'

defineOptions({
  name: 'SystemRoleIndex'
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

const name = useQuery<IRoleQuery['name']>('name', undefined, { isEncodeURIComponent: true })
const disabled = useQuery('disabled', undefined, {
  transform: (val) => (val !== undefined ? Number(val) : undefined) as IRoleQuery['disabled']
})
const startTime = useQuery<IRoleQuery['startTime']>('startTime')
const endTime = useQuery<IRoleQuery['endTime']>('endTime')
const isDesc = useQuery('isDesc', undefined, {
  transform: (val) => (val !== undefined ? Number(val) : undefined) as IRoleQuery['isDesc']
})

const { page, pageSize, total, loading, list, getList, lastPage } = usePageRequest(requestData)

const query = computed(() => {
  const data: IRoleQuery = { page: page.value, pageSize: pageSize.value }
  if (name.value) {
    data.name = name.value
  }
  if (disabled.value !== undefined) {
    data.disabled = disabled.value
  }
  if (startTime.value) {
    data.startTime = startTime.value
  }
  if (endTime.value) {
    data.endTime = endTime.value
  }
  if (isDesc.value !== undefined) {
    data.isDesc = isDesc.value
  }

  getList(data)
  return data
})

const handleQuery = (data?: IRoleQuery) => {
  name.value = data?.name ?? ''
  disabled.value = data?.disabled
  startTime.value = data?.startTime
  endTime.value = data?.endTime
}

const handleSort = (fieldName: keyof IRoleList, order?: 'descend' | 'ascend' | null) => {
  if (fieldName === 'createTime') {
    isDesc.value = order === 'ascend' ? 0 : 1
    return
  }
}

const checkedIds = ref<number[]>([])
const deleteSuccess = () => {
  if (page.value < lastPage.value) {
    checkedIds.value = []
    getList(query.value)
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
    getList(query.value)
    return
  }
}
</script>

<template>
  <div class="st-container">
    <t-filter
      :loading="loading"
      :query="query"
      @handle-search="handleQuery"
      @handle-reset="handleQuery"
    />

    <div class="tool">
      <a-space>
        <role-add @handle-success="getList(query)" />
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
            <role-edit :id="record.id" @handle-success="getList(query)" />
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
