<template>
  <div class="quick-dashboard">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Quick Dashboard</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- KPI Cards -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Total Users</h3>
          <p class="text-3xl font-bold text-blue-600">1,234</p>
          <p class="text-sm text-gray-500 mt-2">↑ 12% from last month</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Revenue</h3>
          <p class="text-3xl font-bold text-green-600">$45,678</p>
          <p class="text-sm text-gray-500 mt-2">↑ 8% from last month</p>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Orders</h3>
          <p class="text-3xl font-bold text-purple-600">892</p>
          <p class="text-sm text-gray-500 mt-2">↓ 3% from last month</p>
        </div>
      </div>
      
      <!-- Chart Section -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Performance Overview</h3>
        <div class="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <p class="text-gray-500">Chart placeholder - Connect your data source to display charts</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Quick dashboard component logic can be added here
</script>

<style scoped>
.quick-dashboard {
  min-height: 100vh;
  background-color: #f8fafc;
}
</style>