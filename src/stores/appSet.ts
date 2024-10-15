import type { IMenubarItem } from '@/types'
import type { MenuOption } from 'naive-ui'

export const useAppSetStore = defineStore(
  'appSet',
  () => {
    const collapsed = ref(false)
    function toggleCollapsed() {
      collapsed.value = !collapsed.value
    }

    const theme = ref<'light' | 'dark'>('light')
    function toggleTheme() {
      theme.value = theme.value === 'light' ? 'dark' : 'light'
    }

    const menubarItems = ref<IMenubarItem[]>([])
    const cacheRoutes = ref<string[]>([])
    const asideMenus = ref<MenuOption[]>([])

    function reset() {
      menubarItems.value = []
      cacheRoutes.value = []
      asideMenus.value = []
    }

    return {
      collapsed,
      toggleCollapsed,
      theme,
      toggleTheme,
      menubarItems,
      cacheRoutes,
      asideMenus,
      reset
    }
  },
  {
    persist: {
      // @ts-ignore
      omit: ['asideMenus']
    }
  }
)
