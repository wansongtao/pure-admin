import { ALL_PERMISSION } from '@/config/index'

/**
 * 权限校验
 * @param permissions 你的权限组
 * @param needPerm 是否存在的权限
 * @returns
 */
export const checkAuth = (permissions: string[], needPerm: string) => {
  return permissions.some((v) => {
    if (v === ALL_PERMISSION || v === needPerm) {
      return true
    }

    return false
  })
}

/**
 * 角色校验
 * @param roles 你的角色组
 * @param role 是否存在的角色
 * @returns 
 */
export const checkRole = (roles: string[], role: string) => {
  return roles.some((v) => {
    return v === role ? true : false
  })
}
