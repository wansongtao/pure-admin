<script setup lang="ts">
import { initTheme } from '@/utils/theme'
import { theme } from 'ant-design-vue'
import { useSettingStore } from '@/stores/setting'
import dayjs from 'dayjs'

import zhCN from 'ant-design-vue/es/locale/zh_CN'
import 'dayjs/locale/zh-cn'

const setStore = useSettingStore()

dayjs.locale('zh-cn')
initTheme()
</script>

<template>
  <a-config-provider
    :theme="{
      algorithm: setStore.theme === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm
    }"
    :locale="zhCN"
  >
    <RouterView />
  </a-config-provider>
</template>

<style scoped></style>
