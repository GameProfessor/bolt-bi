<template>
  <div class="chart-container">
    <div v-if="error" class="flex items-center justify-center h-full text-red-500 text-sm">
      <ExclamationTriangleIcon class="h-5 w-5 mr-2" />
      {{ error }}
    </div>
    <div v-else-if="!hasValidData" class="flex flex-col items-center justify-center h-full text-gray-500 text-sm">
      <component :is="chartTypeIcon" class="h-12 w-12 mb-2 text-gray-400" />
      <span class="text-gray-500">Chưa có dữ liệu</span>
    </div>
    <KPICard v-else-if="chart.type === 'card'" :chart="chart" class="w-full h-full" />
    <canvas v-else ref="canvasRef" class="w-full h-full"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController,
  PieController,
  ScatterController,
  ChartConfiguration,
  ChartType
} from 'chart.js'
import { 
  ExclamationTriangleIcon, 
  ChartBarIcon,
  PresentationChartLineIcon,
  ChartPieIcon,
  CircleStackIcon
} from '@heroicons/vue/24/outline'
import { useDataSourceStore } from '@/stores'
import type { DashboardChart } from '@/types/dashboard'
import KPICard from './KPICard.vue'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  BarController,
  LineController,
  PieController,
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

// Chart type icons mapping
const chartTypeIcons = {
  bar: ChartBarIcon,
  line: PresentationChartLineIcon,
  pie: ChartPieIcon,
  scatter: CircleStackIcon,
  card: ChartBarIcon // Default for card type
}

const chartTypeIcon = computed(() => {
  const chartType = props.chart.type || 'bar'
  return chartTypeIcons[chartType as keyof typeof chartTypeIcons] || ChartBarIcon
})

// Extract chart properties from DashboardChart structure
const chartData = computed(() => {
  return {
    type: props.chart.type,
    title: props.chart.base.title,
    dataSourceId: props.chart.base.dataSourceId,
    backgroundColor: props.chart.base.backgroundColor,
    borderColor: props.chart.base.borderColor,
    colorScheme: props.chart.base.colorScheme,
    // Extract type-specific properties
    xAxis: props.chart.properties.bar?.xAxis || props.chart.properties.line?.xAxis || props.chart.properties.scatter?.xAxis,
    yAxis: props.chart.properties.bar?.yAxis || props.chart.properties.line?.yAxis || props.chart.properties.scatter?.yAxis,
    category: props.chart.properties.pie?.category,
    value: props.chart.properties.pie?.value,
    keyMetric: props.chart.properties.card?.keyMetric,
    previousMetric: props.chart.properties.card?.previousMetric,
    horizontal: props.chart.properties.bar?.horizontal,
    smooth: props.chart.properties.line?.smooth,
    fillArea: props.chart.properties.line?.fillArea,
    differenceType: props.chart.properties.card?.differenceType,
    aggregation: props.chart.properties.card?.aggregation
  }
})

const hasValidData = computed(() => {
  if (!chartData.value.dataSourceId || !chartData.value.type) return false
  const dataSource = dataSourceStore.getDataSourceById(chartData.value.dataSourceId)
  if (!dataSource || dataSource.rows.length === 0) return false
  
  if (chartData.value.type === 'card') {
    return !!chartData.value.keyMetric
  } else if (chartData.value.type === 'pie') {
    return !!chartData.value.category
  } else if (chartData.value.type === 'bar') {
    return Array.isArray(chartData.value.xAxis) ? chartData.value.xAxis.length > 0 && !!chartData.value.yAxis : !!chartData.value.xAxis && !!chartData.value.yAxis
  } else {
    return !!chartData.value.xAxis && !!chartData.value.yAxis
  }
})

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

const createChart = async () => {
  error.value = ''
  if (!canvasRef.value || !hasValidData.value || chartData.value.type === 'card') return
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
    let chartDataConfig: any
    let chartOptions: any = {
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
    if (chartData.value.type === 'pie') {
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

      chartDataConfig = {
        labels,
        datasets: [{
          data: values,
          backgroundColor: generateColors(labels.length),
          borderColor: chartData.value.borderColor || '#ffffff',
          borderWidth: 1
        }]
      }
    } else if (chartData.value.type === 'bar') {
      // Multi-dimension grouping for bar chart
      const xAxes = Array.isArray(chartData.value.xAxis) ? chartData.value.xAxis : chartData.value.xAxis ? [chartData.value.xAxis] : [];
      const yAxes = Array.isArray(chartData.value.yAxis) ? chartData.value.yAxis : chartData.value.yAxis ? [chartData.value.yAxis] : [];
      if (yAxes.length === 0 || xAxes.length === 0) {
        error.value = 'X and Y axis required'
        return
      }
      // Group rows by all xAxes fields
      if (xAxes.every((f) => typeof f === 'string')) {
        const groupKey = (row: Record<string, any>) => xAxes.map(field => row[field]).join(' | ')
        const grouped: Record<string, Record<string, number>> = {};
        dataSource.rows.forEach((row: Record<string, any>) => {
          const key = groupKey(row)
          if (!grouped[key]) grouped[key] = {};
          yAxes.forEach((yField: string) => {
            const yVal = Number(row[yField])
            if (!isNaN(yVal)) {
              grouped[key][yField] = (grouped[key][yField] || 0) + yVal
            }
          })
        })
        const labels = Object.keys(grouped)
        if (labels.length === 0) {
          error.value = 'No valid data for chart'
          return
        }
        // Build datasets for each yAxis field
        const datasets = yAxes.map((yField: string, idx: number) => ({
          label: yField,
          data: labels.map(label => grouped[label] && typeof grouped[label][yField] === 'number' ? grouped[label][yField] : 0),
          backgroundColor: getPalette(chartData.value.colorScheme || 'default', yAxes.length)[idx],
          borderColor: chartData.value.borderColor || '#1d4ed8',
          borderWidth: 1
        }))
        chartDataConfig = {
          labels,
          datasets
        }
        chartOptions.scales = {
          y: {
            beginAtZero: true,
            title: {
              display: !chartData.value.horizontal,
              text: yAxes.join(', '),
              font: { size: 10 }
            },
            ticks: { font: { size: 9 } }
          },
          x: {
            title: {
              display: chartData.value.horizontal,
              text: xAxes.join(', '),
              font: { size: 10 }
            },
            ticks: { font: { size: 9 }, maxRotation: 45, minRotation: 0 }
          }
        }
        chartOptions.indexAxis = chartData.value.horizontal ? 'y' : 'x'
      } else {
        error.value = 'Invalid X-axis fields'
        return
      }
    } else {
      const xColumn = dataSource.columns.find(c => c.name === chartData.value.xAxis)
      const yColumn = dataSource.columns.find(c => c.name === chartData.value.yAxis)
      
      if (!xColumn || !yColumn) {
        error.value = 'Required columns not found'
        return
      }

      // Filter out null/undefined values and ensure numeric y-values
      const xAxisField = Array.isArray(chartData.value.xAxis) ? chartData.value.xAxis[0] : chartData.value.xAxis
      const yAxisField = Array.isArray(chartData.value.yAxis) ? chartData.value.yAxis[0] : chartData.value.yAxis
      const validData = dataSource.rows
        .map((row) => ({
          x: row[xAxisField!],
          y: Number(row[yAxisField!])
        }))
        .filter(item => item.x != null && item.x !== '' && !isNaN(item.y))

      if (validData.length === 0) {
        error.value = 'No valid data points found'
        return
      }

      if (chartData.value.type === 'scatter') {
        chartDataConfig = {
          datasets: [{
            label: `${chartData.value.yAxis} vs ${chartData.value.xAxis}`,
            data: validData,
            backgroundColor: chartData.value.backgroundColor || '#3b82f6',
            borderColor: chartData.value.borderColor || '#1d4ed8',
            pointRadius: 3,
            pointHoverRadius: 4
          }]
        }
      } else if (chartData.value.type === 'line') {
        // Sort by x-axis for line charts
        validData.sort((a, b) => {
          if (typeof a.x === 'number' && typeof b.x === 'number') {
            return a.x - b.x
          }
          return String(a.x).localeCompare(String(b.x))
        })

        chartDataConfig = {
          labels: validData.map(d => d.x),
          datasets: [{
            label: chartData.value.yAxis,
            data: validData.map(d => d.y),
            backgroundColor: chartData.value.backgroundColor || '#3b82f6',
            borderColor: chartData.value.borderColor || '#1d4ed8',
            borderWidth: 2,
            fill: chartData.value.fillArea || false,
            tension: chartData.value.smooth ? 0.4 : 0,
            pointRadius: 2,
            pointHoverRadius: 4
          }]
        }
        chartOptions.scales = {
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
    }

    await nextTick()
    if (canvasRef.value) {
      chartInstance = new ChartJS(canvasRef.value, { 
        type: chartData.value.type as ChartType, 
        data: chartDataConfig, 
        options: chartOptions 
      })
    }
  } catch (err) {
    console.error('Error creating chart:', err)
    error.value = 'Failed to create chart'
  }
}

const generateColors = (count: number) => {
  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1',
    '#14b8a6', '#f43f5e', '#a855f7', '#22c55e', '#eab308'
  ]
  
  const result = []
  for (let i = 0; i < count; i++) {
    result.push(colors[i % colors.length])
  }
  return result
}

// Watch for changes in chart properties and recreate chart
watch(() => chartData.value, () => {
  if (chartData.value.type && hasValidData.value) {
    createChart()
  }
}, { deep: true })

// Watch for changes in data source
watch(() => dataSourceStore.dataSources, () => {
  if (chartData.value.type && hasValidData.value) {
        createChart()
    }
}, { deep: true })

onMounted(() => {
  if (hasValidData.value && props.chart.type !== 'card') {
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

// Export chart data to CSV
function exportCSV() {
  if (!hasValidData.value) {
    alert('No data to export')
    return
  }
  const dataSource = dataSourceStore.getDataSourceById(chartData.value.dataSourceId!)
  if (!dataSource) {
    alert('Data source not found')
    return
  }
  let csv = ''
  if (chartData.value.type === 'pie') {
    // Pie: category and count
    const categoryColumn = dataSource.columns.find(c => c.name === chartData.value.category)
    if (!categoryColumn) return
    const categoryCounts = {} as Record<string, number>
    categoryColumn.values.forEach(value => {
      if (value != null && value !== '') {
        const key = String(value)
        categoryCounts[key] = (categoryCounts[key] || 0) + 1
      }
    })
    csv += 'Category,Count\n'
    for (const [cat, count] of Object.entries(categoryCounts)) {
      csv += `"${cat}",${count}\n`
    }
  } else if (chartData.value.type === 'bar') {
    // Bar: x labels and y values for each dataset
    const xAxes = Array.isArray(chartData.value.xAxis) ? chartData.value.xAxis : chartData.value.xAxis ? [chartData.value.xAxis] : []
    const yAxes = Array.isArray(chartData.value.yAxis) ? chartData.value.yAxis : chartData.value.yAxis ? [chartData.value.yAxis] : []
    if (xAxes.length === 0 || yAxes.length === 0) return
    // Group rows by all xAxes fields
    const groupKey = (row: Record<string, any>) => xAxes.map(field => row[field]).join(' | ')
    const grouped: Record<string, Record<string, number>> = {}
    dataSource.rows.forEach((row: Record<string, any>) => {
      const key = groupKey(row)
      if (!grouped[key]) grouped[key] = {}
      yAxes.forEach((yField: string) => {
        const yVal = Number(row[yField])
        if (!isNaN(yVal)) {
          grouped[key][yField] = (grouped[key][yField] || 0) + yVal
        }
      })
    })
    // Header
    csv += xAxes.join(' | ')
    yAxes.forEach(y => { csv += `,${y}` })
    csv += '\n'
    // Rows
    for (const label of Object.keys(grouped)) {
      csv += `"${label}"`
      yAxes.forEach(y => { csv += `,${grouped[label][y] ?? 0}` })
      csv += '\n'
    }
  } else if (chartData.value.type === 'line' || chartData.value.type === 'scatter') {
    // Line/Scatter: x and y values
    const xField = Array.isArray(chartData.value.xAxis) ? chartData.value.xAxis[0] : chartData.value.xAxis
    const yField = Array.isArray(chartData.value.yAxis) ? chartData.value.yAxis[0] : chartData.value.yAxis
    if (!xField || !yField) return
    csv += `${xField},${yField}\n`
    dataSource.rows.forEach((row: Record<string, any>) => {
      const x = row[xField]
      const y = row[yField]
      if (x != null && y != null && y !== '' && !isNaN(Number(y))) {
        csv += `"${x}",${y}\n`
      }
    })
  } else if (chartData.value.type === 'card') {
    // KPI card: just export the key metric column
    const keyMetric = chartData.value.keyMetric
    if (!keyMetric) return
    csv += `${keyMetric}\n`
    dataSource.rows.forEach((row: Record<string, any>) => {
      const val = row[keyMetric]
      if (val != null && val !== '') {
        csv += `${val}\n`
      }
    })
  }
  // Download CSV
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = (chartData.value.title || 'chart-data') + '.csv'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

defineExpose({ exportCSV })
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