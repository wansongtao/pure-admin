<script lang="ts" setup>
import { STATUS, MENU_TYPES } from '@/constants/index'
import { convertObjectToArray } from '@/utils/index'

import type { IBaseQuery } from '@/types/index'
import type { IMenuQuery } from '@/types/api/menu'

const $props = defineProps<{
  query?: IMenuQuery
}>()
const $emits = defineEmits<{
  handleSearch: [query: IMenuQuery]
  handleReset: []
}>()

const menuTypes = convertObjectToArray(MENU_TYPES)

const disabled = ref<IMenuQuery['disabled']>(undefined)
const type = ref<IMenuQuery['type']>(undefined)
const handleSearch = (data: IBaseQuery) => {
  const params: IMenuQuery = {}
  if (data?.keyword) {
    params.keyword = data.keyword
  }
  if (data?.startTime) {
    params.beginTime = data.startTime
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

watch(
  () => $props.query,
  (query) => {
    if (query) {
      disabled.value = query.disabled
      type.value = query.type
    }
  },
  {
    immediate: true
  }
)
</script>

<template>
  <base-filter
    :span="8"
    :disabled-empty-search="disabled === undefined && type === undefined"
    :keyword="query?.keyword"
    :default-start-time="query?.beginTime"
    :default-end-time="query?.endTime"
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
          :options="STATUS"
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
  </base-filter>
</template>

<style lang="scss" scoped></style>
@/constants/index