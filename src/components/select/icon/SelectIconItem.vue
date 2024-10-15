<script lang="ts" setup>
import { useThemeVars } from 'naive-ui'

const { checked = false, name } = defineProps<{ checked?: boolean; name: string }>()

const themeVars = useThemeVars()
</script>

<template>
  <div
    class="select_item"
    :class="{
      'select_item--checked': checked
    }"
  >
    <div class="text"><slot /></div>
    <div class="text one-line-ellipsis">{{ name }}</div>
  </div>
</template>

<style lang="scss" scoped>
.select_item {
  padding: 0 4px;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: v-bind('themeVars.tabColor');
  }

  .text {
    font-size: 14px;
    text-align: center;
  }
}

.one-line-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
}

.select_item--checked.select_item--checked {
  font-weight: 600;
  background-color: v-bind('themeVars.iconColor');
}
</style>
