<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { deleteMenu, deleteMenus } from '@/api/menu'

const $props = defineProps<{
  id: number | number[]
}>()
const $emits = defineEmits<{
  handleSuccess: []
}>()

const isMulti = computed(() => {
  return Array.isArray($props.id)
})

const beforeOpenConfirm = () => {
  if (isMulti.value && ($props.id as number[]).length === 0) {
    message.warn('请先选中删除项')
    return false
  }

  return true
}

const handleDelete = async () => {
  const id = $props.id
  if (!isMulti.value) {
    const [err] = await deleteMenu(id as number)
    if (err) {
      return
    }
  } else {
    const [err] = await deleteMenus(id as number[])
    if (err) {
      return
    }
  }

  message.success('删除成功')
  $emits('handleSuccess')
}
</script>

<template>
  <button-delete
    :size="isMulti ? 'middle' : 'small'"
    :text="isMulti ? '批量删除' : '删除'"
    :confirm-config="{
      title: isMulti ? '您确定要删除这些菜单数据吗？' : '您确定要删除该菜单数据吗？'
    }"
    :ghost="!isMulti"
    :before-open-confirm="beforeOpenConfirm"
    @handle-ok="handleDelete"
  />
</template>

<style lang="scss" scoped></style>
