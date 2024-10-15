<script lang="ts" setup>
import UserCenter from './UserCenter.vue'
</script>

<template>
  <header class="header">
    <div class="header-left">
      <button-collapsed />
      <base-breadcrumb />
    </div>
    <div class="header-right">
      <button-fullscreen />
      <button-theme />
      <user-center />
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 24px;
  height: 50px;

  .header-left {
    display: flex;
    align-items: center;
  }

  .header-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
}
</style>
