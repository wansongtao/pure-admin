<script lang="ts" setup>
import { objectToArray } from '@/utils'
import { MENU_TYPES } from '@/constants'

const options = objectToArray(MENU_TYPES)
const menuType = defineModel<keyof typeof MENU_TYPES | null>()
</script>

<template>
  <n-select v-model:value="menuType" :options="options" placeholder="菜单类型" clearable />
</template>

<style lang="scss" scoped></style>
