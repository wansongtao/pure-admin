<script lang="ts" setup>
import { resetUserPassword } from '@/api/user'

const { id } = defineProps<{ id: string }>()

const onConfirm = async () => {
  const [err] = await resetUserPassword(id)
  if (err) {
    return
  }

  window.$message.success('成功重置密码，默认密码为d.123456')
}
</script>

<template>
  <button-confirm text="重置密码" ghost size="small" type="primary" @confirm="onConfirm">
    您确定要重置密码吗？重置后，默认密码为d.123456
  </button-confirm>
</template>

<style lang="scss" scoped></style>
