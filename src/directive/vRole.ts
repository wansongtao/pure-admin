import type { App } from 'vue'
import { useUserStore } from '@/stores/user'
import { hasRoles } from '@/utils/authority'

const vRole = (app: App) => {
  app.directive<HTMLElement, string[] | string>('role', (el, binding) => {
    const userStore = useUserStore()
    const roles = userStore.userInfo.roles
    const needRole = binding.value
    const or = binding.modifiers.or

    const isHas = hasRoles(roles, needRole, or)
    if (!isHas) {
      el.style.display = 'none'
      setImmediate(() => {
        el.parentNode?.removeChild(el)
      })
    }
  })
}

export default vRole
