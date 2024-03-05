import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { hasPermissions, hasRoles } from '@/utils/authority'

export const useAuthority = () => {
  const userStore = useUserStore()
  const { userInfo } = storeToRefs(userStore)

  const hasPermission = (perm: string | string[], or?: boolean) => {
    return hasPermissions(userInfo.value.permissions, perm, or)
  }
  const hasRole = (role: string | string[], or?: boolean) => {
    return hasRoles(userInfo.value.roles, role, or)
  }

  return {
    hasPermission,
    hasRole
  }
}
