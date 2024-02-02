import { ref } from 'vue'
import { getMenuTree } from '@/api/menu'

import type { IMenuTree } from '@/types/api/menu'

export interface ITree {
  label: string
  value: number
  type: IMenuTree['type']
  disabled?: boolean
  children?: ITree[]
}

export const useMenuTree = (
  callback?: (data: IMenuTree) => { label: string; value: number; disabled?: boolean },
  immediate = true
) => {
  const menuTree = ref<ITree[]>([])

  const fetchMenuTree = async () => {
    const transformData = (tree: IMenuTree[]) => {
      return tree.map((v) => {
        const item: ITree = { label: v.name, value: v.id, type: v.type }
        if (callback) {
          const res = callback(v)
          item.label = res.label
          item.value = res.value
          item.disabled = res.disabled
        }

        if (v.children) {
          item.children = transformData(v.children)
        }

        return item
      })
    }

    const { result } = await getMenuTree()
    menuTree.value = transformData(result?.data ?? [])
    return menuTree.value
  }

  if (immediate) {
    fetchMenuTree()
  }

  return {
    menuTree,
    fetchMenuTree
  }
}
