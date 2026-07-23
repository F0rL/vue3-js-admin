import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as userApi from '@/api/user'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const userInfo = ref({
      id: '',
      name: '',
      avatar: '',
      roles: [],
      permissions: [],
    })

    const isLoggedIn = computed(() => !!token.value)
    const roles = computed(() => userInfo.value.roles)
    const permissions = computed(() => userInfo.value.permissions)

    async function login(loginForm) {
      const { data } = await userApi.login(loginForm).send()
      token.value = data.token
    }

    async function fetchUserInfo() {
      const { data } = await userApi.getUserInfo().send()
      userInfo.value = {
        id: data.id,
        name: data.name,
        avatar: data.avatar,
        roles: data.roles,
        permissions: data.permissions,
      }
      return data
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
