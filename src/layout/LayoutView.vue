<script lang="ts" setup>
import AsideView from './components/AsideView.vue'
import HeaderView from './components/HeaderView.vue'
import LinkHistory from './components/LinkHistory.vue'

import { useSettingStore } from '@/stores/setting'

// 显式设置width，解决某些特殊情况下，响应式宽度失效的问题（例如：a-table设置了scroll属性）。
const setStore = useSettingStore()
const style = computed(() => {
  return  `width: calc(100% - var(${setStore.collapsed ? '--st-aside-w-s' : '--st-aside-w'}));`
})
</script>

<template>
  <div class="layout">
    <AsideView />
    <div class="layout_container" :style="style">
      <HeaderView />
      <LinkHistory />
      <div class="layout-main st-transition-bg">
        <ParentView />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.layout_container {
  flex: 1;

  .layout-main {
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100vh - var(--st-header-h) - var(--st-scrollbar-h));
    background-color: var(--st-c-bg-2);
  }
}
</style>
