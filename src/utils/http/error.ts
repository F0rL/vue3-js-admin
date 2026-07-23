import { message } from '@/utils/feedback'
import type { AxiosError } from 'axios'

/* ============ 业务错误码常量 ============ */
export const ERROR_CODES = {
  INVALID_TOKEN: 50008, // 非法 token
  TOKEN_EXPIRED: 50012, // token 过期
  TOKEN_KICKED: 50014, // 被踢下线
}

/* ============ HTTP 状态码 → 友好提示 ============ */
const HTTP_STATUS_MESSAGES: Record<number, string> = {
  400: '请求参数有误',
  403: '没有操作权限',
  404: '请求的资源不存在',
  405: '请求方法不允许',
  408: '请求超时',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
}

/* ============ 业务码判定 ============ */
const AUTH_ERROR_CODES = new Set([
  ERROR_CODES.INVALID_TOKEN,
  ERROR_CODES.TOKEN_EXPIRED,
  ERROR_CODES.TOKEN_KICKED,
])

export function isSuccess(res: ApiResponse<unknown>): boolean {
  return res.code === 0
}

/* ============ 路径一：HTTP 200 但业务码异常 ============ */
export function handleBusinessError(res: ApiResponse<unknown>) {
  const { code, msg } = res
  message.error(msg ? String(msg) : '请求失败')

  if (AUTH_ERROR_CODES.has(code)) {
    message.error('登录已过期，请重新登录')
    window.location.href = '/login'
  }
}

/* ============ 路径二-A：HTTP 4xx/5xx（有响应体） ============ */
export function handleHttpError(error: AxiosError<ApiResponse<unknown>>) {
  const status = error.response?.status
  const serverMsg = error.response?.data?.msg

  if (status === 401) {
    message.error('登录已过期，请重新登录')
    window.location.href = '/login'
    return
  }

  const fallback = status !== undefined ? `请求失败 (${status})` : '请求失败'
  const serverMsgText = serverMsg ? String(serverMsg) : ''
  const statusMsg = status ? HTTP_STATUS_MESSAGES[status] : ''
  const msg = serverMsgText || statusMsg || fallback
  message.error(msg)
}

/* ============ 路径二-B：网络层错误（无响应体） ============ */
export function handleNetworkError(error: any) {
  if (error?.response) {
    // 有响应体 → HTTP 4xx/5xx
    handleHttpError(error)
  } else if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
    message.error('请求超时，请稍后重试')
  } else {
    message.error(error?.message ? String(error.message) : '网络连接失败，请检查网络')
  }
}
