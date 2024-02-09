<script lang="ts" setup>
import RoleModal from './RoleModal.vue'

import { message } from 'ant-design-vue'
import { getRoleDetail, updateRole } from '@/api/role'
import { removeSameValue } from '@/utils'

import type { IRoleDetail, IRoleEditParam } from '@/types/api/role'

const $props = defineProps<{
  id: number
}>()
const $emits = defineEmits<{
  handleSuccess: []
}>()

const open = ref(false)
const detail = ref<IRoleDetail>()
const handleOpen = async () => {
  open.value = true
  const { result } = await getRoleDetail($props.id)
  if (!result) {
    return
  }

  detail.value = result.data
}

const handleEdit = async (data: IRoleEditParam) => {
  data = removeSameValue(data, detail.value!)
  if (Object.keys(data).length === 0) {
    message.warn('您没有修改任何信息！')
    return
  }
  
  const { result } = await updateRole($props.id, data)
  if (result) {
    open.value = false
    $emits('handleSuccess')
    message.success('修改菜单成功')
  }
}
</script>

<template>
  <a-button
    v-permission="['system:role:edit']"
    type="primary"
    size="small"
    ghost
    @click="handleOpen"
    >编辑</a-button
  >
  <role-modal v-model="open" title="编辑角色" :details="detail" @on-ok="handleEdit" />
</template>

<style lang="scss" scoped></style>
