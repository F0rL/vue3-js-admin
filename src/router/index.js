import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import { useUserStore } from '@/stores/modules/user'
import { config } from '@/config'

import DefaultLayout from '@/layouts/default/index.vue'

export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { hidden: true, title: '登录' },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: { hidden: true, title: '404' },
  },
]

export const asyncRoutes = [
  {
    path: '/',
    component: DefaultLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'HomeFilled', affix: true },
      },
    ],
  },
  {
    path: '/system',
    component: DefaultLayout,
    redirect: '/system/user',
    meta: { title: '系统管理', icon: 'Setting' },
    children: [
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/system/user.vue'),
        meta: { title: '用户管理', icon: 'User' },
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/system/role.vue'),
        meta: { title: '角色管理', icon: 'Avatar' },
      },
    ],
  },
  {
    path: '/example',
    component: DefaultLayout,
    redirect: '/example/table',
    meta: { title: '示例页面', icon: 'Document' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/example/table.vue'),
        meta: { title: '综合表格', icon: 'Grid' },
      },
      {
        path: 'form',
        name: 'Form',
        component: () => import('@/views/example/form.vue'),
        meta: { title: '综合表单', icon: 'Edit' },
      },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/404', meta: { hidden: true } },
]

const router = createRouter({
  history: createWebHistory(config.BASE_URL),
  routes: [...constantRoutes, ...asyncRoutes],
  scrollBehavior: () => ({ top: 0 }),
})

const whiteList = ['/login']

router.beforeEach(async (to, from) => {
  NProgress.start()
  // document.title = to.meta.title ? `${to.meta.title} - Admin` : 'Admin Template'
  const userStore = useUserStore()
  const hasToken = !!userStore.token

  if (hasToken) {
    if (to.path === '/login') {
      return { path: '/' }
    }
    if (!userStore.userInfo.name) {
      try {
        await userStore.fetchUserInfo()
        return { ...to, replace: true }
      } catch {
        userStore.resetToken()
        return `/login?redirect=${to.path}`
      }
    }
    return
  }

  if (whiteList.includes(to.path)) {
    return
  }
  return `/login?redirect=${to.path}`
})

router.afterEach(() => {
  NProgress.done()
})

export default router
