<template>
  <template v-if="!item.meta?.hidden">
    <!-- Single child or no children -->
    <el-menu-item v-if="!hasVisibleChildren" :index="fullPath">
      <el-icon v-if="item.meta?.icon && iconMap[item.meta.icon]">
        <component :is="iconMap[item.meta.icon]" />
      </el-icon>
      <template #title>
        <span class="font-medium">{{ item.meta?.title }}</span>
      </template>
    </el-menu-item>

    <!-- Has children -->
    <el-sub-menu v-else :index="fullPath">
      <template #title>
        <el-icon v-if="item.meta?.icon && iconMap[item.meta.icon]">
          <component :is="iconMap[item.meta.icon]" />
        </el-icon>
        <span class="font-medium">{{ item.meta?.title }}</span>
      </template>
      <SidebarItem
        v-for="child in visibleChildren"
        :key="child.path"
        :item="child"
        :base-path="fullPath"
      />
    </el-sub-menu>
  </template>
</template>

<script setup>
import { computed } from 'vue'
import iconMap from '@/icons'
import SidebarItem from './SidebarItem.vue'

const props = defineProps({
  item: { type: Object, required: true },
  basePath: { type: String, default: '' },
})

const fullPath = computed(() => {
  if (props.item.path.startsWith('/')) return props.item.path
  return `${props.basePath}/${props.item.path}`.replace(/\/+/g, '/')
})

const visibleChildren = computed(() =>
  (props.item.children || []).filter(c => !c.meta?.hidden)
)

const hasVisibleChildren = computed(() => visibleChildren.value.length > 0)
</script>
