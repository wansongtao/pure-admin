import type { App } from 'vue'
import { useUserStore } from '@/stores/user'
import { checkRole } from '@/utils/authority'

const vRole = (app: App) => {
  app.directive<HTMLElement, string[] | string>('role', (el, binding) => {
    const userStore = useUserStore()

    const roles = userStore.userInfo.roles
    const role = binding.value

    let isHas = true
    if (typeof role === 'string') {
      isHas = checkRole(roles, role)
    } else {
      const or = binding.modifiers.or
      if (or) {
        isHas = role.some((v) => {
          return checkRole(roles, v)
        })
      } else {
        isHas = role.every((v) => {
          return checkRole(roles, v)
        })
      }
    }

    if (!isHas) {
      el.style.display = 'none'
      setTimeout(() => {
        el.parentNode?.removeChild(el)
      }, 0)
    }
  })
}

export default vRole
