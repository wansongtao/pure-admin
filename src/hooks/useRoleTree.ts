import { getRoleTree } from '@/api/role'

import type { IRoleTreeItem } from '@/types/api/role'

export default function useRoleTree(immediate = true) {
  const roleTree = ref<IRoleTreeItem[]>([])

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
