import type { AxiosInstance } from 'axios'
import { axiosInstance } from '@/utils/http'
import MockAdapter from 'axios-mock-adapter'
import { registerAuthMock } from './modules/auth'
import { registerSysMenuMock } from './modules/sysMenu'

const mock: MockAdapter = new MockAdapter(axiosInstance as AxiosInstance, { delayResponse: 300 })

registerAuthMock(mock)
registerSysMenuMock(mock)
