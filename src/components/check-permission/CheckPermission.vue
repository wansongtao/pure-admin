<script lang="ts" setup>
import usePermission from '@/hooks/usePermission'

const { permission, or = false } = defineProps<{
  permission: string | string[]
  or?: boolean
}>()

const { hasPermission } = usePermission()
const isShow = computed(() => {
  return hasPermission(permission, or)
})
</script>

<template>
  <template v-if="isShow">
    <slot />
  </template>
</template>

<style lang="scss" scoped></style>
