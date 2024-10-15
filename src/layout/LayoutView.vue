<script lang="ts" setup>
import AsideView from './components/AsideView.vue'
import HeaderView from './components/HeaderView.vue'
import MenuBar from './components/MenuBar.vue'
import FooterView from './components/FooterView.vue'
</script>

<template>
  <n-layout style="height: 100vh" has-sider>
    <aside-view />
    <n-layout>
      <n-layout-header bordered>
        <header-view />
      </n-layout-header>
      <menu-bar />
      <n-layout-content embedded content-style="padding: 24px;">
        <div class="layout-main">
          <the-parent-view />
        </div>
        <footer-view />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<style>
.n-layout-scroll-container {
  display: flex;
  flex-direction: column;
}

.layout-main {
  height: 100%;
  overflow: auto;
}
</style>
