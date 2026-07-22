<template>
  <router-view />
</template>

<script setup>
import { useAppStore } from '@/stores/modules/app'

const appStore = useAppStore()
</script>
