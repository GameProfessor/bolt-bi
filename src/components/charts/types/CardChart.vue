<template>
  <div
    class="h-full w-full flex flex-col justify-between rounded-2xl shadow-lg transition-all duration-200"
    :style="cardStyle.containerStyle"
    :class="cardStyle.containerClass"
  >
    <div :class="cardStyle.innerClass" class="flex-1 flex flex-col justify-center items-center px-6 py-4">
      <div v-if="chartData.title" class="mb-2 w-full flex items-center justify-center">
        <h3 :class="cardStyle.titleClass">
          {{ chartData.title }}
        </h3>
      </div>
      <div v-if="error" class="flex flex-col items-center justify-center h-full text-red-500 text-base font-medium py-8">
        <ExclamationTriangleIcon class="h-8 w-8 mb-2" />
        <span>{{ error }}</span>
      </div>
      <div v-else class="flex flex-col items-center justify-center flex-1">
        <div :class="cardStyle.valueRowClass">
          <span v-if="chartData.prefix" :class="cardStyle.prefixClass">{{ chartData.prefix }}</span>
          <span :class="cardStyle.valueClass">
            {{ formattedValueOnly }}
          </span>
          <span v-if="chartData.suffix" :class="cardStyle.suffixClass">{{ chartData.suffix }}</span>
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

const cardColorSchemes = {
  default: {
    backgroundColor: '#EFF6FF',
    color: '#3B82F6',
    titleClass: 'text-base font-semibold text-gray-800 text-center',
    valueClass: 'text-4xl md:text-5xl font-extrabold text-center',
    valueRowClass: 'flex items-baseline gap-2 mb-1 justify-center',
    prefixClass: 'text-lg font-medium text-gray-500',
    suffixClass: 'text-lg font-medium text-gray-500',
    containerClass: '',
    innerClass: '',
    containerStyle: {},
  },
  success: {
    backgroundColor: '#ECFDF5',
    color: '#10B981',
    titleClass: 'text-base font-semibold text-green-900 text-center',
    valueClass: 'text-4xl md:text-5xl font-extrabold text-center text-green-700',
    valueRowClass: 'flex items-baseline gap-2 mb-1 justify-center',
    prefixClass: 'text-lg font-medium text-green-500',
    suffixClass: 'text-lg font-medium text-green-500',
    containerClass: '',
    innerClass: '',
    containerStyle: {},
  },
  danger: {
    backgroundColor: '#FEF2F2',
    color: '#EF4444',
    titleClass: 'text-base font-semibold text-red-900 text-center',
    valueClass: 'text-4xl md:text-5xl font-extrabold text-center text-red-700',
    valueRowClass: 'flex items-baseline gap-2 mb-1 justify-center',
    prefixClass: 'text-lg font-medium text-red-500',
    suffixClass: 'text-lg font-medium text-red-500',
    containerClass: '',
    innerClass: '',
    containerStyle: {},
  },
  info: {
    backgroundColor: '#F0F9FF',
    color: '#0EA5E9',
    titleClass: 'text-base font-semibold text-sky-900 text-center',
    valueClass: 'text-4xl md:text-5xl font-extrabold text-center text-sky-700',
    valueRowClass: 'flex items-baseline gap-2 mb-1 justify-center',
    prefixClass: 'text-lg font-medium text-sky-500',
    suffixClass: 'text-lg font-medium text-sky-500',
    containerClass: '',
    innerClass: '',
    containerStyle: {},
  },
  dark: {
    backgroundColor: '#1E293B',
    color: '#F1F5F9',
    titleClass: 'text-base font-semibold text-slate-100 text-center',
    valueClass: 'text-4xl md:text-5xl font-extrabold text-center text-white',
    valueRowClass: 'flex items-baseline gap-2 mb-1 justify-center',
    prefixClass: 'text-lg font-medium text-slate-300',
    suffixClass: 'text-lg font-medium text-slate-300',
    containerClass: '',
    innerClass: '',
    containerStyle: {},
  },
}

const chartData = computed(() => {
  const base = props.chart.base
  const cardProps = (props.chart.properties.card || {}) as Partial<CardChartConfig>
  return {
    title: base.title,
    dataSourceId: base.dataSourceId,
    backgroundColor: cardProps.backgroundColor || '',
    color: cardProps.color || '',
    colorScheme: cardProps.colorScheme || 'default',
    field: typeof cardProps.field === 'string' ? cardProps.field : '',
    aggregation: cardProps.aggregation || 'sum',
    prefix: cardProps.prefix || '',
    suffix: cardProps.suffix || '',
    decimalPlaces: typeof cardProps.decimalPlaces === 'number' ? cardProps.decimalPlaces : 0
  }
})

const cardStyle = computed(() => {
  const scheme = cardColorSchemes[chartData.value.colorScheme as keyof typeof cardColorSchemes] || cardColorSchemes.default
  return {
    containerStyle: { backgroundColor: chartData.value.backgroundColor || scheme.backgroundColor },
    containerClass: scheme.containerClass,
    innerClass: scheme.innerClass,
    titleClass: scheme.titleClass,
    valueClass: scheme.valueClass,
    valueRowClass: scheme.valueRowClass,
    prefixClass: scheme.prefixClass,
    suffixClass: scheme.suffixClass,
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

const formattedValueOnly = computed(() => {
  if (value.value == null || (typeof value.value === 'number' && isNaN(value.value))) return '--'
  const val = value.value as number | string
  if (typeof val === 'number') {
    const dp = chartData.value.decimalPlaces ?? 0
    return val.toLocaleString(undefined, { minimumFractionDigits: dp, maximumFractionDigits: dp })
  }
  return val
})
</script>

<style scoped>
/* Responsive, modern card style */
</style>