<script lang="ts" setup>
import MENU_ICON_MAP from '@/plugins/menuIcons'
import IconArrowDown from '@/assets/svgs/icons/arrow-down.svg?component'

const icon = defineModel<string>()
const handleCheck = (key: string) => {
  icon.value = key
}
</script>

<template>
  <n-popover
    style="max-height: 200px"
    content-style="padding: 10px;"
    trigger="click"
    width="trigger"
    scrollable
  >
    <template #trigger>
      <n-input v-model:value="icon" placeholder="请选择图标" clearable>
        <template v-if="icon" #prefix>
          <component :is="MENU_ICON_MAP[icon]"></component>
        </template>
        <template #suffix>
          <n-icon :component="IconArrowDown"></n-icon>
        </template>
      </n-input>
    </template>
    <n-row :gutter="[0, 8]">
      <n-col v-for="(value, key) of MENU_ICON_MAP" :key="key" :span="6">
        <select-icon-item :name="key" :checked="icon === key" @click="handleCheck(key)">
          <component :is="value" />
        </select-icon-item>
      </n-col>
    </n-row>
  </n-popover>
</template>

<style lang="scss" scoped></style>
