<script lang="ts" setup>
import { updateMenu } from '@/api/menu'
import { throttle } from '@/utils'

const { id, disabled } = defineProps<{ id: number; disabled?: boolean }>()
const $emits = defineEmits<{
  success: []
}>()

const state = defineModel<boolean>()
const loading = ref(false)
const onChangeState = throttle(async (value: boolean) => {
  loading.value = true
  const [err] = await updateMenu(id, { disabled: value })
  loading.value = false
  if (err) {
    return
  }

  window.$message.success(value ? '成功禁用菜单' : '成功启用菜单')
  state.value = value
  $emits('success')
})
</script>

<template>
  <switch-state :value="state" :disabled :loading @update:value="onChangeState" />
</template>

<style lang="scss" scoped></style>
