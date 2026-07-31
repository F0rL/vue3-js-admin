export interface RoleEntity {
  id: string
  name: string
  isDelHandle?: boolean
  status: { value: number; text: string }
  menuList: { id: string; title: string }[]
  localUser: { id: string; name: string }[]
  workUser: { id: string; name: string }[]
  menuIdsJSON?: string
}

export interface RoleListItem {
  id: string
  name: string
}

export interface RoleListParams {
  pageIndex?: number
  pageSize?: number
}

export interface RolePayload {
  id?: string
  name: string
  status: number
  menuIds: string[]
  menuIdsJSON: string
}
