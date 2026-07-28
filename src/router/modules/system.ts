import type { RouteRecordRaw } from 'vue-router'

export default [
  {
    path: 'sys-user-list',
    name: 'SystemUserList',
    component: () => import('@/views/system/user/index.vue'),
    meta: { title: '账户管理', icon: 'User' },
  },
  {
    path: 'sys-user-edit',
    name: 'SystemUserEdit',
    component: () => import('@/views/system/user/edit.vue'),
    meta: { title: '账户编辑', icon: 'User', hidden: true },
  },
  {
    path: 'sys-log-list',
    name: 'SystemLogList',
    component: () => import('@/views/system/log/index.vue'),
    meta: { title: '日志管理', icon: 'Document' },
  },
  {
    path: 'sys-menu-list',
    name: 'SystemMenuList',
    component: () => import('@/views/system/menu/index.vue'),
    meta: { title: '菜单管理', icon: 'Menu' },
  },
  {
    path: 'sys-menu-edit',
    name: 'SystemMenuEdit',
    component: () => import('@/views/system/menu/edit.vue'),
    meta: { title: '菜单编辑', icon: 'Menu', hidden: true },
  },
  {
    path: 'sys-org-list',
    name: 'SystemOrgList',
    component: () => import('@/views/system/org/index.vue'),
    meta: { title: '组织架构', icon: 'List' },
  },
  {
    path: 'sys-org-add',
    name: 'SystemOrgAdd',
    component: () => import('@/views/system/org/add.vue'),
    meta: { title: '新增成员', icon: 'List', hidden: true },
  },
  {
    path: 'sys-org-edit',
    name: 'SystemOrgEdit',
    component: () => import('@/views/system/org/edit.vue'),
    meta: { title: '编辑成员', icon: 'List', hidden: true },
  },
  {
    path: 'sys-role-list',
    name: 'SystemRoleList',
    component: () => import('@/views/system/role/index.vue'),
    meta: { title: '角色管理', icon: 'Avatar' },
  },
] as RouteRecordRaw[]
