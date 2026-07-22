import request from '@/api/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data,
  })
}

export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post',
  })
}
