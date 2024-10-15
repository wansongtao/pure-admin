<script lang="ts" setup>
import { NSpace, NTag } from 'naive-ui'
import SearchForm from './components/SearchForm.vue'
import ButtonAdd from './components/ButtonAdd.vue'
import ButtonDelete from './components/ButtonDelete.vue'
import ButtonDeleteBatch from './components/ButtonDeleteBatch.vue'
import ButtonState from './components/ButtonState.vue'
import ButtonEdit from './components/ButtonEdit.vue'
import ButtonResetPassword from './components/ButtonResetPassword.vue'

import useRequest from '@/hooks/useRequest'
import useTableSort from '@/hooks/useTableSort'
import { getUserList } from '@/api/user'
import usePermission from '@/hooks/usePermission'

import type { IQuery } from '@/types/api'
import type { IUserListItem } from '@/types/api/user'
import type { IColumn } from '@/types'
import type { VNode } from 'vue'

const { page, pageSize, list, total, loading, fetchList } = useRequest(async (params: IQuery) => {
  const [, result] = await getUserList(params)
  const data = result?.data.list ?? []
  const total = result?.data.total ?? 0

  return {
    data,
    total
  }
})

const search = ref<IQuery>({})
const onSearch = (data: IQuery) => {
  search.value = data
  page.value = 1
}
const onReset = () => {
  search.value = {}
  page.value = 1
}

const { sort, onSorterChange } = useTableSort()
const updateTableData = () => {
  fetchList({ ...search.value, sort: sort.value })
}

watch(
  [page, pageSize, search, sort],
  () => {
    updateTableData()
  },
  { immediate: true }
)

const { hasPermission } = usePermission()

const columns = computed(() => {
  const hasEditPermission = hasPermission('system:user:edit')

  const list: IColumn<IUserListItem>[] = [
    {
      align: 'center',
      key: 'userName',
      title: '用户名'
    },
    {
      align: 'center',
      key: 'nickName',
      title: '昵称',
      ellipsis: {
        tooltip: true
      },
      render: (row) => row.nickName || '--'
    },
    {
      align: 'center',
      key: 'avatar',
      title: '头像',
      width: 60,
      render: (row) => {
        return row.avatar
          ? h('img', {
              src: row.avatar,
              alt: 'avatar',
              style: {
                margin: '0 auto',
                width: '40px',
                height: '40px',
                borderRadius: '50%'
              }
            })
          : '--'
      }
    },
    {
      align: 'center',
      key: 'roleNames',
      title: '角色',
      width: 160,
      render: (row) => {
        if (!row.roleNames?.length) {
          return '--'
        }

        return h(
          NSpace,
          { justify: 'center' },
          {
            default: () =>
              row.roleNames!.map((role) => h(NTag, { type: 'info' }, { default: () => role }))
          }
        )
      }
    },
    {
      align: 'center',
      key: 'disabled',
      title: '状态',
      render: (row) => {
        return h(ButtonState, {
          id: row.id,
          modelValue: row.disabled,
          disabled: !hasEditPermission
        })
      }
    },
    {
      align: 'center',
      key: 'createdAt',
      title: '创建时间',
      defaultSortOrder: sort.value === 'asc' ? 'ascend' : 'descend',
      sorter: true,
      width: 200
    },
    {
      align: 'center',
      key: 'updatedAt',
      title: '更新时间',
      width: 200
    }
  ]

  const hasDeletePermission = hasPermission('system:user:del')
  if (hasDeletePermission) {
    list.unshift({
      type: 'selection'
    })
  }

  const hasResetPasswordPermission = hasPermission('system:user:reset')
  if (hasDeletePermission || hasEditPermission || hasResetPasswordPermission) {
    const action: IColumn<IUserListItem> = {
      align: 'center',
      key: 'action',
      title: '操作',
      width: 220,
      render(row) {
        const actionList: VNode[] = []
        if (hasEditPermission) {
          actionList.push(h(ButtonEdit, { id: row.id, onSuccess: updateTableData }))
        }
        if (hasDeletePermission) {
          actionList.push(
            h(ButtonDelete, {
              id: row.id,
              onSuccess: onDeleteSuccess
            })
          )
        }
        if (hasResetPasswordPermission) {
          actionList.push(h(ButtonResetPassword, { id: row.id }))
        }

        if (actionList.length === 1) {
          return actionList[0]
        }

        return h(
          NSpace,
          { justify: 'center' },
          {
            default: () => actionList
          }
        )
      }
    }

    list.push(action)
  }

  return list
})

const checkedKeys = ref<string[]>([])
function onDeleteSuccess(isBatch = false) {
  let deleteCount = 1
  if (isBatch) {
    deleteCount = checkedKeys.value.length
    checkedKeys.value = []
  }

  const lastPageSize = total.value % pageSize.value || pageSize.value
  if (deleteCount < lastPageSize || page.value === 1) {
    updateTableData()
    return
  }

  const lastPage = Math.ceil(total.value / pageSize.value)
  const currentLastPage = Math.ceil((total.value - deleteCount) / pageSize.value)
  page.value = Math.max(1, page.value - (lastPage - currentLastPage))
}
</script>

<template>
  <base-box>
    <search-form :loading @search="onSearch" @reset="onReset" />
    <check-permission or :permission="['system:user:add', 'system:user:del']">
      <n-space style="margin-top: 20px">
        <check-permission permission="system:user:add">
          <button-add @success="updateTableData" />
        </check-permission>
        <check-permission permission="system:user:del">
          <button-delete-batch
            :id="checkedKeys"
            @success="onDeleteSuccess(true)"
            @failed="checkedKeys = []"
          />
        </check-permission>
      </n-space>
    </check-permission>
    <div class="table">
      <n-data-table
        v-model:checked-row-keys="checkedKeys"
        :columns="columns"
        :data="list"
        :row-key="(rowData: IUserListItem) => rowData.id"
        :loading
        style="height: 100%"
        flex-height
        striped
        @update:sorter="onSorterChange"
      />
    </div>
    <base-pagination v-model:page="page" v-model:page-size="pageSize" :total :disabled="loading" />
  </base-box>
</template>

<style lang="scss" scoped>
.table {
  flex: 1;
  margin: 20px 0;
}
</style>
