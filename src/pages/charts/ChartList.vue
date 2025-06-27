<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-bold text-gray-900">Charts</h1>
          <p class="mt-2 text-sm text-gray-700">
            Create and manage your data visualizations
          </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <router-link
            to="/charts/create"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <PlusIcon class="w-4 h-4 mr-2" />
            Create Chart
          </router-link>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="chart in chartStore.charts"
          :key="chart.id"
          class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
        >
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <PresentationChartLineIcon class="h-8 w-8 text-primary-500" />
                <div class="ml-4">
                  <h3 class="text-lg font-medium text-gray-900">{{ chart.name }}</h3>
                  <p class="text-sm text-gray-500">{{ chart.type }} Chart</p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="editChart(chart)"
                  class="text-gray-400 hover:text-gray-500"
                >
                  <PencilIcon class="h-5 w-5" />
                </button>
                <button
                  @click="deleteChart(chart)"
                  class="text-gray-400 hover:text-red-500"
                >
                  <TrashIcon class="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div class="mt-4">
              <p class="text-sm text-gray-600">
                {{ chart.description || 'No description' }}
              </p>
            </div>
            
            <div class="mt-4 flex items-center justify-between">
              <span class="text-xs text-gray-500">
                Updated {{ formatDate(chart.updatedAt) }}
              </span>
              <router-link
                :to="`/charts/${chart.id}`"
                class="text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                View Chart
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="chartStore.charts.length === 0" class="text-center py-12">
        <PresentationChartLineIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">No charts</h3>
        <p class="mt-1 text-sm text-gray-500">
          Get started by creating your first chart.
        </p>
        <div class="mt-6">
          <router-link
            to="/charts/create"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon class="w-4 h-4 mr-2" />
            Create Chart
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  PlusIcon,
  PresentationChartLineIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import { useChartStore } from '@/stores'

const router = useRouter()
const chartStore = useChartStore()

const editChart = (chart: any) => {
  router.push(`/charts/${chart.id}/edit`)
}

const deleteChart = async (chart: any) => {
  if (confirm(`Are you sure you want to delete "${chart.name}"?`)) {
    try {
      await chartStore.deleteChart(chart.id)
    } catch (error) {
      console.error('Failed to delete chart:', error)
    }
  }
}

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString()
}
</script>
