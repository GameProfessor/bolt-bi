<template>
  <div class="h-full w-full flex flex-col p-4 rounded-lg shadow-sm" :style="{ backgroundColor: chartData.backgroundColor }">
    <div v-if="chartData.title" class="mb-3">
      <h3 class="text-sm font-medium text-gray-900 truncate">{{ chartData.title }}</h3>
    </div>
    <div v-if="error" class="flex items-center justify-center h-full text-red-500 text-sm">
      <ExclamationTriangleIcon class="h-5 w-5 mr-2" />
      {{ error }}
    </div>
    <div v-else class="flex-1 flex flex-col justify-center">
      <div class="text-center mb-2">
        <div class="text-2xl font-bold" :style="{ color: chartData.color }">
          {{ formattedValue }}
        </div>
        <div class="text-xs text-gray-500 uppercase tracking-wide">
          {{ chartData.suffix }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import { useDataSourceStore } from '@/stores'
import type { DashboardChart } from '@/types/dashboard'
import type { CardChartConfig } from '@/types/chart'

interface Props {
  chart: DashboardChart
}
const props = defineProps<Props>()
const dataSourceStore = useDataSourceStore()

const chartData = computed(() => {
  const base = props.chart.base
  const cardProps = (props.chart.properties.card || {}) as Partial<CardChartConfig>
  return {
    title: base.title,
    dataSourceId: base.dataSourceId,
    backgroundColor: cardProps.backgroundColor || '#EFF6FF',
    color: cardProps.color || '#3B82F6',
    field: typeof cardProps.field === 'string' ? cardProps.field : '',
    aggregation: cardProps.aggregation || 'sum',
    prefix: cardProps.prefix || '',
    suffix: cardProps.suffix || '',
    decimalPlaces: typeof cardProps.decimalPlaces === 'number' ? cardProps.decimalPlaces : 0
  }
})

const error = computed(() => {
  if (!chartData.value.dataSourceId) return 'No data source selected'
  if (!chartData.value.field) return 'No field selected'
  const dataSource = dataSourceStore.getDataSourceById(chartData.value.dataSourceId)
  if (!dataSource) return 'Data source not found'
  const keyColumn = dataSource.columns.find(c => c.name === chartData.value.field)
  if (!keyColumn) return 'Field column not found'
  return ''
})

const value = computed(() => {
  if (error.value) return null
  const dataSource = dataSourceStore.getDataSourceById(chartData.value.dataSourceId)
  if (!dataSource) return null
  const keyColumn = dataSource.columns.find(c => c.name === chartData.value.field)
  if (!keyColumn) return null
  const values = dataSource.rows.map(row => row[chartData.value.field]).filter(v => v !== undefined && v !== null)
  if (!values.length) return null
  if (keyColumn.type === 'number') {
    switch (chartData.value.aggregation) {
      case 'avg':
        return values.reduce((a, b) => Number(a) + Number(b), 0) / values.length
      case 'min':
        return Math.min(...values.map(Number))
      case 'max':
        return Math.max(...values.map(Number))
      case 'sum':
      default:
        return values.reduce((a, b) => Number(a) + Number(b), 0)
    }
  } else {
    return values[0]
  }
})

const formattedValue = computed(() => {
  if (value.value == null || isNaN(value.value as number)) return '--'
  const val = value.value as number
  const dp = chartData.value.decimalPlaces ?? 0
  return `${chartData.value.prefix ?? ''}${val.toLocaleString(undefined, { minimumFractionDigits: dp, maximumFractionDigits: dp })}${chartData.value.suffix ?? ''}`
})
</script>