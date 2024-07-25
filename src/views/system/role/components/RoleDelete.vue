<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { deleteRole, deleteRoles } from '@/api/role'

const $props = defineProps<{
  id: number | number[]
}>()
const $emits = defineEmits<{
  handleSuccess: [isSingle: boolean]
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
  const success = (isSingle = true) => {
    message.success(isSingle ? '删除角色成功' : '批量删除角色成功')
    $emits('handleSuccess', isSingle)
  }

  const id = $props.id
  if (typeof id === 'number') {
    const [, result] = await deleteRole(id)
    if (result) {
      success()
    }
    return
  }

  const [, result] = await deleteRoles(id)
  if (result) {
    success(false)
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

<style lang="scss" scoped>

</style>