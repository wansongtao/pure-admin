<script lang="ts" setup>
import RoleForm from './RoleForm.vue'
import { addRole } from '@/api/role'
import { filterUndefinedValue } from '@/utils'

import type { IRoleParam } from '@/types/api/role'

const $emits = defineEmits<{
  success: []
}>()

const show = ref(false)
const loading = ref(false)
const onSubmit = async (data: IRoleParam) => {
  loading.value = true
  const [err] = await addRole(filterUndefinedValue(data))
  loading.value = false

  if (err) {
    return
  }

  show.value = false
  window.$message.success('成功添加角色')
  $emits('success')
}
</script>

<template>
  <div class="button-add">
    <n-button type="primary" @click="show = true">添加角色</n-button>

    <n-modal v-model:show="show">
      <n-card
        style="overflow-y: auto; width: 35%; max-height: 85vh"
        :header-style="{ textAlign: 'center' }"
        title="添加角色"
      >
        <role-form :loading @cancel="show = false" @submit="onSubmit" />
      </n-card>
    </n-modal>
  </div>
</template>

<style lang="scss" scoped></style>
