<script lang="ts" setup>
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons-vue'

import { useSettingStore } from '@/stores/setting'

defineOptions({
  name: 'ButtonCollapsed'
})

const setStore = useSettingStore()
const { toggleCollapsed } = setStore
const { collapsed } = storeToRefs(setStore)
</script>

<template>
  <div class="collapsed" @click="toggleCollapsed">
    <menu-fold-outlined v-show="!collapsed" />
    <menu-unfold-outlined v-show="collapsed" />
  </div>
</template>

<style lang="scss" scoped>
.collapsed {
  display: flex;
  align-items: center;
  margin: 0 12px;
  padding: 8px;
  cursor: pointer;
  font-size: 16px;
  color: var(--st-c-icon);
}
</style>