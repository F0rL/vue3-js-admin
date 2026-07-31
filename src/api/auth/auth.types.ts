/** PC 端账号密码登录表单 */
export interface LoginPayload {
  username: string
  password: string
  verifyCode: string
  verifyKey: string
}

export interface UserInfo {
  id: string
  name: string
  avatar: string
  roles: { id: string; name: string }[]
}
