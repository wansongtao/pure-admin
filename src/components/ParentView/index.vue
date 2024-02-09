<script lang="ts" setup>
import { useSettingStore } from '@/stores/setting'

defineOptions({
  name: 'ParentView'
})

/**
 * @todo: 缓存组件后，不同层级的 router-view 之间切换，还是会触发 onMounted
 * @example: 从首页切换到系统管理下的用户管理页面，会触发用户管理页面的 onMounted，即使用户管理页面已经缓存。
 * 但从系统管理下的用户管理页切换到首页，不会触发首页的 onMounted，因为首页已经缓存。
 * 系统管理下的子页面相互切换，只会触发 onActivated，而不会重复触发 onMounted。
 */

const setStore = useSettingStore()
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="slide-fade">
      <keep-alive :include="setStore.cacheRoutes">
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<style scoped>
.slide-fade-enter-active {
  animation: slide-fade 0.3s both;
}

.slide-fade-leave-active {
  display: none;
}

@keyframes slide-fade {
  from {
    transform: translateX(120px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
