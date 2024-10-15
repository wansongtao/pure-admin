<script lang="ts" setup>
import type { ButtonProps } from 'naive-ui'

type ButtonConfirmProps = {
  negativeText?: string
  positiveText?: string
  showIcon?: boolean
  type?: ButtonProps['type']
  loading?: boolean
  ghost?: boolean
  disabled?: boolean
  size?: ButtonProps['size']
  text?: string
  round?: boolean
  block?: boolean
  circle?: boolean
  dashed?: boolean
  bordered?: boolean
}

const {
  negativeText = '取消',
  positiveText = '确认',
  showIcon = true,
  type = 'error',
  loading,
  ghost,
  disabled,
  size,
  text = '删除',
  round,
  block,
  circle,
  dashed,
  bordered = true
} = defineProps<ButtonConfirmProps>()

const $emits = defineEmits<{
  confirm: []
  cancel: []
}>()

const onConfirm = () => {
  $emits('confirm')
}

const onCancel = () => {
  $emits('cancel')
}
</script>

<template>
  <n-popconfirm
    :negative-text
    :positive-text
    :show-icon
    @positive-click="onConfirm"
    @negative-click="onCancel"
  >
    <template #trigger>
      <n-button :type :loading :ghost :size :disabled :round :block :circle :dashed :bordered>
        {{ text }}
      </n-button>
    </template>
    <slot />
  </n-popconfirm>
</template>

<style lang="scss" scoped></style>
