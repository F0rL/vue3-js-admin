import { queryOptions } from '@tanstack/vue-query'
import { fetchRoleList, fetchRoleEntity } from './role.api'
import type { RoleListParams } from './role.types'

export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  details: () => [...roleKeys.all, 'detail'] as const,
}

export const roleQueries = {
  list: <T>(params?: T) =>
    queryOptions({
      queryKey: [...roleKeys.lists(), params] as const,
      queryFn: () => fetchRoleList(params as RoleListParams | undefined),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: [...roleKeys.details(), id] as const,
      queryFn: () => fetchRoleEntity(id),
      enabled: !!id,
    }),
}
