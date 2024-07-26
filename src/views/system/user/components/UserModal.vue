<script lang="ts" setup>
import { useRoleTree } from '@/hooks/useRoleTree'
import { validateUsername, validateNickName } from '@/utils/validate'

import type { IUserEdit } from '@/types/api/user'
import type { Rule } from 'ant-design-vue/es/form'
import type { FormInstance } from 'ant-design-vue'

const $props = withDefaults(
  defineProps<{
    title?: string
    details?: IUserEdit
  }>(),
  {
    title: '新增用户'
  }
)
const $emits = defineEmits<{
  onCancel: []
  onOk: [data: IUserEdit]
}>()

const loading = defineModel<boolean>('loading', { default: false })
const open = defineModel<boolean>()

const { roleTree, fetchRoleTree } = useRoleTree(false)
watch(open, (val) => {
  if (!val) {
    return
  }

  fetchRoleTree()
})

const rules: {[key in keyof IUserEdit]: Rule[]}= {
  userName: [
    {
      required: true,
      validator: validateUsername
    }
  ],
  nickName: [
    {
      required: false,
      validator: validateNickName
    }
  ]
}
const createState = (): IUserEdit => {
  return {
    userName: '',
    nickName: '',
    roles: [],
    disabled: false,
  }
}

const formState = ref<IUserEdit>(createState())
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

const handleCancel = () => {
  resetForm()
  open.value = false
  $emits('onCancel')
}
const handleOk = async () => {
  const nameList = []
  if (!$props.details) {
    nameList.push('userName')
  }
  if (formState.value.nickName) {
    nameList.push('nickName')
  }

  formRef.value?.validate(nameList).then(async () => {
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
      <a-form-item label="用户名：" name="userName">
        <a-input v-model:value="formState.userName" :disabled="!!details" />
      </a-form-item>
      <a-form-item label="用户角色：" name="roles">
        <a-select
          v-model:value="formState.roles"
          mode="multiple"
          style="width: 100%"
          :field-names="{ label: 'name', value: 'id' }"
          placeholder="请选择用户角色"
          :options="roleTree"
        ></a-select>
      </a-form-item>
      <a-form-item label="用户昵称：" name="nickName">
        <a-input v-model:value="formState.nickName" />
      </a-form-item>
      <a-form-item label="是否禁用：" name="disabled">
        <a-switch v-model:checked="formState.disabled" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<style lang="scss" scoped></style>
