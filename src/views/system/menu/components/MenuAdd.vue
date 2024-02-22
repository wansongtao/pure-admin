<script lang="ts" setup>
import MenuModal from './MenuModal.vue'

import { addMenu } from '@/api/menu'
import { message } from 'ant-design-vue'
import { getTrulyObject } from '@/utils/index'

import type { IMenuParam } from '@/types/api/menu'

const $emits = defineEmits<{
  handleSuccess: []
}>()

const open = ref(false)
const handleOpen = () => {
  open.value = true
}

const loading = ref(false)
const modalRef = ref<InstanceType<typeof MenuModal>>()
const handleAdd = async (param: IMenuParam) => {
  const data = getTrulyObject(param)

  loading.value = true
  const { result } = await addMenu(data)
  loading.value = false
  if (result) {
    open.value = false
    modalRef.value?.resetForm()
    message.success('添加菜单成功')
    $emits('handleSuccess')
  }
}
</script>

<template>
  <a-button v-permission="['system:menu:add']" type="primary" @click="handleOpen">新增</a-button>
  <menu-modal ref="modalRef" v-model="open" v-model:loading="loading" @verify-success="handleAdd" />
</template>

<style lang="scss" scoped></style>
