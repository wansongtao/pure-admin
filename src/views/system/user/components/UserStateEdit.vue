<script lang="ts" setup>
import { useAuthority } from '@/hooks/useAuthority'
import { message } from 'ant-design-vue'
import { updateUser } from '@/api/user'
import { throttle } from '@/utils';

const $props = defineProps<{
  id: string
}>()

const { hasPermission } = useAuthority()

const disabled = defineModel<boolean>()
const loading = ref(false)

const handleEdit = throttle(async () => {
  loading.value = true
  const [, result] = await updateUser($props.id, { disabled: !disabled.value })
  loading.value = false
  if (result) {
    disabled.value = !disabled.value
    message.success('修改状态成功')
  }
})
</script>

<template>
  <a-switch
    v-if="hasPermission('system:user:edit')"
    :checked="disabled"
    checked-children="是"
    un-checked-children="否"
    :loading="loading"
    @click="handleEdit"
  />
  <span v-else>{{ disabled ? '是' : '否' }}</span>
</template>

<style lang="scss" scoped></style>
