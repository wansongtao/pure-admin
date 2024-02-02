import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { hasPermissions, hasRoles } from '@/utils/authority'

export const useAuthority = () => {
  const userStore = useUserStore()
  const { userInfo } = storeToRefs(userStore)

  const hasPermission = (...rest: string[]) => {
    return hasPermissions(userInfo.value.permissions, rest)
  }
  const hasRole = (...rest: string[]) => {
    return hasRoles(userInfo.value.roles, rest)
  }

  return {
    hasPermission,
    hasRole
  }
}
