import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getTheme, setTheme } from '@/utils/theme'
import { getSystemTheme } from '@/utils/index'
import { getMenus } from '@/api/common'
import { generateAsideMenu, generateCacheRouteNames, generateRoutes } from '@/utils/menu'

import type { IMenuItem, ITagLinkItem } from '@/types'

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

  const defaultTagLinks = ref<ITagLinkItem[]>([
    {
      title: '首页',
      path: '/',
      hiddenCloseIcon: true
    }
  ])
  function setDefaultTagLink(...tagLinks: ITagLinkItem[]) {
    defaultTagLinks.value = tagLinks
  }

  const cacheRoutes = ref<string[]>([])
  const menus = ref<IMenuItem[]>([])
  async function getRoutesAction() {
    const result = await getMenus().catch(() => ({ data: [] }))
    const route = generateRoutes(result.data)
    cacheRoutes.value = generateCacheRouteNames(route.children ?? [])
    menus.value = generateAsideMenu(route.children ?? [])

    return route
  }

  return {
    theme,
    followSystemTheme,
    toggleTheme,
    collapsed,
    toggleCollapsed,
    defaultTagLinks,
    setDefaultTagLink,
    cacheRoutes,
    menus,
    getRoutesAction
  }
})
