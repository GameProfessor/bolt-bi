<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div>
            <h1 class="text-xl font-semibold text-gray-900">Quick Dashboard</h1>
            <p class="text-sm text-gray-500">Create dashboards quickly with drag-and-drop</p>
          </div>
          <div class="flex items-center space-x-3">
            <button
              v-if="currentDashboard"
              @click="saveDashboard"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <CheckIcon class="h-4 w-4 mr-2" />
              Save Dashboard
            </button>
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              New Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <!-- Left Sidebar -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Data Sources Section -->
            <div class="bg-white shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Data Sources</h3>
                <div v-if="dataSourceStore.dataSources.length === 0" class="text-center py-4">
                  <TableCellsIcon class="mx-auto h-8 w-8 text-gray-400" />
                  <p class="mt-2 text-sm text-gray-500">No data sources available</p>
                  <router-link
                    to="/data-sources"
                    class="mt-2 inline-flex items-center text-sm text-primary-600 hover:text-primary-500"
                  >
                    Upload CSV files
                    <ArrowRightIcon class="ml-1 h-4 w-4" />
                  </router-link>
                </div>
                <div v-else class="space-y-2">
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
                    <h4 class="text-sm font-medium text-gray-900">{{ dataSource.name }}</h4>
                    <p class="text-xs text-gray-500">{{ dataSource.rows.length }} rows, {{ dataSource.columns.length }} columns</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Chart Types Section -->
            <div class="bg-white shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Chart Types</h3>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="chartType in chartTypes"
                    :key="chartType.type"
                    @click="selectedChartType = chartType.type"
                    class="p-3 border rounded-lg text-center transition-colors duration-200"
                    :class="{
                      'border-primary-300 bg-primary-50 text-primary-700': selectedChartType === chartType.type,
                      'border-gray-200 hover:border-gray-300 text-gray-700': selectedChartType !== chartType.type
                    }"
                  >
                    <component :is="chartType.icon" class="h-6 w-6 mx-auto mb-1" />
                    <span class="text-xs font-medium">{{ chartType.name }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Chart Configuration -->
            <div v-if="selectedDataSource && selectedChartType" class="bg-white shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Chart Configuration</h3>
                
                <!-- Chart Name -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Chart Name</label>
                  <input
                    v-model="chartConfig.name"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter chart name"
                  />
                </div>

                <!-- Chart Title -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Chart Title</label>
                  <input
                    v-model="chartConfig.title"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter chart title"
                  />
                </div>

                <!-- Card Chart Configuration -->
                <div v-if="selectedChartType === 'card'">
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Key Metric</label>
                    <select
                      v-model="chartConfig.keyMetric"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
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

                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Previous Period Metric (Optional)</label>
                    <select
                      v-model="chartConfig.previousMetric"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
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

                  <div v-if="chartConfig.previousMetric" class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Difference Type</label>
                    <select
                      v-model="chartConfig.differenceType"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="value">Value</option>
                    </select>
                  </div>
                </div>

                <!-- Pie Chart Configuration -->
                <div v-else-if="selectedChartType === 'pie'">
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      v-model="chartConfig.category"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
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
                <div v-else>
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">X-Axis</label>
                    <select
                      v-model="chartConfig.xAxis"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
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

                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Y-Axis</label>
                    <select
                      v-model="chartConfig.yAxis"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
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
                <button
                  @click="addChartToDashboard"
                  :disabled="!canAddChart"
                  class="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <PlusIcon class="h-4 w-4 mr-2" />
                  Add to Dashboard
                </button>
              </div>
            </div>
          </div>

          <!-- Main Dashboard Area -->
          <div class="lg:col-span-3">
            <div class="bg-white shadow rounded-lg">
              <!-- Dashboard Tabs -->
              <div v-if="currentDashboard && (currentDashboard.tabs.length > 1 || !hideTabBar)" class="border-b border-gray-200">
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
                    <PlusIcon class="h-4 w-4" />
                  </button>
                </nav>
                <div class="px-6 py-2 bg-gray-50 border-b border-gray-200">
                  <div class="flex items-center justify-between">
                    <input
                      v-if="currentDashboard && activeTab"
                      v-model="activeTab.name"
                      class="text-sm font-medium bg-transparent border-none focus:outline-none focus:ring-0 p-0"
                      placeholder="Tab name"
                    />
                    <button
                      @click="hideTabBar = !hideTabBar"
                      class="text-xs text-gray-500 hover:text-gray-700"
                    >
                      {{ hideTabBar ? 'Show' : 'Hide' }} Tab Bar
                    </button>
                  </div>
                </div>
              </div>

              <!-- Dashboard Content -->
              <div class="p-6">
                <div v-if="!currentDashboard" class="text-center py-12">
                  <Squares2X2Icon class="mx-auto h-12 w-12 text-gray-400" />
                  <h3 class="mt-2 text-sm font-medium text-gray-900">No dashboard selected</h3>
                  <p class="mt-1 text-sm text-gray-500">Create a new dashboard to get started.</p>
                  <div class="mt-6">
                    <button
                      @click="showCreateModal = true"
                      class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                    >
                      <PlusIcon class="h-4 w-4 mr-2" />
                      Create Dashboard
                    </button>
                  </div>
                </div>

                <div v-else-if="!activeTab || activeTab.widgets.length === 0" class="text-center py-12">
                  <ChartBarIcon class="mx-auto h-12 w-12 text-gray-400" />
                  <h3 class="mt-2 text-sm font-medium text-gray-900">No charts in this tab</h3>
                  <p class="mt-1 text-sm text-gray-500">Add charts from the sidebar to build your dashboard.</p>
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

    <!-- Create Dashboard Modal -->
    <TransitionRoot :show="showCreateModal" as="template">
      <Dialog @close="showCreateModal = false" class="relative z-10">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <form @submit.prevent="createDashboard">
                  <div>
                    <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                      <Squares2X2Icon class="h-6 w-6 text-primary-600" />
                    </div>
                    <div class="mt-3 text-center sm:mt-5">
                      <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                        Create New Dashboard
                      </DialogTitle>
                      <div class="mt-2">
                        <p class="text-sm text-gray-500">
                          Enter a name and description for your new dashboard.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div class="mt-5 sm:mt-6">
                    <div class="mb-4">
                      <label for="dashboardName" class="block text-sm font-medium text-gray-700">
                        Dashboard Name
                      </label>
                      <input
                        id="dashboardName"
                        v-model="newDashboard.name"
                        type="text"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        placeholder="Enter dashboard name"
                      />
                    </div>
                    <div class="mb-4">
                      <label for="dashboardDescription" class="block text-sm font-medium text-gray-700">
                        Description (Optional)
                      </label>
                      <textarea
                        id="dashboardDescription"
                        v-model="newDashboard.description"
                        rows="3"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        placeholder="Enter dashboard description"
                      />
                    </div>
                    <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                      <button
                        type="submit"
                        class="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
                      >
                        Create
                      </button>
                      <button
                        type="button"
                        @click="showCreateModal = false"
                        class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import {
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  ChartBarIcon,
  PresentationChartLineIcon,
  ChartPieIcon,
  TableCellsIcon,
  Squares2X2Icon,
  ArrowRightIcon,
  CreditCardIcon
} from '@heroicons/vue/24/outline'
import { GridStack } from 'gridstack'
import { useDataSourceStore, type DataSource } from '../stores/dataSource'
import { useChartStore } from '../stores/chart'
import { useDashboardStore, type DashboardWidget } from '../stores/dashboard'
import DashboardChart from '../components/DashboardChart.vue'

// Enhanced Dashboard interface with tabs
interface DashboardTab {
  id: string
  name: string
  widgets: DashboardWidget[]
}

interface EnhancedDashboard {
  id: string
  name: string
  description?: string
  tabs: DashboardTab[]
  createdAt: Date
}

const route = useRoute()
const router = useRouter()

const dataSourceStore = useDataSourceStore()
const chartStore = useChartStore()
const dashboardStore = useDashboardStore()

const selectedDataSource = ref<DataSource | null>(null)
const selectedChartType = ref<string>('')
const showCreateModal = ref(false)
const gridStackContainer = ref<HTMLElement>()
const activeTabIndex = ref(0)
const hideTabBar = ref(true)

let gridStack: GridStack | null = null

// Enhanced dashboard state
const currentDashboard = ref<EnhancedDashboard | null>(null)

const chartTypes = [
  { type: 'bar', name: 'Bar', icon: ChartBarIcon },
  { type: 'line', name: 'Line', icon: PresentationChartLineIcon },
  { type: 'pie', name: 'Pie', icon: ChartPieIcon },
  { type: 'scatter', name: 'Scatter', icon: Squares2X2Icon },
  { type: 'card', name: 'Card', icon: CreditCardIcon }
]

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

const newDashboard = reactive({
  name: '',
  description: ''
})

const numericColumns = computed(() => {
  return selectedDataSource.value?.columns.filter(col => col.type === 'number') || []
})

const activeTab = computed(() => {
  return currentDashboard.value?.tabs[activeTabIndex.value] || null
})

const canAddChart = computed(() => {
  if (!selectedDataSource.value || !selectedChartType.value || !chartConfig.name) return false
  
  if (selectedChartType.value === 'card') {
    return !!chartConfig.keyMetric
  } else if (selectedChartType.value === 'pie') {
    return !!chartConfig.category
  } else {
    return !!chartConfig.xAxis && !!chartConfig.yAxis
  }
})

// Initialize from URL parameter
const initializeDashboard = () => {
  const dashboardId = route.query.id as string
  if (dashboardId) {
    const dashboard = dashboardStore.getDashboardById(dashboardId)
    if (dashboard) {
      // Convert regular dashboard to enhanced dashboard with tabs
      currentDashboard.value = {
        id: dashboard.id,
        name: dashboard.name,
        description: dashboard.description,
        createdAt: dashboard.createdAt,
        tabs: [{
          id: 'tab-1',
          name: 'Main',
          widgets: dashboard.widgets
        }]
      }
      hideTabBar.value = true
    }
  }
}

const createDashboard = () => {
  const dashboard = dashboardStore.createDashboard(newDashboard.name, newDashboard.description)
  
  // Convert to enhanced dashboard
  currentDashboard.value = {
    id: dashboard.id,
    name: dashboard.name,
    description: dashboard.description,
    createdAt: dashboard.createdAt,
    tabs: [{
      id: 'tab-1',
      name: 'Main',
      widgets: []
    }]
  }
  
  activeTabIndex.value = 0
  hideTabBar.value = true
  showCreateModal.value = false
  newDashboard.name = ''
  newDashboard.description = ''
  
  // Update URL
  router.replace({ query: { id: dashboard.id } })
}

const addTab = () => {
  if (!currentDashboard.value) return
  
  const newTab: DashboardTab = {
    id: `tab-${Date.now()}`,
    name: `Tab ${currentDashboard.value.tabs.length + 1}`,
    widgets: []
  }
  
  currentDashboard.value.tabs.push(newTab)
  activeTabIndex.value = currentDashboard.value.tabs.length - 1
  hideTabBar.value = false
}

const removeTab = (index: number) => {
  if (!currentDashboard.value || currentDashboard.value.tabs.length <= 1) return
  
  if (confirm('Are you sure you want to remove this tab? All widgets in this tab will be deleted.')) {
    currentDashboard.value.tabs.splice(index, 1)
    if (activeTabIndex.value >= currentDashboard.value.tabs.length) {
      activeTabIndex.value = currentDashboard.value.tabs.length - 1
    }
    if (currentDashboard.value.tabs.length === 1) {
      hideTabBar.value = true
    }
  }
}

const addChartToDashboard = () => {
  if (!canAddChart.value || !selectedDataSource.value || !currentDashboard.value || !activeTab.value) return

  // Create chart
  const chart = chartStore.createChart({
    name: chartConfig.name,
    type: selectedChartType.value as any,
    dataSourceId: selectedDataSource.value.id,
    title: chartConfig.title,
    xAxis: chartConfig.xAxis || undefined,
    yAxis: chartConfig.yAxis || undefined,
    category: chartConfig.category || undefined,
    keyMetric: chartConfig.keyMetric || undefined,
    previousMetric: chartConfig.previousMetric || undefined,
    differenceType: chartConfig.differenceType,
    backgroundColor: '#3b82f6',
    borderColor: '#1d4ed8'
  })

  // Add widget to active tab
  const widget: DashboardWidget = {
    id: Date.now().toString(),
    chartId: chart.id,
    x: 0,
    y: 0,
    w: selectedChartType.value === 'card' ? 3 : 6,
    h: selectedChartType.value === 'card' ? 2 : 4
  }

  activeTab.value.widgets.push(widget)

  // Reset form
  chartConfig.name = ''
  chartConfig.title = ''
  chartConfig.xAxis = ''
  chartConfig.yAxis = ''
  chartConfig.category = ''
  chartConfig.keyMetric = ''
  chartConfig.previousMetric = ''
  selectedChartType.value = ''

  // Reinitialize GridStack
  nextTick(() => {
    initializeGridStack()
  })
}

const removeWidget = (widgetId: string) => {
  if (!activeTab.value) return
  
  if (confirm('Are you sure you want to remove this widget?')) {
    const index = activeTab.value.widgets.findIndex(w => w.id === widgetId)
    if (index > -1) {
      activeTab.value.widgets.splice(index, 1)
      
      // Reinitialize GridStack
      nextTick(() => {
        initializeGridStack()
      })
    }
  }
}

const saveDashboard = () => {
  if (!currentDashboard.value) return
  
  // For now, save only the first tab to the regular dashboard store
  // In a real implementation, you'd extend the dashboard store to support tabs
  const mainTab = currentDashboard.value.tabs[0]
  if (mainTab) {
    dashboardStore.updateDashboard(currentDashboard.value.id, {
      name: currentDashboard.value.name,
      description: currentDashboard.value.description,
      widgets: mainTab.widgets
    })
  }
  
  alert('Dashboard saved successfully!')
}

const initializeGridStack = async () => {
  if (!gridStackContainer.value || !activeTab.value) return

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
      if (!activeTab.value) return
      
      items.forEach(item => {
        const widget = activeTab.value!.widgets.find(w => w.id === item.id)
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

// Watch for tab changes and reinitialize GridStack
watch(activeTabIndex, () => {
  nextTick(() => {
    initializeGridStack()
  })
})

onMounted(() => {
  initializeDashboard()
  if (activeTab.value && activeTab.value.widgets.length > 0) {
    initializeGridStack()
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