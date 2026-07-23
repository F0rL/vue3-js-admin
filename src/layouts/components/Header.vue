<template>
  <div class="h-14 px-4 flex items-center justify-between bg-white border-b border-slate-200/80">
    <div class="flex items-center gap-3">
      <div
        class="flex items-center justify-center p-2 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer"
        @click="appStore.toggleSidebar()"
      >
        <el-icon :size="16">
          <component :is="appStore.sidebarOpened ? iconMap.Fold : iconMap.Expand" />
        </el-icon>
      </div>

      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path" :to="item.path">
          {{ item.meta?.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="flex items-center gap-1">
      <el-dropdown trigger="click">
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
          <el-avatar :size="32" class="bg-blue-500! text-white!">
            {{ userStore.userInfo?.name?.charAt(0)?.toUpperCase() || 'U' }}
          </el-avatar>
          <span class="text-sm font-medium text-slate-700">
            {{ userStore.userInfo?.name || 'Admin' }}
          </span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="router.push('/')">
              <el-icon><component :is="iconMap.HomeFilled" /></el-icon>
              <span>首页</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">
              <el-icon><component :is="iconMap.SwitchButton" /></el-icon>
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/modules/app'
import { useUserStore } from '@/stores/modules/user'
import { confirm } from '@/utils/feedback'
import iconMap from '@/icons'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const breadcrumbs = computed(() =>
  route.matched.filter(item => item.meta?.title)
)

async function handleLogout() {
  if (await confirm('确定要退出登录吗？')) {
    await userStore.logout()
    await router.push('/login')
  }
}
</script>
