<script lang="ts" generic="T extends string | number | (string | number)[] | null" setup>
import useMenuTree from '@/hooks/useMenuTree'

const { containButton = false } = defineProps<{
  containButton?: boolean
  checkable?: boolean
  maxTagCount?: number | 'responsive'
  multiple?: boolean
  placeholder?: string
}>()

const menuId = defineModel<T>()
const { menuTree } = useMenuTree(containButton)
</script>

<template>
  <n-tree-select
    clearable
    :placeholder
    :checkable
    :multiple
    :max-tag-count="maxTagCount"
    key-field="id"
    label-field="name"
    :options="menuTree as any[]"
    v-model:value="menuId"
  />
</template>

<style lang="scss" scoped></style>
