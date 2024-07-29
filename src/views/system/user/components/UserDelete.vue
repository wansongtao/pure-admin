<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { deleteUser, deleteUsers } from '@/api/user'

const $props = defineProps<{
  id: string | string[]
}>()
const $emits = defineEmits<{
  handleSuccess: [isSingle: boolean]
}>()

const isSingle = computed(() => {
  return typeof $props.id === 'string' ? true : false
})

const beforeOpenConfirm = () => {
  if (typeof $props.id === 'string') {
    return true
  }

  if (!$props.id?.length) {
    message.warn('请先选中删除项')
    return false
  }

  return true
}

const handleDelete = async () => {
  const success = () => {
    message.success(isSingle.value ? '删除角色成功' : '批量删除角色成功')
    $emits('handleSuccess', isSingle.value)
  }

  const id = $props.id
  if (isSingle.value) {
    const [, result] = await deleteUser(id as string)
    if (result) {
      success()
    }
    return
  }

  const [, result] = await deleteUsers(id as string[])
  if (result) {
    success()
  }
}
</script>

<template>
  <button-delete
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
