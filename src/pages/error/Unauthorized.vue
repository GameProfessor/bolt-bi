<template>
  <div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <div class="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-red-100">
        <ExclamationTriangleIcon class="h-12 w-12 text-red-600" />
      </div>
      
      <h1 class="mt-6 text-4xl font-bold text-gray-900">403</h1>
      <h2 class="mt-2 text-xl font-semibold text-gray-700">Không có quyền truy cập</h2>
      
      <p class="mt-4 text-gray-600">
        Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên để được cấp quyền.
      </p>
      
      <div class="mt-6 space-y-3">
        <button
          @click="goBack"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <ArrowLeftIcon class="h-5 w-5 mr-2" />
          Quay lại trang trước
        </button>
        
        <button
          @click="goHome"
          class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <HomeIcon class="h-5 w-5 mr-2" />
          Về trang chủ
        </button>
      </div>
      
      <div class="mt-8 p-4 bg-yellow-50 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <InformationCircleIcon class="h-5 w-5 text-yellow-400" />
          </div>
          <div class="ml-3 text-left">
            <h3 class="text-sm font-medium text-yellow-800">
              Cần hỗ trợ?
            </h3>
            <div class="mt-2 text-sm text-yellow-700">
              <p>Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ:</p>
              <ul class="mt-1 list-disc list-inside">
                <li>Email: admin@company.com</li>
                <li>Điện thoại: (84) 123-456-789</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Debug info in development -->
      <div v-if="isDevelopment" class="mt-6 p-4 bg-gray-100 rounded-md text-left">
        <h4 class="text-sm font-medium text-gray-800 mb-2">Debug Info (Development Only)</h4>
        <div class="text-xs text-gray-600 space-y-1">
          <p><strong>Requested Path:</strong> {{ requestedPath }}</p>
          <p><strong>User Role:</strong> {{ userRole || 'Not authenticated' }}</p>
          <p><strong>Required Permission:</strong> {{ requiredPermission || 'Unknown' }}</p>
          <p><strong>Timestamp:</strong> {{ new Date().toLocaleString() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  ExclamationTriangleIcon, 
  ArrowLeftIcon, 
  HomeIcon,
  InformationCircleIcon 
} from '@heroicons/vue/24/outline'
import { useAppStore } from '@/stores'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

const isDevelopment = import.meta.env.DEV
const requestedPath = computed(() => route.query.from as string || 'Unknown')
const userRole = computed(() => appStore.currentUser?.role)
const requiredPermission = computed(() => route.query.permission as string)

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    goHome()
  }
}

const goHome = () => {
  router.push('/')
}
</script>
