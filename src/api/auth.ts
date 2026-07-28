import http from '@/utils/http'
import type { ApiMethod } from '@/types/api'

/** PC 端账号密码登录表单 */
export interface LoginPayload {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
  /** 验证码（MD5 大写） */
  verifyCode: string
  /** 验证码 key */
  verifyKey: string
}

/** 登录用户信息 */

export interface role {
  id: string
  name: string
}
export interface UserInfo {
  /** 用户 ID */
  id: string
  /** 用户名称 */
  name: string
  /** 头像地址 */
  avatar: string
  /** 角色列表 */
  roles: role[]
}

export function getLoginVerCode(): ApiMethod<{
  base64: string
  key: string
}> {
  return http.Get('/Auth/GetLoginVerCode')
}

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
