<script lang="ts" setup>
import { ACTIVE_STATE } from '@/constants'

const { placeholder = '状态', clearable = true } = defineProps<{
  placeholder?: string
  clearable?: boolean
}>()
const disabled = defineModel<(typeof ACTIVE_STATE)[0]['value'] | null>()
</script>

<template>
  <n-select v-model:value="disabled" :options="ACTIVE_STATE" :placeholder :clearable />
</template>

<style lang="scss" scoped></style>
