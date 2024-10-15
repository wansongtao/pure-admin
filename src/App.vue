<script lang="ts" setup>
import { zhCN, dateZhCN, darkTheme, lightTheme } from 'naive-ui'
import { useAppSetStore } from '@/stores/appSet'

const appSetStore = useAppSetStore()
const { theme } = storeToRefs(appSetStore)
const themeValue = computed(() => {
  return theme.value === 'light' ? lightTheme : darkTheme
})
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN" :theme="themeValue">
    <the-app-provider>
      <router-view />
    </the-app-provider>
  </n-config-provider>
</template>

<style lang="scss" scoped></style>
