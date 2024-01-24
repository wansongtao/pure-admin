<script lang="ts" setup>
import {
  FullscreenExitOutlined,
  FullscreenOutlined
} from '@ant-design/icons-vue'

import { useFullscreen } from '@vueuse/core'

defineOptions({
  name: 'ScreenFull'
})

const { isFullscreen, toggle } = useFullscreen()
</script>

<template>
  <div class="screen_full">
    <fullscreen-exit-outlined v-show="isFullscreen" @click="toggle" />
    <fullscreen-outlined v-show="!isFullscreen" @click="toggle" />
  </div>
</template>

<style lang="scss" scoped>
.screen_full {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  font-size: 16px;
  color: var(--st-c-icon);
}
</style>