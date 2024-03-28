import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getTheme, setTheme } from '@/utils/theme'
import { getSystemTheme } from '@/utils/index'
import { getMenus } from '@/api/common'
import { generateMenus, generateCacheRoutes, generateRoutes } from '@/utils/menu'

import type { IMenuItem, ILinkTab } from '@/types'

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

  const cacheRoutes = ref<string[]>([])
  const menus = ref<IMenuItem[]>([])
  async function getRoutesAction() {
    const { result } = await getMenus()
    const route = generateRoutes(result?.data ?? [])
    cacheRoutes.value = generateCacheRoutes(route.children ?? [])
    menus.value = generateMenus(route.children ?? [])

    return route
  }

  return {
    theme,
    followSystemTheme,
    toggleTheme,
    collapsed,
    toggleCollapsed,
    defaultLinkTabs,
    setDefaultLinkTabs,
    cacheRoutes,
    menus,
    getRoutesAction
  }
})
