import type { RouteRecordRaw } from 'vue-router'

export default [
  {
    path: 'sys-user-list',
    name: 'SystemUserList',
    component: () => import('@/views/system/user/index.vue'),
    meta: { title: '账户管理' },
  },
  {
    path: 'sys-log-list',
    name: 'SystemLogList',
    component: () => import('@/views/system/log/index.vue'),
    meta: { title: '日志管理' },
  },
  {
    path: 'sys-menu-list',
    name: 'SystemMenuList',
    component: () => import('@/views/system/menu/index.vue'),
    meta: { title: '菜单管理' },
  },

  {
    path: 'sys-org-list',
    name: 'SystemOrgList',
    component: () => import('@/views/system/org/index.vue'),
    meta: { title: '组织架构' },
  },
  {
    path: 'sys-org-add',
    name: 'SystemOrgAdd',
    component: () => import('@/views/system/org/add.vue'),
    meta: { title: '新增成员', hidden: true },
  },
  {
    path: 'sys-org-edit',
    name: 'SystemOrgEdit',
    component: () => import('@/views/system/org/edit.vue'),
    meta: { title: '编辑成员', hidden: true },
  },
  {
    path: 'sys-role-list',
    name: 'SystemRoleList',
    component: () => import('@/views/system/role/index.vue'),
    meta: { title: '角色管理' },
  },
] as RouteRecordRaw[]
