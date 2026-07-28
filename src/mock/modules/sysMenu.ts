import type MockAdapter from 'axios-mock-adapter'
import { makeResp } from '../utils'

export function registerSysMenuMock(mock: MockAdapter) {
  const menuData = [
    {
      id: '1',
      title: '首页',
      path: 'dashboard',
      icon: 'el-icon-s-home',
      status: 1,
      createTime: '2024-07-04 13:49:00',
      isMenuShow: true,
    },
    {
      id: '473778965740257280',
      title: '系统设置',
      icon: 'el-icon-s-tools',
      status: 1,
      createTime: '2024-07-31 09:08:27',
      isMenuShow: true,
      children: [
        {
          id: '473778965740257288',
          title: '账户管理',
          icon: 'el-icon-user',
          path: 'sys-user-list',
          status: 1,
          isMenuShow: true,
        },
        {
          id: '473778965740257289',
          title: '账户编辑',
          icon: 'el-icon-user',
          path: 'sys-user-edit',
          status: 1,
          isMenuShow: false,
        },
        {
          id: '473778965740257287',
          title: '日志管理',
          icon: 'el-icon-s-flag',
          path: 'sys-log-list',
          status: 1,
          isMenuShow: true,
        },
        {
          id: '473778965740257286',
          title: '菜单编辑',
          icon: 'el-icon-menu',
          path: 'sys-menu-edit',
          status: 1,
          isMenuShow: false,
        },
        {
          id: '473778965740257285',
          title: '菜单管理',
          icon: 'el-icon-menu',
          path: 'sys-menu-list',
          status: 1,
          isMenuShow: true,
        },
        {
          id: '473778965740257284',
          title: '新增成员',
          icon: 'el-icon-s-flag',
          path: 'sys-org-add',
          status: 1,
          isMenuShow: false,
        },
        {
          id: '473778965740257282',
          title: '组织架构',
          icon: 'el-icon-s-flag',
          path: 'sys-org-list',
          status: 1,
          isMenuShow: true,
        },
        {
          id: '473778965740257283',
          title: '编辑成员',
          icon: 'el-icon-s-flag',
          path: 'sys-org-edit',
          status: 1,
          isMenuShow: false,
        },
        {
          id: '473778965740257281',
          title: '角色管理',
          icon: 'el-icon-s-custom',
          path: 'sys-role-list',
          status: 1,
          isMenuShow: true,
        },
      ],
    },
  ]

  mock.onPost('/api/SysMenu/GetUserRightMenu').reply(200, makeResp(menuData, 0, menuData.length))
}
