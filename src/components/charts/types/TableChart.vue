// @ts-expect-error: vue-good-table-next has no types
// eslint-disable-next-line
declare module 'vue-good-table-next';
<template>
  <div class="h-full w-full flex flex-col bg-white rounded-2xl shadow-lg p-2">
    <div v-if="chart.base.title" class="mb-2 text-base font-semibold text-gray-800 text-center">
      {{ chart.base.title }}
    </div>
    <!-- Show placeholder when no columns are selected -->
    <div v-if="!hasColumns" class="flex-1 flex flex-col items-center justify-center text-gray-500">
      <svg class="w-12 h-12 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
      </svg>
      <p class="text-sm font-medium mb-2">No columns selected</p>
      <p class="text-xs text-gray-400 text-center">Drop column fields from the data panel to display data in this table</p>
    </div>
    <!-- Show table when columns are available -->
    <VueGoodTable
      v-else
      :columns="tableColumns"
      :rows="tableRows"
      :search-options="{ enabled: true, externalQuery: filter }"
      :pagination-options="{ enabled: true, perPage: rowLimit }"
      :resizable="true"
      class="flex-1 min-h-0"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VueGoodTable } from 'vue-good-table-next'
import 'vue-good-table-next/dist/vue-good-table-next.css'
import type { DashboardChart } from '@/types/dashboard'
import { ChartUtils } from '@/strategies'

interface Props {
  chart: DashboardChart
}
const props = defineProps<Props>()

const config = computed(() => {
  return props.chart?.properties?.table || { columns: [], rowLimit: 10, filter: '' }
})

const filter = computed(() => config.value.filter || '')
const rowLimit = computed(() => config.value.rowLimit || 10)

const dataSourceId = computed(() => props.chart.base.dataSourceId)

// Get data from data source store (assume useDataSourceStore is available)
import { useDataSourceStore } from '@/stores'
const dataSourceStore = useDataSourceStore()
const dataSource = computed(() => dataSourceStore.getDataSourceById(dataSourceId.value))

const hasColumns = computed(() => {
  return (config.value.columns || []).length > 0
})

const tableColumns = computed(() => {
  return (config.value.columns || []).map(col => ({
    label: col,
    field: col,
    sortable: true
  }))
})

const tableRows = computed(() => {
  if (!dataSource.value) return []
  // Use ChartStrategy to process data
  const strategy = ChartUtils.getChartTypeInfo('table')
  if (!strategy) return []
  const processed = strategy.processData(dataSource.value.rows, {
    ...config.value,
    type: 'table',
    title: props.chart.base.title,
    dataSourceId: dataSourceId.value,
    colorScheme: 'default'
  })
  return processed
})
</script>

<style scoped>
/* Make header text larger and bold */
.vgt-table thead th {
  font-size: 0.5rem;      /* Adjust as needed */
  font-weight: 600;     /* Bold */
  color: #374151;       /* Tailwind gray-700 */
  padding: 0.5rem 0.75rem;
}

/* Make cell text a bit smaller */
.vgt-table tbody td {
  font-size: 0.95rem;   /* Adjust as needed */
  color: #374151;
  padding: 0.5rem 0.75rem;
}
</style> 