<script lang="ts" setup>
import { STATUS } from '@/constants/index'

import type { IBaseQuery } from '@/types/index'
import type { IRoleQuery } from '@/types/api/role'

const $props = defineProps<{
  query?: IRoleQuery
}>()
const $emits = defineEmits<{
  handleSearch: [query: IRoleQuery]
  handleReset: []
}>()

const disabled = ref<IRoleQuery['disabled']>(undefined)

const handleSearch = (data: IBaseQuery) => {
  const params: IRoleQuery = {}
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

  $emits('handleSearch', params)
}
const handleReset = () => {
  disabled.value = undefined

  $emits('handleReset')
}

watch(
  () => $props.query,
  (query) => {
    if (query) {
      disabled.value = query.disabled
    }
  },
  {
    immediate: true
  }
)
</script>

<template>
  <!-- vue不能正确监听dateRange属性的变化，只要props任一属性变化了都会触发监听该数组的watch。
    使用computed返回该数组再传给组件即可解决。 -->
  <!-- :date-range="[query?.startTime ?? '', query?.endTime ?? '']" -->
  <base-filter
    :span="7"
    :disabled-empty-search="disabled === undefined"
    :keyword="query?.keyword"
    :default-start-time="query?.beginTime"
    :default-end-time="query?.endTime"
    placeholder="请输入角色名称"
    @handle-search="handleSearch"
    @handle-reset="handleReset"
  >
    <template #default>
      <a-col :span="7">
        <a-select
          v-model:value="disabled"
          style="width: 100%"
          placeholder="角色状态"
          allow-clear
          :options="STATUS"
        ></a-select>
      </a-col>
    </template>
  </base-filter>
</template>

<style lang="scss" scoped></style>
