import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo, setLogin, setLogout } from '@/api/common'
import { generateMenus, generateCacheRoutes, generateRoutes } from '@/utils/menu'

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
    removeToken()
  }

  const userInfo = ref<IUserInfo>({
    nickName: '',
    avatar: '',
    permissions: [],
    roles: []
  })
  const cacheRoutes = ref<string[]>([])
  const menus = ref<IMenuItem[]>([])
  async function getUserInfoAction() {
    const [, result] = await getUserInfo()
    if (!result) {
      return
    }

    userInfo.value = {
      nickName: result.data.nickName,
      avatar: result.data.avatar,
      permissions: result.data.permissions,
      roles: result.data.roles
    }

    const route = generateRoutes(result.data.menus ?? [])
    cacheRoutes.value = generateCacheRoutes(route.children ?? [])
    menus.value = generateMenus(route.children ?? [])
    return route
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
    getUserInfoAction
  }
})
