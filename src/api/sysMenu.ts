import http from '@/utils/http'
import type { ApiMethod } from '@/types/api'

export interface MenuTreeNode {
  id: string
  title: string
  path?: string
  icon?: string
  order?: number
  isMenuShow?: boolean
  status?: { value: number } | number
  parent?: { id: string } | null
  sysFile?: { sysFileId: string; url: string }
  children?: MenuTreeNode[]
}

export interface MenuPayload {
  id?: string
  title: string
  path?: string
  icon?: string
  order: number
  isMenuShow: boolean
  status: number
  parentId: string | null
}

export interface MenuListParams {
  searchKey?: string
  page?: number
  row?: number
}

export function getUserRightMenu(data?: Record<string, unknown>): ApiMethod<unknown> {
  return http.Post('/SysMenu/GetUserRightMenu', data)
}

export function getMenuList(params?: MenuListParams): ApiMethod<MenuTreeNode[]> {
  return http.Get('/SysMenu/GetMenuList', { params })
}

export function getMenuTree(params?: { searchKey?: string }): ApiMethod<MenuTreeNode[]> {
  return http.Get('/SysMenu/GetMenuTree', { params })
}

export function getMenuEntity(params: { id: string }): ApiMethod<MenuTreeNode> {
  return http.Get('/SysMenu/GetMenuEntity', { params })
}

export function getParentMenuAll(): ApiMethod<MenuTreeNode[]> {
  return http.Get('/SysMenu/GetParentMenuAll')
}

export function createMenu(data: MenuPayload): ApiMethod<unknown> {
  return http.Post('/SysMenu/CreateMenu', data)
}

export function updateMenu(data: MenuPayload): ApiMethod<unknown> {
  return http.Post('/SysMenu/UpdateMenu', data)
}

export function deleteMenu(data: { ids: string[] }): ApiMethod<unknown> {
  return http.Post('/SysMenu/DeleteMenu', data)
}
