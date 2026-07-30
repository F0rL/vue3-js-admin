import { ref } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'
import DefaultLayout from '@/layouts/default/index.vue'
import { getUserRightMenu } from '@/api/sysMenu'
import { asyncRoutes } from '@/router'
import { collectMenuPaths, filterRoutes, getFirstVisiblePath } from '@/router/utils/filter'
import type { MenuItem } from '@/router/utils/filter'

const LAYOUT_ROUTE_NAME = 'Layout'

export const usePermissionStore = defineStore('permission', () => {
  const menuData = ref<MenuItem[]>([])
  const isRoutesLoaded = ref(false)

  async function generateRoutes() {
    const res = await getUserRightMenu().send()
    const menus = res.msg as MenuItem[]
    menuData.value = menus

    const allowedPaths = collectMenuPaths(menus)
    const filtered = filterRoutes(asyncRoutes, allowedPaths)
    const firstPath = getFirstVisiblePath(menus)
    router.addRoute({
      name: LAYOUT_ROUTE_NAME,
      path: '/',
      component: DefaultLayout,
      redirect: firstPath ? `/${firstPath}` : undefined,
      children: filtered,
    })
    isRoutesLoaded.value = true
  }

  function resetRoutes() {
    router.removeRoute(LAYOUT_ROUTE_NAME)
    isRoutesLoaded.value = false
    menuData.value = []
  }

  async function refreshMenu() {
    resetRoutes()
    await generateRoutes()
  }

  return {
    menuData,
    isRoutesLoaded,
    generateRoutes,
    resetRoutes,
    refreshMenu,
  }
})
