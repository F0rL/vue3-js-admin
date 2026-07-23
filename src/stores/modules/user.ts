import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as authApi from '@/api/auth'
import type { LoginPayload, UserInfo } from '@/api/auth'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const userInfo = ref<UserInfo>({
      id: '',
      name: '',
      avatar: '',
      roles: [],
      permissions: [],
    })

    const isLoggedIn = computed(() => !!token.value)
    const roles = computed(() => userInfo.value.roles)
    const permissions = computed(() => userInfo.value.permissions)

    async function login(loginForm: LoginPayload) {
      const { msg } = await authApi.getTokenPC(loginForm).send()
      token.value = msg
    }

    async function fetchUserInfo() {
      const { msg } = await authApi.getUserInfo().send()
      userInfo.value = {
        id: msg.id,
        name: msg.name,
        avatar: msg.avatar,
        roles: msg.roles,
        permissions: msg.permissions,
      }
      return msg
    }

    async function logout() {
      resetToken()
    }

    function resetToken() {
      token.value = ''
      userInfo.value = {
        id: '',
        name: '',
        avatar: '',
        roles: [],
        permissions: [],
      }
    }

    return {
      token,
      userInfo,
      isLoggedIn,
      roles,
      permissions,
      login,
      fetchUserInfo,
      logout,
      resetToken,
    }
  },
  {
    persist: {
      pick: ['token', 'userInfo'],
    },
  },
)
