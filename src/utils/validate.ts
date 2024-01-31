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

export const validateMenuTitle = async (_rule: Rule, value: string) => {
  const regexp = /^[a-zA-Z\u4e00-\u9fa5]{2,16}$/
  if (!regexp.test(value)) {
    return Promise.reject(
      '请输入2至16位由中文、字母组成的名称'
    )
  }

  return Promise.resolve()
}

export const validateMenuPath = async (_rule: Rule, value: string) => {
  const regexp = /^[a-z/:]{2,30}$/
  if (!regexp.test(value)) {
    return Promise.reject(
      '请输入2至30位由小写字母、‘/’、‘:’组成的菜单路径'
    )
  }

  return Promise.resolve()
}

export const validateMenuComponent = async (_rule: Rule, value: string) => {
  const regexp = /^\/[a-zA-Z/.]{6,100}$/
  if (!regexp.test(value)) {
    return Promise.reject(
      '请输入6至100位由字母、‘/’、‘.’组成的组件路径，必须以’/‘开头(views文件夹下路径)'
    )
  }

  return Promise.resolve()
}

export const validateMenuPermission = async (_rule: Rule, value: string) => {
  const regexp = /^[a-z:]{1,50}$/
  if (!regexp.test(value)) {
    return Promise.reject(
      '请输入1至50位由字母、‘:’组成的菜单权限'
    )
  }

  return Promise.resolve()
}

export const validateMenuRedirect = async (_rule: Rule, value: string) => {
  const regexp = /^[a-zA-Z/0-9]{2,50}$/
  if (!regexp.test(value)) {
    return Promise.reject('请输入2至50位由小写字母、数字、‘/’组成的重定向地址')
  }

  return Promise.resolve()
}
