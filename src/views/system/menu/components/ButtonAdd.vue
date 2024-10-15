<script lang="ts" setup>
import MenuForm from './MenuForm.vue'
import { addMenu } from '@/api/menu'
import { filterUndefinedValue } from '@/utils'

import type { IMenuParam } from '@/types/api/menu'

const $emits = defineEmits<{
  success: []
}>()

const show = ref(false)
const loading = ref(false)
const onSubmit = async (data: IMenuParam) => {
  loading.value = true
  const [err] = await addMenu(filterUndefinedValue(data))
  loading.value = false
  if (err) {
    return
  }

  show.value = false
  window.$message.success('成功添加菜单')
  $emits('success')
}
</script>

<template>
  <div class="button-add">
    <n-button type="primary" @click="show = true">添加菜单</n-button>

    <n-modal v-model:show="show">
      <n-card
        style="overflow-y: auto; width: 35%; max-height: 85vh"
        :header-style="{ textAlign: 'center' }"
        title="添加菜单"
      >
        <menu-form :loading @cancel="show = false" @submit="onSubmit" />
      </n-card>
    </n-modal>
  </div>
</template>

<style lang="scss" scoped></style>
