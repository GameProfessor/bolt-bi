<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <!-- Header -->
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-bold text-gray-900">Quick Dashboard</h1>
          <p class="mt-2 text-sm text-gray-700">
            Create charts and dashboards quickly from your data sources.
          </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            @click="saveDashboard"
            :disabled="!currentDashboard.name || currentDashboard.tabs.every(tab => tab.widgets.length === 0)"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <CheckIcon class="w-4 h-4 mr-2" />
            Save Dashboard
          </button>
        </div>
      </div>

      <div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Data Sources & Chart Creation -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Data Sources Section -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-900">Data Sources</h2>
            </div>
            <div class="p-6">
              <div v-if="dataSourceStore.dataSources.length === 0" class="text-center py-8">
                <TableCellsIcon class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900">No data sources</h3>
                <p class="mt-1 text-sm text-gray-500">Upload a CSV file to get started.</p>
                <div class="mt-6">
                  <router-link
                    to="/data-sources"
                    class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                  >
                    <PlusIcon class="w-4 h-4 mr-2" />
                    Upload Data
                  </router-link>
                </div>
              </div>
              <div v-else class="space-y-3">
                <div
                  v-for="dataSource in dataSourceStore.dataSources"
                  :key="dataSource.id"
                  @click="selectedDataSource = dataSource"
                  class="p-3 border rounded-lg cursor-pointer transition-colors duration-200"
                  :class="{
                    'border-primary-300 bg-primary-50': selectedDataSource?.id === dataSource.id,
                    'border-gray-200 hover:border-gray-300': selectedDataSource?.id !== dataSource.id
                  }"
                >
                  <h3 class="text-sm font-medium text-gray-900">{{ dataSource.name }}</h3>
                  <p class="text-xs text-gray-500">
                    {{ dataSource.rows.length }} rows, {{ dataSource.columns.length }} columns
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Chart Type Selection -->
          <div v-if="selectedDataSource" class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-900">Chart Type</h2>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-2 gap-3">
                <button
                  v-for="chartType in chartTypes"
                  :key="chartType.type"
                  @click="selectedChartType = chartType.type"
                  class="p-3 border rounded-lg text-left transition-colors duration-200"
                  :class="{
                    'border-primary-300 bg-primary-50': selectedChartType === chartType.type,
                    'border-gray-200 hover:border-gray-300': selectedChartType !== chartType.type
                  }"
                >
                  <component :is="chartType.icon" class="h-6 w-6 text-gray-600 mb-2" />
                  <div class="text-sm font-medium text-gray-900">{{ chartType.name }}</div>
                  <div class="text-xs text-gray-500">{{ chartType.description }}</div>
                </button>
              </div>
            </div>
          </div>

          <!-- Chart Configuration -->
          <div v-if="selectedDataSource && selectedChartType" class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-900">Chart Configuration</h2>
            </div>
            <div class="p-6 space-y-4">
              <!-- Chart Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Chart Name</label>
                <input
                  v-model="chartConfig.name"
                  type="text"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Enter chart name"
                />
              </div>

              <!-- Chart Title -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Chart Title</label>
                <input
                  v-model="chartConfig.title"
                  type="text"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Enter chart title"
                />
              </div>

              <!-- Card Chart Configuration -->
              <div v-if="selectedChartType === 'card'" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Key Metric</label>
                  <select
                    v-model="chartConfig.keyMetric"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="">Select metric</option>
                    <option
                      v-for="column in numericColumns"
                      :key="column.name"
                      :value="column.name"
                    >
                      {{ column.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Previous Period Metric (Optional)</label>
                  <select
                    v-model="chartConfig.previousMetric"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="">Select previous metric</option>
                    <option
                      v-for="column in numericColumns"
                      :key="column.name"
                      :value="column.name"
                    >
                      {{ column.name }}
                    </option>
                  </select>
                </div>

                <div v-if="chartConfig.previousMetric">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Difference Type</label>
                  <select
                    v-model="chartConfig.differenceType"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="value">Value</option>
                  </select>
                </div>
              </div>

              <!-- Pie Chart Configuration -->
              <div v-else-if="selectedChartType === 'pie'" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    v-model="chartConfig.category"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="">Select category</option>
                    <option
                      v-for="column in selectedDataSource.columns"
                      :key="column.name"
                      :value="column.name"
                    >
                      {{ column.name }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Other Chart Types Configuration -->
              <div v-else class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">X-Axis</label>
                  <select
                    v-model="chartConfig.xAxis"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="">Select X-axis</option>
                    <option
                      v-for="column in selectedDataSource.columns"
                      :key="column.name"
                      :value="column.name"
                    >
                      {{ column.name }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Y-Axis</label>
                  <select
                    v-model="chartConfig.yAxis"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="">Select Y-axis</option>
                    <option
                      v-for="column in numericColumns"
                      :key="column.name"
                      :value="column.name"
                    >
                      {{ column.name }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Add Chart Button -->
              <div class="pt-4">
                <button
                  @click="addChart"
                  :disabled="!canCreateChart"
                  class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <PlusIcon class="w-4 h-4 mr-2" />
                  Add Chart
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Dashboard Design -->
        <div class="lg:col-span-2">
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-medium text-gray-900">Dashboard Design</h2>
                <div class="flex items-center space-x-2">
                  <input
                    v-model="currentDashboard.name"
                    type="text"
                    placeholder="Dashboard name"
                    class="block w-48 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <!-- Tab Navigation -->
            <div v-if="currentDashboard.tabs.length > 1 || showTabBar" class="border-b border-gray-200">
              <nav class="flex space-x-8 px-6" aria-label="Tabs">
                <button
                  v-for="(tab, index) in currentDashboard.tabs"
                  :key="tab.id"
                  @click="activeTabIndex = index"
                  class="group relative min-w-0 flex-1 overflow-hidden py-4 px-1 text-sm font-medium text-center hover:text-gray-700 focus:z-10"
                  :class="{
                    'text-primary-600 border-b-2 border-primary-500': activeTabIndex === index,
                    'text-gray-500 hover:text-gray-700': activeTabIndex !== index
                  }"
                >
                  <span class="truncate">{{ tab.name }}</span>
                  <button
                    v-if="currentDashboard.tabs.length > 1"
                    @click.stop="removeTab(index)"
                    class="ml-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"
                  >
                    <XMarkIcon class="h-4 w-4" />
                  </button>
                </button>
                <button
                  @click="addTab"
                  class="flex items-center px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  <PlusIcon class="h-4 w-4 mr-1" />
                  Add Tab
                </button>
              </nav>
            </div>

            <!-- Tab Content -->
            <div class="p-6">
              <div v-if="activeTab.widgets.length === 0" class="text-center py-12">
                <Squares2X2Icon class="mx-auto h-12 w-12 text-gray-400" />
                <h3 class="mt-2 text-sm font-medium text-gray-900">No charts in this tab</h3>
                <p class="mt-1 text-sm text-gray-500">Create charts from the left panel to add them here.</p>
              </div>

              <!-- GridStack Container -->
              <div v-else ref="gridStackContainer" class="grid-stack">
                <div
                  v-for="widget in activeTab.widgets"
                  :key="widget.id"
                  class="grid-stack-item"
                  :gs-id="widget.id"
                  :gs-x="widget.x"
                  :gs-y="widget.y"
                  :gs-w="widget.w"
                  :gs-h="widget.h"
                >
                  <div class="grid-stack-item-content">
                    <div class="widget-header">
                      <button
                        @click="removeWidget(widget.id)"
                        class="widget-remove-btn"
                        title="Remove widget"
                      >
                        <XMarkIcon class="h-4 w-4" />
                      </button>
                    </div>
                    <div class="widget-content">
                      <DashboardChart :widget="widget" />
                    </div>
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
import { ref, computed, reactive, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  PlusIcon,
  TableCellsIcon,
  ChartBarIcon,
  PresentationChartLineIcon,
  ChartPieIcon,
  Squares2X2Icon,
  XMarkIcon,
  CheckIcon,
  CreditCardIcon
} from '@heroicons/vue/24/outline'
import { GridStack } from 'gridstack'
import { useDataSourceStore, type DataSource } from '../stores/dataSource'
import { useChartStore, type ChartConfig } from '../stores/chart'
import { useDashboardStore, type DashboardWidget } from '../stores/dashboard'
import DashboardChart from '../components/DashboardChart.vue'

const route = useRoute()
const router = useRouter()

const dataSourceStore = useDataSourceStore()
const chartStore = useChartStore()
const dashboardStore = useDashboardStore()

// State
const selectedDataSource = ref<DataSource | null>(null)
const selectedChartType = ref<string>('')
const gridStackContainer = ref<HTMLElement>()
const activeTabIndex = ref(0)
const showTabBar = ref(false)
let gridStack: GridStack | null = null

// Dashboard Tab Interface
interface DashboardTab {
  id: string
  name: string
  widgets: DashboardWidget[]
}

// Current Dashboard State
const currentDashboard = reactive({
  name: '',
  tabs: [
    {
      id: '1',
      name: 'Tab 1',
      widgets: []
    }
  ] as DashboardTab[]
})

// Chart Types
const chartTypes = [
  {
    type: 'card',
    name: 'Card',
    description: 'Key metrics with comparison',
    icon: CreditCardIcon
  },
  {
    type: 'bar',
    name: 'Bar Chart',
    description: 'Compare categories',
    icon: ChartBarIcon
  },
  {
    type: 'line',
    name: 'Line Chart',
    description: 'Show trends over time',
    icon: PresentationChartLineIcon
  },
  {
    type: 'pie',
    name: 'Pie Chart',
    description: 'Show proportions',
    icon: ChartPieIcon
  }
]

// Chart Configuration
const chartConfig = reactive({
  name: '',
  title: '',
  xAxis: '',
  yAxis: '',
  category: '',
  keyMetric: '',
  previousMetric: '',
  differenceType: 'percentage' as 'percentage' | 'value'
})

// Computed Properties
const numericColumns = computed(() => {
  return selectedDataSource.value?.columns.filter(col => col.type === 'number') || []
})

const activeTab = computed(() => {
  return currentDashboard.tabs[activeTabIndex.value] || currentDashboard.tabs[0]
})

const canCreateChart = computed(() => {
  if (!selectedDataSource.value || !selectedChartType.value || !chartConfig.name) {
    return false
  }

  if (selectedChartType.value === 'card') {
    return !!chartConfig.keyMetric
  } else if (selectedChartType.value === 'pie') {
    return !!chartConfig.category
  } else {
    return !!chartConfig.xAxis && !!chartConfig.yAxis
  }
})

// Methods
const addTab = () => {
  const newTab: DashboardTab = {
    id: Date.now().toString(),
    name: `Tab ${currentDashboard.tabs.length + 1}`,
    widgets: []
  }
  currentDashboard.tabs.push(newTab)
  activeTabIndex.value = currentDashboard.tabs.length - 1
  showTabBar.value = true
}

const removeTab = (index: number) => {
  if (currentDashboard.tabs.length > 1) {
    currentDashboard.tabs.splice(index, 1)
    if (activeTabIndex.value >= currentDashboard.tabs.length) {
      activeTabIndex.value = currentDashboard.tabs.length - 1
    }
    if (currentDashboard.tabs.length === 1) {
      showTabBar.value = false
    }
  }
}

const addChart = () => {
  if (!canCreateChart.value || !selectedDataSource.value) return

  const chart: Omit<ChartConfig, 'id' | 'createdAt'> = {
    name: chartConfig.name,
    type: selectedChartType.value as any,
    dataSourceId: selectedDataSource.value.id,
    title: chartConfig.title,
    backgroundColor: '#3b82f6',
    borderColor: '#1d4ed8'
  }

  if (selectedChartType.value === 'card') {
    chart.keyMetric = chartConfig.keyMetric
    chart.previousMetric = chartConfig.previousMetric || undefined
    chart.differenceType = chartConfig.differenceType
  } else if (selectedChartType.value === 'pie') {
    chart.category = chartConfig.category
  } else {
    chart.xAxis = chartConfig.xAxis
    chart.yAxis = chartConfig.yAxis
  }

  const createdChart = chartStore.createChart(chart)
  
  // Add widget to active tab
  const widget: DashboardWidget = {
    id: Date.now().toString(),
    chartId: createdChart.id,
    x: 0,
    y: 0,
    w: selectedChartType.value === 'card' ? 3 : 6,
    h: selectedChartType.value === 'card' ? 2 : 4
  }
  
  activeTab.value.widgets.push(widget)

  // Reset form
  Object.assign(chartConfig, {
    name: '',
    title: '',
    xAxis: '',
    yAxis: '',
    category: '',
    keyMetric: '',
    previousMetric: '',
    differenceType: 'percentage'
  })

  // Reinitialize GridStack
  nextTick(() => {
    if (gridStack) {
      gridStack.destroy(false)
      gridStack = null
    }
    initializeGridStack()
  })
}

const removeWidget = (widgetId: string) => {
  const widgetIndex = activeTab.value.widgets.findIndex(w => w.id === widgetId)
  if (widgetIndex > -1) {
    activeTab.value.widgets.splice(widgetIndex, 1)
    
    nextTick(() => {
      if (gridStack) {
        gridStack.destroy(false)
        gridStack = null
      }
      initializeGridStack()
    })
  }
}

const initializeGridStack = async () => {
  if (!gridStackContainer.value || activeTab.value.widgets.length === 0) return

  await nextTick()

  try {
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

    gridStack.on('change', (event, items) => {
      items.forEach(item => {
        const widget = activeTab.value.widgets.find(w => w.id === item.id)
        if (widget && item.x !== undefined && item.y !== undefined && item.w !== undefined && item.h !== undefined) {
          widget.x = item.x
          widget.y = item.y
          widget.w = item.w
          widget.h = item.h
        }
      })
    })
  } catch (error) {
    console.error('Failed to initialize GridStack:', error)
  }
}

const saveDashboard = () => {
  if (!currentDashboard.name) return

  // Create dashboard with all tabs and widgets
  const dashboard = dashboardStore.createDashboard(currentDashboard.name)
  
  // Add all widgets from all tabs to the dashboard
  currentDashboard.tabs.forEach(tab => {
    tab.widgets.forEach(widget => {
      dashboardStore.addWidget(dashboard.id, widget.chartId)
      const newWidget = dashboard.widgets[dashboard.widgets.length - 1]
      if (newWidget) {
        dashboardStore.updateWidgetLayout(dashboard.id, newWidget.id, {
          x: widget.x,
          y: widget.y,
          w: widget.w,
          h: widget.h
        })
      }
    })
  })

  router.push(`/dashboard/${dashboard.id}`)
}

// Watch for tab changes to reinitialize GridStack
watch(activeTabIndex, () => {
  nextTick(() => {
    if (gridStack) {
      gridStack.destroy(false)
      gridStack = null
    }
    initializeGridStack()
  })
})

onMounted(() => {
  // Load existing dashboard if editing
  const dashboardId = route.query.id as string
  if (dashboardId) {
    const dashboard = dashboardStore.getDashboardById(dashboardId)
    if (dashboard) {
      currentDashboard.name = dashboard.name
      // For now, put all widgets in the first tab
      // In a full implementation, you'd store tab information
      activeTab.value.widgets = [...dashboard.widgets]
      nextTick(() => {
        initializeGridStack()
      })
    }
  }
})

onUnmounted(() => {
  if (gridStack) {
    gridStack.destroy(false)
    gridStack = null
  }
})
</script>

<style scoped>
.widget-header {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
}

.widget-remove-btn {
  @apply bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 transition-opacity duration-200;
}

.grid-stack-item:hover .widget-remove-btn {
  @apply opacity-100;
}

.widget-content {
  height: 100%;
  padding: 8px;
}

.grid-stack-item-content {
  position: relative;
  height: 100%;
}

/* GridStack overrides */
:deep(.grid-stack-item-content) {
  cursor: move;
}

:deep(.grid-stack-item.ui-draggable-dragging) {
  opacity: 0.8;
}

:deep(.grid-stack-item.ui-resizable-resizing) {
  opacity: 0.8;
}
</style>