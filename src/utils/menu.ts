import MENU_ICON_MAP from '@/plugins/menuIcons'
import ROUTE_COMPONENT_MAP from '@/plugins/routeComponents'
import TheParentView from '@/components/the-parent-view/TheParentView.vue'

import type { IMenuItem } from '@/types/api/common'
import type { MenuOption } from 'naive-ui'
import type { RouteRecordRaw } from 'vue-router'

const getFullPath = (path: string, parentPath = '/') => {
  if (parentPath[parentPath.length - 1] !== '/' && path.indexOf('/') !== 0) {
    return parentPath + '/' + path
  }

  if (path.indexOf(parentPath) === 0) {
    return path
  }

  return parentPath + path
}

export const generateMenus = (
  routes: RouteRecordRaw[],
  parentPath = '',
  isSkip = (route: RouteRecordRaw) => route.meta?.hidden
) => {
  const menus: MenuOption[] = []

  routes.forEach((item) => {
    if (isSkip(item)) {
      return
    }

    const { meta, name } = item
    const path = getFullPath(item.path, parentPath)
    const menuItem: MenuOption = {
      key: path,
      label: meta?.title || (name as string)
    }

    if (meta?.icon && MENU_ICON_MAP[meta.icon]) {
      menuItem.icon = () => h(MENU_ICON_MAP[meta.icon!])
    }
    if (item.children?.length) {
      menuItem.children = generateMenus(item.children, path, isSkip)
    }

    menus.push(menuItem)
  })

  return menus
}

export const generateCacheRoutes = (
  routes: RouteRecordRaw[],
  isSkip = (route: RouteRecordRaw) => route.meta?.cache !== true || !route.name
) => {
  const cacheRouteNames: string[] = []

  routes.forEach((route) => {
    if (!isSkip(route)) {
      cacheRouteNames.push(route.name as string)
    }

    if (route.children?.length) {
      cacheRouteNames.push(...generateCacheRoutes(route.children, isSkip))
    }
  })

  return cacheRouteNames
}

export const generateRoutes = (menuTree: IMenuItem[]) => {
  const historyRouteNames: string[] = []

  const recursionGenerateRoutes = (tree: IMenuItem[], parentPath = '') => {
    return tree.map((item) => {
      const path = getFullPath(item.path, parentPath)
      const name = path.replace(/\//g, '') + '-' + Math.random().toString(36).slice(2)

      const route: RouteRecordRaw = {
        path,
        component: TheParentView,
        name,
        meta: {}
      }

      if (item.component && ROUTE_COMPONENT_MAP[item.component]) {
        route.component = ROUTE_COMPONENT_MAP[item.component]

        const name = item.component
          .replace(/.vue|.jsx|.tsx/g, '')
          .split('/')
          .pop()!
        if (!historyRouteNames.includes(name)) {
          route.name = name
          historyRouteNames.push(name)
        }
      }

      if (item.name) {
        route.meta!.title = item.name
      }
      if (item.icon) {
        route.meta!.icon = item.icon
      }
      if (item.cache === true) {
        route.meta!.cache = item.cache
      }
      if (item.hidden === true) {
        route.meta!.hidden = item.hidden
      }
      if (item.props === true) {
        route.props = item.props
      }

      if (item.children?.length) {
        // @ts-ignore
        route.redirect = item.redirect || getFullPath(item.children[0].path, route.path)

        // @ts-ignore
        route.children = [...recursionGenerateRoutes(item.children, route.path)]
      }

      return route
    })
  }

  const routes = recursionGenerateRoutes(menuTree)
  return routes
}
