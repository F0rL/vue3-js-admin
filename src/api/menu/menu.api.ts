import { apiGet, apiPost } from '@/utils/http'
import type { MenuTreeNode, MenuPayload } from './menu.types'

export function fetchUserRightMenu(): Promise<unknown> {
  return apiPost('/SysMenu/GetUserRightMenu')
}

export function fetchMenuTree(params?: { searchKey?: string }) {
  return apiGet<MenuTreeNode[]>('/SysMenu/GetMenuTree', { params })
}

export function fetchMenuEntity(id: string) {
  return apiGet<MenuTreeNode>('/SysMenu/GetMenuEntity', { params: { id } })
}

export function fetchParentMenuAll() {
  return apiGet<MenuTreeNode[]>('/SysMenu/GetParentMenuAll')
}

export function createMenu(data: MenuPayload) {
  return apiPost('/SysMenu/CreateMenu', data)
}

export function updateMenu(data: MenuPayload) {
  return apiPost('/SysMenu/UpdateMenu', data)
}

export function deleteMenu(data: { ids: string[] }) {
  return apiPost('/SysMenu/DeleteMenu', data)
}
