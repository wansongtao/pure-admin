<script lang="ts" setup>
import UserModal from './UserModal.vue'

import { message } from 'ant-design-vue'
import { getUserDetail, updateUser } from '@/api/user'
import { getChangedData } from '@/utils'

import type { IUserDetail, IUserEdit } from '@/types/api/user'

const $props = defineProps<{
  id: number
}>()
const $emits = defineEmits<{
  handleSuccess: []
}>()

const open = ref(false)
const loading = ref(false)
const detail = ref<IUserDetail>()

const handleOpen = async () => {
  open.value = true
  loading.value = true
  const { result } = await getUserDetail($props.id)
  loading.value = false
  if (!result) {
    return
  }

  detail.value = result.data
}

const handleEdit = async (data: IUserEdit) => {
  data = getChangedData(data, detail.value!)
  if (Object.keys(data).length === 0) {
    message.warn('您没有修改任何信息！')
    return
  }

  loading.value = true
  const { result } = await updateUser($props.id, data)
  loading.value = false
  if (result) {
    open.value = false
    $emits('handleSuccess')
    message.success('修改用户信息成功')
  }
}
</script>

<template>
  <a-button type="primary" size="small" ghost @click="handleOpen">编辑</a-button>
  <user-modal
    v-model="open"
    v-model:loading="loading"
    title="编辑用户"
    :details="detail"
    @on-ok="handleEdit"
  />
</template>

<style lang="scss" scoped></style>
