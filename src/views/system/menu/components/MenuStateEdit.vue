<script lang="ts" setup>
import { updateMenu } from '@/api/menu'
import { useAuthority } from '@/hooks/useAuthority'
import { message } from 'ant-design-vue'

const $props = defineProps<{
  id: number
}>()

const { hasPermission } = useAuthority()

const disabled = defineModel<boolean>()
const loading = ref(false)

let isSkipOnce = false
watch(disabled, async (val) => {
  if (isSkipOnce) {
    isSkipOnce = false
    return
  }

  loading.value = true
  const [error, result] = await updateMenu($props.id, { disabled: val })
  
  loading.value = false
  if (result) {
    message.success('菜单状态修改成功')
    return
  }
  if (error) {
    isSkipOnce = true
    disabled.value = !disabled.value
    return
  }
})
</script>

<template>
  <a-switch
    v-if="hasPermission('system:menu:edit')"
    v-model:checked="disabled"
    checked-children="是"
    un-checked-children="否"
    :loading="loading"
  />
  <span v-else>{{ disabled ? '是' : '否' }}</span>
</template>

<style lang="scss" scoped></style>
