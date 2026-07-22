export function registerUserMock(mock) {
  // 登录 —— 校验用户名和密码
  mock.onPost('/user/login').reply(config => {
    const { username, password } = JSON.parse(config.data)
    if (username === 'admin' && password === 'admin123') {
      return [
        200,
        {
          code: 200,
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
  mock.onGet('/user/info').reply(200, {
    code: 200,
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
  mock.onPost('/user/logout').reply(200, {
    code: 200,
    data: null,
    message: 'OK',
  })
}
