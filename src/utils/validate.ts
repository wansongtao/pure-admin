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
