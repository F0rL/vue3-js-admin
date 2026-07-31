import type MockAdapter from 'axios-mock-adapter'
import { makeResp } from '../utils'

let idCounter = 738088897698856960

function genId(): string {
  idCounter++
  return String(idCounter)
}

interface MockRole {
  id: string
  name: string
  status: number
  menuIdsJSON: string
}

let roles: MockRole[] = [
  { id: '10086', name: '超级管理员组', status: 1, menuIdsJSON: '[]' },
  { id: '738088897698856960', name: '测试角色', status: 1, menuIdsJSON: '[]' },
]

export function registerSysRoleMock(mock: MockAdapter) {
  mock.onGet('/api/SysRole/GetRoleList').reply(config => {
    const params = config.params || {}
    const keyword = ((params.keyword as string) || '').toLowerCase()
    const sorted = [...roles]
    const filtered = keyword ? sorted.filter(r => r.name.toLowerCase().includes(keyword)) : sorted

    const pageIndex = Number(params.pageIndex) || 1
    const pageSize = Number(params.pageSize) || 10
    const total = filtered.length
    const start = (pageIndex - 1) * pageSize
    const page = filtered.slice(start, start + pageSize)

    const list = page.map(r => ({
      id: r.id,
      name: r.name,
    }))

    return [200, makeResp(list, 0, total)]
  })

  mock.onGet('/api/SysRole/GetRoleEntity').reply(config => {
    const params = config.params || {}
    const id = params.id as string
    const role = roles.find(r => r.id === id)
    if (!role) return [404, makeResp('角色不存在', -1)]
    return [
      200,
      makeResp({
        id: role.id,
        name: role.name,
        isDelHandle: role.id !== '10086',
        status: { value: role.status, text: role.status === 1 ? '启用' : '禁用' },
        menuList: [],
        localUser: [],
        workUser: [],
        menuIdsJSON: role.menuIdsJSON,
      }),
    ]
  })

  mock.onPost('/api/SysRole/CreateRole').reply(config => {
    const data = JSON.parse(config.data)
    const role: MockRole = {
      id: genId(),
      name: data.name || '',
      status: data.status ?? 1,
      menuIdsJSON: data.menuIdsJSON || '[]',
    }
    roles.push(role)
    return [200, makeResp(null)]
  })

  mock.onPost('/api/SysRole/UpdateRole').reply(config => {
    const data = JSON.parse(config.data)
    const idx = roles.findIndex(r => r.id === data.id)
    if (idx === -1) return [404, makeResp('角色不存在', -1)]
    roles[idx] = {
      id: data.id,
      name: data.name || '',
      status: data.status ?? 1,
      menuIdsJSON: data.menuIdsJSON || '[]',
    }
    return [200, makeResp(null)]
  })

  mock.onPost('/api/SysRole/DeleteRole').reply(config => {
    const data = JSON.parse(config.data)
    const ids: string[] = data.ids || []
    roles = roles.filter(r => !ids.includes(r.id))
    return [200, makeResp(null)]
  })
}
