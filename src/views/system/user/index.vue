<script lang="ts" setup>
import TFilter from './components/TFilter.vue'
import UserDelete from './components/UserDelete.vue'
import UserStateEdit from './components/UserStateEdit.vue'
import UserEdit from './components/UserEdit.vue'
import UserAdd from './components/UserAdd.vue'

import { usePageRequest } from '@/hooks/usePageRequest'
import { useQuery } from '@/hooks/useQuery'
import { getUserList } from '@/api/user'

import type { IUserQuery, IUserList } from '@/types/api/user'
import type { IBaseColumn } from '@/types/ant-design'

defineOptions({
  name: 'SystemUserIndex'
})

const requestData = async (params: IUserQuery) => {
  const { result } = await getUserList(params)

  return {
    data: result?.data.list ?? [],
    total: result?.data.total ?? 0
  }
}

const timeSort = useQuery<IUserQuery['timeSort']>('timeSort')

const columns = ref<IBaseColumn<IUserList>[]>([
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
    sortOrder: timeSort.value,
    width: 180
  },
  {
    align: 'center',
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 160
  }
])
const handleSort = (fieldName: keyof IUserList, order?: 'descend' | 'ascend' | null) => {
  columns.value.forEach((item) => {
    if (item.dataIndex === fieldName) {
      item.sortOrder = order
    }
  })

  if (fieldName === 'createTime') {
    timeSort.value = order as IUserQuery['timeSort']
    return
  }
}

const { page, pageSize, total, loading, list, getList, lastPage } = usePageRequest(requestData)

const keyword = useQuery<IUserQuery['keyword']>('keyword', undefined, {
  isEncodeURIComponent: true
})
const disabled = useQuery('disabled', undefined, {
  transform: (val) => (val !== undefined ? Number(val) : undefined) as IUserQuery['disabled']
})
const startTime = useQuery<IUserQuery['startTime']>('startTime')
const endTime = useQuery<IUserQuery['endTime']>('endTime')

const query = computed(() => {
  const data: IUserQuery = { page: page.value, pageSize: pageSize.value }
  if (keyword.value) {
    data.keyword = keyword.value
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
  if (timeSort.value) {
    data.timeSort = timeSort.value
  }

  getList(data)
  return data
})

const handleQuery = (data?: IUserQuery) => {
  keyword.value = data?.keyword ?? ''
  disabled.value = data?.disabled
  startTime.value = data?.startTime
  endTime.value = data?.endTime
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

    <div class="mt-20">
      <a-space>
        <check-permission permissions="system:user:add">
          <user-add @handle-success="getList(query)" />
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
      :default-show-operation="false"
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
              <user-edit :id="record.id" @handle-success="getList(query)" />
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
