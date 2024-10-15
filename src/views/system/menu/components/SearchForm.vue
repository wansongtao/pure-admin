<script lang="ts" setup>
import { useRouteQuery } from '@vueuse/router'
import useBaseQuery from '@/hooks/useBaseQuery'
import SelectMenuType from './SelectMenuType.vue'

import type { IMenuQuery } from '@/types/api/menu'

const { loading = false } = defineProps<{
  loading?: boolean
}>()

const $emits = defineEmits<{
  search: [data: IMenuQuery]
  reset: []
}>()

const disablePreviousDate = (ts: number) => {
  return ts > Date.now()
}

const { keyword, disabled, dateRange } = useBaseQuery('menu')
const type = useRouteQuery<IMenuQuery['type']>('menu-type', null)

const disableSearch = computed(() => {
  if (
    keyword.value ||
    type.value ||
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

  const data: IMenuQuery = {
    keyword: keyword.value ?? undefined,
    disabled: disabled.value ?? undefined,
    type: type.value ?? undefined,
    beginTime: dateRange.value?.[0] ?? undefined,
    endTime: dateRange.value?.[1] ?? undefined
  }

  $emits('search', data)
}
const onReset = () => {
  keyword.value = null
  disabled.value = null
  type.value = null
  dateRange.value = null

  $emits('reset')
}
</script>

<template>
  <n-form inline :show-feedback="false" :show-label="false">
    <n-row :gutter="20">
      <n-col :span="4">
        <n-form-item>
          <n-input
            v-model:value="keyword"
            placeholder="菜单名称关键字"
            clearable
            @keyup.enter="onSearch"
          />
        </n-form-item>
      </n-col>
      <n-col :span="4">
        <n-form-item>
          <select-menu-type v-model="type" />
        </n-form-item>
      </n-col>
      <n-col :span="4">
        <n-form-item>
          <select-state v-model="disabled" placeholder="菜单状态" />
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
