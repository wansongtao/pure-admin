<script lang="ts" setup>
import { validateNickName, validatePhone, validateEmail } from '@/utils/validate'
import { GENDER_MAP } from '@/constants'
import useFormValidate from '@/hooks/useFormValidate'
import { updateProfile } from '@/api/common'
import { getChangedData } from '@/utils'

import type { IProfile, IProfileParam } from '@/types/api/common'
import type { IRule } from '@/types'

const { profile } = defineProps<{
  profile: IProfile
}>()

const $emits = defineEmits<{
  success: [data: IProfileParam]
}>()

const rules: IRule<IProfileParam> = {
  nickName: { required: false, validator: validateNickName },
  phone: { required: false, validator: validatePhone },
  email: { required: false, validator: validateEmail }
}

const initFormData = (): IProfileParam => {
  return {
    nickName: '',
    phone: '',
    email: '',
    birthday: null,
    gender: 'OT',
    description: ''
  }
}

const formData = ref(initFormData())
watch(
  () => profile,
  () => {
    formData.value = { ...formData.value, ...profile }
    formData.value.birthday = profile.birthday || null
  },
  { immediate: true }
)

const isUpdate = computed(() => {
  const keys = Object.keys(formData.value) as (keyof IProfileParam)[]
  return keys.some((key) => {
    const oldValue = profile[key]
    const newValue = formData.value[key]

    if (!oldValue && !newValue) {
      return false
    }

    if (newValue !== oldValue) {
      return true
    }

    return false
  })
})

const { formRef, validateForm } = useFormValidate()

const onCancel = () => {
  formData.value = { ...initFormData(), ...profile }
  formRef.value?.restoreValidation()
}

const onSave = async () => {
  const isValid = await validateForm()
  if (!isValid) {
    return
  }

  const params = getChangedData(formData.value, profile)
  if (params.nickName === '') {
    params.nickName = null
  }
  if (params.phone === '') {
    params.phone = null
  }
  if (params.email === '') {
    params.email = null
  }
  if (params.description === '') {
    params.description = null
  }

  const [err] = await updateProfile(params)
  if (err) {
    return
  }

  $emits('success', params)
  window.$message.success('更新成功')
}
</script>

<template>
  <n-form ref="formRef" label-placement="left" :rules="rules" :model="formData">
    <n-form-item label="用户昵称：" path="nickName">
      <n-input v-model:value="formData.nickName" placeholder="请输入用户昵称" clearable />
    </n-form-item>
    <n-form-item label="联系方式：" path="phone">
      <n-input v-model:value="formData.phone" placeholder="请输入联系方式" clearable />
    </n-form-item>
    <n-form-item label="邮箱地址：" path="email">
      <n-input v-model:value="formData.email" placeholder="请输入邮箱地址" clearable />
    </n-form-item>
    <n-form-item label="用户性别：" path="gender">
      <n-radio-group v-model:value="formData.gender" name="radiogroup">
        <n-space>
          <n-radio v-for="(label, value) in GENDER_MAP" :key="value" :value>
            {{ label }}
          </n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>
    <n-form-item label="出生日期：" path="birthday">
      <n-date-picker
        v-model:formatted-value="formData.birthday"
        value-format="yyyy-MM-dd"
        placeholder="请选择出生日期"
        :is-date-disabled="
          (ts: number) => {
            return ts > Date.now()
          }
        "
        clearable
      />
    </n-form-item>
    <n-form-item label="自我介绍：" path="description">
      <n-input
        v-model:value="formData.description"
        type="textarea"
        placeholder="请输入自我介绍"
        clearable
        maxlength="150"
        show-count
      />
    </n-form-item>
    <n-form-item>
      <n-space style="width: 100%; justify-content: center">
        <n-button type="primary" :disabled="!isUpdate" @click="onSave">保存</n-button>
        <n-button :disabled="!isUpdate" @click="onCancel">取消</n-button>
      </n-space>
    </n-form-item>
  </n-form>
</template>

<style lang="scss" scoped></style>
