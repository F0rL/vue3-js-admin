import type { AxiosRequestConfig } from 'axios'
import type MockAdapter from 'axios-mock-adapter'

export function registerAuthMock(mock: MockAdapter) {
  // 登录
  mock.onPost('/api/Auth/GetTokenPC').reply((config: AxiosRequestConfig) => {
    const { username, password } = JSON.parse(config.data)
    if (username === 'admin' && password === 'admin123') {
      return [
        200,
        {
          code: 0,
          data: { token: `mock-token-${Date.now()}` },
          message: 'OK',
        },
      ]
    }
    return [
      200,
      {
        code: 400,
        message: '用户名或密码错误',
      },
    ]
  })

  // 获取当前用户信息
  mock.onGet('/api/Auth/GetUserInfo').reply(200, {
    code: 0,
    data: {
      id: 1,
      name: '管理员',
      avatar: '',
      roles: ['admin'],
      permissions: ['*'],
    },
    message: 'OK',
  })

  // 退出登录
  mock.onPost('/api/Auth/logout').reply(200, {
    code: 0,
    data: null,
    message: 'OK',
  })

}
