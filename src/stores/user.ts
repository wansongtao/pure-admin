import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo, setLogin, setLogout } from '@/api/common'

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

  function login(data: ILoginParams) {
    return new Promise<void>((resolve, reject) => {
      setLogin(data)
        .then((res) => {
          setToken(res.data)
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
  function logout() {
    return new Promise<void>((resolve) => {
      setLogout().then(() => {
        removeToken()
        resolve()
      })
    })
  }

  const userInfo = ref<IUserInfo>({
    nickName: '',
    avatar: '',
    permissions: [],
    roles: []
  })
  function getUserInfoAction() {
    return new Promise<IUserInfo>((resolve, reject) => {
      getUserInfo()
        .then((res) => {
          userInfo.value = res.data
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  return {
    token,
    getToken,
    setToken,
    removeToken,
    login,
    logout,
    userInfo,
    getUserInfoAction
  }
})
