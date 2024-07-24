<script lang="ts" setup>
import { useAuthority } from '@/hooks/useAuthority'
import { message } from 'ant-design-vue'
import { updateRole } from '@/api/role'
import { throttle } from '@/utils';

const $props = defineProps<{
  id: number
}>()

const { hasPermission } = useAuthority()

const disabled = defineModel<boolean>()
const loading = ref(false)

const handleEdit = throttle(async () => {
  loading.value = true
  const [, result] = await updateRole($props.id, { disabled: !disabled.value })
  loading.value = false
  if (result) {
    disabled.value = !disabled.value
    message.success('修改状态成功')
  }
})
</script>

<template>
  <a-switch
    v-if="hasPermission('system:role:edit')"
    :checked="disabled"
    checked-children="是"
    un-checked-children="否"
    :loading="loading"
    @click="handleEdit"
  />
  <span v-else>{{ disabled ? '是' : '否' }}</span>
</template>

<style lang="scss" scoped></style>
