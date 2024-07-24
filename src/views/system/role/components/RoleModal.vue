<script lang="ts" setup>
import PermissionSelect from './PermissionSelect.vue'

import { useMenuTree } from '@/hooks/useMenuTree'
import { validateRoleName } from '@/utils/validate'
import { filterEmoji } from '@/utils'

import type { IRoleEditParam } from '@/types/api/role'
import type { Rule } from 'ant-design-vue/es/form'
import type { FormInstance } from 'ant-design-vue'

const $props = withDefaults(
  defineProps<{
    title?: string
    details?: IRoleEditParam
  }>(),
  {
    title: '新增角色'
  }
)

const loading = defineModel<boolean>('loading', { default: false })

const { menuTree, fetchMenuTree } = useMenuTree(undefined, false)

const open = defineModel<boolean>()
watch(open, (val) => {
  if (val) {
    fetchMenuTree(true)
  }
})

const rules: { [key in keyof IRoleEditParam]: Rule[] } = {
  name: [
    {
      required: true,
      validator: validateRoleName
    }
  ],
  description: [
    {
      required: false,
      max: 150,
    }
  ]
}
const createState = (): IRoleEditParam => {
  return {
    name: '',
    permissions: [],
    disabled: false,
    description: ''
  }
}

const formState = ref<IRoleEditParam>(createState())
watch(
  () => $props.details,
  (data) => {
    if (data) {
      formState.value = { ...formState.value, ...data }
      return
    }

    formState.value = createState()
  }
)

const formRef = ref<FormInstance>()
const resetForm = () => {
  formRef.value?.resetFields()
  formState.value = createState()
}

const $emits = defineEmits<{
  onCancel: []
  onOk: [data: IRoleEditParam]
}>()
const handleCancel = () => {
  resetForm()
  open.value = false
  $emits('onCancel')
}
const handleOk = async () => {
  const nameList = ['name']
  if (formState.value.description) {
    formState.value.description = filterEmoji(formState.value.description)
    nameList.push('description')
  }

  formRef.value?.validate(nameList).then(() => {
    const data = { ...formState.value }

    $emits('onOk', data)
  })
}

defineExpose({
  resetForm
})
</script>

<template>
  <a-modal
    :open="open"
    :confirm-loading="loading"
    :title="title"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form
      ref="formRef"
      :model="formState"
      autocomplete="off"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 19 }"
      :rules="rules"
    >
      <a-form-item label="角色名称：" name="name">
        <a-input v-model:value="formState.name" />
      </a-form-item>
      <a-form-item label="角色权限：" name="permissions">
        <permission-select v-model:value="formState.permissions" :tree-data="menuTree" />
      </a-form-item>
      <a-form-item label="是否禁用：" name="disabled">
        <a-switch v-model:checked="formState.disabled" />
      </a-form-item>
      <a-form-item label="角色描述：" name="description">
        <a-textarea v-model:value="formState.description" show-count :rows="4" :maxlength="150" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style lang="scss" scoped></style>
