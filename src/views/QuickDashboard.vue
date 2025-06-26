<template>
  <div class="quick-dashboard">
    <div class="dashboard-header">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Quick Dashboard</h1>
    </div>
    
    <div class="dashboard-content">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- KPI Cards -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Total Revenue</h3>
          <p class="text-3xl font-bold text-green-600">$24,500</p>
          <p class="text-sm text-gray-500 mt-1">+12% from last month</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Active Users</h3>
          <p class="text-3xl font-bold text-blue-600">1,234</p>
          <p class="text-sm text-gray-500 mt-1">+5% from last week</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Conversion Rate</h3>
          <p class="text-3xl font-bold text-purple-600">3.2%</p>
          <p class="text-sm text-gray-500 mt-1">-0.1% from yesterday</p>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="mt-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors">
            Create Report
          </button>
          <button class="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors">
            Add Data Source
          </button>
          <button class="bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-colors">
            View Analytics
          </button>
          <button class="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors">
            Export Data
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Reactive data
const isLoading = ref(false)
const dashboardData = ref({
  revenue: 24500,
  users: 1234,
  conversionRate: 3.2
})

// Methods
const refreshData = async () => {
  isLoading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Update dashboard data here
  } catch (error) {
    console.error('Error refreshing dashboard data:', error)
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(() => {
  // Initialize dashboard data
  console.log('Quick Dashboard mounted')
})
</script>

<style scoped>
.quick-dashboard {
  @apply min-h-screen bg-gray-50 p-6;
}

.dashboard-header {
  @apply mb-8;
}

.dashboard-content {
  @apply max-w-7xl mx-auto;
}

/* Custom hover effects */
.bg-white:hover {
  @apply shadow-lg;
  transition: box-shadow 0.2s ease-in-out;
}

button:hover {
  transform: translateY(-1px);
  transition: all 0.2s ease-in-out;
}
</style>