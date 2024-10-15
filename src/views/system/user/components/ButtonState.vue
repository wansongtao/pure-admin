<script lang="ts" setup>
import { updateUser } from '@/api/user'
import { throttle } from '@/utils'

const { id, disabled } = defineProps<{ id: string; disabled?: boolean }>()
const $emits = defineEmits<{
  success: []
}>()

const state = defineModel<boolean>()
const loading = ref(false)
const onChangeState = throttle(async (value: boolean) => {
  loading.value = true
  const [err] = await updateUser(id, { disabled: value })
  loading.value = false
  if (err) {
    return
  }

  window.$message.success(value ? '成功禁用用户账号' : '成功启用用户账号')
  state.value = value
  $emits('success')
})
</script>

<template>
  <switch-state :value="state" :disabled :loading @update:value="onChangeState" />
</template>

<style lang="scss" scoped></style>
