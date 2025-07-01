<template>
  <div class="chart-container">
    <div v-if="error" class="flex items-center justify-center h-full text-red-500 text-sm">
      <ExclamationTriangleIcon class="h-5 w-5 mr-2" />
      {{ error }}
    </div>
    <div v-else-if="!hasValidData" class="flex flex-col items-center justify-center h-full text-gray-500 text-sm">
      <CircleStackIcon class="h-12 w-12 mb-2 text-gray-400" />
      <span class="text-gray-500">Chưa có dữ liệu</span>
    </div>
    <canvas v-else ref="canvasRef" class="w-full h-full"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ScatterController
} from 'chart.js'
import { 
  ExclamationTriangleIcon, 
  CircleStackIcon
} from '@heroicons/vue/24/outline'
import { useDataSourceStore } from '@/stores'
import type { DashboardChart } from '@/types/dashboard'

// Register Chart.js components
ChartJS.register(
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ScatterController
)

interface Props {
  chart: DashboardChart
}

const props = defineProps<Props>()
const dataSourceStore = useDataSourceStore()

const canvasRef = ref<HTMLCanvasElement>()
const error = ref<string>('')
let chartInstance: ChartJS | null = null

// Extract chart properties from DashboardChart structure
const chartData = computed(() => {
  return {
    title: props.chart.base.title,
    dataSourceId: props.chart.base.dataSourceId,
    backgroundColor: props.chart.base.backgroundColor,
    borderColor: props.chart.base.borderColor,
    colorScheme: props.chart.base.colorScheme,
    xAxis: props.chart.properties.scatter?.xAxis || '',
    yAxis: props.chart.properties.scatter?.yAxis || ''
  }
})

const hasValidData = computed(() => {
  if (!chartData.value.dataSourceId) return false
  const dataSource = dataSourceStore.getDataSourceById(chartData.value.dataSourceId)
  if (!dataSource || dataSource.rows.length === 0) return false
  
  return !!chartData.value.xAxis && !!chartData.value.yAxis
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

    const xColumn = dataSource.columns.find(c => c.name === chartData.value.xAxis)
    const yColumn = dataSource.columns.find(c => c.name === chartData.value.yAxis)
    
    if (!xColumn || !yColumn) {
      error.value = 'Required columns not found'
      return
    }

    // Filter out null/undefined values and ensure numeric y-values
    const validData = dataSource.rows
      .map((row) => ({
        x: row[chartData.value.xAxis!],
        y: Number(row[chartData.value.yAxis!])
      }))
      .filter(item => item.x != null && item.x !== '' && !isNaN(item.y))

    if (validData.length === 0) {
      error.value = 'No valid data points found'
      return
    }

    const chartDataConfig = {
      datasets: [{
        label: `${chartData.value.yAxis} vs ${chartData.value.xAxis}`,
        data: validData,
        backgroundColor: chartData.value.backgroundColor || '#3b82f6',
        borderColor: chartData.value.borderColor || '#1d4ed8',
        pointRadius: 3,
        pointHoverRadius: 4
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
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: chartData.value.yAxis,
            font: { size: 10 }
          },
          ticks: { font: { size: 9 } }
        },
        x: {
          title: {
            display: true,
            text: chartData.value.xAxis,
            font: { size: 10 }
          },
          ticks: { font: { size: 9 }, maxRotation: 45, minRotation: 0 }
        }
      }
    }

    await nextTick()
    if (canvasRef.value) {
      chartInstance = new ChartJS(canvasRef.value, { 
        type: 'scatter', 
        data: chartDataConfig, 
        options: chartOptions 
      })
    }
  } catch (err) {
    console.error('Error creating scatter chart:', err)
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
