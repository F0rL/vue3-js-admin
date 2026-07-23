<script setup>
import { reactive, ref, useTemplateRef } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from '@/utils/feedback'
import { useUserStore } from '@/stores/modules/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = useTemplateRef('formRef')
const submitting = ref(false)
const rememberMe = ref(true)

const form = reactive({
  username: 'admin',
  password: 'admin123',
})

const rules = reactive({
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, message: '账号长度不能少于 3 位', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于 6 位', trigger: 'blur' },
  ],
})

async function handleSubmit() {
  if (!formRef.value) return
  await formRef.value.validate()
  submitting.value = true
  try {
    await userStore.login({ username: form.username, password: form.password })
    await userStore.fetchUserInfo()
    message.success('登录成功')
    const redirectPath =
      typeof route.query.redirect === 'string' && route.query.redirect ? route.query.redirect : '/'
    await router.push(redirectPath)
  } catch (error) {
    message.error(error.message || '登录失败')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="mt-6">
    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" size="large">
      <el-form-item prop="username">
        <el-input v-model="form.username" :disabled="submitting" placeholder="请输入账号">
          <template #prefix>
            <el-icon><IconEpUser /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="form.password"
          :disabled="submitting"
          type="password"
          show-password
          placeholder="请输入密码"
          @keyup.enter="handleSubmit"
        >
          <template #prefix>
            <el-icon><IconEpLock /></el-icon>
          </template>
        </el-input>
      </el-form-item>

      <div class="-mt-2 mb-6 flex items-center justify-between">
        <el-checkbox v-model="rememberMe">记住我</el-checkbox>
        <button
          type="button"
          class="cursor-pointer border-0 bg-transparent text-sm font-medium text-blue-600 transition hover:text-blue-700"
        >
          忘记密码？
        </button>
      </div>

      <el-button
        class="w-full"
        type="primary"
        size="large"
        :loading="submitting"
        @click="handleSubmit"
      >
        登&nbsp;&nbsp;录
      </el-button>
    </el-form>
  </div>
</template>

<style scoped></style>
