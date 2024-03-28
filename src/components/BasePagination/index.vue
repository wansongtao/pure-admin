<script lang="ts" setup>
defineOptions({
  name: 'BasePagination'
})

withDefaults(
  defineProps<{
    total: number
    pageSizeOptions?: string[] | number[]
    hideOnSinglePage?: boolean
    showQuickJumper?: boolean
    showSizeChanger?: boolean
    disable?: boolean
    showTotal?: (total: number, range: [number, number]) => string
  }>(),
  {
    pageSizeOptions: () => ['10', '20', '30', '40', '50'],
    hideOnSinglePage: false,
    showQuickJumper: true,
    showSizeChanger: true,
    disable: false,
    showTotal: (total: number) => `总计 ${total} 条`
  }
)

const $emits = defineEmits<{
  onChange: [page: number, pageSize: number]
}>()

const page = defineModel<number>('page', { default: 1 })
const pageSize = defineModel<number>('pageSize', { default: 10 })
const onChange = (newPage: number, newPageSize: number) => {
  page.value = newPage
  pageSize.value = newPageSize
  $emits('onChange', newPage, newPageSize)
}
</script>

<template>
  <div class="base_pagination">
    <a-pagination
      v-bind="$attrs"
      :current="page"
      :page-size="pageSize"
      :total="total"
      :page-size-options="pageSizeOptions"
      :hide-on-single-page="hideOnSinglePage"
      :show-quick-jumper="showQuickJumper"
      :show-size-changer="showSizeChanger"
      :show-total="showTotal"
      :disabled="disable"
      @change="onChange"
    />
  </div>
</template>

<style lang="scss" scoped>
.base_pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
