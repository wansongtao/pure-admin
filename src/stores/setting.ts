import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getTheme, setTheme } from '@/utils/theme'
import { getSystemTheme } from '@/utils/index'

import type { IMenuItem } from '@/types'

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

  const collapsed = ref(false)
  function toggleCollapsed() {
    collapsed.value = !collapsed.value
  }

  const cacheRoutes = ref<string[]>([])
  const menus = ref<IMenuItem[]>([])

  return {
    theme,
    followSystemTheme,
    toggleTheme,
    collapsed,
    toggleCollapsed,
    cacheRoutes,
    menus
  }
})
