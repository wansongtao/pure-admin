<script lang="ts" setup>
const {
  total = 100,
  disabled = false,
  pageSizes = [10, 20, 30, 40, 50]
} = defineProps<{
  total?: number
  disabled?: boolean
  pageSizes?: number[]
}>()

const page = defineModel('page', { default: 1 })
const pageSize = defineModel('pageSize', { default: 10 })

const showQuickJumper = computed(() => total / pageSize.value > 10)
</script>

<template>
  <div class="base-pagination">
    <n-pagination
      v-model:page="page"
      v-model:page-size="pageSize"
      :item-count="total"
      :page-sizes
      :disabled
      :show-size-picker="pageSizes.length > 1"
      :show-quick-jumper
      :show-quick-jump-dropdown="false"
    >
      <template #prefix="{ itemCount }"> 共 {{ itemCount }} 项 </template>
    </n-pagination>
  </div>
</template>

<style lang="scss" scoped>
.base-pagination {
  display: flex;
  justify-content: flex-end;
}
</style>
