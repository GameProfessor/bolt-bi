<template>
  <div class="chart-factory">
    <div v-if="error" class="flex items-center justify-center h-full text-red-500 text-sm">
      <ExclamationTriangleIcon class="h-5 w-5 mr-2" />
      {{ error }}
    </div>
    <div v-else-if="!chart" class="flex flex-col items-center justify-center h-full text-gray-500 text-sm">
      <Squares2X2Icon class="h-12 w-12 mb-2 text-gray-400" />
      <span class="text-gray-500">No chart data</span>
    </div>
    <component 
      v-else
      :is="chartComponent" 
      :chart="chart" 
      :key="`${chart.id}-${chart.updatedAt?.getTime() || chart.createdAt.getTime()}`"
      class="w-full h-full" 
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  ExclamationTriangleIcon, 
  Squares2X2Icon
} from '@heroicons/vue/24/outline'
import type { DashboardChart } from '@/types/dashboard'

// Import all chart components
import BarChart from './types/BarChart.vue'
import LineChart from './types/LineChart.vue'
import PieChart from './types/PieChart.vue'
import ScatterChart from './types/ScatterChart.vue'
import CardChart from './types/CardChart.vue'

interface Props {
  chart: DashboardChart | null
}

const props = defineProps<Props>()

// Chart component mapping
const chartComponentMap = {
  bar: BarChart,
  line: LineChart,
  pie: PieChart,
  scatter: ScatterChart,
  card: CardChart
} as const

type SupportedChartType = keyof typeof chartComponentMap

const error = computed(() => {
  if (!props.chart) return ''
  if (!props.chart.type) return 'Chart type not specified'
  if (!(props.chart.type in chartComponentMap)) return `Unsupported chart type: ${props.chart.type}`
  return ''
})

const chartComponent = computed(() => {
  if (!props.chart || error.value) return null
  const chartType = props.chart.type as SupportedChartType
  return chartComponentMap[chartType] || null
})
</script>

<style scoped>
.chart-factory {
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 100px;
  overflow: hidden;
}

</style>
