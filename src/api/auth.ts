import http from '@/utils/http'
import type { ApiMethod } from '@/types/api'

/** PC 端账号密码登录表单 */
export interface LoginPayload {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
}

/** 登录用户信息 */
export interface UserInfo {
  /** 用户 ID */
  id: string
  /** 用户名称 */
  name: string
  /** 头像地址 */
  avatar: string
  /** 角色列表 */
  roles: string[]
  /** 权限列表 */
  permissions: string[]
}

/**
 * PC 端账号密码登录，获取访问令牌
 *
 * 用法（配合 alova 的 Method 链式调用）：
 * ```js
 * const { msg } = await getTokenPC({ username, password }).send()
 * userStore.token = msg
 * ```
 */
export function getTokenPC(data: LoginPayload): ApiMethod<string> {
  return http.Post('/Auth/GetTokenPC', data)
}

/** 获取当前登录用户信息 */
export function getUserInfo(): ApiMethod<UserInfo> {
  return http.Get('/Auth/GetUserInfo')
}

/** 退出登录 */
export function logout(): ApiMethod<unknown> {
  return http.Post('/Auth/logout')
}
