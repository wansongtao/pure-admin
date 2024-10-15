<script lang="ts" setup>
import usePermission from '@/hooks/usePermission'

const { role, or = false } = defineProps<{
  role: string | string[]
  or?: boolean
}>()

const { hasRole } = usePermission()
const isShow = computed(() => {
  return hasRole(role, or)
})
</script>

<template>
  <template v-if="isShow">
    <slot />
  </template>
</template>

<style lang="scss" scoped></style>
