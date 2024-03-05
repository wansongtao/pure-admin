<script lang="ts" setup>
import TFilter from './components/TFilter.vue'
import MENU_ICON_MAP from '@/config/menuIcons'
import MenuAdd from './components/MenuAdd.vue'
import MenuEdit from './components/MenuEdit.vue'
import MenuDelete from './components/MenuDelete.vue'
import MenuStateEdit from './components/MenuStateEdit.vue'

import { usePageRequest } from '@/hooks/usePageRequest'
import { getMenuList } from '@/api/menu'
import { MENU_TYPES } from '@/config/index'
import { useQuery } from '@/hooks/useQuery'
import { useAuthority } from '@/hooks/useAuthority'

import type { IMenuQuery, IMenuListItem } from '@/types/api/menu'
import type { IBaseColumn } from '@/types/ant-design'

defineOptions({
  name: 'SystemMenuIndex'
})

const { hasPermission } = useAuthority()
const isShowTool = computed(() => {
  return hasPermission(['system:menu:add', 'system:menu:del'], true)
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

const requestData = async (params: IMenuQuery) => {
  const { result } = await getMenuList(params)

  return {
    data: result?.data.list ?? [],
    total: result?.data.total ?? 0
  }
}

const timeSort = useQuery<IMenuQuery['timeSort']>('timeSort')
const columns = ref<IBaseColumn<IMenuListItem>[]>([
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
const handleSort = (fieldName: keyof IMenuListItem, order?: 'descend' | 'ascend' | null) => {
  columns.value.forEach((item) => {
    if (item.dataIndex === fieldName) {
      item.sortOrder = order
    }
  })

  if (fieldName === 'createTime') {
    timeSort.value = order as IMenuQuery['timeSort']
    return
  }
}

const { page, pageSize, total, loading, list, lastPage, getList } = usePageRequest(requestData)

const title = useQuery<IMenuQuery['title']>('title', undefined, { isEncodeURIComponent: true })
const disabled = useQuery('disabled', undefined, {
  transform: (val) => (val !== undefined ? Number(val) : undefined) as IMenuQuery['disabled']
})
const type = useQuery<IMenuQuery['type']>('type')
const startTime = useQuery<IMenuQuery['startTime']>('startTime')
const endTime = useQuery<IMenuQuery['endTime']>('endTime')

const query = computed(() => {
  const data: IMenuQuery = { page: page.value, pageSize: pageSize.value }
  if (title.value) {
    data.title = title.value
  }
  if (disabled.value !== undefined) {
    data.disabled = disabled.value
  }
  if (type.value) {
    data.type = type.value
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

const handleQuery = (data?: IMenuQuery) => {
  title.value = data?.title ?? ''
  disabled.value = data?.disabled
  type.value = data?.type
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

    <div class="tool" v-if="isShowTool">
      <a-space>
        <check-permission permissions="system:menu:add">
          <menu-add @handle-success="getList(query)" />
        </check-permission>

        <check-permission permissions="system:menu:del">
          <menu-delete :id="checkedIds" @handle-success="deleteSuccess" />
        </check-permission>
      </a-space>
    </div>

    <base-table
      :columns="columns"
      :list="list"
      :loading="loading"
      bordered
      default-expand-first-rows
      default-row-selection
      v-model:checked="checkedIds"
      :scroll="tableScroll"
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
          <menu-state-edit v-model="record.disabled" :id="record.id" />
        </template>
        <template v-if="column.key === 'operation'">
          <a-space>
            <check-permission permissions="system:menu:edit">
              <menu-edit :id="record.id" @handle-success="getList(query)" />
            </check-permission>
            <check-permission permissions="system:menu:del">
              <menu-delete :id="record.id" @handle-success="deleteSuccess" />
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
