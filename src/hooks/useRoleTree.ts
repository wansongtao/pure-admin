import { ref } from 'vue'
import { getRoleTree } from '@/api/role'

import type { IRoleTree } from '@/types/api/role'

export const useRoleTree = (immediate = true) => {
  const roleTree = ref<IRoleTree[]>([])

  const fetchRoleTree = async () => {
    const [, result] = await getRoleTree()
    if (result) {
      roleTree.value = result?.data
    }
    return roleTree.value
  }

  if (immediate) {
    fetchRoleTree()
  }

  return {
    roleTree,
    fetchRoleTree
  }
}
