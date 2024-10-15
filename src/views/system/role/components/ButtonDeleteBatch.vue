<script lang="ts" setup>
import { deleteRoles } from '@/api/role'

const { id } = defineProps<{ id: number[] }>()
const $emits = defineEmits<{
  success: []
  failed: []
}>()

const disabled = ref(false)
const onConfirm = async () => {
  disabled.value = true
  const [err] = await deleteRoles(id)
  disabled.value = false
  if (err) {
    $emits('failed')
    return
  }

  window.$message.success('成功删除选中角色')
  $emits('success')
}
</script>

<template>
  <button-confirm text="批量删除" :disabled="disabled || !id.length" @confirm="onConfirm">
    您确定要删除选中的角色吗？
  </button-confirm>
</template>

<style lang="scss" scoped></style>
