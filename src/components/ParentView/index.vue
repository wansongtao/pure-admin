<script lang="ts" setup>
import { useUserStore } from '@/stores/user';

defineOptions({
  name: 'ParentView'
})

const userStore = useUserStore()
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="slide-fade">
      <keep-alive :include="userStore.cacheRoutes">
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
