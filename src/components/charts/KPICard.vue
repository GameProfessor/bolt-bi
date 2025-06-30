<template>
 
    <div class="h-full flex flex-col p-4 bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-sm">
      <div v-if="chart.base.title" class="mb-3">
        <h3 class="text-sm font-medium text-gray-900 truncate text-center">{{ chart.base.title }}</h3>
      </div>
      
      <div v-if="error" class="flex items-center justify-center h-full text-red-500 text-sm">
        <ExclamationTriangleIcon class="h-5 w-5 mr-2" />
        {{ error }}
      </div>
      
      <div v-else-if="!hasValidData" class="flex items-center justify-center h-full text-gray-500 text-sm">
        <ChartBarIcon class="h-8 w-8 mr-2" />
        No data available
      </div>
      
      <div v-else class="flex-1 flex flex-col justify-center">
        <!-- Key Metric -->
        <div class="text-center mb-4">
          <div class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-500">
            {{ formatValue(keyMetricValue) }}
          </div>
          <div class="text-xs text-gray-500 uppercase tracking-wider mt-1">
            {{ chart.properties.card?.keyMetric }}
          </div>
        </div>
        
        <!-- Difference -->
        <div v-if="chart.properties.card?.previousMetric && previousMetricValue !== null" class="text-center">
          <div class="flex items-center justify-center">
            <span
              class="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium shadow-sm"
              :class="{
                'bg-green-100 text-green-800 border border-green-200': difference > 0,
                'bg-red-100 text-red-800 border border-red-200': difference < 0,
                'bg-gray-100 text-gray-800 border border-gray-200': difference === 0
              }"
            >
              <ArrowUpIcon v-if="difference > 0" class="h-3 w-3 mr-1" />
              <ArrowDownIcon v-if="difference < 0" class="h-3 w-3 mr-1" />
              <MinusIcon v-if="difference === 0" class="h-3 w-3 mr-1" />
              {{ formatDifference(difference) }}
            </span>
          </div>
          <div class="text-xs text-gray-500 mt-2">
            vs {{ formatValue(previousMetricValue) }} ({{ chart.properties.card?.previousMetric }})
          </div>
        </div>
      </div>
    </div>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  ExclamationTriangleIcon, 
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon
} from '@heroicons/vue/24/outline'
import { useDataSourceStore } from '@/stores'
import type { DashboardChart } from '@/types/dashboard'

interface Props {
  chart: DashboardChart
}

const props = defineProps<Props>()
const dataSourceStore = useDataSourceStore()

const hasValidData = computed(() => {
  if (!props.chart.base.dataSourceId || !props.chart.properties.card?.keyMetric) return false
  const dataSource = dataSourceStore.getDataSourceById(props.chart.base.dataSourceId)
  return !!(dataSource && dataSource.rows.length > 0)
})

const error = computed(() => {
  if (!props.chart.base.dataSourceId) return 'No data source selected'
  if (!props.chart.properties.card?.keyMetric) return 'No key metric selected'
  const dataSource = dataSourceStore.getDataSourceById(props.chart.base.dataSourceId)
  if (!dataSource) return 'Data source not found'
  const keyColumn = dataSource.columns.find(c => c.name === props.chart.properties.card?.keyMetric)
  if (!keyColumn) return 'Key metric column not found'
  if (props.chart.properties.card?.previousMetric) {
    const prevColumn = dataSource.columns.find(c => c.name === props.chart.properties.card?.previousMetric)
    if (!prevColumn) return 'Previous metric column not found'
  }
  return ''
})

const keyMetricValue = computed(() => {
  if (!hasValidData.value || error.value) return ''
  const dataSource = dataSourceStore.getDataSourceById(props.chart.base.dataSourceId!)!
  const keyColumn = dataSource.columns.find(c => c.name === props.chart.properties.card?.keyMetric)!
  // If the column is numeric, sum all values; otherwise, join as string
  if (keyColumn.type === 'number') {
    return keyColumn.values.reduce((sum, value) => {
      const num = Number(value)
      return sum + (isNaN(num) ? 0 : num)
    }, 0)
  } else {
    // For string or other types, join all values with comma (or just show the first value)
    return keyColumn.values.length > 0 ? keyColumn.values[0] : ''
  }
})

const previousMetricValue = computed(() => {
  if (!hasValidData.value || error.value || !props.chart.properties.card?.previousMetric) return null
  const dataSource = dataSourceStore.getDataSourceById(props.chart.base.dataSourceId!)!
  const prevColumn = dataSource.columns.find(c => c.name === props.chart.properties.card?.previousMetric)
  if (!prevColumn) return null
  if (prevColumn.type === 'number') {
    return prevColumn.values.reduce((sum, value) => {
      const num = Number(value)
      return sum + (isNaN(num) ? 0 : num)
    }, 0)
  } else {
    return prevColumn.values.length > 0 ? prevColumn.values[0] : null
  }
})

const difference = computed(() => {
  if (previousMetricValue.value === null) return 0
  // Only calculate difference if both are numbers
  if (typeof keyMetricValue.value === 'number' && typeof previousMetricValue.value === 'number') {
    if (props.chart.properties.card?.differenceType === 'percentage') {
      if (previousMetricValue.value === 0) return 0
      return ((keyMetricValue.value - previousMetricValue.value) / Math.abs(previousMetricValue.value)) * 100
    } else {
      return keyMetricValue.value - previousMetricValue.value
    }
  }
  return 0
})

const formatValue = (value: any) => {
  if (typeof value === 'number') {
    if (Math.abs(value) >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M'
    } else if (Math.abs(value) >= 1000) {
      return (value / 1000).toFixed(1) + 'K'
    } else {
      return value.toLocaleString()
    }
  }
  return value
}

const formatDifference = (diff: number) => {
  if (props.chart.properties.card?.differenceType === 'percentage') {
    return Math.abs(diff).toFixed(1) + '%'
  } else {
    return formatValue(Math.abs(diff))
  }
}
</script>