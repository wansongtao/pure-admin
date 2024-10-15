import { setLogin, setLogout, getNewToken, getUserInfo } from '@/api/common'

import type { ILoginParams, IUserInfo } from '@/types/api/common'

export const useUserStore = defineStore(
  'user',
  () => {
    const accessToken = ref('')
    const refreshToken = ref('')
    async function login(data: ILoginParams) {
      const [, res] = await setLogin(data)
      if (!res) {
        return false
      }

      accessToken.value = res.data.token
      refreshToken.value = res.data.refreshToken
      return true
    }
    async function refresh() {
      if (!refreshToken.value) {
        return false
      }

      const [, res] = await getNewToken(refreshToken.value)
      if (!res) {
        return false
      }

      accessToken.value = res.data.token
      refreshToken.value = res.data.refreshToken
      return true
    }

    const userInfo = ref(initUserInfo())
    function initUserInfo(): IUserInfo {
      return {
        name: '',
        avatar: '',
        permissions: [],
        roles: [],
        menus: []
      }
    }
    async function fetchUserInfo() {
      const [, res] = await getUserInfo()
      if (!res) {
        return
      }

      userInfo.value = res.data
    }

    function reset() {
      accessToken.value = ''
      refreshToken.value = ''
      userInfo.value = initUserInfo()
    }

    async function logout() {
      await setLogout()
      reset()
    }

    return {
      accessToken,
      refreshToken,
      login,
      refresh,
      userInfo,
      fetchUserInfo,
      reset,
      logout
    }
  },
  { persist: true }
)
