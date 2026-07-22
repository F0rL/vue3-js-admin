import service from '@/api/request'
import MockAdapter from 'axios-mock-adapter'
import { registerUserMock } from './modules/user'

const mock = new MockAdapter(service, { delayResponse: 300 })

// 按业务模块注册 mock 路由
registerUserMock(mock)
