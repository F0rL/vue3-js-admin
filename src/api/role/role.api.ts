import { apiGet, apiGetList, apiPost } from '@/utils/http'
import type { RoleEntity, RoleListItem, RoleListParams, RolePayload } from './role.types'

export function fetchRoleList(params?: RoleListParams) {
  return apiGetList<RoleListItem>('/SysRole/GetRoleList', { params })
}

export function fetchRoleEntity(id: string) {
  return apiGet<RoleEntity>('/SysRole/GetRoleEntity', { params: { id } })
}

export function createRole(data: RolePayload) {
  return apiPost('/SysRole/CreateRole', data)
}

export function updateRole(data: RolePayload) {
  return apiPost('/SysRole/UpdateRole', data)
}

export function deleteRole(data: { ids: string[] }) {
  return apiPost('/SysRole/DeleteRole', data)
}
