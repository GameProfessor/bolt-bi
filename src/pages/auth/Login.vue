<template>
  <div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100">
          <ChartBarIcon class="h-8 w-8 text-primary-600" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Đăng nhập vào BI Dashboard
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Hoặc
          <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
            liên hệ admin để được cấp quyền truy cập
          </a>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <input type="hidden" name="remember" value="true" />
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Email address</label>
            <input
              id="email-address"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Địa chỉ email"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Mật khẩu"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.remember"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Ghi nhớ đăng nhập
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
              Quên mật khẩu?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
              <LockClosedIcon class="h-5 w-5 text-primary-500 group-hover:text-primary-400" aria-hidden="true" />
            </span>
            <span v-if="isLoading">Đang đăng nhập...</span>
            <span v-else>Đăng nhập</span>
          </button>
        </div>

        <!-- Demo login info -->
        <div class="mt-6 p-4 bg-blue-50 rounded-md">
          <div class="flex">
            <div class="flex-shrink-0">
              <InformationCircleIcon class="h-5 w-5 text-blue-400" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">
                Demo Mode
              </h3>
              <div class="mt-2 text-sm text-blue-700">
                <p>Trong chế độ development, bạn có thể đăng nhập với bất kỳ email/password nào.</p>
                <p class="mt-1">Hoặc click "Đăng nhập Demo" để truy cập ngay.</p>
              </div>
              <div class="mt-3">
                <button
                  type="button"
                  @click="handleDemoLogin"
                  class="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200"
                >
                  Đăng nhập Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ChartBarIcon, LockClosedIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
import { useAppStore } from '@/stores'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

const isLoading = ref(false)
const form = ref({
  email: '',
  password: '',
  remember: false
})

const handleLogin = async () => {
  isLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In development, accept any credentials
    if (import.meta.env.DEV || (form.value.email && form.value.password)) {
      // Set auth token
      localStorage.setItem('auth_token', 'demo-token-' + Date.now())
      
      // Set user data
      appStore.setUser({
        id: '1',
        name: 'Demo User',
        email: form.value.email || 'demo@example.com',
        avatar: '',
        role: 'admin',
        preferences: {
          theme: 'light',
          language: 'vi',
          notifications: true
        }
      })
      
      appStore.showSuccess('Đăng nhập thành công!')
      
      // Redirect to intended page or home
      const redirect = route.query.redirect as string || '/'
      router.push(redirect)
    } else {
      appStore.showError('Email hoặc mật khẩu không đúng')
    }
  } catch (error) {
    appStore.showError('Có lỗi xảy ra khi đăng nhập')
  } finally {
    isLoading.value = false
  }
}

const handleDemoLogin = () => {
  form.value.email = 'demo@example.com'
  form.value.password = 'demo123'
  handleLogin()
}
</script>
