<script lang="ts" setup>
import MenuModal from './MenuModal.vue';

import { addMenu } from '@/api/menu'
import { message } from 'ant-design-vue';
import { removeObjectEmptyProto } from '@/utils/index'

import type { IMenuParam } from '@/types/api/menu'

const $emits = defineEmits<{
  handleSuccess: []
}>()

const open = ref(false)
const handleOpen = () => {
  open.value = true
}

const modalRef = ref<InstanceType<typeof MenuModal>>()
const handleAdd = (param: IMenuParam) => {
  const data = removeObjectEmptyProto(param)

  addMenu(data).then(() => {
    open.value = false
    modalRef.value?.resetForm()
    message.success('添加菜单成功')
    $emits('handleSuccess')
  })
}
</script>

<template>
  <a-button type="primary" @click="handleOpen">新增</a-button>
  <menu-modal ref="modalRef" v-model="open" @verify-success="handleAdd" />
</template>

<style lang="scss" scoped>

</style>