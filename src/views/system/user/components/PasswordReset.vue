<script lang="ts" setup>
import { resetUserPassword } from '@/api/user'
import { message } from 'ant-design-vue';

const $props = defineProps<{
  id: string
}>()

const onReset = async () => {
  if (!$props.id) {
    return
  }

  const [err] = await resetUserPassword($props.id)
  if (err) {
    return
  }
  message.success('重置成功')
}
</script>

<template>
  <button-delete
    size="small"
    text="重置密码"
    :confirm-config="{
      title: '您确定要重置密码吗？',
      content: '重置后密码将会重置为d.123456'
    }"
    @handle-ok="onReset"
  />
</template>

<style lang="scss" scoped>

</style>