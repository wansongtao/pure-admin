<script lang="ts" setup>
import { validatePassword } from '@/utils/validate'
import { updatePassword } from '@/api/common'

import type { Rule } from 'ant-design-vue/es/form'
import { message, type FormInstance } from 'ant-design-vue'

interface IPwdParam {
  oldPassword: string
  newPassword: string
  confirmPwd: string
}

const rules: { [K in keyof IPwdParam]?: Rule[] } = {
  oldPassword: [
    {
      required: true,
      validator: validatePassword
    }
  ],
  newPassword: [
    {
      required: true,
      validator: validatePassword
    }
  ]
}

const createState = (): IPwdParam => {
  return {
    oldPassword: '',
    newPassword: '',
    confirmPwd: ''
  }
}
const formState = ref<IPwdParam>(createState())
const isUpdate = computed(() => {
  if (formState.value.oldPassword && formState.value.newPassword && formState.value.confirmPwd) {
    return true
  }

  return false
})

const formRef = ref<FormInstance>()
const errorInfo = ref('')
const handleReset = () => {
  errorInfo.value = ''
  formRef.value?.resetFields()
  formState.value = createState()
}

const loading = ref(false)
const handleUpdate = () => {
  if (!isUpdate.value) {
    return
  }

  if (formState.value.newPassword !== formState.value.confirmPwd) {
    errorInfo.value = '新密码与确认密码不一致'
    return
  }
  if (formState.value.oldPassword === formState.value.newPassword) {
    errorInfo.value = '新密码不能与旧密码相同'
    return
  }
  errorInfo.value = ''

  formRef.value?.validate().then(async () => {
    loading.value = true
    const data = {
      oldPassword: formState.value.oldPassword,
      newPassword: formState.value.newPassword
    }

    const [error] = await updatePassword(data)
    loading.value = false
    if (error) {
      return
    }

    handleReset()
    message.success('密码修改成功')
  })
}
</script>

<template>
  <a-form
    ref="formRef"
    :model="formState"
    :rules="rules"
    autocomplete="off"
    :label-col="{ span: 3 }"
    :wrapper-col="{ span: 12 }"
  >
    <a-form-item name="oldPassword" label="原密码：">
      <a-input-password
        v-model:value="formState.oldPassword"
        placeholder="请输入原密码"
        allow-clear
      />
    </a-form-item>
    <a-form-item name="newPassword" label="新密码：">
      <a-input-password
        v-model:value="formState.newPassword"
        placeholder="请输入新密码"
        allow-clear
      />
    </a-form-item>
    <a-form-item
      name="confirmPwd"
      label="确认密码："
      required
      :validate-status="errorInfo ? 'error' : ''"
      :help="errorInfo"
    >
      <a-input-password
        v-model:value="formState.confirmPwd"
        placeholder="请确认密码"
        allow-clear
        @press-enter="handleUpdate"
      />
    </a-form-item>
    <a-form-item :wrapper-col="{ offset: 3 }">
      <a-button type="primary" :disabled="!isUpdate" :loading="loading" @click="handleUpdate"
        >确认更改</a-button
      >
      <a-button
        style="margin-left: 10px"
        :disabled="!isUpdate"
        :loading="loading"
        @click="handleReset"
        >取消</a-button
      >
    </a-form-item>
  </a-form>
</template>

<style lang="scss" scoped>
:deep(.ant-form-item-control) {
  padding-left: 12px;
}
</style>
