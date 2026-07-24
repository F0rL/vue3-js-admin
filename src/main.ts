import { createApp } from 'vue'
import pinia from '@/stores'
import router from './router'
import App from './App.vue'

// 启用 mock 时动态加载；__USE_MOCK__ 由 vite.config.ts define 在构建期
// 替换为 true/false 字面量，false 时该分支被 Rollup 彻底 tree-shake
async function bootstrap() {
  if (__USE_MOCK__) {
    await import('@/mock')
  }

  const app = createApp(App)
  app.use(pinia)
  app.use(router)
  app.mount('#app')
}

import 'element-plus/dist/index.css'
import './styles/theme.css'
import './styles/tailwind.css'
import './styles/index.scss'
import 'nprogress/nprogress.css'

bootstrap()
