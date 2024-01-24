import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getTheme, setTheme } from '@/utils/theme'
import { getSystemTheme } from '@/utils/index'

export const useSettingStore = defineStore('setting', () => {
  const theme = ref(getTheme())
  function followSystemTheme() {
    theme.value = getSystemTheme((mode) => {
      theme.value = mode
      setTheme(mode)
    })
    setTheme(theme.value)
  }
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    setTheme(theme.value)
  }

  const cacheRoutes = ref<string[]>([])

  return {
    theme,
    followSystemTheme,
    toggleTheme,
    cacheRoutes
  }
})
