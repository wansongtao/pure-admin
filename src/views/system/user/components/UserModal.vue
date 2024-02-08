<script lang="ts" setup>
import UploadAvatar from '@/components/UploadAvatar/index.vue'

import { useRoleTree } from '@/hooks/useRoleTree'
import { validateUsername, validateNickName } from '@/utils/validate'

import type { IUserEdit } from '@/types/api/user'
import type { Rule } from 'ant-design-vue/es/form'
import type { FormInstance } from 'ant-design-vue'

type IUserInfo = IUserEdit & { userName?: string }

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
  onOk: [data: IUserInfo]
}>()

const open = defineModel<boolean>()

const { roleTree, fetchRoleTree } = useRoleTree(false)
watch(open, (val) => {
  if (!val) {
    return
  }

  fetchRoleTree()
})

const rules: Record<string, Rule[]> = {
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
const createState = (): IUserInfo => {
  return {
    userName: '',
    nickName: '',
    roles: [],
    disabled: false,
    avatar: ''
  }
}

const formState = ref<IUserInfo>(createState())
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

const uploadRef = ref<InstanceType<typeof UploadAvatar>>()

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
    if (formState.value.avatar && formState.value.avatar !== $props.details?.avatar) {
      await uploadRef.value?.handleUpload()
    }

    const data = { ...formState.value }
    $emits('onOk', data)
  })
}

defineExpose({
  resetForm
})
</script>

<template>
  <a-modal :open="open" :title="title" @cancel="handleCancel" @ok="handleOk">
    <a-form
      ref="formRef"
      :model="formState"
      autocomplete="off"
      :label-col="{ span: 5 }"
      :wrapper-col="{ span: 19 }"
      :rules="rules"
    >
      <a-form-item label="用户头像：" name="avatar">
        <upload-avatar ref="uploadRef" v-model:img-url="formState.avatar" />
      </a-form-item>
      <a-form-item label="用户名：" name="userName">
        <a-input v-model:value="formState.userName" :readonly="!!details" />
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
