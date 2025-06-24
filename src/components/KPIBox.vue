<template>
  <div class="kpi-container h-full bg-white rounded-lg p-4 flex flex-col justify-center">
    <div v-if="error" class="flex items-center justify-center h-full text-red-500 text-sm">
      <ExclamationTriangleIcon class="h-5 w-5 mr-2" />
      {{ error }}
    </div>
    <div v-else-if="!hasValidData" class="flex items-center justify-center h-full text-gray-500 text-sm">
      <RectangleGroupIcon class="h-8 w-8 mr-2" />
      No data available
    </div>
    <div v-else class="text-center">
      <!-- Title -->
      <h3 v-if="chart.title" class="text-sm font-medium text-gray-700 mb-2 truncate">
        {{ chart.title }}
      </h3>
      
      <!-- Key Metric -->
      <div class="mb-2">
        <div class="text-2xl font-bold text-gray-900">
          {{ formatNumber(keyMetricValue) }}
        </div>
        <div class="text-xs text-gray-500">
          {{ chart.keyMetric }}
        </div>
      </div>
      
      <!-- Difference -->
      <div v-if="chart.previousMetric && previousMetricValue !== null" class="flex items-center justify-center">
        <div
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
          :class="{
            'bg-green-100 text-green-800': difference > 0,
            'bg-red-100 text-red-800': difference < 0,
            'bg-gray-100 text-gray-800': difference === 0
          }"
        >
          <component
            :is="difference > 0 ? ArrowUpIcon : difference < 0 ? ArrowDownIcon : MinusIcon"
            class="h-3 w-3 mr-1"
          />
          {{ formatDifference(difference) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ExclamationTriangleIcon, RectangleGroupIcon, ArrowUpIcon, ArrowDownIcon, MinusIcon } from '@heroicons/vue/24/outline'
import { useDataSourceStore } from '../stores/dataSource'
import type { ChartConfig } from '../stores/chart'

interface Props {
  chart: Partial<ChartConfig & { keyMetric?: string; previousMetric?: string; differenceType?: 'percentage' | 'value' }>
}

const props = defineProps<Props>()
const dataSourceStore = useDataSourceStore()

const error = computed(() => {
  if (!props.chart.dataSourceId || !props.chart.keyMetric) return ''
  
  const dataSource = dataSourceStore.getDataSourceById(props.chart.dataSourceId)
  if (!dataSource) return 'Data source not found'
  
  const keyMetricColumn = dataSource.columns.find(c => c.name === props.chart.keyMetric)
  if (!keyMetricColumn) return 'Key metric column not found'
  
  if (keyMetricColumn.type !== 'number') return 'Key metric must be a numeric field'
  
  if (props.chart.previousMetric) {
    const previousMetricColumn = dataSource.columns.find(c => c.name === props.chart.previousMetric)
    if (!previousMetricColumn) return 'Previous metric column not found'
    if (previousMetricColumn.type !== 'number') return 'Previous metric must be a numeric field'
  }
  
  return ''
})

const hasValidData = computed(() => {
  if (!props.chart.dataSourceId || !props.chart.keyMetric) return false
  const dataSource = dataSourceStore.getDataSourceById(props.chart.dataSourceId)
  return dataSource && dataSource.rows.length > 0 && !error.value
})

const keyMetricValue = computed(() => {
  if (!hasValidData.value) return 0
  
  const dataSource = dataSourceStore.getDataSourceById(props.chart.dataSourceId!)
  if (!dataSource) return 0
  
  const keyMetricColumn = dataSource.columns.find(c => c.name === props.chart.keyMetric)
  if (!keyMetricColumn) return 0
  
  // Sum all values in the key metric column
  return keyMetricColumn.values.reduce((sum, value) => {
    const num = Number(value)
    return sum + (isNaN(num) ? 0 : num)
  }, 0)
})

const previousMetricValue = computed(() => {
  if (!hasValidData.value || !props.chart.previousMetric) return null
  
  const dataSource = dataSourceStore.getDataSourceById(props.chart.dataSourceId!)
  if (!dataSource) return null
  
  const previousMetricColumn = dataSource.columns.find(c => c.name === props.chart.previousMetric)
  if (!previousMetricColumn) return null
  
  // Sum all values in the previous metric column
  return previousMetricColumn.values.reduce((sum, value) => {
    const num = Number(value)
    return sum + (isNaN(num) ? 0 : num)
  }, 0)
})

const difference = computed(() => {
  if (previousMetricValue.value === null || previousMetricValue.value === 0) return 0
  
  if (props.chart.differenceType === 'percentage') {
    return ((keyMetricValue.value - previousMetricValue.value) / previousMetricValue.value) * 100
  } else {
    return keyMetricValue.value - previousMetricValue.value
  }
})

const formatNumber = (value: number) => {
  if (Math.abs(value) >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M'
  } else if (Math.abs(value) >= 1000) {
    return (value / 1000).toFixed(1) + 'K'
  } else {
    return value.toLocaleString()
  }
}

const formatDifference = (value: number) => {
  if (props.chart.differenceType === 'percentage') {
    return Math.abs(value).toFixed(1) + '%'
  } else {
    return formatNumber(Math.abs(value))
  }
}
</script>

<style scoped>
.kpi-container {
  min-height: 120px;
}
</style>