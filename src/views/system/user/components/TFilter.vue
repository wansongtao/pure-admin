<script lang="ts" setup>
import { STATUS } from '@/constants/index'

import type { IBaseQuery } from '@/types/index'
import type { IUserQuery } from '@/types/api/user'

const $emits = defineEmits<{
  handleSearch: [query: IUserQuery]
  handleReset: []
}>()
const $props = defineProps<{
  query?: IUserQuery
}>()

const disabled = ref<IUserQuery['disabled']>(undefined)

const handleSearch = (data: IBaseQuery) => {
  const params: IUserQuery = {}
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
  <base-filter
    :span="8"
    placeholder="请输入用户名、昵称关键字"
    :disabled-empty-search="disabled === undefined"
    :keyword="query?.keyword"
    :default-start-time="query?.beginTime"
    :default-end-time="query?.endTime"
    @handle-search="handleSearch"
    @handle-reset="handleReset"
  >
    <template #default>
      <a-col :span="6">
        <a-select
          v-model:value="disabled"
          style="width: 100%"
          placeholder="用户状态"
          allow-clear
          :options="STATUS"
        ></a-select>
      </a-col>
    </template>
  </base-filter>
</template>

<style lang="scss" scoped>

</style>