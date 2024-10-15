import type { FormItemRule } from 'naive-ui'

export const validateUsername = (_rule: any, value: string) => {
  if (!value) {
    return new Error('请输入用户名')
  }

  const regexp = /^[a-zA-Z][a-zA-Z0-9]{2,10}$/
  if (!regexp.test(value)) {
    return new Error('请输入3至11位由字母、数字组成的用户名(字母开头)')
  }

  return true
}

export const validatePassword = (_rule: any, value: string) => {
  if (!value) {
    return new Error('请输入密码')
  }

  const regexp = /^[a-zA-Z](?=.*[.?!&_])(?=.*\d)[a-zA-Z\d.?!&_]{5,15}$/
  if (!regexp.test(value)) {
    return new Error(
      '请输入6至16位由字母、数字、.?!&_特殊字符组成的密码(字母开头，必须包含字母、数字、特殊字符)'
    )
  }

  return true
}

export const validateMenuName = (_rule: any, value: string) => {
  const regexp = /^[a-zA-Z\u4e00-\u9fa5]{2,16}$/
  if (!regexp.test(value)) {
    return new Error('请输入2至16位由字母、汉字组成的菜单名称')
  }

  return true
}

export const validateMenuPermission = (rule: FormItemRule, value: string) => {
  if (!value && !rule.required) {
    return true
  }

  const regexp = /^[a-z:]{1,50}$/
  if (!regexp.test(value)) {
    return new Error('请输入1至50位由小写字母、:组成的权限标识')
  }

  return true
}

export const validateMenuPath = (rule: FormItemRule, value: string) => {
  if (!rule.required && !value) {
    return true
  }

  if (value.length > 50 || value.length < 2) {
    return new Error('请输入2至50位路由地址')
  }

  const regexp = /^\/?([a-zA-Z]+)(\/[a-zA-Z]+|\/:[a-zA-Z]+)*$/
  if (!regexp.test(value)) {
    return new Error('请输入由字母、‘/’、‘:’组成的路径')
  }

  return true
}

export const validateMenuComponent = (rule: FormItemRule, value: string) => {
  if (!rule.required && !value) {
    return true
  }

  if (value.length > 100 || value.length < 6) {
    return new Error('请输入6至100位组件路径')
  }

  const regexp = /^(\/[a-zA-Z]+[-_]?[a-zA-Z]+)+(.vue|.tsx|.jsx)$/
  if (!regexp.test(value)) {
    return new Error('请输入由字母、‘/’、‘-’、‘_’、‘.’组成的组件路径')
  }

  return true
}

export const validateMenuRedirect = (_rule: any, value: string) => {
  if (!value) {
    return true
  }

  if (value.length > 50 || value.length < 2) {
    return new Error('请输入2至50位由小写字母、数字、‘/’组成的重定向地址')
  }

  const regexp = /^(\/?[a-zA-Z0-9]+)+$/
  if (!regexp.test(value)) {
    return new Error('请输入2至50位由小写字母、数字、‘/’组成的重定向地址')
  }

  return true
}

export const validateRoleName = (_rule: any, value: string) => {
  const regexp = /^[a-zA-Z0-9._-]{1,50}$/
  if (!regexp.test(value)) {
    return new Error('请输入1至50位由字母、数字、‘._-’组成的角色名称')
  }

  return true
}

export const validateEmoji = (_rule: any, value: string) => {
  const regexp =
    /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g

  if (regexp.test(value)) {
    return new Error('不支持输入表情符号')
  }

  return true
}

export const validateNickName = (rule: FormItemRule, value: string) => {
  if (!rule.required && !value) {
    return true
  }

  const regexp = /^[a-zA-Z\u4e00-\u9fa5']{1,50}$/
  if (!regexp.test(value)) {
    return new Error('请输入1至50位由中英文组成的昵称')
  }

  return true
}

export const validatePhone = (rule: FormItemRule, value: string) => {
  if (!rule.required && !value) {
    return true
  }

  const regexp = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
  if (!regexp.test(value)) {
    return new Error('手机号格式错误')
  }

  return true
}

export const validateEmail = (rule: FormItemRule, value: string) => {
  if (!rule.required && !value) {
    return true
  }

  const regexp = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  if (!regexp.test(value)) {
    return new Error('邮箱格式错误')
  }

  return true
}
