<script lang="ts" setup>
import { validateRoleName, validateEmoji } from '@/utils/validate'
import useFormValidate from '@/hooks/useFormValidate'

import type { IRoleParam } from '@/types/api/role'
import type { IRule } from '@/types'

const { detail, loading = false } = defineProps<{
  detail?: IRoleParam
  loading?: boolean
}>()

const $emits = defineEmits<{
  submit: [data: IRoleParam]
  cancel: []
}>()

const rules: IRule<IRoleParam> = {
  name: { required: true, validator: validateRoleName },
  description: [
    {
      required: false,
      min: 2,
      max: 150,
      message: '长度在 2 到 150 个字符',
      trigger: 'blur'
    },
    {
      validator: validateEmoji,
      trigger: 'blur'
    }
  ]
}

const initFormData = (): IRoleParam => {
  return {
    name: '',
    permissions: [],
    disabled: false,
    description: ''
  }
}

const formData = ref(initFormData())

watch(
  () => detail,
  (data) => {
    if (!data) {
      return
    }

    formData.value = { ...data }
  },
  { immediate: true }
)

const { formRef, validateForm } = useFormValidate()
const onSubmit = async () => {
  if (!(await validateForm())) {
    return
  }

  $emits('submit', { ...formData.value })
}
const onCancel = () => {
  $emits('cancel')
}
</script>

<template>
  <n-form ref="formRef" label-placement="left" label-width="100" :rules="rules" :model="formData">
    <n-form-item label="角色名称" path="name">
      <n-input v-model:value="formData.name" placeholder="请输入角色名称" clearable />
    </n-form-item>
    <n-form-item label="角色权限" path="permissions">
      <menu-tree-select
        contain-button
        checkable
        multiple
        max-tag-count="responsive"
        placeholder="请选择角色权限"
        v-model="formData.permissions"
      />
    </n-form-item>
    <n-form-item label="角色状态" path="disabled">
      <switch-state v-model:value="formData.disabled" round size="large" />
    </n-form-item>
    <n-form-item label="角色描述" path="description">
      <n-input
        type="textarea"
        placeholder="请输入角色描述"
        clearable
        maxlength="150"
        :rows="4"
        show-count
        v-model:value="formData.description"
      />
    </n-form-item>
    <n-form-item>
      <n-space style="width: 100%; justify-content: center">
        <n-button type="primary" :loading @click="onSubmit">提交</n-button>
        <n-button :disabled="loading" @click="onCancel">取消</n-button>
      </n-space>
    </n-form-item>
  </n-form>
</template>

<style lang="scss" scoped></style>
