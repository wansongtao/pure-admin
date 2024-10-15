<script lang="ts" setup>
import UserForm from './UserForm.vue'
import { addUser } from '@/api/user'
import { filterUndefinedValue } from '@/utils'

import type { IUserParam } from '@/types/api/user'

const $emits = defineEmits<{
  success: []
}>()

const show = ref(false)
const loading = ref(false)
const onSubmit = async (data: IUserParam) => {
  loading.value = true
  const [err] = await addUser(filterUndefinedValue(data))
  loading.value = false

  if (err) {
    return
  }

  show.value = false
  window.$message.success('成功添加用户')
  $emits('success')
}
</script>

<template>
  <div class="button-add">
    <n-button type="primary" @click="show = true">添加用户</n-button>

    <n-modal v-model:show="show">
      <n-card
        style="overflow-y: auto; width: 35%; max-height: 85vh"
        :header-style="{ textAlign: 'center' }"
        title="添加用户"
      >
        <user-form :loading @cancel="show = false" @submit="onSubmit" />
      </n-card>
    </n-modal>
  </div>
</template>

<style lang="scss" scoped></style>
