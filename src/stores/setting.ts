import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getTheme, setTheme } from '@/utils/theme'
import { getSystemTheme, followSystemTheme as followTheme } from '@/utils/index'

import type { ILinkTab } from '@/types'

export const useSettingStore = defineStore('setting', () => {
  const theme = ref(getTheme())
  function followSystemTheme() {
    theme.value = getSystemTheme()
    setTheme(theme.value)

    followTheme((mode) => {
      theme.value = mode
      setTheme(theme.value)
    })
  }
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    setTheme(theme.value)
  }

  const collapsed = ref(false)
  function toggleCollapsed() {
    collapsed.value = !collapsed.value
  }

  const defaultLinkTabs = ref<ILinkTab[]>([
    {
      title: '首页',
      path: '/',
      hiddenCloseIcon: true
    }
  ])
  function setDefaultLinkTabs(...tagLinks: ILinkTab[]) {
    defaultLinkTabs.value = tagLinks
  }

  return {
    theme,
    followSystemTheme,
    toggleTheme,
    collapsed,
    toggleCollapsed,
    defaultLinkTabs,
    setDefaultLinkTabs,
  }
})
