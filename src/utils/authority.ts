import { ALL_PERMISSION } from '@/config/index'

/**
 * 权限校验
 * @param permissions 拥有的权限组
 * @param needPerm 是否有的权限
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
 *
 * @param permissions 拥有的权限组
 * @param needPermissions 是否有的权限/组
 * @param or 默认false，false => 全部有  true => 有一个即可
 * @returns
 */
export const hasPermissions = (
  permissions: string[],
  needPermissions: string | string[],
  or = false
) => {
  if (typeof needPermissions === 'string') {
    return checkAuth(permissions, needPermissions)
  }

  if (or) {
    return needPermissions.some((v) => {
      return checkAuth(permissions, v)
    })
  }

  return needPermissions.every((v) => {
    return checkAuth(permissions, v)
  })
}

/**
 * 角色校验
 * @param roles 拥有的角色组
 * @param needRole 是否有的角色
 * @returns
 */
export const checkRole = (roles: string[], needRole: string) => {
  return roles.some((v) => {
    return v === needRole ? true : false
  })
}

/**
 *
 * @param roles 拥有的角色组
 * @param needRoles 是否有的角色/组
 * @param or 默认false，false => 全部有  true => 有一个即可
 * @returns
 */
export const hasRoles = (roles: string[], needRoles: string | string[], or = false) => {
  if (typeof needRoles === 'string') {
    return checkRole(roles, needRoles)
  }

  if (or) {
    return needRoles.some((v) => {
      return checkRole(roles, v)
    })
  }

  return needRoles.every((v) => {
    return checkRole(roles, v)
  })
}
