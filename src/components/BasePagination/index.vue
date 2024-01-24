<script lang="ts" setup>
defineOptions({
  name: 'BasePagination'
})

withDefaults(defineProps<{
  page: number
  pageSize: number
  total: number
  pageSizeOptions?: string[] | number[]
  hideOnSinglePage?: boolean
  showQuickJumper?: boolean
  showSizeChanger?: boolean
  showTotal?: (total: number, range: [number, number]) => string
}>(), {
  pageSizeOptions: () => ['10', '20', '30', '40', '50'],
  hideOnSinglePage: true,
  showQuickJumper: true,
  showSizeChanger: true,
  showTotal: (total: number) => `总计 ${total} 条`
})

const $emits = defineEmits<{
  onChange: [page: number, pageSize: number]
  'update:page': [page: number]
  'update:pageSize': [pageSize: number]
}>()

const onChange = (page: number, pageSize: number) => {
  $emits('update:page', page)
  $emits('update:pageSize', pageSize)
  $emits('onChange', page, pageSize)
}
</script>

<template>
  <div class="base_pagination">
    <a-pagination
      :current="page"
      :page-size="pageSize"
      :total="total"
      :page-size-options="pageSizeOptions"
      :hide-on-single-page="hideOnSinglePage"
      :show-quick-jumper="showQuickJumper"
      :show-size-changer="showSizeChanger"
      :show-total="showTotal"
      @change="onChange"
    />
  </div>
</template>

<style lang="scss" scoped></style>
