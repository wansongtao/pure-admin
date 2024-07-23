<script lang="ts" setup>
import SelectIcon from './SelectIcon.vue'

import { useMenuTree } from '@/hooks/useMenuTree'
import { MENU_TYPES } from '@/constants/index'
import { convertObjectToArray } from '@/utils/index'
import {
  validateMenuTitle,
  validateMenuPath,
  validateMenuComponent,
  validateMenuPermission,
  validateMenuRedirect
} from '@/utils/validate'

import type { IMenuParam } from '@/types/api/menu'
import type { Rule } from 'ant-design-vue/es/form'
import type { FormInstance } from 'ant-design-vue'

const $props = withDefaults(
  defineProps<{
    id?: number
    title?: string
    details?: IMenuParam
  }>(),
  {
    title: '新增菜单'
  }
)
const loading = defineModel<boolean>('loading', { default: false })

const menuTypes = convertObjectToArray(MENU_TYPES)
const { menuTree, fetchMenuTree } = useMenuTree((data) => {
  return {
    label: data.name,
    value: data.id,
    disabled: data.type === 'BUTTON' || data.id === $props.id
  }
}, false)

const open = defineModel<boolean>()
watch(open, (val) => {
  if (val) {
    fetchMenuTree()
  }
})

const rules: { [key in keyof IMenuParam]: Rule[] } = {
  name: [
    {
      required: true,
      validator: validateMenuTitle
    }
  ],
  path: [
    {
      required: true,
      validator: validateMenuPath
    }
  ],
  permission: [
    {
      required: false,
      validator: validateMenuPermission,
      trigger: 'change'
    }
  ],
  redirect: [
    {
      required: false,
      validator: validateMenuRedirect,
      trigger: 'change'
    }
  ],
  component: [
    {
      required: false,
      validator: validateMenuComponent,
      trigger: 'change'
    }
  ]
}
const createState = (): IMenuParam => {
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

const formState = ref<IMenuParam>(createState())
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
  verifySuccess: [data: IMenuParam]
}>()
const handleCancel = () => {
  resetForm()
  open.value = false
  $emits('onCancel')
}
const handleOk = async () => {
  const nameList = ['title']
  if (formState.value.type !== 'BUTTON') {
    nameList.push('path')
  }
  if (formState.value.type === 'MENU' || formState.value.component) {
    nameList.push('component')
  }
  if (formState.value.permission || formState.value.type === 'BUTTON') {
    nameList.push('permission')
  }
  if (formState.value.redirect) {
    nameList.push('redirect')
  }

  formRef.value?.validate(nameList).then(() => {
    let data: IMenuParam = {}
    switch (formState.value.type) {
      case 'BUTTON':
        data = {
          pid: formState.value.pid,
          type: formState.value.type,
          name: formState.value.name,
          disabled: formState.value.disabled,
          permission: formState.value.permission
        }
        break
      case 'DIRECTORY':
        data = {
          ...formState.value
        }
        delete data.props
        delete data.cache
        break
      default:
        data = { ...formState.value }
    }

    $emits('verifySuccess', data)
  })
}

defineExpose({
  resetForm
})
</script>

<template>
  <div class="menu_modal">
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
        <a-form-item label="父级菜单：" name="pid">
          <a-tree-select
            v-model:value="formState.pid"
            show-search
            style="width: 100%"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="请选择父菜单"
            allow-clear
            :tree-data="menuTree"
            tree-node-filter-prop="label"
          />
        </a-form-item>
        <a-form-item label="菜单类型：" name="typeId">
          <a-radio-group v-model:value="formState.type" :disabled="details !== undefined">
            <a-radio v-for="item in menuTypes" :value="item.value" :key="item.value">
              {{ item.label }}
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="菜单名称：" name="name">
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="菜单权限：" name="permission" :required="formState.type === 'BUTTON'">
          <a-input v-model:value="formState.permission" />
        </a-form-item>

        <template v-if="formState.type !== 'BUTTON'">
          <a-form-item label="菜单图标：" name="icon">
            <select-icon v-model="formState.icon" />
          </a-form-item>
          <a-form-item label="菜单路径：" name="path">
            <a-input v-model:value="formState.path" />
          </a-form-item>
          <a-form-item label="组件路径：" name="component" :required="formState.type === 'MENU'">
            <a-input v-model:value="formState.component" />
          </a-form-item>
          <a-form-item label="重定向地址：" name="redirect">
            <a-input v-model:value="formState.redirect" />
          </a-form-item>
          <a-form-item label="排序：" name="sort">
            <a-input-number
              v-model:value="formState.sort"
              :min="0"
              :max="255"
              style="width: 100%"
            />
          </a-form-item>
        </template>
        <a-row :gutter="20">
          <a-col :span="12">
            <a-form-item :label-col="{ span: 10 }" label="是否禁用：" name="disabled">
              <a-switch v-model:checked="formState.disabled" />
            </a-form-item>
          </a-col>
          <a-col :span="12" v-if="formState.type !== 'BUTTON'">
            <a-form-item :label-col="{ span: 10 }" label="是否隐藏：" name="hidden">
              <a-switch v-model:checked="formState.hidden" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row v-if="formState.type === 'MENU'" :gutter="20">
          <a-col :span="12">
            <a-form-item :label-col="{ span: 10 }" label="是否缓存：" name="cache">
              <a-switch v-model:checked="formState.cache" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :label-col="{ span: 10 }" label="路由传参：" name="props">
              <a-tooltip title="是否开启路由的布尔模式传参">
                <a-switch v-model:checked="formState.props" />
              </a-tooltip>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<style lang="scss" scoped></style>
