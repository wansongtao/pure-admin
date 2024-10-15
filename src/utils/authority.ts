import { ALL_PERMISSION } from '@/constants/index'

/**
 *
 * @param permissions 拥有的权限组
 * @param needPerm 需要的权限
 * @returns
 */
export const hasPermission = (permissions: string[], needPerm: string) => {
  return permissions.some((v) => {
    return v === ALL_PERMISSION || v === needPerm
  })
}

/**
 *
 * @param permissions 拥有的权限组
 * @param needPermissions 需要的权限(组)
 * @param or 默认 false，false => 全部有  true => 有一个即可
 * @returns
 */
export const hasPermissions = (
  permissions: string[],
  needPermissions: string | string[],
  or = false
) => {
  if (typeof needPermissions === 'string') {
    return hasPermission(permissions, needPermissions)
  }

  if (or) {
    return needPermissions.some((v) => {
      return hasPermission(permissions, v)
    })
  }

  return needPermissions.every((v) => {
    return hasPermission(permissions, v)
  })
}

/**
 *
 * @param roles 拥有的角色组
 * @param needRole 需要的角色
 * @returns
 */
export const hasRole = (roles: string[], needRole: string) => {
  return roles.some((v) => {
    return v === needRole
  })
}

/**
 *
 * @param roles 拥有的角色组
 * @param needRoles 需要的角色(组)
 * @param or 默认 false，false => 全部有  true => 有一个即可
 * @returns
 */
export const hasRoles = (roles: string[], needRoles: string | string[], or = false) => {
  if (typeof needRoles === 'string') {
    return hasRole(roles, needRoles)
  }

  if (or) {
    return needRoles.some((v) => {
      return hasRole(roles, v)
    })
  }

  return needRoles.every((v) => {
    return hasRole(roles, v)
  })
}
