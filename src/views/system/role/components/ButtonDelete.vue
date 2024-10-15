<script lang="ts" setup>
import { deleteRole } from '@/api/role'

const { id } = defineProps<{ id: number }>()
const $emits = defineEmits<{
  success: []
}>()

const disabled = ref(false)
const onConfirm = async () => {
  disabled.value = true
  const [err] = await deleteRole(id)
  disabled.value = false
  if (err) {
    return
  }

  window.$message.success('成功删除角色')
  $emits('success')
}
</script>

<template>
  <button-confirm text="删除" ghost size="small" :disabled @confirm="onConfirm">
    您确定要删除该角色吗？
  </button-confirm>
</template>

<style lang="scss" scoped></style>
