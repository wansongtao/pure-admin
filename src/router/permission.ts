import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from './index'
import { useUserStore } from '@/stores/user'
import { useAppSetStore } from '@/stores/appSet'
import { generateCacheRoutes, generateRoutes, generateMenus } from '@/utils/menu'
import getStaticAdminRoute from './adminRoute'

import type { IMenuItem } from '@/types/api/common'

const getRoutes = (menus: IMenuItem[]) => {
  const adminRoute = getStaticAdminRoute()
  const routes = generateRoutes(menus)
  adminRoute.children!.push(...routes)

  return adminRoute
}

const whiteList = ['Login', 'NotFound']

NProgress.configure({ showSpinner: false })

router.beforeEach(async (to) => {
  NProgress.start()

  const userStore = useUserStore()
  const appSetStore = useAppSetStore()

  const token = userStore.accessToken
  if (!token) {
    if (!whiteList.includes(to.name as string)) {
      NProgress.done()
      return `/login?redirect=${to.path}`
    }

    appSetStore.reset()
    router.getRoutes().forEach((route) => {
      if (!whiteList.includes(route.name as string)) {
        router.removeRoute(route.name as string)
      }
    })

    return true
  }

  if (to.name === 'Login') {
    NProgress.done()
    return (to.query?.redirect as string) || '/'
  }

  if (!userStore.userInfo.name) {
    await userStore.fetchUserInfo()
  }

  if (appSetStore.asideMenus.length === 0) {
    const adminRoute = getRoutes(userStore.userInfo.menus ?? [])

    // @ts-ignore
    appSetStore.asideMenus = generateMenus(adminRoute.children!)
  }

  if (appSetStore.cacheRoutes.length === 0) {
    const adminRoute = getRoutes(userStore.userInfo.menus ?? [])
    appSetStore.cacheRoutes = generateCacheRoutes(adminRoute.children!)
  }

  if (!router.hasRoute(getStaticAdminRoute().name as string)) {
    const adminRoute = getRoutes(userStore.userInfo.menus ?? [])
    router.addRoute(adminRoute)

    NProgress.done()
    return to.fullPath
  }
})

router.afterEach(() => {
  NProgress.done()
})
