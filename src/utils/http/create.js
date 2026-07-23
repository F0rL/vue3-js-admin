import { createAlova } from 'alova'
import VueHook from 'alova/vue'
import { axiosRequestAdapter } from '@alova/adapter-axios'
import axios from 'axios'
import { tokenBehaviors, defaultResponded, defaultCacheFor } from './presets'

/**
 * 创建 alova HTTP 实例
 * @param {Object} options
 * @param {string} options.baseURL                 - 基础地址
 * @param {number} [options.timeout=15000]          - 超时时间
 * @param {'bearer'|'apiKey'|'none'|Function} [options.token='bearer'] - token 携带方式
 * @param {Object} [options.responded]              - 响应处理（onSuccess/onError）
 * @param {Object|null} [options.cacheFor]          - 缓存策略，null 禁用
 * @param {Object} [options.axiosConfig]            - 透传 axios 实例的额外配置
 * @returns {Object} alova 实例，含附加属性 axiosInstance
 */
export function createHttp({
  baseURL,
  timeout = 15000,
  token = 'bearer',
  responded = defaultResponded,
  cacheFor = defaultCacheFor,
  axiosConfig = {},
}) {
  const axiosInstance = axios.create({ baseURL, timeout, ...axiosConfig })

  const beforeRequest =
    typeof token === 'function' ? token : tokenBehaviors[token] || tokenBehaviors.none

  const http = createAlova({
    baseURL,
    statesHook: VueHook,
    requestAdapter: axiosRequestAdapter({ axios: axiosInstance }),
    cacheFor,
    beforeRequest,
    responded,
  })

  // 附加裸 axios 实例，供 mock 适配器挂载
  http.axiosInstance = axiosInstance
  return http
}
