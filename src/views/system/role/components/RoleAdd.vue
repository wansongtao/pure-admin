<script lang="ts" setup>
import RoleModal from './RoleModal.vue'

import { addRole } from '@/api/role'
import { message } from 'ant-design-vue'
import { getTrulyValue } from '@/utils/index'

import type { IRoleEditParam } from '@/types/api/role'

const $emits = defineEmits<{
  handleSuccess: []
}>()

const open = ref(false)
const handleOpen = () => {
  open.value = true
}

const loading = ref(false)
const modalRef = ref<InstanceType<typeof RoleModal>>()
const handleAdd = async (param: IRoleEditParam) => {
  const data = getTrulyValue(param)

  loading.value = true
  const [, result] = await addRole(data)
  loading.value = false
  if (!result) {
    return
  }

  open.value = false
  modalRef.value?.resetForm()
  message.success('添加角色成功')
  $emits('handleSuccess')
}
</script>

<template>
  <a-button type="primary" @click="handleOpen">新增</a-button>
  <role-modal ref="modalRef" v-model="open" v-model:loading="loading" @on-ok="handleAdd" />
</template>

<style lang="scss" scoped></style>
