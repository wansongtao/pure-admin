<script lang="ts" setup>
import useFormValidate from '@/hooks/useFormValidate'
import { validatePassword } from '@/utils/validate'
import { updatePassword } from '@/api/common'
import { useUserStore } from '@/stores/user'

import type { IRule } from '@/types'
import type { IPasswordParam } from '@/types/api/common'

interface IFormData extends IPasswordParam {
  confirmPassword: string
}

const initFormData = (): IFormData => {
  return {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

const formData = ref(initFormData())

const rules = computed(() => {
  const formRules: IRule<IFormData> = {
    oldPassword: { required: true, validator: validatePassword, trigger: 'blur' },
    newPassword: [
      { required: true, validator: validatePassword, trigger: 'blur' },
      {
        validator: (_rule, value) => !value || value !== formData.value.oldPassword,
        message: '新密码不能与原密码相同',
        trigger: 'blur'
      }
    ],
    confirmPassword: [
      { required: true, message: '请再次输入密码', trigger: 'blur' },
      {
        validator: (_rule, value) => !value || value === formData.value.newPassword,
        message: '两次输入的密码不一致',
        trigger: 'blur'
      }
    ]
  }

  return formRules
})

const disabled = computed(() => {
  if (
    !formData.value.oldPassword ||
    !formData.value.newPassword ||
    !formData.value.confirmPassword ||
    formData.value.newPassword !== formData.value.confirmPassword ||
    formData.value.oldPassword === formData.value.newPassword
  ) {
    return true
  }

  return false
})

const { formRef, validateForm } = useFormValidate()
const onCancel = () => {
  formData.value = initFormData()
  formRef.value?.restoreValidation()
}

const router = useRouter()
const logout = async () => {
  const userStore = useUserStore()
  await userStore.logout()
  router.replace('/login')
}

const onSave = async () => {
  const valid = await validateForm()
  if (!valid) {
    return
  }

  const { oldPassword, newPassword } = formData.value
  const [err] = await updatePassword({ oldPassword, newPassword })
  if (err) {
    return
  }

  formData.value = initFormData()
  window.$dialog.success({
    title: '修改成功',
    content: '密码修改成功，请重新登录',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      logout()
    }
  })
}
</script>

<template>
  <n-form ref="formRef" label-placement="left" label-width="80" :rules="rules" :model="formData">
    <n-form-item label="旧密码" path="oldPassword">
      <n-input
        v-model:value="formData.oldPassword"
        type="password"
        show-password-on="click"
        placeholder="请输入旧密码"
      >
      </n-input>
    </n-form-item>
    <n-form-item label="新密码" path="newPassword">
      <n-input
        v-model:value="formData.newPassword"
        type="password"
        show-password-on="click"
        placeholder="请输入新密码"
      >
      </n-input>
    </n-form-item>
    <n-form-item label="确认密码" path="confirmPassword">
      <n-input
        v-model:value="formData.confirmPassword"
        type="password"
        show-password-on="click"
        placeholder="请再次输入新密码"
        @keydown.enter.prevent="onSave"
      >
      </n-input>
    </n-form-item>

    <n-form-item>
      <n-space style="width: 100%; justify-content: center">
        <n-button type="primary" :disabled @click="onSave">确认更改</n-button>
        <n-button @click="onCancel">取消</n-button>
      </n-space>
    </n-form-item>
  </n-form>
</template>

<style lang="scss" scoped></style>
