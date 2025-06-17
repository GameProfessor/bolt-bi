<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <button
              @click="goBack"
              class="mr-4 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeftIcon class="h-6 w-6" />
            </button>
            <div>
              <h1 class="text-xl font-semibold text-gray-900">Quick Dashboard</h1>
              <p class="text-sm text-gray-500">Create charts directly on your dashboard</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="saveDashboard"
              :disabled="!dashboardName || charts.length === 0"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <DocumentCheckIcon class="h-4 w-4 mr-2" />
              Save Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex h-[calc(100vh-4rem)]">
      <!-- Left Sidebar -->
      <div
        class="bg-white border-r border-gray-200 flex flex-col"
        :style="{ width: leftSidebarWidth + 'px', minWidth: '180px', maxWidth: '400px' }"
      >
        <!-- Dashboard Name -->
        <div class="p-4 border-b border-gray-200">
          <label for="dashboardName" class="block text-sm font-medium text-gray-700 mb-2">
            Dashboard Name
          </label>
          <input
            id="dashboardName"
            v-model="dashboardName"
            type="text"
            placeholder="Enter dashboard name"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>

        <!-- Data Source Selection -->
        <div class="p-4 border-b border-gray-200">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Select Data Source
          </label>
          <select
            v-model="selectedDataSourceId"
            @change="onDataSourceChange"
            class="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="">Choose a data source</option>
            <option
              v-for="ds in dataSourceStore.dataSources"
              :key="ds.id"
              :value="ds.id"
            >
              {{ ds.name }}
            </option>
          </select>
        </div>

        <!-- Data Fields -->
        <div v-if="selectedDataSource" class="flex-1 overflow-hidden flex flex-col">
          <div class="p-4 border-b border-gray-200">
            <h3 class="text-sm font-medium text-gray-700">Data Fields</h3>
            <p class="text-xs text-gray-500 mt-1">Drag fields to chart properties</p>
          </div>
          <div class="flex-1 overflow-y-auto p-4">
            <div class="space-y-2">
              <div
                v-for="column in selectedDataSource.columns"
                :key="column.name"
                :draggable="true"
                @dragstart="onFieldDragStart($event, column)"
                class="flex items-center justify-between p-2 bg-gray-50 rounded cursor-move hover:bg-gray-100 transition-colors duration-200"
              >
                <span class="text-sm font-medium text-gray-900">{{ column.name }}</span>
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-blue-100 text-blue-800': column.type === 'number',
                    'bg-green-100 text-green-800': column.type === 'date',
                    'bg-gray-100 text-gray-800': column.type === 'string'
                  }"
                >
                  {{ column.type }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Draggable Divider (between left sidebar and chart type col) -->
      <div
        class="resizer"
        @mousedown="startResizing('left')"
        :style="{ cursor: 'col-resize', width: '6px', background: '#e5e7eb', zIndex: 20 }"
      ></div>

      <!-- Chart Type & Properties Column -->
      <div
        class="bg-white border-r border-gray-200 flex flex-col"
        :style="{ width: chartTypeColWidth + 'px', minWidth: '200px', maxWidth: '400px' }"
      >
        <!-- Chart Type Selection -->
        <div v-if="selectedDataSource" class="p-4 border-b border-gray-200">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Chart Type
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="type in chartTypes"
              :key="type.value"
              @click="selectedChartType = type.value"
              :class="[
                'flex flex-col items-center p-3 border rounded-lg text-xs font-medium transition-colors duration-200',
                selectedChartType === type.value
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              ]"
            >
              <component :is="type.icon" class="h-5 w-5 mb-1" />
              {{ type.label }}
            </button>
          </div>
        </div>

        <!-- Chart Properties -->
        <div v-if="selectedChartType" class="p-4 border-t border-gray-200 flex-1 overflow-y-auto">
          <h3 class="text-sm font-medium text-gray-700 mb-3">Chart Properties</h3>
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

            <div v-if="selectedChartType === 'pie'">
              <label class="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <div
                @drop="onFieldDrop($event, 'category')"
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
                @drop="onFieldDrop($event, 'xAxis')"
                @dragover.prevent
                @dragenter.prevent
                class="min-h-[2.5rem] p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 flex flex-wrap items-center gap-2 hover:border-primary-400 transition-colors duration-200"
                :class="{ 'border-primary-400 bg-primary-50': chartConfig.xAxis.length > 0 }"
              >
                <template v-if="chartConfig.xAxis.length > 0">
                  <span v-for="(field, idx) in chartConfig.xAxis" :key="field" class="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 rounded mr-1">
                    {{ field }}
                    <button @click.stop="chartConfig.xAxis.splice(idx, 1)" class="ml-1 text-xs text-primary-700 hover:text-red-500">&times;</button>
                  </span>
                </template>
                <span v-else>Drop X-axis fields here (dimensions)</span>
              </div>
              <div class="mt-2">
                <label class="block text-xs font-medium text-gray-600 mb-1">Y-Axis (Values)</label>
                <div
                  @drop="onFieldDrop($event, 'yAxis')"
                  @dragover.prevent
                  @dragenter.prevent
                  class="min-h-[2.5rem] p-2 border-2 border-dashed border-gray-300 rounded text-sm text-gray-500 flex items-center justify-center hover:border-primary-400 transition-colors duration-200"
                  :class="{ 'border-primary-400 bg-primary-50': chartConfig.yAxis }"
                >
                  {{ chartConfig.yAxis || 'Drop Y-axis field here (numbers only)' }}
                </div>
              </div>
            </div>

            <div v-else>
              <div class="space-y-2">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">X-Axis</label>
                  <div
                    @drop="onFieldDrop($event, 'xAxis')"
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
                    @drop="onFieldDrop($event, 'yAxis')"
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

            <div v-if="selectedChartType === 'bar'" class="flex items-center gap-2 mt-2">
              <input type="checkbox" id="horizontalBar" v-model="chartConfig.horizontal" class="form-checkbox" />
              <label for="horizontalBar" class="text-xs font-medium text-gray-600">Flip to horizontal bar chart</label>
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
              @click="addOrUpdateChart"
              :disabled="!isChartConfigValid"
              class="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <PlusIcon v-if="!editingChartId" class="h-4 w-4 mr-2" />
              <span v-if="editingChartId">Update Chart</span>
              <span v-else>Add to Dashboard</span>
            </button>
            <button v-if="editingChartId" @click="cancelEdit" class="w-full mt-2 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Draggable Divider (between chart type col and main dashboard) -->
      <div
        class="resizer"
        @mousedown="startResizing('chartType')"
        :style="{ cursor: 'col-resize', width: '6px', background: '#e5e7eb', zIndex: 20 }"
      ></div>

      <!-- Main Dashboard Area -->
      <div class="flex-1 p-6">
        <div class="bg-white rounded-lg shadow-sm h-full">
          <div class="p-6 h-full">
            <div v-if="charts.length === 0" class="flex items-center justify-center h-full text-gray-500">
              <div class="text-center">
                <Squares2X2Icon class="mx-auto h-12 w-12 mb-4" />
                <h3 class="text-lg font-medium text-gray-900 mb-2">Start Building Your Dashboard</h3>
                <p class="text-sm text-gray-500">
                  Select a data source, choose a chart type, and drag fields to create your first chart.
                </p>
              </div>
            </div>

            <!-- GridStack Container -->
            <div v-else ref="gridStackContainer" class="grid-stack h-full">
              <div
                v-for="chart in charts"
                :key="chart.id"
                class="grid-stack-item"
                :gs-id="chart.id"
                :gs-x="chart.layout.x"
                :gs-y="chart.layout.y"
                :gs-w="chart.layout.w"
                :gs-h="chart.layout.h"
              >
                <div class="grid-stack-item-content">
                  <div class="chart-header flex justify-end items-center gap-2">
                    <!-- 3-dot menu -->
                    <div class="relative">
                      <button @click="toggleChartMenu(chart.id)" class="chart-menu-btn p-1 rounded-full hover:bg-gray-100 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>
                      </button>
                      <div v-if="openChartMenuId === chart.id" class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-30">
                        <button @click="editChart(chart)" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Edit</button>
                        <button @click="exportChart(chart, 'pdf')" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Export PDF</button>
                        <button @click="exportChart(chart, 'png')" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Export to PNG</button>
                        <button @click="removeChart(chart.id)" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Remove</button>
                      </div>
                    </div>
                  </div>
                  <div class="chart-content">
                    <ChartPreview :chart="chart.config" class="w-full h-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeftIcon,
  PlusIcon,
  XMarkIcon,
  Squares2X2Icon,
  DocumentCheckIcon,
  ChartBarIcon,
  PresentationChartLineIcon,
  ChartPieIcon,
  CircleStackIcon
} from '@heroicons/vue/24/outline'
import { GridStack } from 'gridstack'
import { useDataSourceStore, type DataSourceColumn } from '../stores/dataSource'
import { useDashboardStore } from '../stores/dashboard'
import { useChartStore, type ChartConfig } from '../stores/chart'
import ChartPreview from '../components/ChartPreview.vue'

const router = useRouter()
const dataSourceStore = useDataSourceStore()
const dashboardStore = useDashboardStore()
const chartStore = useChartStore()

const dashboardName = ref('')
const selectedDataSourceId = ref('')
const selectedChartType = ref<ChartConfig['type'] | ''>('')
const gridStackContainer = ref<HTMLElement>()
let gridStack: GridStack | null = null

interface ChartItem {
  id: string
  config: Partial<ChartConfig>
  layout: {
    x: number
    y: number
    w: number
    h: number
  }
}

const charts = ref<ChartItem[]>([])

const chartConfig = reactive({
  title: '',
  xAxis: [],
  yAxis: '',
  category: '',
  backgroundColor: '#3b82f6',
  borderColor: '#1d4ed8',
  horizontal: false
})

const chartTypes = [
  { value: 'bar', label: 'Bar', icon: ChartBarIcon },
  { value: 'line', label: 'Line', icon: PresentationChartLineIcon },
  { value: 'pie', label: 'Pie', icon: ChartPieIcon },
  { value: 'scatter', label: 'Scatter', icon: CircleStackIcon }
] as const

const selectedDataSource = computed(() => {
  if (!selectedDataSourceId.value) return null
  return dataSourceStore.getDataSourceById(selectedDataSourceId.value)
})

const isChartConfigValid = computed(() => {
  if (!selectedChartType.value || !selectedDataSourceId.value) return false
  if (selectedChartType.value === 'pie') {
    return !!chartConfig.category
  } else if (selectedChartType.value === 'bar') {
    return Array.isArray(chartConfig.xAxis) && chartConfig.xAxis.length > 0 && !!chartConfig.yAxis
  } else {
    return !!chartConfig.xAxis && !!chartConfig.yAxis
  }
})

const onDataSourceChange = () => {
  resetChartConfig()
}

const resetChartConfig = () => {
  chartConfig.title = ''
  chartConfig.xAxis = []
  chartConfig.yAxis = ''
  chartConfig.category = ''
  chartConfig.horizontal = false
  selectedChartType.value = ''
}

const onFieldDragStart = (event: DragEvent, column: DataSourceColumn) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', JSON.stringify({
      name: column.name,
      type: column.type
    }))
  }
}

const onFieldDrop = (event: DragEvent, target: 'xAxis' | 'yAxis' | 'category') => {
  event.preventDefault()
  if (!event.dataTransfer) return
  try {
    const fieldData = JSON.parse(event.dataTransfer.getData('text/plain'))
    // Validate field type for Y-axis (should be numeric)
    if (target === 'yAxis' && fieldData.type !== 'number') {
      alert('Y-axis requires a numeric field')
      return
    }
    if (target === 'xAxis' && selectedChartType.value === 'bar') {
      // Add to array, no duplicates
      if (!chartConfig.xAxis.includes(fieldData.name)) {
        chartConfig.xAxis.push(fieldData.name)
      }
    } else {
      chartConfig[target] = fieldData.name
    }
  } catch (error) {
    console.error('Failed to parse dropped field data:', error)
  }
}

const openChartMenuId = ref<string | null>(null)
const editingChartId = ref<string | null>(null)
const chartTypeColRef = ref<HTMLElement>()

const toggleChartMenu = (id: string) => {
  openChartMenuId.value = openChartMenuId.value === id ? null : id
}

const editChart = (chart: ChartItem) => {
  openChartMenuId.value = null
  editingChartId.value = chart.id
  selectedChartType.value = chart.config.type || ''
  chartConfig.title = chart.config.title || ''
  if (chart.config.type === 'bar') {
    chartConfig.xAxis = Array.isArray(chart.config.xAxis) ? [...chart.config.xAxis] : (chart.config.xAxis ? [chart.config.xAxis] : [])
  } else {
    chartConfig.xAxis = chart.config.xAxis || ''
  }
  chartConfig.yAxis = chart.config.yAxis || ''
  chartConfig.category = chart.config.category || ''
  chartConfig.backgroundColor = chart.config.backgroundColor || '#3b82f6'
  chartConfig.borderColor = chart.config.borderColor || '#1d4ed8'
  chartConfig.horizontal = chart.config.horizontal || false
  selectedDataSourceId.value = chart.config.dataSourceId || ''
}

const exportChart = (chart: ChartItem, type: 'pdf' | 'png') => {
  openChartMenuId.value = null
  alert(`Exporting chart '${chart.config.title || chart.config.name}' as ${type.toUpperCase()} (stub)`)
}

const addOrUpdateChart = () => {
  if (!isChartConfigValid.value || !selectedDataSource.value) return
  if (editingChartId.value) {
    // Update existing chart
    const idx = charts.value.findIndex(c => c.id === editingChartId.value)
    if (idx !== -1) {
      charts.value[idx].config = {
        ...charts.value[idx].config,
        id: charts.value[idx].id,
        name: chartConfig.title || `Chart ${idx + 1}`,
        type: selectedChartType.value as ChartConfig['type'],
        dataSourceId: selectedDataSourceId.value,
        xAxis: selectedChartType.value === 'bar' ? [...chartConfig.xAxis] : chartConfig.xAxis,
        yAxis: chartConfig.yAxis || undefined,
        category: chartConfig.category || undefined,
        title: chartConfig.title,
        backgroundColor: chartConfig.backgroundColor,
        borderColor: chartConfig.borderColor,
        horizontal: selectedChartType.value === 'bar' ? chartConfig.horizontal : undefined,
        createdAt: charts.value[idx].config.createdAt || new Date()
      }
    }
    editingChartId.value = null
    resetChartConfig()
    nextTick(() => initializeGridStack())
    return
  }
  // Add new chart (existing logic)
  addChart()
}

const cancelEdit = () => {
  editingChartId.value = null
  resetChartConfig()
}

const addChart = () => {
  if (!isChartConfigValid.value || !selectedDataSource.value) return
  const chartId = Date.now().toString()
  const newChart: ChartItem = {
    id: chartId,
    config: {
      id: chartId,
      name: chartConfig.title || `Chart ${charts.value.length + 1}`,
      type: selectedChartType.value as ChartConfig['type'],
      dataSourceId: selectedDataSourceId.value,
      xAxis: selectedChartType.value === 'bar' ? [...chartConfig.xAxis] : chartConfig.xAxis,
      yAxis: chartConfig.yAxis || undefined,
      category: chartConfig.category || undefined,
      title: chartConfig.title,
      backgroundColor: chartConfig.backgroundColor,
      borderColor: chartConfig.borderColor,
      horizontal: selectedChartType.value === 'bar' ? chartConfig.horizontal : undefined,
      createdAt: new Date()
    },
    layout: {
      x: 0,
      y: 0,
      w: 6,
      h: 4
    }
  }
  charts.value.push(newChart)
  resetChartConfig()
  // Reinitialize GridStack
  nextTick(() => {
    initializeGridStack()
  })
}

const removeChart = (chartId: string) => {
  if (confirm('Are you sure you want to remove this chart?')) {
    charts.value = charts.value.filter(chart => chart.id !== chartId)
    
    nextTick(() => {
      initializeGridStack()
    })
  }
}

const initializeGridStack = async () => {
  if (!gridStackContainer.value || charts.value.length === 0) return

  await nextTick()

  try {
    if (gridStack) {
      gridStack.destroy(false)
      gridStack = null
    }

    gridStack = GridStack.init({
      cellHeight: 70,
      verticalMargin: 10,
      horizontalMargin: 10,
      minRow: 1,
      animate: true,
      resizable: {
        handles: 'e, se, s, sw, w'
      },
      draggable: {
        handle: '.grid-stack-item-content',
        scroll: false
      }
    }, gridStackContainer.value)

    // Listen for layout changes
    gridStack.on('change', (event, items) => {
      items.forEach(item => {
        const chart = charts.value.find(c => c.id === item.id)
        if (chart && item.x !== undefined && item.y !== undefined && item.w !== undefined && item.h !== undefined) {
          chart.layout = {
            x: item.x,
            y: item.y,
            w: item.w,
            h: item.h
          }
        }
      })
    })
  } catch (error) {
    console.error('Failed to initialize GridStack:', error)
  }
}

const saveDashboard = () => {
  if (!dashboardName.value || charts.value.length === 0) return

  // Create dashboard
  const dashboard = dashboardStore.createDashboard(dashboardName.value)

  // Create and save charts, then add widgets
  charts.value.forEach(chartItem => {
    // Create the chart in the chart store
    const savedChart = chartStore.createChart({
      name: chartItem.config.name!,
      type: chartItem.config.type!,
      dataSourceId: chartItem.config.dataSourceId!,
      xAxis: chartItem.config.xAxis,
      yAxis: chartItem.config.yAxis,
      category: chartItem.config.category,
      title: chartItem.config.title!,
      backgroundColor: chartItem.config.backgroundColor!,
      borderColor: chartItem.config.borderColor!
    })

    // Add widget to dashboard
    dashboardStore.addWidget(dashboard.id, savedChart.id)
    
    // Update widget layout
    const widget = dashboard.widgets[dashboard.widgets.length - 1]
    if (widget) {
      dashboardStore.updateWidgetLayout(dashboard.id, widget.id, chartItem.layout)
    }
  })

  // Navigate to the dashboard editor
  router.push(`/dashboard/${dashboard.id}`)
}

const goBack = () => {
  if (charts.value.length > 0) {
    if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
      router.push('/dashboards')
    }
  } else {
    router.push('/dashboards')
  }
}

// Resizable sidebar logic
const leftSidebarWidth = ref(240)
const chartTypeColWidth = ref(260)
const resizing = ref<'left' | 'chartType' | null>(null)
const startX = ref(0)
const startWidth = ref(0)

const startResizing = (which: 'left' | 'chartType') => {
  resizing.value = which
  startX.value = window.event instanceof MouseEvent ? window.event.clientX : 0
  startWidth.value = which === 'left' ? leftSidebarWidth.value : chartTypeColWidth.value
  document.addEventListener('mousemove', onResizing)
  document.addEventListener('mouseup', stopResizing)
}

const onResizing = (e: MouseEvent) => {
  if (!resizing.value) return
  const dx = e.clientX - startX.value
  if (resizing.value === 'left') {
    let newWidth = startWidth.value + dx
    newWidth = Math.max(180, Math.min(400, newWidth))
    leftSidebarWidth.value = newWidth
  } else if (resizing.value === 'chartType') {
    let newWidth = startWidth.value + dx
    newWidth = Math.max(200, Math.min(400, newWidth))
    chartTypeColWidth.value = newWidth
  }
}

const stopResizing = () => {
  resizing.value = null
  document.removeEventListener('mousemove', onResizing)
  document.removeEventListener('mouseup', stopResizing)
}

onMounted(() => {
  // Initialize with empty state
})

onUnmounted(() => {
  if (gridStack) {
    gridStack.destroy(false)
    gridStack = null
  }
  document.removeEventListener('mousemove', onResizing)
  document.removeEventListener('mouseup', stopResizing)
})
</script>

<style scoped>
.chart-header {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.chart-menu-btn {
  color: #6b7280;
}
.chart-menu-btn:hover {
  color: #374151;
}

.chart-remove-btn {
  @apply bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 transition-opacity duration-200;
}

.chart-content {
  height: 100%;
  padding: 8px;
}

.grid-stack-item-content {
  position: relative;
  height: 100%;
  cursor: move;
}

/* GridStack overrides */
:deep(.grid-stack-item.ui-draggable-dragging) {
  opacity: 0.8;
}

:deep(.grid-stack-item.ui-resizable-resizing) {
  opacity: 0.8;
}

/* Drag and drop styling */
.border-dashed:hover {
  @apply border-primary-400;
}

.resizer {
  transition: background 0.2s;
}
.resizer:hover {
  background: #d1d5db;
}
</style>