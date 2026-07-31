import { queryOptions } from '@tanstack/vue-query'
import {
  fetchUserRightMenu,
  fetchMenuTree,
  fetchMenuEntity,
  fetchParentMenuAll,
} from './menu.api'

export const menuKeys = {
  all: ['menus'] as const,
  trees: () => [...menuKeys.all, 'tree'] as const,
  details: () => [...menuKeys.all, 'detail'] as const,
  parents: () => [...menuKeys.all, 'parents'] as const,
  userRights: () => [...menuKeys.all, 'userRights'] as const,
}

export const menuQueries = {
  userRights: () =>
    queryOptions({
      queryKey: menuKeys.userRights(),
      queryFn: fetchUserRightMenu,
      staleTime: 5 * 60 * 1000,
    }),
  tree: <T>(params?: T) =>
    queryOptions({
      queryKey: [...menuKeys.trees(), params] as const,
      queryFn: () => fetchMenuTree(params as { searchKey?: string } | undefined),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: [...menuKeys.details(), id] as const,
      queryFn: () => fetchMenuEntity(id),
      enabled: !!id,
    }),
  parentAll: () =>
    queryOptions({
      queryKey: menuKeys.parents(),
      queryFn: fetchParentMenuAll,
    }),
}
