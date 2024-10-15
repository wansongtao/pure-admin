<script lang="ts" setup>
import IconSearch from '@/assets/svgs/icons/search.svg'
import type { ButtonProps } from 'naive-ui'

defineProps<{
  attrType?: ButtonProps['attrType']
  loading?: boolean
  disabled?: boolean
  block?: boolean
  size?: ButtonProps['size']
}>()
const $emits = defineEmits<{
  click: [e: MouseEvent]
}>()

const onClick = (e: MouseEvent) => {
  $emits('click', e)
}
</script>

<template>
  <n-button :attr-type="attrType" :loading :disabled :block :size @click="onClick">
    <template #icon>
      <n-icon>
        <icon-search />
      </n-icon>
    </template>
    <slot>查询</slot>
  </n-button>
</template>

<style lang="scss" scoped></style>
