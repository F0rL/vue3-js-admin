import { createAlova } from 'alova'
import VueHook from 'alova/vue'
import { axiosRequestAdapter } from '@alova/adapter-axios'
import axios from 'axios'
import { tokenBehaviors, defaultResponded, defaultCacheFor } from './presets'
import type { Alova, AlovaGenerics, Method, RespondedHandler, RespondedHandlerRecord, GlobalCacheConfig } from 'alova'
import type { AxiosInstance, AxiosResponse, AxiosResponseHeaders } from 'axios'
import type { AlovaAxiosRequestConfig } from '@alova/adapter-axios'

type TokenType = 'bearer' | 'apiKey' | 'none'

export interface CreateHttpOptions {
  /** 基础地址 */
  baseURL: string
  /** 超时时间（毫秒） */
  timeout?: number
  /**
   * token 携带方式
   * - bearer：Authorization: Bearer xxx
   * - apiKey：X-API-Key 头
   * - none：不携带
   * - 自定义函数：接收 alova Method 实例
   */
  token?: TokenType | ((method: Method) => void | Promise<void>)
  /** 响应处理（onSuccess / onError） */
  responded?: RespondedHandler<any> | RespondedHandlerRecord<any>
  /** 缓存策略，传入 null 禁用 */
  cacheFor?: GlobalCacheConfig<any> | null
  /** 透传给 axios.create 的额外配置 */
  axiosConfig?: AlovaAxiosRequestConfig
}

export type HttpInstance = Alova<
  AlovaGenerics<any, any, AlovaAxiosRequestConfig, AxiosResponse, AxiosResponseHeaders>
> & {
  axiosInstance: AxiosInstance
}

/**
 * 创建 alova HTTP 实例
 */
export function createHttp({
  baseURL,
  timeout = 15000,
  token = 'bearer',
  responded = defaultResponded,
  cacheFor = defaultCacheFor,
  axiosConfig = {},
}: CreateHttpOptions): HttpInstance {
  const axiosInstance = axios.create({ baseURL, timeout, ...axiosConfig })

  const beforeRequest =
    typeof token === 'function' ? token : tokenBehaviors[token] || tokenBehaviors.none

  const http = createAlova({
    baseURL,
    statesHook: VueHook,
    requestAdapter: axiosRequestAdapter({ axios: axiosInstance }),
    cacheFor: cacheFor ?? undefined,
    beforeRequest,
    responded,
  }) as HttpInstance

  // 附加裸 axios 实例，供 mock 适配器挂载
  http.axiosInstance = axiosInstance
  return http
}
