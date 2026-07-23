import http from '@/utils/http'

export function login(data) {
  return http.Post('/user/login', data)
}

export function getUserInfo() {
  return http.Get('/user/info')
}

export function logout() {
  return http.Post('/user/logout')
}
