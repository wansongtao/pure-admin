<script lang="ts" setup>
import TFilter from './components/TFilter.vue'
import RoleStateEdit from './components/RoleStateEdit.vue'
import RoleAdd from './components/RoleAdd.vue'
import RoleEdit from './components/RoleEdit.vue'
import RoleDelete from './components/RoleDelete.vue'

import { usePageRequest } from '@/hooks/usePageRequest'
import { getRoleList } from '@/api/role'
import { useObjectQuery } from '@/hooks/useQuery'
import { useAuthority } from '@/hooks/useAuthority'

import type { IRoleQuery, IRoleList } from '@/types/api/role'
import type { IBaseColumn } from '@/types/ant-design'

defineOptions({
  name: 'SystemRoleIndex'
})

const { hasPermission } = useAuthority()
const isShowTool = computed(() => {
  return hasPermission(['system:role:add', 'system:role:del'], true)
})
const tableScroll = computed(() => {
  return isShowTool.value
    ? {
        scrollToFirstRowOnChange: true,
        y: 'calc(100vh - var(--st-scrollbar-h) - var(--st-header-h) - 262px)'
      }
    : {
        scrollToFirstRowOnChange: true,
        y: 'calc(100vh - var(--st-scrollbar-h) - var(--st-header-h) - 212px)'
      }
})

const requestData = async (params: IRoleQuery) => {
  const { result } = await getRoleList(params)

  return {
    data: result?.data.list ?? [],
    total: result?.data.total ?? 0
  }
}

const search = useObjectQuery<IRoleQuery>('search')

const columns = computed(() => {
  const list: IBaseColumn<IRoleList>[] = [
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
      sortOrder: search.value.timeSort,
      width: 180
    }
  ]

  if (hasPermission(['system:role:edit', 'system:role:del'], true)) {
    list.push({
      align: 'center',
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 160
    })
  }

  return list
})

const handleSort = (fieldName: keyof IRoleList, order?: 'descend' | 'ascend' | null) => {
  columns.value.forEach((item) => {
    if (item.dataIndex === fieldName) {
      item.sortOrder = order
    }
  })

  if (fieldName === 'createTime') {
    search.value.timeSort = order as IRoleQuery['timeSort']
    return
  }
}

const { page, pageSize, total, loading, list, getList, lastPage } = usePageRequest(requestData)

watch(
  [search, page, pageSize],
  () => {
    getList(search.value)
  },
  {
    immediate: true
  }
)

const handleQuery = (data?: IRoleQuery) => {
  search.value = data!
}

const checkedIds = ref<number[]>([])
const deleteSuccess = () => {
  if (page.value < lastPage.value) {
    checkedIds.value = []
    getList(search.value)
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
    getList(search.value)
    return
  }
}
</script>

<template>
  <div class="st-container">
    <t-filter
      :loading="loading"
      :query="search"
      @handle-search="handleQuery"
      @handle-reset="handleQuery"
    />

    <div class="tool" v-if="isShowTool">
      <a-space>
        <check-permission permissions="system:role:add">
          <role-add @handle-success="getList(search)" />
        </check-permission>
        <check-permission permissions="system:role:del">
          <role-delete :id="checkedIds" @handle-success="deleteSuccess" />
        </check-permission>
      </a-space>
    </div>

    <base-table
      :columns="columns"
      :scroll="tableScroll"
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
            <check-permission permissions="system:role:edit">
              <role-edit :id="record.id" @handle-success="getList(search)" />
            </check-permission>

            <check-permission permissions="system:role:del">
              <role-delete :id="record.id" @handle-success="deleteSuccess" />
            </check-permission>
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
