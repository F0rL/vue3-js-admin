/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
}

declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.webp'

declare module '~icons/*' {
  import type { Component } from 'vue'
  const component: Component
  export default component
}

/** vite.config.ts 中 define 的构建期字面量 */
declare const __USE_MOCK__: boolean

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_BASE_URL: string
  readonly VITE_APP_BASE_API: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'nprogress' {
  const NProgress: {
    start(): void
    done(force?: boolean): void
    configure(options: Record<string, unknown>): void
    set(n: number): void
    inc(): void
    inc(n: number): void
    remove(): void
    isStarted(): boolean
    settings: Record<string, unknown>
  }
  export default NProgress
}