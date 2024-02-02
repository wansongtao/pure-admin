<script lang="ts" setup>
import { updateMenu } from '@/api/menu'
import { useAuthority } from '@/hooks/useAuthority'
import { message } from 'ant-design-vue'

const $props = defineProps<{
  id: number
}>()

const { hasPermission } = useAuthority()

const disabled = defineModel<boolean>()
const loading = ref(false)
watch(disabled, (val) => {
  loading.value = true
  updateMenu($props.id, { disabled: val }).then(() => {
    message.success('菜单状态修改成功')
  }).catch(() => {
    disabled.value = !disabled.value
  }).finally(() => {
    loading.value = false
  })
})
</script>

<template>
  <a-switch
    v-if="hasPermission('system:menu:edit')"
    v-model:checked="disabled"
    checked-children="是"
    un-checked-children="否"
    :loading="loading"
  />
  <span v-else>{{ disabled ? '是' : '否' }}</span>
</template>

<style lang="scss" scoped></style>
