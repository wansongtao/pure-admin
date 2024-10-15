import { useUserStore } from '@/stores/user'
import { hasPermissions, hasRoles } from '@/utils/authority'

export default function usePermission() {
  const userStore = useUserStore()
  const { userInfo } = storeToRefs(userStore)

  const hasPermission = (needPerm: string | string[], or?: boolean) => {
    return hasPermissions(userInfo.value.permissions, needPerm, or)
  }
  const hasRole = (needRole: string | string[], or?: boolean) => {
    return hasRoles(userInfo.value.roles, needRole, or)
  }

  return {
    hasPermission,
    hasRole
  }
}
