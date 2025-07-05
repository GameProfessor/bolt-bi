<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center h-16">
          <button
            @click="goBack"
            class="mr-4 text-gray-400 hover:text-gray-600"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-2xl font-bold text-gray-900">Strategy Pattern Demo</h1>
        </div>
      </div>
    </div>

    <!-- Demo Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Strategy Pattern Overview -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-blue-900 mb-4">🎯 Strategy Pattern Benefits</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="bg-white p-4 rounded-lg">
            <h3 class="font-medium text-blue-800 mb-2">Easy Extension</h3>
            <p class="text-sm text-gray-600">Add new chart types with just one strategy class</p>
          </div>
          <div class="bg-white p-4 rounded-lg">
            <h3 class="font-medium text-blue-800 mb-2">Type Safety</h3>
            <p class="text-sm text-gray-600">Each chart type has its own validated configuration</p>
          </div>
          <div class="bg-white p-4 rounded-lg">
            <h3 class="font-medium text-blue-800 mb-2">Maintainability</h3>
            <p class="text-sm text-gray-600">Logic separated, easy to test and debug</p>
          </div>
        </div>
      </div>

      <!-- Chart Type Selection -->
      <div class="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">📊 Chart Type Selection</h2>
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <button
            v-for="type in availableChartTypes"
            :key="type"
            @click="selectChartType(type)"
            :class="[
              'p-4 rounded-lg border-2 transition-all duration-200',
              selectedChartType === type
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100'
            ]"
          >
            <div class="text-center">
              <div class="text-2xl mb-2">{{ getChartIcon(type) }}</div>
              <div class="font-medium">{{ type.charAt(0).toUpperCase() + type.slice(1) }}</div>
            </div>
          </button>
        </div>
      </div>

      <!-- Chart Configuration -->
      <div v-if="chartConfig" class="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">⚙️ Chart Configuration</h2>
        
        <!-- Base Configuration -->
        <div class="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 class="font-medium text-gray-900 mb-3">Base Configuration</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                v-model="chartConfig.title" 
                type="text" 
                placeholder="Enter chart title"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Data Source ID</label>
              <input 
                v-model="chartConfig.dataSourceId" 
                type="text" 
                placeholder="Enter data source ID"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
              <input 
                v-model="chartConfig.backgroundColor" 
                type="color" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Border Color</label>
              <input 
                v-model="chartConfig.borderColor" 
                type="color" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <!-- Type-Specific Configuration -->
        <div class="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 class="font-medium text-blue-900 mb-3">Type-Specific Configuration</h3>
          
          <!-- Bar Chart Config -->
          <div v-if="chartConfig.type === 'bar'" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">X-Axis Fields</label>
                <input 
                  v-model="chartConfig.xAxis" 
                  type="text" 
                  placeholder="field1,field2,field3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Y-Axis Fields</label>
                <input 
                  v-model="chartConfig.yAxis" 
                  type="text" 
                  placeholder="field1,field2,field3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label class="flex items-center">
                <input 
                  v-model="chartConfig.horizontal" 
                  type="checkbox" 
                  class="mr-2"
                />
                <span class="text-sm font-medium text-gray-700">Horizontal Bar</span>
              </label>
            </div>
          </div>

          <!-- Pie Chart Config -->
          <div v-if="chartConfig.type === 'pie'" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Dimension Fields</label>
                <input 
                  v-model="chartConfig.dimension" 
                  type="text" 
                  placeholder="field1,field2,field3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Metric Fields</label>
                <input 
                  v-model="chartConfig.metric" 
                  type="text" 
                  placeholder="field1,field2,field3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label class="flex items-center">
                <input 
                  v-model="chartConfig.showLegend" 
                  type="checkbox" 
                  class="mr-2"
                />
                <span class="text-sm font-medium text-gray-700">Show Legend</span>
              </label>
              <label class="flex items-center">
                <input 
                  v-model="chartConfig.showValues" 
                  type="checkbox" 
                  class="mr-2"
                />
                <span class="text-sm font-medium text-gray-700">Show Values</span>
              </label>
            </div>
          </div>

          <!-- Line Chart Config -->
          <div v-if="chartConfig.type === 'line'" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">X-Axis Fields</label>
                <input 
                  v-model="chartConfig.xAxis" 
                  type="text" 
                  placeholder="field1,field2,field3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Y-Axis Fields</label>
                <input 
                  v-model="chartConfig.yAxis" 
                  type="text" 
                  placeholder="field1,field2,field3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label class="flex items-center">
                <input 
                  v-model="chartConfig.smooth" 
                  type="checkbox" 
                  class="mr-2"
                />
                <span class="text-sm font-medium text-gray-700">Smooth Line</span>
              </label>
              <label class="flex items-center">
                <input 
                  v-model="chartConfig.area" 
                  type="checkbox" 
                  class="mr-2"
                />
                <span class="text-sm font-medium text-gray-700">Fill Area</span>
              </label>
            </div>
          </div>

          <!-- Card Chart Config -->
          <div v-if="chartConfig.type === 'card'" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Metric Fields</label>
                <input 
                  v-model="chartConfig.metric" 
                  type="text" 
                  placeholder="field1,field2,field3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Comparison Fields</label>
                <input 
                  v-model="chartConfig.comparison" 
                  type="text" 
                  placeholder="field1,field2,field3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Format</label>
                <select 
                  v-model="chartConfig.format" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="number">Number</option>
                  <option value="currency">Currency</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Decimal Places</label>
                <input 
                  v-model="chartConfig.decimalPlaces" 
                  type="number" 
                  min="0" 
                  max="10"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Validation and Actions -->
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-medium text-green-900 mb-2">Configuration Status</h3>
              <div class="flex items-center gap-2 mb-2">
                <div 
                  :class="[
                    'w-3 h-3 rounded-full',
                    isConfigValid ? 'bg-green-500' : 'bg-red-500'
                  ]"
                ></div>
                <span class="text-sm text-green-800">
                  {{ isConfigValid ? 'Configuration is valid' : 'Configuration is invalid' }}
                </span>
              </div>
              <div v-if="!isConfigValid" class="text-sm text-red-600">
                <p>Required fields: {{ requiredFields.join(', ') }}</p>
              </div>
            </div>
            <div class="flex gap-2">
              <button 
                @click="resetConfig"
                class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Reset
              </button>
              <button 
                @click="createChart"
                :disabled="!isConfigValid"
                class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Chart
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Chart Information -->
      <div v-if="selectedChartType" class="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">ℹ️ Chart Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-medium text-gray-900 mb-2">Required Fields</h3>
            <div class="text-sm text-gray-600">
              <div v-for="field in requiredFields" :key="field" class="mb-1">
                • {{ field }}
              </div>
            </div>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-medium text-gray-900 mb-2">Optional Fields</h3>
            <div class="text-sm text-gray-600">
              <div v-for="field in optionalFields" :key="field" class="mb-1">
                • {{ field }}
              </div>
            </div>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-medium text-gray-900 mb-2">Default Layout</h3>
            <div class="text-sm text-gray-600">
              Width: {{ defaultLayout.w }}, Height: {{ defaultLayout.h }}
            </div>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="font-medium text-gray-900 mb-2">Supported Data Types</h3>
            <div class="text-sm text-gray-600">
              <div v-for="type in supportedDataTypes" :key="type" class="mb-1">
                • {{ type }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Created Charts -->
      <div v-if="createdCharts.length > 0" class="bg-white border border-gray-200 rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">📈 Created Charts</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div 
            v-for="chart in createdCharts" 
            :key="chart.id"
            class="bg-gray-50 p-4 rounded-lg border border-gray-200"
          >
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-medium text-gray-900">{{ chart.title }}</h3>
              <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{{ chart.type }}</span>
            </div>
            <p class="text-sm text-gray-600 mb-2">Data Source: {{ chart.dataSourceId }}</p>
            <div class="flex gap-2">
              <button 
                @click="editChart(chart)"
                class="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Edit
              </button>
              <button 
                @click="deleteChart(chart.id)"
                class="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Console Output -->
      <div class="mt-8 bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
        <div class="mb-2 text-white">Console Output:</div>
        <div v-for="(log, index) in consoleLogs" :key="index" class="mb-1">
          {{ log }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ChartConfigFactory } from '@/factories'
import type { ChartType, ChartConfig } from '@/types/chart'

const router = useRouter()

const selectedChartType = ref<ChartType | ''>('')
const chartConfig = ref<ChartConfig | null>(null)
const createdCharts = ref<Array<ChartConfig & { id: string }>>([])
const consoleLogs = ref<string[]>([])

// Get available chart types from factory
const availableChartTypes = computed(() => ChartConfigFactory.getAvailableTypes())

// Get required fields for current chart type
const requiredFields = computed(() => {
  if (!selectedChartType.value) return []
  return ChartConfigFactory.getRequiredFields(selectedChartType.value)
})

// Get optional fields for current chart type
const optionalFields = computed(() => {
  if (!selectedChartType.value) return []
  return ChartConfigFactory.getOptionalFields(selectedChartType.value)
})

// Get default layout for current chart type
const defaultLayout = computed(() => {
  if (!selectedChartType.value) return { w: 0, h: 0 }
  return ChartConfigFactory.getDefaultLayout(selectedChartType.value)
})

// Get supported data types for current chart type
const supportedDataTypes = computed(() => {
  if (!selectedChartType.value) return []
  return ChartConfigFactory.getSupportedDataTypes(selectedChartType.value)
})

// Check if current config is valid
const isConfigValid = computed(() => {
  if (!chartConfig.value) return false
  return ChartConfigFactory.validateConfig(chartConfig.value)
})

// Get chart icon
const getChartIcon = (type: ChartType): string => {
  const icons: Partial<Record<ChartType, string>> = {
    bar: '📊',
    pie: '🥧',
    line: '📈',
    scatter: '🔍',
    card: '💳',
    doughnut: '🍩',
    area: '📊',
    bubble: '🫧',
    radar: '🎯',
    polarArea: '🎯',
    gauge: '📊',
    funnel: '🫙',
    heatmap: '🔥',
    treemap: '🌳'
  }
  return icons[type] || '📊'
}

// Handle chart type selection
const selectChartType = (type: ChartType) => {
  selectedChartType.value = type
  
  // Create new config using factory
  chartConfig.value = ChartConfigFactory.createConfig(type)
  
  // Log the action
  addLog(`Selected chart type: ${type}`)
  addLog(`Created default config for ${type} chart`)
}

// Reset configuration
const resetConfig = () => {
  if (selectedChartType.value) {
    chartConfig.value = ChartConfigFactory.createConfig(selectedChartType.value)
    addLog(`Reset configuration for ${selectedChartType.value} chart`)
  }
}

// Create chart
const createChart = () => {
  if (!chartConfig.value || !isConfigValid.value) return
  
  const newChart = {
    ...chartConfig.value,
    id: `chart-${Date.now()}`
  }
  
  createdCharts.value.push(newChart)
  addLog(`Created ${newChart.type} chart: "${newChart.title}"`)
  
  // Reset for next chart
  selectedChartType.value = ''
  chartConfig.value = null
}

// Edit chart
const editChart = (chart: ChartConfig & { id: string }) => {
  selectedChartType.value = chart.type
  chartConfig.value = { ...chart }
  addLog(`Editing ${chart.type} chart: "${chart.title}"`)
}

// Delete chart
const deleteChart = (chartId: string) => {
  const index = createdCharts.value.findIndex(chart => chart.id === chartId)
  if (index !== -1) {
    const chart = createdCharts.value[index]
    createdCharts.value.splice(index, 1)
    addLog(`Deleted ${chart.type} chart: "${chart.title}"`)
  }
}

// Add log to console
const addLog = (message: string) => {
  const timestamp = new Date().toLocaleTimeString()
  consoleLogs.value.push(`[${timestamp}] ${message}`)
  
  // Keep only last 20 logs
  if (consoleLogs.value.length > 20) {
    consoleLogs.value.shift()
  }
}

// Go back
const goBack = () => {
  router.go(-1)
}

// Initialize with demo data
onMounted(() => {
  addLog('Strategy Pattern Demo initialized')
  addLog(`Available chart types: ${availableChartTypes.value.join(', ')}`)
})
</script> 