<script lang="ts" setup>
import dayjs from 'dayjs'
import { validateNickName, validatePhone, validateEmail } from '@/utils/validate'
import { updateProfile } from '@/api/common'
import { getChangedData } from '@/utils/index'

import type { Rule } from 'ant-design-vue/es/form'
import { message, type FormInstance } from 'ant-design-vue'
import type { IProfileParam } from '@/types/api/common'
import type { Dayjs } from 'dayjs'

const $props = defineProps<{
  details: IProfileParam
}>()
const $emits = defineEmits<{
  onChange: [data: IProfileParam]
}>()

type IRuleKey = 'nickName' | 'phone' | 'email'
const rules: Record<IRuleKey, Rule[]> = {
  nickName: [
    {
      required: false,
      validator: validateNickName
    }
  ],
  phone: [
    {
      required: false,
      validator: validatePhone
    }
  ],
  email: [
    {
      required: false,
      validator: validateEmail
    }
  ]
}

const createState = (): IProfileParam => {
  return {
    nickName: '',
    phone: '',
    email: '',
    birthday: '',
    sex: undefined,
    description: ''
  }
}

const formState = ref<IProfileParam>(createState())
watch(
  () => $props.details,
  (data) => {
    formState.value = { ...createState(), ...data }
  }
)
const isUpdate = computed(() => {
  const formStateKeys = Object.keys(formState.value) as (keyof IProfileParam)[]
  return formStateKeys.some((key) => {
    const oldValue = $props.details[key]
    const newValue = formState.value[key]

    if (newValue !== oldValue) {
      return true
    }

    return false
  })
})

const formRef = ref<FormInstance>()
const handleReset = () => {
  formRef.value?.resetFields()
  formState.value = { ...createState(), ...$props.details }
}

const loading = ref(false)
const handleSave = () => {
  const nameList: IRuleKey[] = []
  if (formState.value.nickName) {
    nameList.push('nickName')
  }
  if (formState.value.phone) {
    nameList.push('phone')
  }
  if (formState.value.email) {
    nameList.push('email')
  }

  formRef.value?.validate(nameList).then(async () => {
    const data: IProfileParam = getChangedData(formState.value, $props.details)

    loading.value = true
    const [error] = await updateProfile(data)
    loading.value = false
    if (error) {
      return
    }

    message.success('修改信息成功')
    $emits('onChange', data)
  })
}

const disabledDate = (current: Dayjs) => {
  return current && current > dayjs().endOf('day')
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
    <a-form-item label="用户昵称：" name="nickName">
      <a-input v-model:value="formState.nickName" />
    </a-form-item>
    <a-form-item label="联系方式：" name="phone">
      <a-input v-model:value="formState.phone" />
    </a-form-item>
    <a-form-item label="用户邮箱：" name="email">
      <a-input v-model:value="formState.email" />
    </a-form-item>
    <a-form-item label="出生日期：" name="birthday">
      <a-date-picker
        v-model:value="formState.birthday"
        :disabled-date="disabledDate"
        style="width: 100%"
        valueFormat="YYYY-MM-DD"
      />
    </a-form-item>
    <a-form-item label="用户性别：" name="sex">
      <a-radio-group v-model:value="formState.sex">
        <a-radio :value="0">女</a-radio>
        <a-radio :value="1">男</a-radio>
        <a-radio :value="2">其他</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="自我介绍：" name="description">
      <a-textarea v-model:value="formState.description" show-count :rows="3" :maxlength="150" />
    </a-form-item>
    <a-form-item :wrapper-col="{ offset: 3 }">
      <a-button type="primary" :disabled="!isUpdate" :loading="loading" @click="handleSave"
        >保存</a-button
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
