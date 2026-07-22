import axios from 'axios'
import { message } from '@/utils/feedback'
import pinia from '@/stores'
import { useUserStore } from '@/stores/modules/user'
import { config } from '@/config'

const service = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 15000,
})

service.interceptors.request.use(
  config => {
    const userStore = useUserStore(pinia)
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

service.interceptors.response.use(
  response => {
    const res = response.data

    if (res.code !== 20000 && res.code !== 200) {
      message.error(res.message || '请求失败')

      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        message.error('登录已过期，请重新登录')
        window.location.href = '/login'
      }
      return Promise.reject(new Error(res.message || '请求失败'))
    }

    return res
  },
  error => {
    message.error(error.message || '网络错误')
    return Promise.reject(error)
  },
)

export default service
