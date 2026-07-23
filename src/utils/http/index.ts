import { config } from '@/config'
import { createHttp } from './create'

// 默认实例（主服务），当前项目唯一实例
// 未来新增实例（如 httpFile、httpOpen）在此追加 createHttp 调用
const http = createHttp({ baseURL: config.API_BASE_URL })

export default http
// 供 mock 适配器挂载
export const axiosInstance = http.axiosInstance
