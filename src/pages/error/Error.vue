<template>
  <div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center">
      <div class="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-red-100">
        <ExclamationCircleIcon class="h-12 w-12 text-red-600" />
      </div>
      
      <h1 class="mt-6 text-4xl font-bold text-gray-900">Oops!</h1>
      <h2 class="mt-2 text-xl font-semibold text-gray-700">Có lỗi xảy ra</h2>
      
      <p class="mt-4 text-gray-600">
        Đã xảy ra lỗi không mong muốn. Chúng tôi đã ghi nhận sự cố và sẽ khắc phục sớm nhất có thể.
      </p>
      
      <div class="mt-6 space-y-3">
        <button
          @click="retry"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <ArrowPathIcon class="h-5 w-5 mr-2" />
          Thử lại
        </button>
        
        <button
          @click="goHome"
          class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <HomeIcon class="h-5 w-5 mr-2" />
          Về trang chủ
        </button>
      </div>
      
      <div class="mt-8 p-4 bg-red-50 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <InformationCircleIcon class="h-5 w-5 text-red-400" />
          </div>
          <div class="ml-3 text-left">
            <h3 class="text-sm font-medium text-red-800">
              Báo cáo lỗi
            </h3>
            <div class="mt-2 text-sm text-red-700">
              <p>Nếu lỗi tiếp tục xảy ra, vui lòng báo cáo cho chúng tôi:</p>
              <ul class="mt-1 list-disc list-inside">
                <li>Email: support@company.com</li>
                <li>Điện thoại: (84) 123-456-789</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Error details in development -->
      <div v-if="isDevelopment && errorDetails" class="mt-6 p-4 bg-gray-100 rounded-md text-left">
        <h4 class="text-sm font-medium text-gray-800 mb-2">Error Details (Development Only)</h4>
        <div class="text-xs text-gray-600 space-y-1">
          <p><strong>Error:</strong> {{ errorDetails.message }}</p>
          <p><strong>Stack:</strong></p>
          <pre class="mt-1 text-xs bg-gray-200 p-2 rounded overflow-auto">{{ errorDetails.stack }}</pre>
          <p><strong>Timestamp:</strong> {{ new Date().toLocaleString() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  ExclamationCircleIcon, 
  ArrowPathIcon, 
  HomeIcon,
  InformationCircleIcon 
} from '@heroicons/vue/24/outline'
import { useAppStore } from '@/stores'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

const isDevelopment = import.meta.env.DEV
const errorDetails = ref<{ message: string; stack: string } | null>(null)

onMounted(() => {
  // Get error details from route state or global error handler
  if (route.params.error) {
    try {
      errorDetails.value = JSON.parse(route.params.error as string)
    } catch (e) {
      errorDetails.value = {
        message: route.params.error as string,
        stack: 'Stack trace not available'
      }
    }
  }
})

const retry = () => {
  // Try to go back to the previous page
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    // If no history, reload the current page
    window.location.reload()
  }
}

const goHome = () => {
  router.push('/')
}

// Global error handler
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (isDevelopment) {
      errorDetails.value = {
        message: event.error?.message || event.message,
        stack: event.error?.stack || 'Stack trace not available'
      }
    }
  })
  
  window.addEventListener('unhandledrejection', (event) => {
    if (isDevelopment) {
      errorDetails.value = {
        message: event.reason?.message || 'Unhandled promise rejection',
        stack: event.reason?.stack || 'Stack trace not available'
      }
    }
  })
}
</script>
