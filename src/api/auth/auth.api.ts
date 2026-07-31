import { apiGet, apiPost } from '@/utils/http'
import type { LoginPayload, UserInfo } from './auth.types'

export function fetchCaptcha() {
  return apiGet<{ base64: string; key: string }>('/Auth/GetLoginVerCode')
}

export function fetchToken(data: LoginPayload) {
  return apiPost<string>('/Auth/GetTokenPC', data)
}

export function fetchUserInfo() {
  return apiGet<UserInfo>('/Auth/GetUserInfo')
}
