import { useUserStore } from '@/stores/user'
import { hasRoles } from '@/utils/authority'

const vRole = {
  mounted(el: HTMLElement, binding: { value: string | string[]; modifiers: { or: boolean } }) {
    const userStore = useUserStore()
    const roles = userStore.userInfo.roles
    const needRole = binding.value
    const or = binding.modifiers.or

    const isHas = hasRoles(roles, needRole, or)
    if (!isHas) {
      el.parentNode?.removeChild(el)
    }
  }
}

export default vRole
