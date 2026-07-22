# AGENTS.md

## 技术栈

Vue 3（JS，非 TS）+ Vite 8 + Pinia 3 + Vue Router 5 + Element Plus 2 + Tailwind CSS 4 + SCSS。

## 命令

```
pnpm dev           # 开发服务器 → http://localhost:5173/admin/
pnpm build         # 生产构建 → dist/
pnpm preview       # 预览生产构建
pnpm lint          # ESLint 检查 .vue/.js 文件
```

仅允许使用 `pnpm`——由 `packageManager`（corepack）+ `devEngines.packageManager` 强制执行。

## 原则

### 优先使用成熟的第三方包，而非自行实现

在针对常见需求编写自定义代码之前，先检查是否有维护良好的社区包已经解决了该问题。示例：

- 日期处理 → `dayjs`（已通过 element-plus 作为间接依赖安装）
- Cookie/localStorage 抽象 → `js-cookie`
- 工具函数集合 → `@vueuse/core`（已安装）
- 富文本 / Markdown → `@vueup/vue-quill`、`md-editor-v3`
- 图表 → `echarts` + `vue-echarts`
- 拖拽 → `vuedraggable`
- Excel 导入/导出 → `xlsx`
- 表单校验 → `async-validator`（element-plus 已使用）
- HTTP 请求 → `axios`（已安装）

不要从零构建自定义事件总线、防抖/节流、剪贴板、全屏、暗色模式切换或 localStorage 封装——`@vueuse/core` 已覆盖这些功能。请先查阅其目录。

## 架构

### 自动导入（无需手动导入）

`unplugin-auto-import` 会在 `.vue` 文件中全局注入 `vue`、`vue-router`、`pinia` 以及 Element Plus API。无需编写 `import { ref, computed } from 'vue'` 或 `import { ElMessage } from 'element-plus'`。

Element Plus **组件**通过 `unplugin-vue-components` 自动导入——直接使用 `<el-button>`、`<el-table>` 等，无需手动注册。

### Store 使用 Setup 语法（非 Options API）

所有 store 使用组合式函数形式：`defineStore('id', () => { ... })`，配合 `ref`/`computed`/普通函数使用。`persist` 配置放在第三个参数中。不要使用 `{ state, getters, actions }` 这种 Options API 形式。

### Pinia 实例从 stores/index.js 导出

`src/stores/index.js` 创建 `pinia` 实例（通过 `createPinia()` + `createPersistedState()`）并默认导出。非组件代码（如 `src/api/request.js` 中的 axios 拦截器）可导入该实例以在 `<script setup>` 上下文之外使用 store：

```js
import pinia from '@/stores'
import { useUserStore } from '@/stores/modules/user'
const userStore = useUserStore(pinia)
```

### 动态图标必须使用 iconMap

`unplugin-vue-components` 仅能解析静态标签形式的图标（如 `<HomeFilled />`）。动态方式 `<component :is="iconName" />` 会静默失败。务必使用图标映射：

```js
import iconMap from '@/icons'
// 模板：<component :is="iconMap[item.meta.icon]" />
```

添加新的侧边栏菜单项时，将其图标名称添加到路由的 `meta.icon`（字符串），然后：

- EP 图标 → 添加 `~icons/ep/...` 导入 + 在 `src/icons/ep.js` 中新增条目
- RemixIcon → 添加 `~icons/ri/...` 导入 + 在 `src/icons/ri.js` 中新增条目

### Tailwind CSS v4（CSS 优先，无配置文件）

Tailwind v4 使用 `@tailwindcss/vite` 插件（在 `vite.config.js` 中配置）而非 PostCSS。配置通过 CSS 的 `@theme` 和 `@source` 指令完成——**没有 `tailwind.config.js`**，也**没有 `postcss.config.js`**。

已禁用 Preflight 以避免与 Element Plus 基础样式冲突。无需 `corePlugins: { preflight: false }`，只需从 `src/styles/tailwind.css` 中省略 preflight CSS 导入：

```css
@layer theme, base, components, utilities;
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/utilities.css' layer(utilities);
/* @import "tailwindcss/preflight.css" 已故意省略 */
```

添加自定义主题值时使用 `@theme`。添加内容来源时使用 `@source`：

```css
@source "../../index.html";
```

### 路由与侧边栏联动

`src/router/index.js` 导出 `asyncRoutes`，侧边栏直接读取该数据构建菜单。`meta.hidden: true` 的路由不会显示在侧边栏中。新增页面时：在 `asyncRoutes` 中添加路由，并设置 `meta.title` 和 `meta.icon`。

路由使用 `createWebHistory(import.meta.env.BASE_URL)`——基础路径与 Vite 的 `base` 配置同步（当前为 `/admin/`）。开发服务器运行在 `http://localhost:5173/admin/`。

### Token 存储

Token 和用户状态通过 `pinia-plugin-persistedstate` 持久化，使用来自 `src/utils/storage.js` 的全局 key 前缀（`import.meta.env.BASE_URL` + store id → key 形如 `/admin/user`）。插件在 `main.js` 中通过 `createPersistedState()` 注册。每个 store 的 `persist` 配置（`defineStore` 的第三个参数）控制持久化哪些 ref——参见 `src/stores/user.js` 和 `src/stores/app.js`。

`src/utils/auth.js` 已删除——token 现在完全通过 Pinia 持久化管理。如需在非 Pinia 场景下访问 localStorage，使用 `src/utils/storage.js` 中的 `storageKey(name)` 辅助函数。

### API 层

- 基础 URL：`import.meta.env.VITE_APP_BASE_API`（默认 `/api`）
- 开发代理：`/api` → `http://localhost:8080`（去除 `/api` 前缀）
- 响应拦截器期望格式：`{ code: 200 | 20000, data, message }`
- API 模块放在 `src/api/modules/` 目录下

### Mock 登录

登录页面目前直接设置 mock token——没有真正的后端调用。连接真实 API 时，替换 `src/views/login/index.vue` 中的 `handleLogin`。

### sass-embedded

使用 `api: 'modern-compiler'`——SCSS 文件必须使用 `@use`/`@forward` 语法，不能使用 `@import`。

### 路径别名

`@` → `src/`（在 `vite.config.js` 和 `jsconfig.json` 中均已配置）。
