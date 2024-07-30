<script lang="ts" setup>
import TFilter from './components/TFilter.vue'
import MENU_ICON_MAP from '@/plugins/importMenuIcons'
import MenuAdd from './components/MenuAdd.vue'
import MenuEdit from './components/MenuEdit.vue'
import MenuDelete from './components/MenuDelete.vue'
import MenuStateEdit from './components/MenuStateEdit.vue'

import { usePageRequest } from '@/hooks/usePageRequest'
import { getMenuList } from '@/api/menu'
import { MENU_TYPES } from '@/constants/index'
import { useObjectQuery } from '@/hooks/useQuery'
import { useAuthority } from '@/hooks/useAuthority'
import dayjs from 'dayjs'
import { deepMap } from '@/utils'

import type { IMenuQuery, IMenuListItem } from '@/types/api/menu'
import type { IBaseColumn } from '@/types/ant-design'

defineOptions({
  name: 'SystemMenuIndex'
})

const { hasPermission } = useAuthority()
const isShowTool = computed(() => {
  return hasPermission(['system:menu:add', 'system:menu:del'], true)
})
const isShowSelection = computed(() => {
  return hasPermission(['system:menu:del'])
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
  if (params.beginTime) {
    params.beginTime = dayjs(params.beginTime).add(-480, 'm').format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]')
  }
  if (params.endTime) {
    params.endTime = dayjs(params.endTime).add(-480, 'm').format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]')
  }

  const [, result] = await getMenuList(params)
  const list = result?.data.list ?? []
  const total = result?.data.total ?? 0

  return {
    data: deepMap(list, (item) => {
      item.createdAt = dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
      return item
    }),
    total
  }
}

const search = useObjectQuery<IMenuQuery>('search')

const staticColumns: IBaseColumn<IMenuListItem>[] = [
  {
    align: 'center',
    title: '菜单名称',
    dataIndex: 'name',
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
    title: '排序',
    dataIndex: 'sort'
  }
]
const columns = computed(() => {
  const list = [...staticColumns]
  list.push({
    align: 'center',
    title: '添加时间',
    dataIndex: 'createdAt',
    sorter: true,
    defaultSortOrder: search.value.sort === 'asc' ? 'ascend' : 'descend',
    width: 180
  })

  if (hasPermission(['system:menu:edit', 'system:menu:del'], true)) {
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

const handleSort = (fieldName: keyof IMenuListItem, order?: 'descend' | 'ascend' | null) => {
  if (fieldName === 'createdAt') {
    const sort = order === 'ascend' ? 'asc' : 'desc'
    search.value = { ...search.value, sort }
    return
  }
}

const handleQuery = (data?: IMenuQuery) => {
  search.value = data ? { ...search.value, ...data } : {}
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

const editSuccess = () => {
  page.value = 1
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
        <check-permission permissions="system:menu:add">
          <menu-add @handle-success="getList(search)" />
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
      :default-row-selection="isShowSelection"
      v-model:checked="checkedIds"
      :scroll="tableScroll"
      @handle-sort="handleSort"
    >
      <template #default="{ column, record }">
        <template v-if="column.dataIndex === 'type'">
          <a-tag color="success" v-if="record.type === 'MENU'">{{ MENU_TYPES[record.type] }}</a-tag>
          <a-tag color="processing" v-if="record.type === 'BUTTON'">{{
            MENU_TYPES[record.type]
          }}</a-tag>
          <a-tag color="default" v-if="record.type !== 'MENU' && record.type !== 'BUTTON'">
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
              <menu-edit :id="record.id" @handle-success="editSuccess" />
            </check-permission>
            <check-permission permissions="system:menu:del">
              <menu-delete :id="record.id" @handle-success="deleteSuccess" />
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
