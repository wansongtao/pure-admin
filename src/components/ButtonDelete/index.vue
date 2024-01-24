<script lang="ts" setup>
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { Modal, type ModalFuncProps } from 'ant-design-vue'
import { createVNode } from 'vue'

import type { ButtonType } from 'ant-design-vue/es/button'

defineOptions({
  name: 'ButtonDelete'
})

const $props = withDefaults(
  defineProps<{
    text?: string
    type?: ButtonType
    size?: 'large' | 'middle' | 'small'
    danger?: boolean
    ghost?: boolean
    block?: boolean
    loading?: boolean
    disabled?: boolean
    shape?: 'default' | 'circle' | 'round'
    confirmConfig?: ModalFuncProps
  }>(),
  {
    text: '删除',
    type: 'primary',
    size: 'small',
    danger: true,
    ghost: true
  }
)

const $emits = defineEmits<{
  handleOk: []
  handleCancel: []
}>()

const showDeleteConfirm = () => {
  Modal.confirm({
    title: '您确定要删除这条数据吗？',
    icon: createVNode(ExclamationCircleOutlined),
    content: '删除后，将不可恢复，请慎重！',
    okText: '确定',
    okType: 'danger',
    cancelText: '取消',
    ...$props.confirmConfig,
    onOk() {
      $emits('handleOk')
    },
    onCancel() {
      $emits('handleCancel')
    }
  })
}
</script>

<template>
  <a-button
    :type="type"
    :size="size"
    :danger="danger"
    :ghost="ghost"
    :block="block"
    :loading="loading"
    :disabled="disabled"
    :shape="shape"
    @click="showDeleteConfirm"
  >
    <template #icon>
      <slot name="icon" />
    </template>
    {{ text }}
  </a-button>
</template>

<style lang="scss" scoped></style>
