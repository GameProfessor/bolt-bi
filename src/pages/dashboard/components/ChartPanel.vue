<template>
  <div class="bg-white border-r border-gray-200 flex flex-col" :style="{ minWidth: '200px', maxWidth: '400px', width: width + 'px' }">
    <!-- Chart Type Selection -->
    <div class="p-4 border-b border-gray-200">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Chart Type
      </label>
      <div class="grid gap-2" :style="`grid-template-columns: repeat(${chartTypeCols}, minmax(0, 1fr));`">
        <div v-for="type in chartTypes" :key="type.value" class="relative group">
          <button
            @click="$emit('update:selectedChartType', type.value)"
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
    <div v-if="selectedChartType" class="p-4 border-t border-gray-200 flex-1 overflow-y-auto">
      <h3 class="text-sm font-medium text-gray-700 mb-3">Chart Properties</h3>
      <!-- <div v-if="selectedDataSources.length === 0" class="text-sm text-gray-500 text-center py-2 mb-3 bg-blue-50 rounded border border-blue-200">
        <p class="text-xs text-blue-600">No data sources selected</p>
        <p class="text-xs text-blue-500">Select data sources to configure chart data fields</p>
      </div> -->
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Chart Title</label>
          <input
            v-model="chartConfig.title"
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
            :class="{ 'border-primary-400 bg-primary-50': chartConfig.keyMetric }"
          >
            {{ chartConfig.keyMetric || 'Drop KPI field here (numbers only)' }}
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
            :class="{ 'border-primary-400 bg-primary-50': chartConfig.category }"
          >
            {{ chartConfig.category || 'Drop category field here' }}
          </div>
        </div>

        <div v-else-if="selectedChartType === 'bar'">
          <label class="block text-xs font-medium text-gray-600 mb-1">X-Axis (Dimensions)</label>
          <div
            @drop="$emit('field-drop', $event, 'xAxis')"
            @dragover.prevent
            @dragenter.prevent
            class="min-h-[2.5rem] p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 flex flex-wrap items-center gap-2 hover:border-primary-400 transition-colors duration-200"
            :class="{ 'border-primary-400 bg-primary-50': Array.isArray(chartConfig.xAxis) && chartConfig.xAxis.length > 0 }"
          >
            <template v-if="Array.isArray(chartConfig.xAxis) && chartConfig.xAxis.length > 0">
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
              :class="{ 'border-primary-400 bg-primary-50': Array.isArray(chartConfig.yAxis) && chartConfig.yAxis.length > 0 }"
            >
              <template v-if="Array.isArray(chartConfig.yAxis) && chartConfig.yAxis.length > 0">
                <span v-for="(field, idx) in chartConfig.yAxis" :key="field" class="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 rounded mr-1">
                  {{ field }}
                  <button @click.stop="$emit('remove-y-axis', idx)" class="ml-1 text-xs text-primary-700 hover:text-red-500">&times;</button>
                </span>
              </template>
              <span v-else>Drop Y-axis fields here (numbers only)</span>
            </div>
          </div>
          <div class="flex items-center gap-2 mt-2">
            <input type="checkbox" id="horizontalBar" v-model="chartConfig.horizontal" class="form-checkbox" />
            <label for="horizontalBar" class="text-xs font-medium text-gray-600">Flip to horizontal bar chart</label>
          </div>
          <div class="flex items-center gap-2 mt-2">
            <input type="checkbox" id="stackedBar" v-model="chartConfig.stacked" class="form-checkbox" />
            <label for="stackedBar" class="text-xs font-medium text-gray-600">Stacked</label>
          </div>
          <div class="mt-2">
            <label class="block text-xs font-bold text-gray-700 mb-1">Sort X-Axis by</label>
            <select
              v-model="chartConfig.sortXAxisBy"
              class="block w-full border border-gray-300 rounded-md focus:border-primary-500 focus:ring-primary-500 text-sm text-gray-900 bg-white px-3 py-2 transition placeholder-gray-400"
            >
              <option value="">--</option>
              <option v-for="field in chartConfig.xAxis" :key="field" :value="field">{{ field }}</option>
            </select>
          </div>
          <div class="flex items-center gap-2 mt-1">
            <input type="checkbox" id="sortDescending" v-model="chartConfig.sortDescending" class="form-checkbox" />
            <label for="sortDescending" class="text-xs font-medium text-gray-600">Descending</label>
          </div>
          <div class="mt-3">
            <label class="block text-xs font-bold text-gray-700 mb-1">Filter</label>
            <label class="block text-xs font-medium text-gray-600 mb-1">Filter expression</label>
            <input
              v-model="chartConfig.filter"
              type="text"
              placeholder="eg (col_time > 10)  AND (col_data <10)"
              class="block w-full border border-gray-300 rounded-md focus:border-primary-500 focus:ring-primary-500 text-sm text-gray-900 bg-white px-3 py-2 transition placeholder-gray-400"
            />
            <div class="text-xs text-gray-500 mt-1">Use existing field names as variables. Example: (col_time &gt; 10)  AND (col_data &lt;10)</div>
          </div>
          <div class="mt-3">
            <label class="block text-xs font-bold text-gray-700 mb-1">Legend</label>
            <input type="checkbox" id="showLegend" v-model="chartConfig.showLegend" class="form-checkbox" />
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
                :class="{ 'border-primary-400 bg-primary-50': chartConfig.xAxis }"
              >
                {{ chartConfig.xAxis || 'Drop X-axis field here' }}
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-1">Y-Axis</label>
              <div
                @drop="$emit('field-drop', $event, 'yAxis')"
                @dragover.prevent
                @dragenter.prevent
                class="min-h-[2.5rem] p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 flex items-center justify-center hover:border-primary-400 transition-colors duration-200"
                :class="{ 'border-primary-400 bg-primary-50': chartConfig.yAxis }"
              >
                {{ chartConfig.yAxis || 'Drop Y-axis field here (numbers only)' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Chart Configuration Options - Always show -->
        <div v-if="selectedChartType === 'bar'" class="mt-2">
          <label class="block text-xs font-medium text-gray-600 mb-1">Color Scheme</label>
          <select v-model="chartConfig.colorScheme" class="block w-full border border-gray-300 rounded-md focus:border-primary-500 focus:ring-primary-500 text-sm text-gray-900 bg-white px-3 py-2 transition placeholder-gray-400">
            <option v-for="scheme in colorSchemes" :key="scheme.value" :value="scheme.value">{{ scheme.label }}</option>
          </select>
          <!-- Color scheme preview -->
          <div class="flex items-center gap-1 mt-2">
            <span v-for="(color, idx) in colorPalettes[chartConfig.colorScheme] && colorPalettes[chartConfig.colorScheme].slice(0, 8)" :key="color + idx"
              class="w-5 h-5 rounded-full border border-gray-200" :style="{ background: color }"></span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Background</label>
            <input
              v-model="chartConfig.backgroundColor"
              type="color"
              class="w-full h-8 rounded border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-600 mb-1">Border</label>
            <input
              v-model="chartConfig.borderColor"
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
        <button v-if="editingChartId" @click="$emit('cancel-edit')" class="w-full mt-2 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlusIcon } from '@heroicons/vue/24/outline'
import type { DataSourceColumn } from '@/stores'
import { computed, ref } from 'vue'

const props = defineProps<{
  chartTypes: ReadonlyArray<{ value: string; label: string; icon: any }>
  selectedChartType: string
  chartConfig: any
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
  'chart-type-drag-start'
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
</script> 