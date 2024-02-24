<script lang="ts" setup>
import { STATUS } from '@/config/index'

import type { IBaseQuery } from '@/types/index'
import type { IRoleQuery } from '@/types/api/role'

const $emits = defineEmits<{
  handleSearch: [query: IRoleQuery]
  handleReset: []
}>()

const disabled = ref<IRoleQuery['disabled']>(undefined)

const handleSearch = (data: IBaseQuery) => {
  const params: IRoleQuery = {}
  if (data?.keyword) {
    params.name = data.keyword
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

  $emits('handleSearch', params)
}
const handleReset = () => {
  disabled.value = undefined

  $emits('handleReset')
}
</script>

<template>
  <base-filter
    :span="8"
    :disabled-empty-search="disabled === undefined"
    @handle-search="handleSearch"
    @handle-reset="handleReset"
  >
    <template #default>
      <a-col :span="8">
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
 