import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as authApi from '@/api/auth'
import type { LoginPayload, UserInfo } from '@/api/auth'
import { encryptPwdRsa } from '@/utils/encrypt'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const userInfo = ref<UserInfo>({
      id: '',
      name: '',
      avatar: '',
      roles: [],
    })

    const isLoggedIn = computed(() => !!token.value)
    const roles = computed(() => userInfo.value.roles)

    async function login(loginForm: LoginPayload) {
      const password = encryptPwdRsa(loginForm.password)
      const { msg } = await authApi.getTokenPC({ ...loginForm, password }).send()
      token.value = msg
    }

    async function fetchUserInfo() {
      const { msg } = await authApi.getUserInfo().send()
      userInfo.value = {
        id: msg.id,
        name: msg.name,
        avatar: msg.avatar,
        roles: msg.roles,
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
      }
    }

    return {
      token,
      userInfo,
      isLoggedIn,
      roles,
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
