<script lang="ts" setup>
import { deepFind } from '@/utils/index'

interface ITree {
  label: string
  value: number
  children?: ITree[]
}

const $props = withDefaults(
  defineProps<{
    treeData?: ITree[]
    value?: number[]
  }>(),
  {
    treeData: () => [],
    value: () => []
  }
)
const $emits = defineEmits<{
  'update:value': [value: number[]]
}>()

const list = computed({
  get() {
    const tree = $props.treeData
    const checkedList = $props.value
    if (!tree.length || !checkedList.length) {
      return []
    }

    const arr: ITree[] = []
    checkedList.forEach((v) => {
      const item = deepFind(tree, (res) => res.value === v)
      if (!item) {
        return
      }
      arr.push({ label: item.label, value: item.value })
    })

    return arr
  },
  set(tree) {
    const value = tree.map((v) => v.value)
    $emits('update:value', value)
  }
})
</script>

<template>
  <a-tree-select
    v-model:value="list"
    show-search
    style="width: 100%"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    placeholder="请选择角色权限"
    allow-clear
    tree-checkable
    tree-check-strictly
    :max-tag-count="3"
    :tree-data="treeData"
    tree-node-filter-prop="label"
  />
</template>

<style lang="scss" scoped></style>
