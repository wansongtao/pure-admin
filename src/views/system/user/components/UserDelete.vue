<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { deleteUser, deleteMultipleUsers } from '@/api/user'

const $props = defineProps<{
  id: number | number[]
}>()
const $emits = defineEmits<{
  handleSuccess: []
}>()

const isSingle = computed(() => {
  return typeof $props.id === 'number' ? true : false
})

const beforeOpenConfirm = () => {
  if (typeof $props.id === 'number') {
    return true
  }

  if (!$props.id?.length) {
    message.warn('请先选中删除项')
    return false
  }

  return true
}

const handleDelete = async () => {
  const success = (text = '删除用户成功') => {
    message.success(text)
    $emits('handleSuccess')
  }

  const id = $props.id
  if (typeof id === 'number') {
    const { result } = await deleteUser(id)
    if (result) {
      success()
    }
    return
  }

  const { result } = await deleteMultipleUsers(id)
  if (result) {
    success('批量删除用户成功')
  }
}
</script>

<template>
  <button-delete
    v-permission="['system:user:del']"
    :size="isSingle ? 'small' : 'middle'"
    :text="isSingle ? '删除' : '批量删除'"
    :confirm-config="{
      title: isSingle ? '您确定要删除这条数据吗？' : '您确定要删除这些数据吗？'
    }"
    :ghost="isSingle"
    :before-open-confirm="beforeOpenConfirm"
    @handle-ok="handleDelete"
  />
</template>

<style lang="scss" scoped></style>
