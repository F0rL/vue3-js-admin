export interface MenuTreeNode {
  id: string
  title: string
  path?: string
  icon?: string
  order?: number
  createTime?: string
  isMenuShow?: boolean
  _disabled?: boolean
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
  parentId: string | null
}
