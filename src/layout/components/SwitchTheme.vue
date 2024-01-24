<script lang="ts" setup>
import { useSettingStore } from '@/stores/setting'

const setStore = useSettingStore()
const { toggleTheme, followSystemTheme } = setStore
followSystemTheme()

const checked = computed(() => setStore.theme === 'dark')
</script>

<template>
  <BaseSwitch :value="checked" :delay="300" @onChange="toggleTheme" />
</template>

<style lang="scss" scoped></style>
