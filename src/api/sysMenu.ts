import http from '@/utils/http'
import type { ApiMethod } from '@/types/api'

/** 获取当前用户有权限的菜单 */
export function getUserRightMenu(data?: Record<string, unknown>): ApiMethod<unknown> {
  return http.Post('/SysMenu/GetUserRightMenu', data)
}
