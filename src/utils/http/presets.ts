import pinia from '@/stores'
import { useUserStore } from '@/stores/modules/user'
import { isSuccess, handleBusinessError, handleNetworkError } from './error'
import type { AlovaGenerics, Method, RespondedHandlerRecord, GlobalCacheConfig } from 'alova'
import type { AxiosResponse, AxiosResponseHeaders } from 'axios'
import type { AlovaAxiosRequestConfig } from '@alova/adapter-axios'

type HttpAlovaGenerics = AlovaGenerics<
  any,
  any,
  AlovaAxiosRequestConfig,
  AxiosResponse<ApiResponse<unknown>>,
  AxiosResponseHeaders
>

type TokenBehavior = (method: Method) => void | Promise<void>

/* ============ token 携带方式预设 ============ */
export const tokenBehaviors: Record<string, TokenBehavior> = {
  // 默认：Authorization: Bearer xxx
  bearer(method) {
    const userStore = useUserStore(pinia)
    if (userStore.token) {
      method.config.headers.Authorization = `Bearer ${userStore.token}`
    }
  },
  // X-API-Key 头（预留）
  apiKey(method) {
    method.config.headers['X-API-Key'] = 'fixed-api-key-xxx'
  },
  // 不携带（预留）
  none() {},
}

/* ============ 默认响应处理预设（code/data/message 结构） ============ */
export const defaultResponded: RespondedHandlerRecord<HttpAlovaGenerics> = {
  onSuccess(response: AxiosResponse<ApiResponse<unknown>>) {
    const res = response.data
    if (!isSuccess(res)) {
      handleBusinessError(res)
      return Promise.reject(new Error(String(res.msg || '请求失败')))
    }
    return res
  },
  onError(error) {
    handleNetworkError(error)
    return Promise.reject(error)
  },
}

/* ============ 默认缓存策略预设 ============ */
// GET 30 秒：管理后台列表数据频繁变动，避免长时间脏数据
// POST/PUT/DELETE：不缓存
export const defaultCacheFor: GlobalCacheConfig<HttpAlovaGenerics> = {
  GET: 30 * 1000,
  POST: 0,
  PUT: 0,
  DELETE: 0,
}
