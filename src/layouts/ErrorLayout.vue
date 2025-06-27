<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Simple Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <ChartBarIcon class="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 class="text-lg font-semibold text-gray-900">BI Dashboard</h1>
            </div>
          </div>
          
          <button
            @click="goHome"
            class="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex items-center justify-center px-4 py-12">
      <div class="max-w-lg w-full">
        <slot />
      </div>
    </main>

    <!-- Simple Footer -->
    <footer class="bg-white border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© {{ currentYear }} BI Dashboard. Tất cả quyền được bảo lưu.</p>
          <div class="mt-2 md:mt-0 flex items-center space-x-4">
            <a href="#" class="hover:text-primary-600">Hỗ trợ</a>
            <span>•</span>
            <a href="#" class="hover:text-primary-600">Liên hệ</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ChartBarIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const currentYear = new Date().getFullYear()

const goHome = () => {
  router.push('/')
}
</script>
