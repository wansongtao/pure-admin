<script lang="ts" setup>
import { deleteMenu } from '@/api/menu'

const { id } = defineProps<{ id: number }>()
const $emits = defineEmits<{
  success: []
}>()

const disabled = ref(false)
const onConfirm = async () => {
  disabled.value = true
  const [err] = await deleteMenu(id)
  disabled.value = false
  if (err) {
    return
  }

  window.$message.success('成功删除菜单')
  $emits('success')
}
</script>

<template>
  <button-confirm text="删除" ghost size="small" :disabled @confirm="onConfirm">
    您确定要删除该菜单吗？
  </button-confirm>
</template>

<style lang="scss" scoped></style>
