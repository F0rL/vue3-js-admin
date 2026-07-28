import type { RouteRecordRaw } from 'vue-router'

export default [
  {
    path: 'dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/index.vue'),
    meta: { title: '首页', icon: 'HomeFilled' },
  },
] as RouteRecordRaw[]
