<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <!-- Background Pattern -->
    <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
    
    <!-- Header -->
    <header class="relative z-10 px-4 py-6">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="h-10 w-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <ChartBarIcon class="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900">BI Dashboard</h1>
            <p class="text-sm text-gray-500">Business Intelligence Platform</p>
          </div>
        </div>
        
        <!-- Language Selector -->
        <!-- <div class="flex items-center space-x-4">
          <select 
            v-model="selectedLanguage"
            @change="changeLanguage"
            class="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="vi">🇻🇳 Tiếng Việt</option>
            <option value="en">🇺🇸 English</option>
          </select>
        </div> -->
      </div>
    </header>

    <!-- Main Content -->
    <main class="relative z-10 flex-1" >
      <slot />
    </main>

    <!-- Footer -->
    

    <!-- Loading Overlay -->
    <div 
      v-if="isLoading" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        <span class="text-gray-700">Đang xử lý...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { ChartBarIcon } from '@heroicons/vue/24/outline'
import { useAppStore } from '@/stores'

const appStore = useAppStore()


const isLoading = computed(() => appStore.isLoading)



onMounted(() => {
  // Set page theme for auth pages
  document.body.classList.add('auth-layout')
})
</script>

<style scoped>
.bg-grid-pattern {
  background-image: 
    linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

:global(.auth-layout) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>
