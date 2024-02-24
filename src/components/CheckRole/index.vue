<script lang="ts" setup>
import { hasRoles } from '@/utils/authority'
import { useUserStore } from '@/stores/user'

defineOptions({
  name: 'CheckRole'
})

const $props = defineProps<{
  or?: boolean
  roles: string | string[]
}>()

const userStore = useUserStore()
const isShow = computed(() => {
  return hasRoles(userStore.userInfo.roles, $props.roles, $props.or)
})
</script>

<template>
  <template v-if="isShow">
    <slot />
  </template>
</template>

<style lang="scss" scoped></style>
