import { useUserStore } from '@/stores/user'
import { hasPermissions } from '@/utils/authority'

const vPermission = {
  mounted(el: HTMLElement, binding: { value: string | string[]; modifiers: { or: boolean } }) {
    const userStore = useUserStore()
    const permissions = userStore.userInfo.permissions
    const needPermissions = binding.value
    const or = binding.modifiers.or

    const isHas = hasPermissions(permissions, needPermissions, or)
    if (!isHas) {
      el.parentNode?.removeChild(el)
    }
  }
}

export default vPermission
