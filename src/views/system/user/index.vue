<script lang="ts" setup>
import TFilter from './components/TFilter.vue'
import UserDelete from './components/UserDelete.vue'
import UserStateEdit from './components/UserStateEdit.vue'
import UserEdit from './components/UserEdit.vue'
import UserAdd from './components/UserAdd.vue'

import { usePageRequest } from '@/hooks/usePageRequest'
import { useObjectQuery } from '@/hooks/useQuery'
import { getUserList } from '@/api/user'
import { useAuthority } from '@/hooks/useAuthority'

import type { IUserQuery, IUserList } from '@/types/api/user'
import type { IBaseColumn } from '@/types/ant-design'

defineOptions({
  name: 'SystemUserIndex'
})

const { hasPermission } = useAuthority()
const isShowTool = computed(() => {
  return hasPermission(['system:user:add', 'system:user:del'], true)
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

const requestData = async (params: IUserQuery) => {
  const { result } = await getUserList(params)

  return {
    data: result?.data.list ?? [],
    total: result?.data.total ?? 0
  }
}

const search = useObjectQuery<IUserQuery>('search')

const columns = computed(() => {
  const list: IBaseColumn<IUserList>[] = [
    {
      align: 'center',
      title: '用户ID',
      dataIndex: 'id',
      width: 100
    },
    {
      align: 'center',
      title: '用户名',
      dataIndex: 'userName'
    },
    {
      align: 'center',
      title: '角色头像',
      dataIndex: 'avatar'
    },
    {
      align: 'center',
      title: '用户昵称',
      dataIndex: 'nickName'
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

  if (hasPermission(['system:user:edit', 'system:user:del'], true)) {
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

const handleSort = (fieldName: keyof IUserList, order?: 'descend' | 'ascend' | null) => {
  columns.value.forEach((item) => {
    if (item.dataIndex === fieldName) {
      item.sortOrder = order
    }
  })

  if (fieldName === 'createTime') {
    search.value.timeSort = order as IUserQuery['timeSort']
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

const handleQuery = (data?: IUserQuery) => {
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

    <div class="mt-20" v-if="isShowTool">
      <a-space>
        <check-permission permissions="system:user:add">
          <user-add @handle-success="getList(search)" />
        </check-permission>
        <check-permission permissions="system:user:del">
          <user-delete :id="checkedIds" @handle-success="deleteSuccess" />
        </check-permission>
      </a-space>
    </div>

    <base-table
      v-model:checked="checkedIds"
      default-row-selection
      :columns="columns"
      :scroll="tableScroll"
      :loading="loading"
      :list="list"
      @handle-sort="handleSort"
    >
      <template #default="{ column, record }">
        <template v-if="column.dataIndex === 'avatar'">
          <div class="avatar">
            <img class="avatar_img" :src="record.avatar" alt="" />
          </div>
        </template>
        <template v-if="column.dataIndex === 'disabled'">
          <user-state-edit v-model="record.disabled" :id="record.id" />
        </template>
        <template v-if="column.key === 'operation'">
          <a-space>
            <check-permission permissions="system:user:edit">
              <user-edit :id="record.id" @handle-success="getList(search)" />
            </check-permission>
            <check-permission permissions="system:user:del">
              <user-delete :id="record.id" @handle-success="deleteSuccess" />
            </check-permission>
          </a-space>
        </template>
      </template>
    </base-table>

    <base-pagination v-model:page="page" v-model:page-size="pageSize" :total="total" />
  </div>
</template>

<style lang="scss" scoped>
.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  .avatar_img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
}

.mt-20 {
  margin-top: 20px;
}
</style>
