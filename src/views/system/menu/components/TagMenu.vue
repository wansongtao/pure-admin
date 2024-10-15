<script lang="ts" setup>
import { MENU_TYPES } from '@/constants'
import type { TagProps } from 'naive-ui'

const $props = defineProps<{
  type: keyof typeof MENU_TYPES
}>()

const tagType = computed(() => {
  let type: TagProps['type'] = 'default'
  if ($props.type === 'MENU') {
    type = 'success'
  } else if ($props.type === 'BUTTON') {
    type = 'info'
  }

  return type
})
</script>

<template>
  <n-tag :bordered="false" :type="tagType">{{ MENU_TYPES[type] }}</n-tag>
</template>

<style lang="scss" scoped></style>
