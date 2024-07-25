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
import dayjs from 'dayjs'

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
  if (params.beginTime) {
    params.beginTime = dayjs(params.beginTime).add(-480, 'm').format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]')
  }
  if (params.endTime) {
    params.endTime = dayjs(params.endTime).add(-480, 'm').format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]')
  }

  const [, result] = await getRoleList(params)

  result?.data.list?.forEach((item: IRoleList) => {
    item.createdAt = dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
    item.updatedAt = dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')
  })

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
      title: '角色名称',
      dataIndex: 'name'
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
      dataIndex: 'createdAt',
      sorter: true,
      defaultSortOrder: search.value.sort === 'asc' ? 'ascend' : 'descend',
      width: 180
    },
    {
      align: 'center',
      title: '更新时间',
      dataIndex: 'updatedAt',
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

const { page, pageSize, total, loading, list, getList } = usePageRequest(requestData)

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
  search.value = data ? { ...search.value, ...data } : {}
}

const handleSort = (fieldName: keyof IRoleList, order?: 'descend' | 'ascend' | null) => {
  if (fieldName === 'createdAt') {
    const sort = order === 'ascend' ? 'asc' : 'desc'
    search.value = { ...search.value, sort }
    return
  }
}

const checkedIds = ref<number[]>([])
const deleteSuccess = (isSingle: boolean) => {
  let deleteCount = 1
  if (!isSingle) {
    deleteCount = checkedIds.value.length
    checkedIds.value = []
  }

  const lastPageSize = total.value % pageSize.value || pageSize.value
  if (deleteCount >= lastPageSize && page.value > 1) {
    page.value -= 1
    return
  }

  getList(search.value)
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

    <base-pagination
      v-model:page="page"
      v-model:page-size="pageSize"
      :total="total"
      :disable="loading"
    />
  </div>
</template>

<style lang="scss" scoped>
.tool {
  margin-top: 20px;
}
</style>
