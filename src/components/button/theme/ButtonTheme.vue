<script lang="ts" setup>
import IconSun from '@/assets/svgs/icons/sun.svg?component'
import IconMoon from '@/assets/svgs/icons/moon.svg?component'
import { useAppSetStore } from '@/stores/appSet'
import useThemeAnimation from '@/hooks/useThemeAnimation'

const { toggleThemeAnimation } = useThemeAnimation()

const appSetStore = useAppSetStore()
const { toggleTheme } = appSetStore
const { theme } = storeToRefs(appSetStore)
</script>

<template>
  <div class="button-theme" @click="toggleThemeAnimation">
    <n-switch
      :value="theme"
      unchecked-value="light"
      checked-value="dark"
      @update-value="toggleTheme"
    >
      <template #icon>
        <n-icon size="12" :component="theme === 'light' ? IconSun : IconMoon"></n-icon>
      </template>
    </n-switch>
  </div>
</template>

<style lang="scss" scoped>
.button-theme {
  display: flex;
  align-items: center;
  margin-left: 20px;
}
</style>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root) {
  z-index: 1;
}

::view-transition-new(root) {
  z-index: 99999;
}

[data-theme='dark']::view-transition-old(root) {
  z-index: 99999;
}
[data-theme='dark']::view-transition-new(root) {
  z-index: 1;
}
</style>
