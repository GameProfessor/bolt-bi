<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <!-- Header -->
      <div class="mb-8">
        <nav class="flex" aria-label="Breadcrumb">
          <ol class="flex items-center space-x-4">
            <li>
              <router-link to="/charts" class="text-gray-400 hover:text-gray-500">
                Charts
              </router-link>
            </li>
            <li>
              <ChevronRightIcon class="h-5 w-5 text-gray-400" />
            </li>
            <li>
              <span class="text-gray-900 font-medium">Create Chart</span>
            </li>
          </ol>
        </nav>
        <h1 class="mt-4 text-2xl font-bold text-gray-900">Create New Chart</h1>
        <p class="mt-2 text-sm text-gray-700">
          Select a data source and configure your chart visualization
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Configuration Panel -->
        <div class="lg:col-span-1">
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Chart Configuration</h3>
            
            <!-- Data Source Selection -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Data Source
              </label>
              <select
                v-model="selectedDataSource"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                @change="onDataSourceChange"
              >
                <option value="">Select a data source</option>
                <option
                  v-for="dataSource in dataSourceStore.dataSources"
                  :key="dataSource.id"
                  :value="dataSource.id"
                >
                  {{ dataSource.name }}
                </option>
              </select>
            </div>

            <!-- Chart Type Selection -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Chart Type
              </label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  v-for="type in chartTypes"
                  :key="type.value"
                  @click="chartConfig.type = type.value"
                  class="flex flex-col items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  :class="chartConfig.type === type.value 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-300'"
                >
                  <component :is="type.icon" class="h-6 w-6 mb-2" />
                  <span class="text-sm font-medium">{{ type.label }}</span>
                </button>
              </div>
            </div>

            <!-- Chart Name -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Chart Name
              </label>
              <input
                v-model="chartConfig.name"
                type="text"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Enter chart name"
              />
            </div>

            <!-- Column Mapping -->
            <div v-if="selectedDataSource && availableColumns.length > 0" class="mb-6">
              <h4 class="text-sm font-medium text-gray-700 mb-3">Column Mapping</h4>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm text-gray-600 mb-1">X-Axis</label>
                  <select
                    v-model="chartConfig.xAxis"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="">Select column</option>
                    <option
                      v-for="column in availableColumns"
                      :key="column.name"
                      :value="column.name"
                    >
                      {{ column.name }} ({{ column.type }})
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm text-gray-600 mb-1">Y-Axis</label>
                  <select
                    v-model="chartConfig.yAxis"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="">Select column</option>
                    <option
                      v-for="column in numericColumns"
                      :key="column.name"
                      :value="column.name"
                    >
                      {{ column.name }} ({{ column.type }})
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex space-x-3">
              <button
                @click="createChart"
                :disabled="!canCreateChart"
                class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Create Chart
              </button>
              <button
                @click="$router.go(-1)"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        <!-- Preview Panel -->
        <div class="lg:col-span-2">
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Preview</h3>
            
            <div v-if="!selectedDataSource" class="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <div class="text-center">
                <ChartBarIcon class="mx-auto h-12 w-12 text-gray-400" />
                <p class="mt-2 text-sm text-gray-500">Select a data source to preview your chart</p>
              </div>
            </div>
            
            <div v-else-if="!chartConfig.type" class="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <div class="text-center">
                <PresentationChartLineIcon class="mx-auto h-12 w-12 text-gray-400" />
                <p class="mt-2 text-sm text-gray-500">Select a chart type to see preview</p>
              </div>
            </div>
            
            <div v-else class="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p class="text-gray-500">Chart preview will appear here</p>
              <!-- ChartPreview component sẽ được thêm vào sau -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  ChevronRightIcon,
  ChartBarIcon,
  PresentationChartLineIcon
} from '@heroicons/vue/24/outline'
import { useDataSourceStore, useChartStore } from '@/stores'

const router = useRouter()
const dataSourceStore = useDataSourceStore()
const chartStore = useChartStore()

const selectedDataSource = ref('')
const chartConfig = ref({
  name: '',
  type: '',
  xAxis: '',
  yAxis: '',
  dataSourceId: ''
})

const chartTypes = [
  { value: 'bar', label: 'Bar Chart', icon: ChartBarIcon },
  { value: 'line', label: 'Line Chart', icon: PresentationChartLineIcon },
  { value: 'pie', label: 'Pie Chart', icon: ChartBarIcon },
  { value: 'scatter', label: 'Scatter Plot', icon: ChartBarIcon }
]

const availableColumns = computed(() => {
  if (!selectedDataSource.value) return []
  const dataSource = dataSourceStore.dataSources.find(ds => ds.id === selectedDataSource.value)
  return dataSource?.columns || []
})

const numericColumns = computed(() => {
  return availableColumns.value.filter(col => col.type === 'number')
})

const canCreateChart = computed(() => {
  return chartConfig.value.name && 
         chartConfig.value.type && 
         chartConfig.value.xAxis && 
         chartConfig.value.yAxis &&
         selectedDataSource.value
})

const onDataSourceChange = () => {
  chartConfig.value.dataSourceId = selectedDataSource.value
  chartConfig.value.xAxis = ''
  chartConfig.value.yAxis = ''
}

const createChart = async () => {
  if (!canCreateChart.value) return
  
  try {
    await chartStore.createChart({
      ...chartConfig.value,
      dataSourceId: selectedDataSource.value
    })
    router.push('/charts')
  } catch (error) {
    console.error('Failed to create chart:', error)
  }
}
</script>
