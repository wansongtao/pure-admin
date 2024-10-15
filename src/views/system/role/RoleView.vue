<script lang="ts" setup>
import { NSpace } from 'naive-ui'
import SearchForm from './components/SearchForm.vue'
import ButtonAdd from './components/ButtonAdd.vue'
import ButtonDelete from './components/ButtonDelete.vue'
import ButtonDeleteBatch from './components/ButtonDeleteBatch.vue'
import ButtonState from './components/ButtonState.vue'
import ButtonEdit from './components/ButtonEdit.vue'

import useRequest from '@/hooks/useRequest'
import useTableSort from '@/hooks/useTableSort'
import { getRoleList } from '@/api/role'
import usePermission from '@/hooks/usePermission'

import type { IQuery } from '@/types/api'
import type { IRoleListItem } from '@/types/api/role'
import type { IColumn } from '@/types'

const { page, pageSize, list, total, loading, fetchList } = useRequest(async (params: IQuery) => {
  const [, result] = await getRoleList(params)
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
  const hasEditPermission = hasPermission('system:role:edit')

  const list: IColumn<IRoleListItem>[] = [
    {
      align: 'center',
      key: 'id',
      title: '角色ID'
    },
    {
      align: 'center',
      key: 'name',
      title: '角色名称'
    },
    {
      align: 'center',
      key: 'description',
      title: '角色描述',
      ellipsis: {
        tooltip: true
      },
      render: ({ description }) => description || '--'
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

  const hasDeletePermission = hasPermission('system:role:del')
  if (hasDeletePermission) {
    list.unshift({
      type: 'selection'
    })
  }

  if (hasDeletePermission || hasEditPermission) {
    const action: IColumn<IRoleListItem> = {
      align: 'center',
      key: 'action',
      title: '操作',
      render(row) {
        const deleteButton = h(ButtonDelete, {
          id: row.id,
          onSuccess: onDeleteSuccess
        })
        const editButton = h(ButtonEdit, { id: row.id, onSuccess: updateTableData })

        if (hasDeletePermission && hasEditPermission) {
          return h(NSpace, undefined, {
            default: () => [editButton, deleteButton]
          })
        }

        if (hasDeletePermission) {
          return deleteButton
        }

        if (hasEditPermission) {
          return editButton
        }
      }
    }

    list.push(action)
  }

  return list
})

const checkedKeys = ref<number[]>([])
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
    <check-permission or :permission="['system:role:add', 'system:role:del']">
      <n-space style="margin-top: 20px">
        <check-permission permission="system:role:add">
          <button-add @success="updateTableData" />
        </check-permission>
        <check-permission permission="system:role:del">
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
        :loading
        style="height: 100%"
        flex-height
        striped
        :row-key="(rowData: IRoleListItem) => rowData.id"
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
