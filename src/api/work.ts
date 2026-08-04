import { apiGet } from '@/utils/http'

// ==================== Types ====================

/** 组织树节点（部门 type=1 / 用户 type=2） */
export interface OrgTreeNode {
  id: string
  name: string
  type: number
  isLeaf?: boolean
  children?: OrgTreeNode[]
}

/** 关联的企业微信用户详情 */
export interface WorkUserEntity {
  name: string
  userid: string
  mobile?: string
  avatar?: string
  department?: number[]
  departmentNames?: string[]
}

// ==================== API Functions ====================

/**
 * 获取组织架构树（部门/用户）
 * @param departmentId 部门 id，0 表示根节点
 * @param searchKey 按姓名/工号搜索
 * @param type 0 全部 / 1 部门 / 2 用户
 */
export function fetchOrgTree(params: {
  departmentId: number
  searchKey?: string
  type?: number
}) {
  return apiGet<OrgTreeNode[]>('/WeiXinWork/GetOrgTree', { params })
}

/** 获取企业微信用户详情（关联人员时自动填充账号信息） */
export function fetchWorkUserEntity(params: { userId: string }) {
  return apiGet<WorkUserEntity>('/WeiXinWork/GetUserEntity', { params })
}
