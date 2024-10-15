<script lang="ts" setup>
import useBaseQuery from '@/hooks/useBaseQuery'

import type { IQuery } from '@/types/api/index'

const { loading = false } = defineProps<{
  loading?: boolean
}>()

const $emits = defineEmits<{
  search: [data: IQuery]
  reset: []
}>()

const disablePreviousDate = (ts: number) => {
  return ts > Date.now()
}

const { keyword, disabled, dateRange } = useBaseQuery('user')

const disableSearch = computed(() => {
  if (
    keyword.value ||
    (disabled.value !== undefined && disabled.value !== null) ||
    dateRange.value
  ) {
    return false
  }

  return true
})

const onSearch = () => {
  if (disableSearch.value) {
    return
  }

  const data: IQuery = {
    keyword: keyword.value ?? undefined,
    disabled: disabled.value ?? undefined,
    beginTime: dateRange.value?.[0] ?? undefined,
    endTime: dateRange.value?.[1] ?? undefined
  }

  $emits('search', data)
}
const onReset = () => {
  keyword.value = null
  disabled.value = null
  dateRange.value = null

  $emits('reset')
}
</script>

<template>
  <n-form inline :show-feedback="false" :show-label="false">
    <n-row :gutter="20">
      <n-col :span="6">
        <n-form-item>
          <n-input
            v-model:value="keyword"
            placeholder="名称、昵称关键字"
            clearable
            @keyup.enter="onSearch"
          />
        </n-form-item>
      </n-col>
      <n-col :span="6">
        <n-form-item>
          <select-state v-model="disabled" placeholder="用户状态" />
        </n-form-item>
      </n-col>
      <n-col :span="8">
        <n-form-item>
          <n-date-picker
            v-model:value="dateRange"
            type="daterange"
            :is-date-disabled="disablePreviousDate"
            clearable
          />
        </n-form-item>
      </n-col>
      <n-col :span="4">
        <n-form-item>
          <n-row :gutter="20">
            <n-col :span="12">
              <button-search
                :disabled="disableSearch"
                :loading="loading && !disableSearch"
                @click="onSearch"
              />
            </n-col>
            <n-col :span="12">
              <button-reset :loading="loading && disableSearch" @click="onReset" />
            </n-col>
          </n-row>
        </n-form-item>
      </n-col>
    </n-row>
  </n-form>
</template>

<style lang="scss" scoped></style>
