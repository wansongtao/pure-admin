import { defineStore } from 'pinia'
import { ref } from 'vue'
import { setLogin } from '@/api/common'

import type { ILoginParams } from '@/types/api/common'

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

  return {
    token,
    getToken,
    setToken,
    removeToken,
    login
  }
})
