<script lang="ts" setup>
import useFormValidate from '@/hooks/useFormValidate'
import useRoleTree from '@/hooks/useRoleTree'
import { validateUsername, validateNickName } from '@/utils/validate'

import type { IRule } from '@/types'
import type { IUserParam } from '@/types/api/user'
import type { SelectOption } from 'naive-ui'

const { detail, loading = false } = defineProps<{
  detail?: IUserParam
  loading?: boolean
}>()

const $emits = defineEmits<{
  submit: [data: IUserParam]
  cancel: []
}>()

const { roleTree } = useRoleTree()
const roleOptions = computed(() => {
  const list: SelectOption[] = roleTree.value.map((item) => {
    return {
      value: item.id,
      label: item.name
    }
  })

  return list
})

const rules: IRule<IUserParam> = {
  userName: { required: true, validator: validateUsername },
  nickName: { required: false, validator: validateNickName }
}

const initFormData = (): IUserParam => {
  return {
    userName: '',
    nickName: '',
    disabled: false,
    roles: []
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
    <n-form-item label="用户角色" path="roles">
      <n-select
        v-model:value="formData.roles"
        :options="roleOptions"
        multiple
        filterable
        max-tag-count="responsive"
        clearable
      />
    </n-form-item>
    <n-form-item label="用户名称" path="userName">
      <n-input
        v-model:value="formData.userName"
        placeholder="请输入用户名称"
        :disabled="detail !== undefined"
        clearable
      />
    </n-form-item>
    <n-form-item label="用户昵称" path="nickName">
      <n-input v-model:value="formData.nickName" placeholder="请输入用户昵称" clearable />
    </n-form-item>
    <n-form-item label="用户状态" path="disabled">
      <switch-state v-model:value="formData.disabled" round size="large" />
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
