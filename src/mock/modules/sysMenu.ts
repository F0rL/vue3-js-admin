import type MockAdapter from 'axios-mock-adapter'

export function registerSysMenuMock(mock: MockAdapter) {
  // 获取用户权限菜单
  mock.onPost('/api/SysMenu/GetUserRightMenu').reply(200, {
    flag: true,
    code: 0,
    msg: [
      {
        path: '/dashboard',
        name: 'Dashboard',
        meta: { title: '首页', icon: 'HomeFilled' },
      },
      {
        path: '/system',
        name: 'System',
        meta: { title: '系统管理', icon: 'Setting' },
        children: [
          { path: '/system/user', name: 'User', meta: { title: '用户管理', icon: 'User' } },
          { path: '/system/role', name: 'Role', meta: { title: '角色管理', icon: 'Avatar' } },
        ],
      },
      {
        path: '/example',
        name: 'Example',
        meta: { title: '示例页面', icon: 'Document' },
        children: [
          { path: '/example/table', name: 'Table', meta: { title: '综合表格', icon: 'Grid' } },
          { path: '/example/form', name: 'Form', meta: { title: '综合表单', icon: 'Edit' } },
        ],
      },
    ],
    total: 0,
    time: new Date().toISOString(),
  })
}
