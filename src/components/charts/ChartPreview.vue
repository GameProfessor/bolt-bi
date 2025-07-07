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
import { ChartUtils } from '@/strategies'
import { useDataSourceStore } from '@/stores'

interface Props {
  chart: DashboardChart | null
}

const props = defineProps<Props>()
//const dataSourceStore = useDataSourceStore()

const error = computed(() => {
  if (!props.chart) return ''
  if (!props.chart.type) return 'Chart type not specified'
  if (!ChartUtils.getChartTypeInfo(props.chart.type)) return `Unsupported chart type: ${props.chart.type}`
  return ''
})

const chartComponent = computed(() => {
  if (!props.chart || error.value) return null
  return ChartUtils.getChartComponent(props.chart.type) || null
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
