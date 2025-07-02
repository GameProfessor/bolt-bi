<template>
  <div class="chart-container">
    <div v-if="error" class="flex items-center justify-center h-full text-red-500 text-sm">
      <ExclamationTriangleIcon class="h-5 w-5 mr-2" />
      {{ error }}
    </div>
    <div v-else-if="!hasValidData" class="flex flex-col items-center justify-center h-full text-gray-500 text-sm">
      <ChartPieIcon class="h-12 w-12 mb-2 text-gray-400" />
      <span class="text-gray-500">Chưa có dữ liệu</span>
    </div>
    <canvas v-else ref="canvasRef" class="w-full h-full"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PieController
} from 'chart.js'
import { 
  ExclamationTriangleIcon, 
  ChartPieIcon
} from '@heroicons/vue/24/outline'
import { useDataSourceStore } from '@/stores'
import type { DashboardChart } from '@/types/dashboard'

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PieController
)

interface Props {
  chart: DashboardChart
}

const props = defineProps<Props>()
const dataSourceStore = useDataSourceStore()

const canvasRef = ref<HTMLCanvasElement>()
const error = ref<string>('')
let chartInstance: ChartJS | null = null

// Add color palettes
const colorPalettes: Record<string, string[]> = {
  default: [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1',
    '#14b8a6', '#f43f5e', '#a855f7', '#22c55e', '#eab308'
  ],
  pastel: [
    '#a5b4fc', '#fbcfe8', '#bbf7d0', '#fde68a', '#ddd6fe',
    '#bae6fd', '#fed7aa', '#d9f99d', '#f9a8d4', '#c7d2fe',
    '#99f6e4', '#fecdd3', '#e9d5ff', '#bbf7d0', '#fef08a'
  ],
  vivid: [
    '#e11d48', '#2563eb', '#059669', '#f59e42', '#a21caf',
    '#0ea5e9', '#f43f5e', '#22d3ee', '#facc15', '#7c3aed',
    '#f472b6', '#16a34a', '#fbbf24', '#f87171', '#38bdf8'
  ],
  earth: [
    '#a16207', '#713f12', '#166534', '#155e75', '#7c2d12',
    '#be185d', '#4d7c0f', '#b91c1c', '#0e7490', '#a21caf',
    '#ca8a04', '#ea580c', '#15803d', '#1e293b', '#f59e42'
  ]
}

function getPalette(scheme: string, count: number): string[] {
  const palette = colorPalettes[scheme] || colorPalettes['default']
  const result = []
  for (let i = 0; i < count; i++) {
    result.push(palette[i % palette.length])
  }
  return result
}

// Extract chart properties from DashboardChart structure
const chartData = computed(() => {
  return {
    title: props.chart.base.title,
    dataSourceId: props.chart.base.dataSourceId,
    backgroundColor: props.chart.base.backgroundColor,
    borderColor: props.chart.base.borderColor,
    colorScheme: props.chart.base.colorScheme,
    category: props.chart.properties.pie?.category || '',
    value: props.chart.properties.pie?.value || ''
  }
})

const hasValidData = computed(() => {
  if (!chartData.value.dataSourceId) return false
  const dataSource = dataSourceStore.getDataSourceById(chartData.value.dataSourceId)
  if (!dataSource || dataSource.rows.length === 0) return false
  
  return !!chartData.value.category
})

const createChart = async () => {
  error.value = ''
  if (!canvasRef.value || !hasValidData.value) return
  
  try {
    const dataSource = dataSourceStore.getDataSourceById(chartData.value.dataSourceId!)
    if (!dataSource) {
      error.value = 'Data source not found'
      return
    }

    // Destroy existing chart
    if (chartInstance) {
      chartInstance.destroy()
      chartInstance = null
    }

    const categoryColumn = dataSource.columns.find(c => c.name === chartData.value.category)
    if (!categoryColumn) {
      error.value = 'Category column not found'
      return
    }

    // Count occurrences of each category
    const categoryCounts: { [key: string]: number } = {}
    categoryColumn.values.forEach(value => {
      if (value != null && value !== '') {
        const key = String(value)
        categoryCounts[key] = (categoryCounts[key] || 0) + 1
      }
    })

    const labels = Object.keys(categoryCounts)
    const values = Object.values(categoryCounts)

    if (labels.length === 0) {
      error.value = 'No valid data for pie chart'
      return
    }

    const chartDataConfig = {
      labels,
      datasets: [{
        data: values,
        backgroundColor: getPalette(chartData.value.colorScheme || 'default', labels.length),
        borderColor: chartData.value.borderColor || '#ffffff',
        borderWidth: 1
      }]
    }

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top' as const,
          labels: {
            boxWidth: 12,
            padding: 8,
            font: {
              size: 10
            }
          }
        },
        title: {
          display: !!chartData.value.title,
          text: chartData.value.title || '',
          font: {
            size: 12
          },
          padding: {
            top: 5,
            bottom: 10
          }
        },
        tooltip: {
          titleFont: {
            size: 11
          },
          bodyFont: {
            size: 10
          }
        }
      },
      animation: {
        duration: 0 // Disable animations for better performance
      },
      layout: {
        padding: {
          top: 5,
          right: 5,
          bottom: 5,
          left: 5
        }
      }
    }

    await nextTick()
    if (canvasRef.value) {
      chartInstance = new ChartJS(canvasRef.value, { 
        type: 'pie', 
        data: chartDataConfig, 
        options: chartOptions 
      })
    }
  } catch (err) {
    console.error('Error creating pie chart:', err)
    error.value = 'Failed to create chart'
  }
}

// Watch for changes in chart properties and recreate chart
watch(() => chartData.value, () => {
  if (hasValidData.value) {
    createChart()
  }
}, { deep: true })

// Watch for changes in data source
watch(() => dataSourceStore.dataSources, () => {
  if (hasValidData.value) {
    createChart()
  }
}, { deep: true })

onMounted(() => {
  if (hasValidData.value) {
    nextTick(() => {
      createChart()
    })
  }
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 100px;
  overflow: hidden;
}

canvas {
  max-width: 100%;
  max-height: 100%;
  display: block;
}
</style>
