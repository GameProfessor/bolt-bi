<template>
  <div class="dashboard-editor">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Dashboard Editor</h1>
      
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="mb-4">
          <label for="dashboard-name" class="block text-sm font-medium text-gray-700 mb-2">
            Dashboard Name
          </label>
          <input
            id="dashboard-name"
            v-model="dashboardName"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter dashboard name"
          />
        </div>
        
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Dashboard Description
          </label>
          <textarea
            v-model="dashboardDescription"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter dashboard description"
          ></textarea>
        </div>
        
        <div class="flex gap-4">
          <button
            @click="saveDashboard"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Save Dashboard
          </button>
          
          <button
            @click="cancelEdit"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const dashboardName = ref('')
const dashboardDescription = ref('')

const saveDashboard = () => {
  // TODO: Implement dashboard saving logic
  console.log('Saving dashboard:', {
    name: dashboardName.value,
    description: dashboardDescription.value
  })
  
  // Navigate back to dashboards list
  router.push('/dashboards')
}

const cancelEdit = () => {
  // Navigate back to dashboards list
  router.push('/dashboards')
}
</script>

<style scoped>
.dashboard-editor {
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>