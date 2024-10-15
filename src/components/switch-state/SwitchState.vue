<script lang="ts" setup>
import type { CSSProperties } from 'vue'
import type { SwitchProps } from 'naive-ui'

const state = defineModel<boolean>()

const {
  checkedText = '禁用',
  uncheckedText = '启用',
  disabled,
  loading,
  round = false,
  size,
  railStyle = ({ focused, checked }: { focused: boolean; checked: boolean }) => {
    const style: CSSProperties = {}
    if (checked) {
      style.background = '#d03050'
      if (focused) {
        style.boxShadow = '0 0 0 2px #d0305040'
      }
    } else {
      style.background = '#4b9e5f'
      if (focused) {
        style.boxShadow = '0 0 0 2px #4b9e5f40'
      }
    }

    return style
  }
} = defineProps<{
  checkedText?: string
  uncheckedText?: string
  disabled?: boolean
  loading?: boolean
  round?: boolean
  size?: SwitchProps['size']
  railStyle?: SwitchProps['railStyle']
}>()
</script>

<template>
  <n-switch v-model:value="state" :round :disabled :loading :size :rail-style="railStyle">
    <template #checked> {{ checkedText }} </template>
    <template #unchecked> {{ uncheckedText }} </template>
  </n-switch>
</template>

<style lang="scss" scoped></style>
