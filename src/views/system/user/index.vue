<script lang="ts" setup>
import TFilter from './components/TFilter.vue'

import { usePageRequest } from '@/hooks/usePageRequest'
import { getUserList } from '@/api/user'

import type { IUserQuery, IUserList } from '@/types/api/user'
import type { TableColumnProps } from 'ant-design-vue'

defineOptions({
  name: 'systemUser'
})

const requestData = async (params: IUserQuery) => {
  const { result } = await getUserList(params)

  return {
    data: result?.data.list ?? [],
    total: result?.data.total ?? 0
  }
}

const columns: (TableColumnProps & { dataIndex?: keyof IUserList })[] = [
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
const query = ref<IUserQuery>({})
const handleQuery = (data?: IUserQuery) => {
  query.value = data ?? {}

  getList(query.value)
}

const handleSort = (fieldName: keyof IUserList, order?: 'descend' | 'ascend' | null) => {
  if (fieldName === 'createTime') {
    query.value.isDesc = order === 'ascend' ? 0 : 1
    getList(query.value)
    return
  }
}
</script>

<template>
  <div class="st-container">
    <t-filter :loading="loading" @handle-search="handleQuery" @handle-reset="handleQuery" />

    <base-table
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
</style>
