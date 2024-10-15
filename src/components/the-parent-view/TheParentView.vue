<script lang="ts" setup>
import { useAppSetStore } from '@/stores/appSet'

const appSetStore = useAppSetStore()
const { cacheRoutes } = storeToRefs(appSetStore)
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="slide-fade">
      <keep-alive :include="cacheRoutes">
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
