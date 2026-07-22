# AGENTS.md

## Stack

Vue 3 (JS, not TS) + Vite 8 + Pinia 3 + Vue Router 5 + Element Plus 2 + Tailwind CSS 4 + SCSS.

## Commands

```
pnpm dev           # dev server at http://localhost:5173/admin/
pnpm build         # production build → dist/
pnpm preview       # preview production build
pnpm lint          # ESLint on .vue/.js
```

Only `pnpm` is allowed — enforced by `packageManager` (corepack) + `devEngines.packageManager` (npm 10.9+).

## Principles

### Prefer mature third-party packages over self-implementation

Before writing custom code for common needs, check if a well-maintained community package already solves it. Examples:

- Date handling → `dayjs` (already a transitive dep via element-plus)
- Cookie/localStorage abstraction → `js-cookie`
- Utility collections → `@vueuse/core` (already installed)
- Rich text / Markdown → `@vueup/vue-quill`, `md-editor-v3`
- Charts → `echarts` + `vue-echarts`
- Drag-and-drop → `vuedraggable`
- Excel import/export → `xlsx`
- Form validation schemas → `async-validator` (already used by element-plus)
- HTTP requests → `axios` (already installed)

Do NOT build custom event buses, debounce/throttle, clipboard, fullscreen, dark-mode toggle, or localStorage wrappers from scratch — `@vueuse/core` covers these. Check its catalog first.

## Architecture

### Auto-imports (don't manually import these)

`unplugin-auto-import` injects `vue`, `vue-router`, `pinia`, and Element Plus APIs globally in `.vue` files. No need to write `import { ref, computed } from 'vue'` or `import { ElMessage } from 'element-plus'`.

Element Plus **components** are auto-imported via `unplugin-vue-components` — use `<el-button>`, `<el-table>`, etc. directly without registration.

### Stores use Setup syntax (not Options API)

All stores use the composable function form: `defineStore('id', () => { ... })` with `ref`/`computed`/plain functions. The `persist` config goes in the 3rd argument. Do NOT use the `{ state, getters, actions }` Options API form.

### pinia instance is exported from stores/index.js

`src/stores/index.js` creates the `pinia` instance (with `createPinia()` + `createPersistedState()`) and exports it as default. Non-component code (e.g. `src/api/request.js` axios interceptors) imports it to invoke stores outside of `<script setup>` context:

```js
import pinia from '@/stores'
import { useUserStore } from '@/stores/modules/user'
const userStore = useUserStore(pinia)
```

### Dynamic icons MUST use iconMap

`unplugin-vue-components` only resolves icons used as static tags (`<HomeFilled />`). Dynamic `<component :is="iconName" />` fails silently. Always use the icon map:

```js
import iconMap from '@/icons'
// template: <component :is="iconMap[item.meta.icon]" />
```

When adding new sidebar menu items, add their icon to route `meta.icon` (string name), and:

- EP icon → add `~icons/ep/...` import + entry to `src/icons/ep.js`
- RemixIcon → add `~icons/ri/...` import + entry to `src/icons/ri.js`

### SCSS variables are globally injected

`vite.config.js` injects `@use "@/styles/variables.scss" as *;` into every SCSS block. Variables like `$sidebar-width`, `$color-primary`, etc. are available everywhere — never `@import` them manually.

### Tailwind CSS v4 (CSS-first, no config file)

Tailwind v4 uses `@tailwindcss/vite` plugin (in `vite.config.js`) instead of PostCSS. Configuration is CSS-based via `@theme` and `@source` directives — there is **no `tailwind.config.js`** and **no `postcss.config.js`**.

Preflight is disabled to avoid clashing with Element Plus base styles. Instead of `corePlugins: { preflight: false }`, the preflight CSS import is omitted from `src/styles/tailwind.css`:

```css
@layer theme, base, components, utilities;
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/utilities.css' layer(utilities);
/* @import "tailwindcss/preflight.css" is intentionally omitted */
```

To add custom theme values, use `@theme` in CSS. To add content sources, use `@source`:

```css
@source "../../index.html";
```

### Router & sidebar coupling

`src/router/index.js` exports `asyncRoutes` which the sidebar reads directly to build the menu. Routes with `meta.hidden: true` are excluded from the sidebar. New pages: add route to `asyncRoutes` with `meta.title` and `meta.icon`.

The router uses `createWebHistory(import.meta.env.BASE_URL)` — the base path is synced from Vite's `base` config (currently `/admin/`). Dev server runs at `http://localhost:5173/admin/`.

### Token storage

Token and user state are persisted via `pinia-plugin-persistedstate` with a global key prefix from `src/utils/storage.js` (`import.meta.env.BASE_URL` + store id → key like `/admin/user`). The plugin is registered in `main.js` using `createPersistedState()`. Per-store `persist` config (3rd argument to `defineStore`) controls which refs to persist — see `src/stores/user.js` and `src/stores/app.js` for examples.

`src/utils/auth.js` has been removed — token is now managed entirely through Pinia persist. For non-Pinia localStorage access, use the `storageKey(name)` helper from `src/utils/storage.js`.

### API layer

- Base URL: `import.meta.env.VITE_APP_BASE_API` (defaults `/api`)
- Dev proxy: `/api` → `http://localhost:8080` (strips `/api` prefix)
- Response interceptor expects `{ code: 200 | 20000, data, message }`
- API modules go in `src/api/modules/`

### Mock login

The login page currently sets a mock token directly — no real backend call. Replace `handleLogin` in `src/views/login/index.vue` when connecting to a real API.

### sass-embedded

Uses `api: 'modern-compiler'` — SCSS files must use `@use`/`@forward` syntax, not `@import`.

### Path alias

`@` → `src/` (configured in both `vite.config.js` and `jsconfig.json`).
