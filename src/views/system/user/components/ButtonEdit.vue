<script lang="ts" setup>
import UserForm from './UserForm.vue'
import { getUserDetail, updateUser } from '@/api/user'
import { getChangedData } from '@/utils'

import type { IUserDetail, IUserParam } from '@/types/api/user'

const { id } = defineProps<{ id: string }>()
const $emits = defineEmits<{
  success: []
}>()

const show = ref(false)
const loading = ref(false)
const detail = ref<IUserDetail>()

const onOpen = async () => {
  show.value = true
  loading.value = true
  const [, res] = await getUserDetail(id)
  loading.value = false

  if (!res) {
    window.$message.error('获取用户详情失败')
    return
  }

  detail.value = res.data
}

const onSubmit = async (data: IUserParam) => {
  const changedData = getChangedData(data, detail.value!)
  if (Object.keys(changedData).length === 0) {
    window.$message.warning('未修改任何数据')
    return
  }

  loading.value = true
  const [err] = await updateUser(id, changedData)
  loading.value = false
  if (err) {
    return
  }

  show.value = false
  window.$message.success('成功修改用户信息')
  $emits('success')
}
</script>

<template>
  <div class="button-edit">
    <n-button type="warning" ghost size="small" @click="onOpen">编辑</n-button>

    <n-modal v-model:show="show" :auto-focus="false">
      <n-card
        style="overflow-y: auto; width: 35%; max-height: 85vh"
        :header-style="{ textAlign: 'center' }"
        title="编辑用户"
      >
        <user-form :detail :loading @cancel="show = false" @submit="onSubmit" />
      </n-card>
    </n-modal>
  </div>
</template>

<style lang="scss" scoped></style>
