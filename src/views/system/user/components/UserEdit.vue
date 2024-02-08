<script lang="ts" setup>
import UserModal from './UserModal.vue'

import { message } from 'ant-design-vue'
import { getUserDetail, updateUser } from '@/api/user'
import { removeSameValue } from '@/utils'

import type { IUserDetail, IUserEdit } from '@/types/api/user'

const $props = defineProps<{
  id: number
}>()
const $emits = defineEmits<{
  handleSuccess: []
}>()

const open = ref(false)
const detail = ref<IUserDetail>()
const handleOpen = async () => {
  open.value = true
  const { result } = await getUserDetail($props.id)
  if (!result) {
    return
  }

  detail.value = result.data
}

const handleEdit = async (data: IUserEdit) => {
  data = removeSameValue(data, detail.value!)
  if (Object.keys(data).length === 0) {
    message.warn('您没有修改任何信息！')
    return
  }

  const { result } = await updateUser($props.id, data)
  if (result) {
    open.value = false
    $emits('handleSuccess')
    message.success('修改用户信息成功')
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
  <user-modal v-model="open" title="编辑用户信息" :details="detail" @on-ok="handleEdit" />
</template>

<style lang="scss" scoped>

</style>