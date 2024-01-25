import type { App } from 'vue'
import { useUserStore } from '@/stores/user'
import { checkAuth } from '@/utils/authority'

const vPerm = (app: App) => {
  app.directive<HTMLElement, string[]>('perm', (el, binding) => {
    const userStore = useUserStore()

    const permissions = binding.value ?? userStore.userInfo.permissions
    const isHas = checkAuth(permissions, binding.arg ?? '')
    if (!isHas) {
      el.style.display = 'none'
      setTimeout(() => {
        el.parentNode?.removeChild(el)
      }, 0)
    }
  })
}

export default vPerm
