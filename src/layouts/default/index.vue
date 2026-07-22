<template>
  <div class="h-screen w-screen flex bg-gray-100">
    <!-- Sidebar -->
    <aside
      class="h-full flex flex-col bg-white border-r border-gray-200 transition-all duration-300"
      :class="sidebarWidthClass"
    >
      <Logo />
      <Sidebar />
    </aside>

    <!-- Right content -->
    <div class="flex-1 flex flex-col min-w-0">
      <Header />
      <main class="flex-1 overflow-auto p-4">
        <router-view v-slot="{ Component, route: r }">
          <transition name="fade-slide" mode="out-in">
            <div :key="r.fullPath">
              <component :is="Component" />
            </div>
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '@/stores/modules/app'
import Logo from '../components/Logo.vue'
import Sidebar from '../components/Sidebar.vue'
import Header from '../components/Header.vue'

const appStore = useAppStore()

const sidebarWidthClass = computed(() => {
  if (!appStore.sidebarOpened) return 'w-0 overflow-hidden'
  return appStore.sidebarIconOnly ? 'w-16' : 'w-56'
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
