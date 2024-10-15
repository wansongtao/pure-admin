import { getMenuTree } from '@/api/menu'

import type { IMenuTree } from '@/types/api/menu'

export default function useMenuTree(containButton: boolean = false) {
  const menuTree = ref<IMenuTree[]>([])

  const fetchMenuTree = async () => {
    const [, result] = await getMenuTree(containButton)
    menuTree.value = result?.data ?? []
  }

  fetchMenuTree()

  return {
    menuTree,
    fetchMenuTree
  }
}
