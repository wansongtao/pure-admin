<script lang="ts" setup>
import { useMenuTypes } from '@/hooks/useMenuTypes'
import { MENU_STATUS } from '@/config/index'

import type { IBaseQuery } from '@/types/index'
import type { IQueryMenuParam } from '@/types/api/menu'

const $emits = defineEmits<{
  handleSearch: [query: IQueryMenuParam]
  handleReset: []
}>()

const { menuTypes } = useMenuTypes()

const disabled = ref<IQueryMenuParam['disabled']>(undefined)
const type = ref<IQueryMenuParam['type']>(undefined)
const handleSearch = (data: IBaseQuery) => {
  const params: IQueryMenuParam = {}
  if (data?.keyword) {
    params.title = data.keyword
  }
  if (data?.startTime) {
    params.startTime = data.startTime
  }
  if (data?.endTime) {
    params.endTime = data.endTime
  }
  if (disabled.value !== undefined) {
    params.disabled = disabled.value
  }
  if (type.value !== undefined) {
    params.type = type.value
  }

  $emits('handleSearch', params)
}
const handleReset = () => {
  disabled.value = undefined
  type.value = undefined

  $emits('handleReset')
}
</script>

<template>
  <BaseFilter
    :span="8"
    :disabled-empty-search="disabled === undefined && type === undefined"
    @handle-search="handleSearch"
    @handle-reset="handleReset"
  >
    <template #default>
      <a-col :span="4">
        <a-select
          v-model:value="disabled"
          style="width: 100%"
          placeholder="菜单状态"
          allow-clear
          :options="MENU_STATUS"
        ></a-select>
      </a-col>
      <a-col :span="4">
        <a-select
          v-model:value="type"
          style="width: 100%"
          placeholder="菜单类型"
          allow-clear
          :options="menuTypes"
        ></a-select>
      </a-col>
    </template>
  </BaseFilter>
</template>

<style lang="scss" scoped></style>
 