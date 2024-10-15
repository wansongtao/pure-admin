<script lang="ts" setup>
import { deleteUser } from '@/api/user'

const { id } = defineProps<{ id: string }>()
const $emits = defineEmits<{
  success: []
}>()

const disabled = ref(false)
const onConfirm = async () => {
  disabled.value = true
  const [err] = await deleteUser(id)
  disabled.value = false
  if (err) {
    return
  }

  $emits('success')
  window.$message.success('成功删除用户')
}
</script>

<template>
  <button-confirm text="删除" ghost size="small" :disabled @confirm="onConfirm">
    您确定要删除该用户账号吗？
  </button-confirm>
</template>

<style lang="scss" scoped></style>
