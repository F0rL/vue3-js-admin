import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import { useUserStore } from '@/stores/modules/user'
import { config } from '@/config'

import DefaultLayout from '@/layouts/default/index.vue'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    hidden?: boolean
    affix?: boolean
  }
}

export const constantRoutes: RouteRecordRaw[] = [
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

export const asyncRoutes: RouteRecordRaw[] = [
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
  { path: '/:pathMatch(.*)*', redirect: '/404', meta: { hidden: true } },
]

const router = createRouter({
  history: createWebHistory(config.BASE_URL),
  routes: [...constantRoutes, ...asyncRoutes],
  scrollBehavior: () => ({ top: 0 }),
})

const whiteList = ['/login']

router.beforeEach(async to => {
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
