import ParentView from '@/components/ParentView/index.vue'

import { h } from 'vue'
import MENU_ICON_MAP from '@/plugins/importMenuIcons'
import COMPONENT_MAP from '@/plugins/importRouteComponents'

import type { IMenuData } from '@/types/api/common'
import type { RouteRecordRaw } from 'vue-router'
import type { IMenuItem } from '@/types/index'

const getFullPath = (path: string, parentPath = '/') => {
  if (parentPath[parentPath.length - 1] !== '/' && path.indexOf('/') !== 0) {
    return parentPath + '/' + path
  }

  if (path.indexOf(parentPath) === 0) {
    return path
  }

  return parentPath + path
}

export const generateMenus = (routes: RouteRecordRaw[], parentPath = ''): IMenuItem[] => {
  const menus: IMenuItem[] = []

  routes.forEach((item) => {
    if (item.meta?.hidden) {
      return
    }

    const { meta, name } = item
    const path = getFullPath(item.path, parentPath)

    const menuItem: IMenuItem = {
      key: path,
      label: meta?.title || (name as string),
      path
    }

    if (meta?.icon && MENU_ICON_MAP[meta.icon]) {
      menuItem.icon = () => h(MENU_ICON_MAP[meta.icon!])
    }

    if (item.children?.length) {
      menuItem.children = generateMenus(item.children, path)
    }

    menus.push(menuItem)
  })

  return menus
}

export const generateCacheRoutes = (routes: RouteRecordRaw[]): string[] => {
  const cacheRouteNames: string[] = []

  routes.forEach((route) => {
    if (route.meta?.cache && route.name) {
      cacheRouteNames.push(route.name as string)
    }

    if (route.children?.length) {
      cacheRouteNames.push(...generateCacheRoutes(route.children))
    }
  })

  return cacheRouteNames
}

export const generateRoutes = (menuTree: IMenuData[]): RouteRecordRaw[] => {
  const historyRouteNames: string[] = []

  const recursionGenerateRoutes = (tree: IMenuData[], parentPath = ''): RouteRecordRaw[] => {
    return tree.map((item) => {
      const path = getFullPath(item.path, parentPath)
      const name = path.replace(/\//g, '') + '-' + Math.random().toString(36).slice(2)

      const route: RouteRecordRaw = {
        path,
        component: ParentView,
        name,
        meta: {}
      }

      if (item.component && COMPONENT_MAP[item.component]) {
        route.component = COMPONENT_MAP[item.component]
        const name = item.component
          .replace(/.vue|.jsx|.tsx/g, '')
          .split('/')
          .map((item) => item.replace(/^\S/, (s) => s.toUpperCase()))
          .join('')
        if (!historyRouteNames.includes(name)) {
          route.name = name
          historyRouteNames.push(name)
        } else {
          console.warn(`多个路由引用了相同的组件：${item.component}`)
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
      // 设置为字符串会报错，页面加载不出来
      if (item.props === true) {
        route.props = item.props
      }

      if (item.children?.length) {
        // 通过在父路由的children中添加一个相同path的子路由，实现路由跳转父级菜单时，重定向到相应子菜单
        const redirectRoute = {
          path: route.path,
          title: item.name,
          redirect: item.redirect,
          meta: {
            hidden: true
          }
        }

        // 如果未设置重定向地址，则重定向到父路由的第一个子路由
        if (!item.redirect) {
          redirectRoute.redirect = getFullPath(item.children[0].path, route.path)
        }

        // @ts-ignore
        route.children = [redirectRoute, ...recursionGenerateRoutes(item.children, route.path)]
      }

      return route
    })
  }

  const routes = recursionGenerateRoutes(menuTree)
  return routes
}
