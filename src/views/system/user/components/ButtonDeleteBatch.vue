<script lang="ts" setup>
import { deleteUsers } from '@/api/user'

const { id } = defineProps<{ id: string[] }>()
const $emits = defineEmits<{
  success: []
  failed: []
}>()

const disabled = ref(false)
const onConfirm = async () => {
  disabled.value = true
  const [err] = await deleteUsers(id)
  disabled.value = false
  if (err) {
    $emits('failed')
    return
  }

  $emits('success')
  window.$message.success('成功删除选中用户')
}
</script>

<template>
  <button-confirm text="批量删除" :disabled="disabled || !id.length" @confirm="onConfirm">
    您确定要删除选中的用户账号吗？
  </button-confirm>
</template>

<style lang="scss" scoped></style>
