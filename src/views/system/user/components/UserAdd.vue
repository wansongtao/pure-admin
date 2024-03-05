<script lang="ts" setup>
import UserModal from './UserModal.vue'

import { addUser } from '@/api/user'
import { message } from 'ant-design-vue'
import { getTrulyObject } from '@/utils/index'

import type { IUserEdit } from '@/types/api/user'

const $emits = defineEmits<{
  handleSuccess: []
}>()

const open = ref(false)
const handleOpen = () => {
  open.value = true
}

const loading = ref(false)
const modalRef = ref<InstanceType<typeof UserModal>>()
const handleAdd = async (param: IUserEdit) => {
  const data = getTrulyObject(param)

  loading.value = true
  const { result } = await addUser(data)
  loading.value = false
  if (!result) {
    return
  }

  open.value = false
  modalRef.value?.resetForm()
  message.success('添加用户成功')
  $emits('handleSuccess')
}
</script>

<template>
  <a-button type="primary" @click="handleOpen">新增</a-button>
  <user-modal ref="modalRef" v-model="open" v-model:loading="loading" @on-ok="handleAdd" />
</template>

<style lang="scss" scoped></style>
