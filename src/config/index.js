export const config = {
  /** 应用基础路径，用于路由 basename */
  BASE_URL: import.meta.env.VITE_APP_BASE_URL,

  /** axios 请求 baseURL，dev 代理 /api */
  API_BASE_URL: import.meta.env.VITE_APP_BASE_API,

  /** 应用标题 */
  APP_TITLE: import.meta.env.VITE_APP_TITLE,
}
