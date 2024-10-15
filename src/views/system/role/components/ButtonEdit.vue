<script lang="ts" setup>
import RoleForm from './RoleForm.vue'
import { getRoleDetail, updateRole } from '@/api/role'
import { getChangedData } from '@/utils'

import type { IRoleDetail, IRoleParam } from '@/types/api/role'

const { id } = defineProps<{ id: number }>()
const $emits = defineEmits<{
  success: []
}>()

const show = ref(false)
const loading = ref(false)
const detail = ref<IRoleDetail>()

const onOpen = async () => {
  show.value = true
  loading.value = true
  const [, res] = await getRoleDetail(id)
  loading.value = false

  if (!res) {
    window.$message.error('获取角色详情失败')
    return
  }

  detail.value = res.data
}

const onSubmit = async (data: IRoleParam) => {
  const changedData = getChangedData(data, detail.value!)
  if (Object.keys(changedData).length === 0) {
    window.$message.warning('未修改任何数据')
    return
  }

  loading.value = true
  const [err] = await updateRole(id, changedData)
  loading.value = false
  if (err) {
    return
  }

  show.value = false
  window.$message.success('成功修改角色信息')
  $emits('success')
}
</script>

<template>
  <div class="button-edit">
    <n-button type="warning" ghost size="small" @click="onOpen">编辑</n-button>

    <n-modal v-model:show="show">
      <n-card
        style="overflow-y: auto; width: 35%; max-height: 85vh"
        :header-style="{ textAlign: 'center' }"
        title="编辑角色"
      >
        <role-form :detail :loading @cancel="show = false" @submit="onSubmit" />
      </n-card>
    </n-modal>
  </div>
</template>

<style lang="scss" scoped></style>
