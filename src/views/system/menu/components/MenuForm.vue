<script lang="ts" setup>
import useFormValidate from '@/hooks/useFormValidate'
import { MENU_TYPES } from '@/constants'
import {
  validateMenuName,
  validateMenuPermission,
  validateMenuPath,
  validateMenuComponent,
  validateMenuRedirect
} from '@/utils/validate'

import type { IMenuParam } from '@/types/api/menu'
import type { IRule } from '@/types'

const { detail, loading } = defineProps<{ detail?: IMenuParam; loading?: boolean }>()
const $emits = defineEmits<{
  submit: [data: IMenuParam]
  cancel: []
}>()

const initFormData = (): IMenuParam => {
  return {
    pid: undefined,
    type: 'DIRECTORY',
    name: '',
    permission: '',
    disabled: false,
    hidden: false,
    cache: false,
    props: false,
    path: '',
    component: '',
    redirect: '',
    icon: '',
    sort: 0
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

const rules = computed(() => {
  const rule: IRule<IMenuParam> = {
    name: { required: true, validator: validateMenuName },
    permission: {
      required: formData.value.type === 'BUTTON',
      validator: validateMenuPermission
    }
  }

  if (formData.value.type !== 'BUTTON') {
    rule.path = { required: true, validator: validateMenuPath }
    rule.redirect = { required: false, validator: validateMenuRedirect }
    rule.component = { required: formData.value.type === 'MENU', validator: validateMenuComponent }
  }

  return rule
})

const { formRef, validateForm } = useFormValidate()
const onSubmit = async () => {
  if (!(await validateForm())) {
    return
  }

  let data: IMenuParam = {}
  switch (formData.value.type) {
    case 'BUTTON':
      data = {
        pid: formData.value.pid,
        type: formData.value.type,
        name: formData.value.name,
        disabled: formData.value.disabled,
        permission: formData.value.permission
      }
      break
    case 'DIRECTORY':
      data = {
        ...formData.value
      }
      delete data.props
      delete data.cache
      break
    default:
      data = { ...formData.value }
  }

  $emits('submit', data)
}

const onCancel = () => {
  $emits('cancel')
}
</script>

<template>
  <n-form ref="formRef" label-placement="left" label-width="100" :rules="rules" :model="formData">
    <n-form-item label="菜单类型" path="type">
      <n-radio-group
        v-model:value="formData.type"
        name="menu-type"
        :disabled="detail !== undefined"
      >
        <n-radio-button v-for="(v, k) in MENU_TYPES" :key="k" :value="k" :label="v" />
      </n-radio-group>
    </n-form-item>
    <n-form-item label="父菜单" path="pid">
      <menu-tree-select placeholder="请选择父菜单" v-model="formData.pid" />
    </n-form-item>
    <n-form-item label="菜单名称" path="name">
      <n-input v-model:value="formData.name" placeholder="请输入菜单名称" clearable />
    </n-form-item>
    <n-form-item label="权限标识" path="permission">
      <n-input v-model:value="formData.permission" placeholder="请输入权限标识" clearable />
    </n-form-item>

    <template v-if="formData.type !== 'BUTTON'">
      <n-form-item label="菜单图标" path="icon">
        <select-icon v-model="formData.icon" />
      </n-form-item>
      <n-form-item label="路由地址" path="path">
        <n-input v-model:value="formData.path" placeholder="请输入路由地址" clearable />
      </n-form-item>
      <n-form-item label="组件路径" path="component">
        <n-input v-model:value="formData.component" placeholder="请输入组件路径" clearable />
      </n-form-item>
      <n-form-item label="重定向地址" path="redirect">
        <n-input v-model:value="formData.redirect" placeholder="请输入重定向地址" clearable />
      </n-form-item>
      <n-form-item label="排序" path="sort">
        <n-input-number v-model:value="formData.sort" :max="99" :min="0" :precision="0" />
      </n-form-item>
    </template>

    <n-row :gutter="20">
      <n-col :span="12">
        <n-form-item label="是否禁用" path="disabled">
          <n-switch v-model:value="formData.disabled" />
        </n-form-item>
      </n-col>
      <n-col :span="12" v-show="formData.type !== 'BUTTON'">
        <n-form-item label="是否隐藏" path="hidden">
          <n-switch v-model:value="formData.hidden" />
        </n-form-item>
      </n-col>
    </n-row>
    <n-row :gutter="20" v-show="formData.type === 'MENU'">
      <n-col :span="12">
        <n-form-item label="是否缓存" path="cache">
          <n-switch v-model:value="formData.cache" />
        </n-form-item>
      </n-col>
      <n-col :span="12">
        <n-form-item label="是否携带参数" path="props">
          <n-switch v-model:value="formData.props" />
        </n-form-item>
      </n-col>
    </n-row>
    <n-form-item>
      <n-space style="width: 100%; justify-content: center">
        <n-button type="primary" :loading @click="onSubmit">提交</n-button>
        <n-button :disabled="loading" @click="onCancel">取消</n-button>
      </n-space>
    </n-form-item>
  </n-form>
</template>

<style lang="scss" scoped></style>
