<template>
  <div class="bg-white border-r border-gray-200 flex flex-col min-h-0 h-full" :style="{ minWidth: '200px', maxWidth: '400px', width: width + 'px' }">
    <!-- Chart Type Selection -->
    <div class="p-4 border-b border-gray-200">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Chart Type
      </label>
      <div class="grid gap-2" :style="`grid-template-columns: repeat(${chartTypeCols}, minmax(0, 1fr));`">
        <div v-for="type in chartTypes" :key="type.value" class="relative group">
          <button
            @click="onChartTypeSelect(type.value)"
            :draggable="true"
            @dragstart="onChartTypeDragStart(type.value, $event)"
            :class="[
              chartTypeButtonClass,
              selectedChartType === type.value
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
            ]"
          >
            <component :is="type.icon" :class="chartTypeIconClass" />
          </button>
          <!-- Custom Tooltip -->
          <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50">
            {{ type.label }}
            <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart Properties -->
    <div v-if="selectedChartType" class="p-4 border-t border-gray-200 flex-1 min-h-0 overflow-y-auto">
      <h3 class="text-sm font-medium text-gray-700 mb-3">Chart Properties</h3>
      <!-- <div v-if="selectedDataSources.length === 0" class="text-sm text-gray-500 text-center py-2 mb-3 bg-blue-50 rounded border border-blue-200">
        <p class="text-xs text-blue-600">No data sources selected</p>
        <p class="text-xs text-blue-500">Select data sources to configure chart data fields</p>
      </div> -->
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Chart Title</label>
          <input
            v-model="chartTitle"
            type="text"
            placeholder="Enter chart title"
            class="w-full text-sm rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <!-- Card (KPI) chart: Only show KPI drop area -->
        <div v-if="selectedChartType === 'card'">
          <label class="block text-xs font-medium text-gray-600 mb-1">KPI</label>
          <div
            @drop="$emit('field-drop', $event, 'keyMetric')"
            @dragover.prevent
            @dragenter.prevent
            class="min-h-[2.5rem] p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 flex items-center justify-center hover:border-primary-400 transition-colors duration-200"
            :class="{ 'border-primary-400 bg-primary-50': chartConfig && isCardChartConfig(chartConfig) && chartConfig.keyMetric }"
          >
            {{ (chartConfig && isCardChartConfig(chartConfig) ? chartConfig.keyMetric : '') || 'Drop KPI field here' }}
          </div>
        </div>

        <!-- Pie chart config -->
        <div v-else-if="selectedChartType === 'pie'">
          <label class="block text-xs font-medium text-gray-600 mb-1">Category</label>
          <div
            @drop="$emit('field-drop', $event, 'category')"
            @dragover.prevent
            @dragenter.prevent
            class="min-h-[2.5rem] p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 flex items-center justify-center hover:border-primary-400 transition-colors duration-200"
            :class="{ 'border-primary-400 bg-primary-50': chartConfig && isPieChartConfig(chartConfig) && chartConfig.category }"
          >
            {{ (chartConfig && isPieChartConfig(chartConfig) ? chartConfig.category : '') || 'Drop category field here' }}
          </div>
        </div>

        <div v-else-if="selectedChartType === 'bar'">
          <label class="block text-xs font-medium text-gray-600 mb-1">X-Axis (Dimensions)</label>
          <div
            @drop="$emit('field-drop', $event, 'xAxis')"
            @dragover.prevent
            @dragenter.prevent
            class="min-h-[2.5rem] p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 flex flex-wrap items-center gap-2 hover:border-primary-400 transition-colors duration-200"
            :class="{ 'border-primary-400 bg-primary-50': chartConfig && isBarChartConfig(chartConfig) && Array.isArray(chartConfig.xAxis) && chartConfig.xAxis.length > 0 }"
          >
            <template v-if="chartConfig && isBarChartConfig(chartConfig) && Array.isArray(chartConfig.xAxis) && chartConfig.xAxis.length > 0">
              <span v-for="(field, idx) in chartConfig.xAxis" :key="field" class="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 rounded mr-1">
                {{ field }}
                <button @click.stop="$emit('remove-x-axis', idx)" class="ml-1 text-xs text-primary-700 hover:text-red-500">&times;</button>
              </span>
            </template>
            <span v-else>Drop X-axis fields here (dimensions)</span>
          </div>
          <div class="mt-2">
            <label class="block text-xs font-medium text-gray-600 mb-1">Y-Axis (Values)</label>
            <div
              @drop="$emit('field-drop', $event, 'yAxis')"
              @dragover.prevent
              @dragenter.prevent
                          class="min-h-[2.5rem] p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 flex flex-wrap items-center gap-2 hover:border-primary-400 transition-colors duration-200"
            :class="{ 'border-primary-400 bg-primary-50': chartConfig && isBarChartConfig(chartConfig) && Array.isArray(chartConfig.yAxis) && chartConfig.yAxis.length > 0 }"
          >
            <template v-if="chartConfig && isBarChartConfig(chartConfig) && Array.isArray(chartConfig.yAxis) && chartConfig.yAxis.length > 0">
              <span v-for="(field, idx) in chartConfig.yAxis" :key="field" class="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 rounded mr-1">
                  {{ field }}
                  <button @click.stop="$emit('remove-y-axis', idx)" class="ml-1 text-xs text-primary-700 hover:text-red-500">&times;</button>
                </span>
              </template>
              <span v-else>Drop Y-axis fields here (numbers only)</span>
            </div>
          </div>
          <!-- Dimension (stacked) -->
          <div class="mt-2">
            <label class="block text-xs font-medium text-gray-600 mb-1">Dimension (stacked)</label>
            <div
              @drop="$emit('field-drop', $event, 'stackedDimension')"
              @dragover.prevent
              @dragenter.prevent
                          class="min-h-[2.5rem] p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 flex flex-wrap items-center gap-2 hover:border-primary-400 transition-colors duration-200"
            :class="{ 'border-primary-400 bg-primary-50': chartConfig && isBarChartConfig(chartConfig) && Array.isArray(chartConfig.stackedDimension) && chartConfig.stackedDimension.length > 0 }"
          >
            <template v-if="chartConfig && isBarChartConfig(chartConfig) && Array.isArray(chartConfig.stackedDimension) && chartConfig.stackedDimension.length > 0">
              <span v-for="(field, idx) in chartConfig.stackedDimension" :key="field" class="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 rounded mr-1">
                  {{ field }}
                  <button @click.stop="$emit('remove-stacked-dimension', idx)" class="ml-1 text-xs text-primary-700 hover:text-red-500">&times;</button>
                </span>
              </template>
              <span v-else>Drop stacked dimension fields here</span>
            </div>
          </div>
          <div class="flex items-center gap-2 mt-2">
            <input type="checkbox" id="horizontalBar" v-model="barHorizontal" class="form-checkbox" />
            <label for="horizontalBar" class="text-xs font-medium text-gray-600">Flip to horizontal bar chart</label>
          </div>
          <div class="flex items-center gap-2 mt-2">
            <input type="checkbox" id="stackedBar" v-model="barStacked" class="form-checkbox" />
            <label for="stackedBar" class="text-xs font-medium text-gray-600">Stacked</label>
          </div>
          <div class="mt-2">
            <label class="block text-xs font-bold text-gray-700 mb-1">Sort X-Axis by</label>
            <select
              v-model="barSortXAxisBy"
              class="block w-full border border-gray-300 rounded-md focus:border-primary-500 focus:ring-primary-500 text-sm text-gray-900 bg-white px-3 py-2 transition placeholder-gray-400"
            >
              <option value="">--</option>
              <option v-for="field in (chartConfig && isBarChartConfig(chartConfig) ? chartConfig.xAxis : [])" :key="field" :value="field">{{ field }}</option>
            </select>
          </div>
          <div class="flex items-center gap-2 mt-1">
            <input type="checkbox" id="sortDescending" v-model="barSortDescending" class="form-checkbox" />
            <label for="sortDescending" class="text-xs font-medium text-gray-600">Descending</label>
          </div>
          <div class="mt-3">
            <label class="block text-xs font-bold text-gray-700 mb-1">Filter</label>
            <label class="block text-xs font-medium text-gray-600 mb-1">Filter expression</label>
            <input
              v-model="barFilter"
              type="text"
              placeholder="eg (col_time > 10)  AND (col_data <10)"
              class="block w-full border border-gray-300 rounded-md focus:border-primary-500 focus:ring-primary-500 text-sm text-gray-900 bg-white px-3 py-2 transition placeholder-gray-400"
            />
            <div class="text-xs text-gray-500 mt-1">Use existing field names as variables. Example: (col_time &gt; 10)  AND (col_data &lt;10)</div>
          </div>
          <div class="mt-3">
            <label class="block text-xs font-bold text-gray-700 mb-1">Legend</label>
            <input type="checkbox" id="showLegend" v-model="barShowLegend" class="form-checkbox" />
            <label for="showLegend" class="text-xs font-medium text-gray-600 ml-2">Show legend</label>
          </div>
        </div>

        <div v-else>
          <div class="space-y-2">
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">X-Axis</label>
              <div
                @drop="$emit('field-drop', $event, 'xAxis')"
                @dragover.prevent
                @dragenter.prevent
                              class="min-h-[2.5rem] p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 flex items-center justify-center hover:border-primary-400 transition-colors duration-200"
              :class="{ 'border-primary-400 bg-primary-50': chartConfig && (isLineChartConfig(chartConfig) || isScatterChartConfig(chartConfig)) && chartConfig.xAxis }"
            >
              {{ (chartConfig && (isLineChartConfig(chartConfig) || isScatterChartConfig(chartConfig)) ? chartConfig.xAxis : '') || 'Drop X-axis field here' }}
            </div>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Y-Axis</label>
            <div
              @drop="$emit('field-drop', $event, 'yAxis')"
              @dragover.prevent
              @dragenter.prevent
              class="min-h-[2.5rem] p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 flex items-center justify-center hover:border-primary-400 transition-colors duration-200"
              :class="{ 'border-primary-400 bg-primary-50': chartConfig && (isLineChartConfig(chartConfig) || isScatterChartConfig(chartConfig)) && chartConfig.yAxis }"
            >
              {{ (chartConfig && (isLineChartConfig(chartConfig) || isScatterChartConfig(chartConfig)) ? chartConfig.yAxis : '') || 'Drop Y-axis field here (numbers only)' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Chart Configuration Options - Always show -->
        <div v-if="selectedChartType === 'bar'" class="mt-2">
          <label class="block text-xs font-medium text-gray-600 mb-1">Color Scheme</label>
          <select v-model="chartColorScheme" class="block w-full border border-gray-300 rounded-md focus:border-primary-500 focus:ring-primary-500 text-sm text-gray-900 bg-white px-3 py-2 transition placeholder-gray-400">
            <option v-for="scheme in colorSchemes" :key="scheme.value" :value="scheme.value">{{ scheme.label }}</option>
          </select>
          <!-- Color scheme preview -->
          <div class="flex items-center gap-1 mt-2">
            <span v-for="(color, idx) in colorPalettes[chartConfig?.colorScheme || 'DEFAULT'] && colorPalettes[chartConfig?.colorScheme || 'DEFAULT'].slice(0, 8)" :key="color + idx"
              class="w-5 h-5 rounded-full border border-gray-200" :style="{ background: color }"></span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Background</label>
            <input
              v-model="chartBackgroundColor"
              type="color"
              class="w-full h-8 rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Border</label>
            <input
              v-model="chartBorderColor"
              type="color"
              class="w-full h-8 rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>

        <button
          @click="$emit('add-or-update-chart')"
          :disabled="!isChartConfigValid"
          class="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <PlusIcon v-if="!editingChartId" class="h-4 w-4 mr-2" />
          <span v-if="editingChartId">Update Chart</span>
          <span v-else>Add to Dashboard</span>
        </button>
        <!-- <button v-if="editingChartId" @click="$emit('cancel-edit')" class="w-full mt-2 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Cancel</button> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import type { DataSourceColumn } from '@/stores'
import type { ChartConfig } from '@/types/chart'
import {
  isBarChartConfig,
  isPieChartConfig,
  isLineChartConfig,
  isScatterChartConfig,
  isCardChartConfig
} from '@/types/chart'
import { computed } from 'vue'

const props = defineProps<{
  chartTypes: ReadonlyArray<{ value: string; label: string; icon: any }>
  selectedChartType: string
  chartConfig: ChartConfig | null
  colorSchemes: Array<{ value: string; label: string }>
  colorPalettes: Record<string, string[]>
  isChartConfigValid: boolean
  editingChartId: string | null
  selectedDataSources: Array<{ id: string; name: string; columns: DataSourceColumn[] }>
  width: number
  alwaysShowProperties?: boolean
}>()

const emit = defineEmits([
  'update:selectedChartType',
  'field-drop',
  'remove-x-axis',
  'remove-y-axis',
  'add-or-update-chart',
  'cancel-edit',
  'chart-type-drag-start',
  'remove-stacked-dimension'
])

function onChartTypeDragStart(type: string, event: DragEvent) {
  if (event.dataTransfer) {
    const data = JSON.stringify({ chartType: type })
    // Set data in multiple formats to ensure it's available
    event.dataTransfer.setData('application/json', data)
    event.dataTransfer.setData('text/plain', data)
  }
  // Emit the chart type being dragged
  emit('chart-type-drag-start', type)
}

function onChartTypeSelect(type: string) {
  if (props.editingChartId) {
    // If editing, switch to add mode and reset chart config
    emit('cancel-edit')
    emit('update:selectedChartType', type)
  } else {
    emit('update:selectedChartType', type)
  }
}

// Dynamically determine columns based on width
const chartTypeCols = computed(() => {
  if (props.width < 240) return 3
  if (props.width < 320) return 4
  if (props.width < 420) return 5
  if (props.width < 520) return 6
  return 6
})

const chartTypeButtonClass =
  'w-12 h-12 flex flex-col items-center justify-center p-2 border rounded-lg transition-colors duration-200 min-h-[3rem] relative bg-white'
const chartTypeIconClass = 'h-5 w-5'

// Computed properties for two-way binding with type safety
const chartTitle = computed({
  get: () => props.chartConfig?.title || '',
  set: (value: string) => {
    if (props.chartConfig) props.chartConfig.title = value
  }
})

const chartColorScheme = computed({
      get: () => props.chartConfig?.colorScheme || 'DEFAULT',
  set: (value: string) => {
    if (props.chartConfig) props.chartConfig.colorScheme = value
  }
})

const chartBackgroundColor = computed({
  get: () => props.chartConfig?.backgroundColor || '#3b82f6',
  set: (value: string) => {
    if (props.chartConfig) props.chartConfig.backgroundColor = value
  }
})

const chartBorderColor = computed({
  get: () => props.chartConfig?.borderColor || '#1d4ed8',
  set: (value: string) => {
    if (props.chartConfig) props.chartConfig.borderColor = value
  }
})

// For bar chart specific properties
const barHorizontal = computed({
  get: () => (props.chartConfig && isBarChartConfig(props.chartConfig) ? props.chartConfig.horizontal : false),
  set: (value: boolean) => {
    if (props.chartConfig && isBarChartConfig(props.chartConfig)) props.chartConfig.horizontal = value
  }
})

const barStacked = computed({
  get: () => (props.chartConfig && isBarChartConfig(props.chartConfig) ? props.chartConfig.stacked : false),
  set: (value: boolean) => {
    if (props.chartConfig && isBarChartConfig(props.chartConfig)) props.chartConfig.stacked = value
  }
})

const barSortXAxisBy = computed({
  get: () => (props.chartConfig && isBarChartConfig(props.chartConfig) ? props.chartConfig.sortXAxisBy : ''),
  set: (value: string) => {
    if (props.chartConfig && isBarChartConfig(props.chartConfig)) props.chartConfig.sortXAxisBy = value
  }
})

const barSortDescending = computed({
  get: () => (props.chartConfig && isBarChartConfig(props.chartConfig) ? props.chartConfig.sortDescending : false),
  set: (value: boolean) => {
    if (props.chartConfig && isBarChartConfig(props.chartConfig)) props.chartConfig.sortDescending = value
  }
})

const barFilter = computed({
  get: () => (props.chartConfig && isBarChartConfig(props.chartConfig) ? props.chartConfig.filter : ''),
  set: (value: string) => {
    if (props.chartConfig && isBarChartConfig(props.chartConfig)) props.chartConfig.filter = value
  }
})

const barShowLegend = computed({
  get: () => (props.chartConfig && isBarChartConfig(props.chartConfig) ? props.chartConfig.showLegend : false),
  set: (value: boolean) => {
    if (props.chartConfig && isBarChartConfig(props.chartConfig)) props.chartConfig.showLegend = value
  }
})
</script> 