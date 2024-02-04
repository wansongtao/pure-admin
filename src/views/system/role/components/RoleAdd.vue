<script lang="ts" setup>
import RoleModal from './RoleModal.vue'

import { addRole } from '@/api/role'
import { message } from 'ant-design-vue'
import { removeObjectEmptyProto } from '@/utils/index'

import type { IRoleEditParam } from '@/types/api/role'

const $emits = defineEmits<{
  handleSuccess: []
}>()

const open = ref(false)
const handleOpen = () => {
  open.value = true
}

const modalRef = ref<InstanceType<typeof RoleModal>>()
const handleAdd = async (param: IRoleEditParam) => {
  const data = removeObjectEmptyProto(param)

  const { result } = await addRole(data)
  if (!result) {
    return
  }

  open.value = false
  modalRef.value?.resetForm()
  message.success('添加菜单成功')
  $emits('handleSuccess')
}
</script>

<template>
  <a-button v-permission="['system:role:add']" type="primary" @click="handleOpen">新增</a-button>
  <role-modal ref="modalRef" v-model="open" @on-ok="handleAdd" />
</template>

<style lang="scss" scoped></style>
