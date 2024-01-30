import type { App } from 'vue'
import { useUserStore } from '@/stores/user'
import { hasPermissions } from '@/utils/authority'

const vPermission = (app: App) => {
  app.directive<HTMLElement, string | string[]>('permission', (el, binding) => {
    const userStore = useUserStore()
    const permissions = userStore.userInfo.permissions
    const needPermissions = binding.value
    const or = binding.modifiers.or

    const isHas = hasPermissions(permissions, needPermissions, or)
    if (!isHas) {
      el.style.display = 'none'
      setImmediate(() => {
        el.parentNode?.removeChild(el)
      })
    }
  })
}

export default vPermission
