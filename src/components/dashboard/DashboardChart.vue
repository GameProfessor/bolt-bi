<template>
  <div class="h-full bg-white rounded-lg shadow-sm overflow-hidden">
    <div v-if="!chart" class="flex items-center justify-center h-full text-gray-500">
      <ExclamationTriangleIcon class="h-8 w-8 mr-2" />
      <span>Chart not found</span>
    </div>
    <div v-else class="h-full flex flex-col">
      <div v-if="chart.base.title" class="px-3 py-2 border-b border-gray-100 flex-shrink-0">
        <h3 class="text-xs font-medium text-gray-900 truncate">{{ chart.base.title }}</h3>
      </div>
      <div class="flex-1 min-h-0 p-2">
        <ChartPreview :chart="chart" class="w-full h-full" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import type { DashboardChart } from '@/types/dashboard'
import ChartPreview from '../charts/ChartPreview.vue'

interface Props {
  chart: DashboardChart
}

const props = defineProps<Props>()

const chart = computed(() => {
  return props.chart
})
</script>