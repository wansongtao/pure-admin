import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo, setLogin, setLogout } from '@/api/common'
import { generateMenus, generateCacheRoutes, generateRoutes } from '@/utils/menu'
import getStaticAdminRoute from '@/router/adminRoute'
import { getToken, setToken, removeToken, setRefreshToken, removeRefreshToken } from '@/utils/token'

import type { IMenuItem } from '@/types'
import type { ILoginParams, IUserInfo } from '@/types/api/common'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<IUserInfo>({
    name: '',
    avatar: '',
    permissions: [],
    roles: []
  })

  const addRouteName = ref<string>('')
  const cacheRoutes = ref<string[]>([])
  const menus = ref<IMenuItem[]>([])

  async function getUserInfoAction() {
    const [, result] = await getUserInfo()
    const route = getStaticAdminRoute()
    addRouteName.value = route.name as string
    if (!result) {
      return false
    }

    userInfo.value = {
      name: result.data.name,
      avatar: result.data.avatar,
      permissions: result.data.permissions,
      roles: result.data.roles
    }

    const newRoute = generateRoutes(result.data.menus ?? [])
    if (route.children) {
      route.children.push(...newRoute)
    } else {
      route.children = newRoute
    }

    cacheRoutes.value = generateCacheRoutes(route.children ?? [])
    menus.value = generateMenus(route.children ?? [])

    return route
  }

  const token = ref(getToken() ?? '')
  async function login(data: ILoginParams) {
    const [err, result] = await setLogin(data)
    if (result) {
      token.value = result.data.token
      setToken(result.data.token)
      setRefreshToken(result.data.refreshToken)
    } else {
      throw err
    }
  }

  function reset() {
    token.value = ''
    userInfo.value = {
      name: '',
      avatar: '',
      permissions: [],
      roles: []
    }
    menus.value = []
    addRouteName.value = ''
    cacheRoutes.value = []
  }

  async function logout() {
    await setLogout()
    reset()
    removeToken()
    removeRefreshToken()
  }

  return {
    token,
    login,
    logout,
    userInfo,
    cacheRoutes,
    menus,
    addRouteName,
    getUserInfoAction,
    reset
  }
})
