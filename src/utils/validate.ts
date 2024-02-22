import type { Rule } from 'ant-design-vue/es/form'

export const validateUsername = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请输入用户名')
  }

  const regexp = /^[a-zA-Z][a-zA-Z0-9]{4,10}$/
  if (!regexp.test(value)) {
    return Promise.reject('请输入5至11位由字母、数字组成的用户名（字母开头）！')
  }

  return Promise.resolve()
}

export const validatePassword = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请输入密码')
  }

  const regexp = /^[a-zA-Z](?=.*[.?!&_])(?=.*\d)[a-zA-Z\d.?!&_]{5,15}$/
  if (!regexp.test(value)) {
    return Promise.reject(
      '请输入6至16位由字母、数字、.?!&_特殊字符组成的密码(字母开头，必须包含字母、数字、特殊字符)'
    )
  }

  return Promise.resolve()
}

export const validateMenuTitle = async (rule: Rule, value: string) => {
  if (!rule.required && value === '') {
    return Promise.resolve()
  }

  const regexp = /^[a-zA-Z\u4e00-\u9fa5]{2,16}$/
  if (!regexp.test(value)) {
    return Promise.reject('请输入2至16位由中文、字母组成的名称')
  }

  return Promise.resolve()
}

export const validateMenuPath = async (rule: Rule, value: string) => {
  if (!rule.required && value === '') {
    return Promise.resolve()
  }

  const regexp = /^[a-z/:]{2,30}$/
  if (!regexp.test(value)) {
    return Promise.reject('请输入2至30位由小写字母、‘/’、‘:’组成的菜单路径')
  }

  return Promise.resolve()
}

export const validateMenuComponent = async (rule: Rule, value: string) => {
  if (!rule.required && value === '') {
    return Promise.resolve()
  }

  const regexp = /^\/[a-zA-Z/.]{6,100}$/
  if (!regexp.test(value)) {
    return Promise.reject(
      '请输入6至100位由字母、‘/’、‘.’组成的组件路径，必须以’/‘开头(views文件夹下路径)'
    )
  }

  return Promise.resolve()
}

export const validateMenuPermission = async (rule: Rule, value: string) => {
  if (!rule.required && value === '') {
    return Promise.resolve()
  }

  const regexp = /^[a-z:]{1,50}$/
  if (!regexp.test(value)) {
    return Promise.reject('请输入1至50位由字母、‘:’组成的菜单权限')
  }

  return Promise.resolve()
}

export const validateMenuRedirect = async (rule: Rule, value: string) => {
  if (!rule.required && value === '') {
    return Promise.resolve()
  }

  const regexp = /^[a-z/0-9]{2,50}$/
  if (!regexp.test(value)) {
    return Promise.reject('请输入2至50位由小写字母、数字、‘/’组成的重定向地址')
  }

  return Promise.resolve()
}

export const validateRoleName = async (rule: Rule, value: string) => {
  if (!rule.required && value === '') {
    return Promise.resolve()
  }

  const regexp = /^[a-zA-Z0-9_-]{1,50}$/
  if (!regexp.test(value)) {
    return Promise.reject('请输入1至50位由字母、数字、‘_-’组成的角色标识')
  }

  return Promise.resolve()
}

export const validateRoleNickName = async (rule: Rule, value: string) => {
  if (!rule.required && value === '') {
    return Promise.resolve()
  }

  const regexp = /^[a-zA-Z\u4e00-\u9fa5']{1,50}$/
  if (!regexp.test(value)) {
    return Promise.reject('请输入1至50位由中英文组成的角色昵称')
  }

  return Promise.resolve()
}

export const validateRoleDescription = async (rule: Rule, value: string) => {
  if (!rule.required && value === '') {
    return Promise.resolve()
  }

  const regexp = /^[a-zA-Z\u4e00-\u9fa5'-]{1,150}$/
  if (!regexp.test(value)) {
    return Promise.reject('请输入1至150位由中英文组成的角色描述')
  }

  return Promise.resolve()
}

export const validateNickName = async (rule: Rule, value: string) => {
  if (!rule.required && value === '') {
    return Promise.resolve()
  }

  const regexp = /^[a-zA-Z\u4e00-\u9fa5']{1,50}$/
  if (!regexp.test(value)) {
    return Promise.reject('请输入1至50位由中英文组成的昵称')
  }

  return Promise.resolve()
}

export const validatePhone = async (rule: Rule, value: string) => {
  if (!rule.required && value === '') {
    return Promise.resolve()
  }

  const regexp = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
  if (!regexp.test(value)) {
    return Promise.reject('手机号格式错误')
  }

  return Promise.resolve()
}

export const validateEmail = async (rule: Rule, value: string) => {
  if (!rule.required && value === '') {
    return Promise.resolve()
  }

  const regexp = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  if (!regexp.test(value)) {
    return Promise.reject('邮箱格式错误')
  }

  return Promise.resolve()
}
