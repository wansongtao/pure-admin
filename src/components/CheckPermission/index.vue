<script lang="ts" setup>
import { hasPermissions } from '@/utils/authority'
import { useUserStore } from '@/stores/user'

defineOptions({
  name: 'checkPermission'
})

const $props = defineProps<{
  or?: boolean
  permissions: string | string[]
}>()

const userStore = useUserStore()
const isShow = computed(() => {
  return hasPermissions(userStore.userInfo.permissions, $props.permissions, $props.or)
})
</script>

<template>
  <template v-if="isShow">
    <slot />
  </template>
</template>

<style lang="scss" scoped></style>
