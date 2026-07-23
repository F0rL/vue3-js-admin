import type { Method, AlovaGenerics } from 'alova'

/**
 * 本项目的 alova Method 类型（响应数据已包装为 ApiResponse）
 *
 * @template T - ApiResponse.msg 的数据类型
 */
export type ApiMethod<T> = Method<AlovaGenerics<ApiResponse<T>>>
