<script lang="ts" setup>
import MenuModal from './MenuModal.vue'

import { message } from 'ant-design-vue'
import { getMenuDetail, updateMenu } from '@/api/menu'
import { removeSameValue } from '@/utils/index'

import type { IMenuParam, IMenuDetail } from '@/types/api/menu'

const $props = defineProps<{
  id: number
}>()
const $emits = defineEmits<{
  handleSuccess: []
}>()

const open = ref(false)
const detail = ref<IMenuDetail>()
const handleOpen = async () => {
  const { result } = await getMenuDetail($props.id)
  if (result) {
    detail.value = result.data
    open.value = true
  }
}

const handleEdit = async (data: IMenuParam) => {
  data = removeSameValue(data, detail.value!)

  // 移除默认值
  const keys = Object.keys(data) as (keyof IMenuParam)[]
  keys.forEach((k) => {
    if (detail.value![k] === undefined && !data[k]) {
      delete data[k]
    }
  })

  const { result } = await updateMenu($props.id, data)
  if (result) {
    open.value = false
    $emits('handleSuccess')
    message.success('修改菜单成功')
  }
}
</script>

<template>
  <a-button
    v-permission="['system:menu:edit']"
    type="primary"
    size="small"
    ghost
    @click="handleOpen"
    >编辑</a-button
  >
  <menu-modal v-model="open" title="编辑菜单" :details="detail" @verify-success="handleEdit" />
</template>

<style lang="scss" scoped></style>
