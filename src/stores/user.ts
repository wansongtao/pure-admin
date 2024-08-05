import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo, setLogin, setLogout } from '@/api/common'
import { generateMenus, generateCacheRoutes, generateRoutes } from '@/utils/menu'
import getStaticAdminRoute from '@/router/adminRoute'

import type { IMenuItem } from '@/types'
import type { ILoginParams, IUserInfo } from '@/types/api/common'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  function getToken() {
    if (token.value) {
      return token.value
    }
    token.value = localStorage.getItem('token') || ''
    return token.value
  }
  function setToken(value: string) {
    token.value = value
    localStorage.setItem('token', value)
  }
  function removeToken() {
    token.value = ''
    localStorage.removeItem('token')
  }

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

  async function login(data: ILoginParams) {
    const [err, result] = await setLogin(data)
    if (result) {
      setToken(result.data.token)
    } else {
      throw err
    }
  }
  async function logout() {
    await setLogout()
    reset()
  }

  function reset() {
    userInfo.value = {
      name: '',
      avatar: '',
      permissions: [],
      roles: []
    }
    menus.value = []
    addRouteName.value = ''
    cacheRoutes.value = []
    removeToken()
  }

  return {
    token,
    getToken,
    setToken,
    removeToken,
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
