<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center h-16 justify-between">
          <div class="flex items-center gap-2">
            <button
              @click="goBack"
              class="mr-4 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeftIcon class="h-6 w-6" />
            </button>
            <input
              id="dashboardName"
              v-model="dashboardName"
              type="text"
              placeholder="Enter dashboard name"
              class="text-xl font-semibold text-gray-900 bg-transparent border-none focus:ring-0 focus:border-b-2 focus:border-primary-500 px-1 py-0.5 w-64"
            />
          </div>
          <div class="flex items-center gap-3 ml-auto">
            <button
              class="inline-flex items-center px-4 py-2 border border-primary-200 text-sm font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              title="Share dashboard"
            >
              <ShareIcon class="h-4 w-4 mr-2" />
              Share
            </button>
            <button
              @click="previewMode = true"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A2 2 0 0020 6.382V5a2 2 0 00-2-2H6a2 2 0 00-2 2v1.382a2 2 0 00.447 1.342L9 10m6 0v4m0 0l-4.553 2.276A2 2 0 014 17.618V19a2 2 0 002 2h12a2 2 0 002-2v-1.382a2 2 0 00-.447-1.342L15 14z" /></svg>
              Preview
            </button>
            <button
              @click="saveDashboard"
              :disabled="!dashboardName"
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
      <!-- Left Sidebar with Tabs -->
      <DataPanel
        v-if="!previewMode"
        ref="dataPanelRef"
        :selectedDataSources="selectedDataSources"
        :expandedDataSources="expandedDataSources"
        :isFieldInUse="isFieldInUse"
        :width="leftSidebarWidth"
        :category="dashboardCategory"
        :description="dashboardDescription"
        @open-manager="openDataSourceManager"
        @toggle-expand="toggleDataSource"
        @field-drag="onFieldDragStart"
        @update-selected-data-sources="updateSelectedDataSources"
        @toggle-dashboard-tabs="handleToggleDashboardTabs"
        @update-dashboard-info="onUpdateDashboardInfo"
      />

      <!-- Draggable Divider (between left sidebar and chart type col) -->
      <div
        v-if="!previewMode"
        class="resizer"
        @mousedown="startResizing('left')"
        :style="{ cursor: 'col-resize', width: '6px', background: '#e5e7eb', zIndex: 20 }"
      ></div>

      <!-- Chart Type & Properties Column -->
      <ChartPanel
        v-if="!previewMode"
        :chartTypes="chartTypes"
        :selectedChartType="selectedChartType"
        :chartConfig="chartConfig"
        :colorSchemes="colorSchemes"
        :colorPalettes="colorPalettes"
        :isChartConfigValid="isChartConfigValid"
        :editingChartId="editingChartId"
        :selectedDataSources="selectedDataSources"
        :width="chartTypeColWidth"
        :alwaysShowProperties="true"
        @update:selectedChartType="selectedChartType = $event"
        @field-drop="onFieldDrop"
        @remove-x-axis="(idx) => { if (Array.isArray(chartConfig.xAxis)) chartConfig.xAxis.splice(idx, 1) }"
        @add-or-update-chart="addOrUpdateChart"
        @cancel-edit="cancelEdit"
      />

      <!-- Draggable Divider (between chart type col and main dashboard) -->
      <div
        v-if="!previewMode"
        class="resizer"
        @mousedown="startResizing('chartType')"
        :style="{ cursor: 'col-resize', width: '6px', background: '#e5e7eb', zIndex: 20 }"
      ></div>

      <!-- Main Dashboard Area -->
      <div 
        :class="['flex-1 p-3']" 
        style="position:relative;"
        @drop="onChartTypeDrop"
        @dragover="onDragOver"
        @dragenter.prevent="onDragEnter"
        @dragleave="onDragLeave"
      >
        <!-- Drag Preview Shadow -->
        <div 
          v-if="showDragPreview"
          class="absolute border-2 border-dashed border-primary-400 bg-primary-50 bg-opacity-30 rounded-lg pointer-events-none z-10"
          :style="{
            left: dragPreviewStyle.left + 'px',
            top: dragPreviewStyle.top + 'px',
            width: dragPreviewStyle.width + 'px',
            height: dragPreviewStyle.height + 'px'
          }"
        >
          <div class="flex items-center justify-center h-full text-primary-600 text-sm font-medium">
            Drop to create chart
          </div>
        </div>
        
        <!-- Tabs UI -->
        <nav v-if="showDashboardTabs" class="flex gap-2 px-1 mt-0 mb-2" aria-label="Dashboard Tabs" style="align-items: flex-start;">
          <div class="flex gap-2">
            <transition-group name="fade" tag="div" class="flex gap-2">
              <div
                v-for="tab in dashboardTabs"
                :key="tab.id"
                class="relative group flex items-center"
                @mouseenter="tabHoverId = tab.id"
                @mouseleave="tabHoverId = null"
              >
                <input
                  v-if="tab.id === editingTabId"
                  v-model="editingTabName"
                  :id="`tab-edit-input-${tab.id}`"
                  @blur="finishRenameTab(tab.id)"
                  @keyup.enter="finishRenameTab(tab.id)"
                  @keyup.esc="cancelRenameTab()"
                  @keydown="handleTabEditKey(tab.id, $event)"
                  class="px-2 py-1 border rounded text-sm w-28 mr-1 focus:ring-2 focus:ring-primary-500"
                  :style="'transition: box-shadow 0.2s;'"
                  autofocus
                />
                <button
                  v-else
                  @click="activeTabId = tab.id"
                  :class="[
                    'py-2.5 px-4 text-center font-medium text-sm transition-all duration-200 flex items-center gap-2 rounded-lg shadow-sm border relative',
                    activeTabId === tab.id
                      ? 'border-primary-200 text-primary-700 bg-primary-50 shadow-md z-10'
                      : 'border-gray-200 text-gray-600 bg-white hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md'
                  ]"
                  :title="tab.name"
                >
                  <span>{{ tab.name }}</span>
                  <PencilIcon
                    v-if="tabHoverId === tab.id"
                    @click.stop="startRenameTab(tab.id)"
                    class="h-4 w-4 ml-1 text-gray-400 hover:text-primary-600 cursor-pointer transition-opacity duration-150 opacity-80 group-hover:opacity-100"
                  />
            <button
                    v-if="dashboardTabs.length > 1 && tabHoverId === tab.id"
                    @click.stop="removeTab(tab.id)"
                    class="ml-1 text-gray-400 hover:text-red-500 bg-transparent rounded-full p-0.5 transition-opacity duration-150 opacity-80 group-hover:opacity-100"
                    style="z-index:20"
                  >
                    &times;
            </button>
                </button>
          </div>
            </transition-group>
            <button @click="addTab" class="ml-2 px-2 py-1 bg-gray-100 text-gray-500 rounded hover:bg-primary-100 hover:text-primary-700 transition-colors duration-150 focus:outline-none border-none shadow-none">+</button>
        </div>
        </nav>
        <div class="bg-white rounded-lg shadow-sm h-full">
          <div class="p-6 h-full">
            <div v-if="charts.length === 0" class="flex items-center justify-center h-full text-gray-500">
              <div class="text-center">
                <Squares2X2Icon class="mx-auto h-12 w-12 mb-4" />
                <h3 class="text-lg font-medium text-gray-900 mb-2">Start Building Your Dashboard</h3>
                <p class="text-sm text-gray-500">
                  Select a data source, choose a chart type, and drag fields to create your first chart.
                </p>
                <p class="text-sm text-gray-400 mt-2">
                  Or drag a chart type from the left panel to create an empty chart.
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
                    <div class="relative chart-menu-container">
                      <button v-if="!previewMode" @click="toggleChartMenu(chart.id)" class="chart-menu-btn p-1 rounded-full hover:bg-gray-100 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>
                      </button>
                      <div v-if="openChartMenuId === chart.id && !previewMode" class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-30">
                        <button @click="editChart(chart)" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Edit</button>
                        <button @click="exportChart(chart, 'pdf')" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Export PDF</button>
                        <button @click="exportChart(chart, 'png')" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Export to PNG</button>
                        <button @click="removeChart(chart.id)" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Remove</button>
                      </div>
                    </div>
                  </div>
                  <div 
                    class="chart-content"
                    @click="editChart(chart)"
                    :class="{ 'cursor-pointer': !previewMode }"
                  >
                    <ChartPreview :chart="chart" :key="`${chart.id}-${chart.updatedAt?.getTime() || chart.createdAt.getTime()}`" class="w-full h-full" />
                  </div>
                </div>
              </div>
            </div>
            <!-- Exit Preview Button -->
            <button v-if="previewMode" @click="previewMode = false" class="absolute top-4 right-4 z-50 px-4 py-2 bg-white text-primary-700 border border-gray-300 rounded shadow hover:bg-gray-50">Exit Preview</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <Toast
      :show="showToast"
      :type="toastType"
      :title="toastTitle"
      :message="toastMessage"
      @close="hideToast"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { nanoid } from 'nanoid'
import {
  ArrowLeftIcon,
  PlusIcon,
  XMarkIcon,
  Squares2X2Icon,
  DocumentCheckIcon,
  ChartBarIcon,
  PresentationChartLineIcon,
  ChartPieIcon,
  CircleStackIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  CheckIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon
} from '@heroicons/vue/24/outline'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { GridStack } from 'gridstack'
import { useDataSourceStore, useDashboardStore } from '@/stores'
import type { DataSourceColumn } from '@/stores/modules/dataSource'
import type { DashboardChart, DashboardTab } from '@/types/dashboard'
import type { ChartType } from '@/types/chart'
import { createBarChart, createPieChart, createLineChart, createScatterChart, createCardChart } from '@/types/dashboard'
import ChartPreview from '@/components/charts/ChartPreview.vue'
import DataPanel from './components/DataPanel.vue'
import ChartPanel from './components/ChartPanel.vue'
import Toast from '@/components/ui/Toast.vue'
import { useDashboardState } from './composables/useDashboardState'

const router = useRouter()
const route = useRoute()
const dataSourceStore = useDataSourceStore()
const dashboardStore = useDashboardStore()

// Use the dashboard state composable
const {
  dashboardName,
  dashboardDescription,
  dashboardCategory,
  currentDashboardId,
  previewMode,
  selectedDataSources,
  expandedDataSources,
  showToast,
  toastType,
  toastTitle,
  toastMessage,
  dashboardTabs,
  activeTabId,
  showDashboardTabs,
  hasUnsavedChanges,
  saveDashboard,
  loadDashboard,
  createTemporaryDashboard,
  showToastNotification,
  hideToast,
  goBack,
  toggleDataSource,
  updateSelectedDataSources,
  handleToggleDashboardTabs,
  onUpdateDashboardInfo
} = useDashboardState()

const selectedDataSourceId = ref('')
const selectedChartType = ref<ChartType | ''>('')
const gridStackContainer = ref<HTMLElement>()
const dataPanelRef = ref<InstanceType<typeof DataPanel>>()

// Single GridStack instance that gets reinitialized when switching tabs
let gridStack: GridStack | null = null

// Chart configuration for editing
const chartConfig = reactive({
  title: '',
  dataSourceId: '',
  backgroundColor: '#3b82f6',
  borderColor: '#1d4ed8',
  colorScheme: 'default',
  // Bar chart specific
  xAxis: [] as string[],
  yAxis: '',
  horizontal: false,
  // Pie chart specific
  category: '',
  value: '',
  // Line chart specific
  smooth: false,
  fillArea: false,
  // Card specific
  keyMetric: '',
  previousMetric: '',
  differenceType: 'percentage' as 'absolute' | 'percentage',
  aggregation: 'sum' as 'sum' | 'avg' | 'count' | 'min' | 'max'
})

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

const editingChartId = ref<string | null>(null)
const openChartMenuId = ref<string | null>(null)

// Tab editing state
const editingTabId = ref<string | null>(null)
const editingTabName = ref('')
const tabHoverId = ref<string | null>(null)

const handleClickOutside = (event: Event) => {
  if (openChartMenuId.value) {
    const target = event.target as HTMLElement
    const isWithinChartMenu = target.closest('.chart-menu-container')
    if (!isWithinChartMenu) {
      openChartMenuId.value = null
    }
  }
}

const resetChartConfig = () => {
  selectedChartType.value = ''
  chartConfig.title = ''
  chartConfig.dataSourceId = ''
  chartConfig.backgroundColor = '#3b82f6'
  chartConfig.borderColor = '#1d4ed8'
  chartConfig.colorScheme = 'default'
  chartConfig.xAxis = []
  chartConfig.yAxis = ''
  chartConfig.horizontal = false
  chartConfig.smooth = false
  chartConfig.fillArea = false
  chartConfig.keyMetric = ''
  chartConfig.previousMetric = ''
  chartConfig.differenceType = 'percentage'
  chartConfig.aggregation = 'sum'
}

const addOrUpdateChart = () => {
  if (!isChartConfigValid.value) return
  
  if (editingChartId.value) {
    if (!currentDashboardId.value) return
    
    const dashboard = dashboardStore.getDashboardById(currentDashboardId.value)
    if (dashboard) {
      const chart = dashboard.charts.find(c => c.id === editingChartId.value)
      if (chart) {
        const updates: Partial<DashboardChart> = {
          base: {
            title: chartConfig.title,
            dataSourceId: chartConfig.dataSourceId,
            backgroundColor: chartConfig.backgroundColor,
            borderColor: chartConfig.borderColor,
            colorScheme: chartConfig.colorScheme
          }
        }
        
        switch (selectedChartType.value) {
          case 'bar':
            updates.properties = { bar: { xAxis: chartConfig.xAxis, yAxis: chartConfig.yAxis, horizontal: chartConfig.horizontal } }
            break
          case 'line':
            updates.properties = { line: { xAxis: chartConfig.xAxis[0] || '', yAxis: chartConfig.yAxis, smooth: chartConfig.smooth, fillArea: chartConfig.fillArea } }
            break
          case 'pie':
            updates.properties = { pie: { category: chartConfig.category, value: chartConfig.value } }
            break
          case 'scatter':
            updates.properties = { scatter: { xAxis: chartConfig.xAxis[0] || '', yAxis: chartConfig.yAxis } }
            break
          case 'card':
            updates.properties = { card: { keyMetric: chartConfig.keyMetric, previousMetric: chartConfig.previousMetric, differenceType: chartConfig.differenceType, aggregation: chartConfig.aggregation } }
            break
        }
        
        dashboardStore.updateChart(currentDashboardId.value, editingChartId.value, updates)
      }
    }
    editingChartId.value = null
    resetChartConfig()
    setTimeout(() => {
      nextTick(() => {
        // Reinitialize GridStack for the current tab
        initializeGridStack()
      })
    }, 100)
    return
  }
  
  addChart()
}

const addChart = () => {
  if (!isChartConfigValid.value) return
  
  if (!currentDashboardId.value) {
    createTemporaryDashboard()
  }
  
  let newChart: DashboardChart
  
  switch (selectedChartType.value) {
    case 'bar':
      newChart = createBarChart({
        title: chartConfig.title,
        dataSourceId: chartConfig.dataSourceId,
        xAxis: chartConfig.xAxis,
        yAxis: chartConfig.yAxis,
        horizontal: chartConfig.horizontal,
        backgroundColor: chartConfig.backgroundColor,
        borderColor: chartConfig.borderColor,
        colorScheme: chartConfig.colorScheme
      })
      break
    case 'line':
      newChart = createLineChart({
        title: chartConfig.title,
        dataSourceId: chartConfig.dataSourceId,
        xAxis: chartConfig.xAxis[0] || '',
        yAxis: chartConfig.yAxis || '',
        smooth: chartConfig.smooth,
        fillArea: chartConfig.fillArea,
        backgroundColor: chartConfig.backgroundColor,
        borderColor: chartConfig.borderColor,
        colorScheme: chartConfig.colorScheme
      })
      break
    case 'pie':
      newChart = createPieChart({
        title: chartConfig.title,
        dataSourceId: chartConfig.dataSourceId,
        category: chartConfig.category || '',
        value: chartConfig.value || '',
        backgroundColor: chartConfig.backgroundColor,
        borderColor: chartConfig.borderColor,
        colorScheme: chartConfig.colorScheme
      })
      break
    case 'scatter':
      newChart = createScatterChart({
        title: chartConfig.title,
        dataSourceId: chartConfig.dataSourceId,
        xAxis: chartConfig.xAxis[0] || '',
        yAxis: chartConfig.yAxis || '',
        backgroundColor: chartConfig.backgroundColor,
        borderColor: chartConfig.borderColor,
        colorScheme: chartConfig.colorScheme
      })
      break
    case 'card':
      newChart = createCardChart({
        title: chartConfig.title,
        dataSourceId: chartConfig.dataSourceId,
        keyMetric: chartConfig.keyMetric || '',
        previousMetric: chartConfig.previousMetric,
        differenceType: chartConfig.differenceType,
        aggregation: chartConfig.aggregation,
        backgroundColor: chartConfig.backgroundColor,
        borderColor: chartConfig.borderColor,
        colorScheme: chartConfig.colorScheme
      })
      break
    default:
    return
  }
  
  if (!currentDashboardId.value) return
  
  const savedChart = dashboardStore.addChart(currentDashboardId.value, newChart)
  
  const activeTab = dashboardTabs.value.find(t => t.id === activeTabId.value)
  if (activeTab) {
    activeTab.chartIds.push(savedChart.id)
  }
  
  resetChartConfig()
  setTimeout(() => {
    nextTick(() => {
      // Reinitialize GridStack for the current tab
      initializeGridStack()
    })
  }, 100)
}

const editChart = (chart: DashboardChart) => {
  openChartMenuId.value = null
  editingChartId.value = chart.id
  selectedChartType.value = chart.type
  
  chartConfig.title = chart.base.title
  chartConfig.dataSourceId = chart.base.dataSourceId
  chartConfig.backgroundColor = chart.base.backgroundColor || '#3b82f6'
  chartConfig.borderColor = chart.base.borderColor || '#1d4ed8'
  chartConfig.colorScheme = chart.base.colorScheme || 'default'
  
  switch (chart.type) {
    case 'bar':
      if (chart.properties.bar) {
        chartConfig.xAxis = chart.properties.bar.xAxis
        chartConfig.yAxis = chart.properties.bar.yAxis
        chartConfig.horizontal = chart.properties.bar.horizontal || false
      }
      break
    case 'line':
      if (chart.properties.line) {
        chartConfig.xAxis = [chart.properties.line.xAxis]
        chartConfig.yAxis = chart.properties.line.yAxis
        chartConfig.smooth = chart.properties.line.smooth || false
        chartConfig.fillArea = chart.properties.line.fillArea || false
      }
      break
    case 'pie':
      if (chart.properties.pie) {
        chartConfig.category = chart.properties.pie.category
        chartConfig.value = chart.properties.pie.value
      }
      break
    case 'scatter':
      if (chart.properties.scatter) {
        chartConfig.xAxis = [chart.properties.scatter.xAxis]
        chartConfig.yAxis = chart.properties.scatter.yAxis
      }
      break
    case 'card':
      if (chart.properties.card) {
        chartConfig.keyMetric = chart.properties.card.keyMetric || ''
        chartConfig.previousMetric = chart.properties.card.previousMetric || ''
        chartConfig.differenceType = chart.properties.card.differenceType || 'percentage'
        chartConfig.aggregation = chart.properties.card.aggregation || 'sum'
      }
      break
  }
}

const removeChart = (chartId: string) => {
  if (confirm('Are you sure you want to remove this chart?') && currentDashboardId.value) {
    dashboardStore.removeChart(currentDashboardId.value, chartId)
    
    dashboardTabs.value.forEach(tab => {
      tab.chartIds = tab.chartIds.filter(id => id !== chartId)
    })
    
    nextTick(() => {
      // Reinitialize GridStack for the current tab
      initializeGridStack()
    })
  }
}

const cancelEdit = () => {
  editingChartId.value = null
  resetChartConfig()
}

const exportChart = (chart: DashboardChart, type: 'pdf' | 'png') => {
  openChartMenuId.value = null
  alert(`Exporting chart '${chart.base.title}' as ${type.toUpperCase()} (stub)`)
}

const toggleChartMenu = (id: string) => {
  openChartMenuId.value = openChartMenuId.value === id ? null : id
}

const initializeGridStack = () => {
  if (!gridStackContainer.value) return

  nextTick(() => {
    try {
      // Always destroy existing GridStack instance first
      if (gridStack) {
        gridStack.destroy(false)
        gridStack = null
      }

      // Create new GridStack instance
      gridStack = GridStack.init({
        cellHeight: 70,
        margin: 10,
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

      // Set up change event handler
      gridStack.on('change', (event, items) => {
        items.forEach(item => {
          if (currentDashboardId.value && item.id && item.x !== undefined && item.y !== undefined && item.w !== undefined && item.h !== undefined) {
            dashboardStore.updateChartLayout(currentDashboardId.value, item.id, {
              x: item.x,
              y: item.y,
              w: item.w,
              h: item.h
            })
          }
        })
      })
    } catch (error) {
      console.error('Failed to initialize GridStack:', error)
    }
  })
}

// Switch to a different tab's GridStack
const switchToTabGridStack = (tabId: string) => {
  // Simply reinitialize the GridStack for the new tab
  initializeGridStack()
}

const isChartConfigValid = computed(() => {
  if (!selectedChartType.value) return false
  
  switch (selectedChartType.value) {
    case 'bar':
      return true
    case 'line':
      return true
    case 'pie':
      return true
    case 'scatter':
      return true
    case 'card':
      return true
    default:
      return false
  }
})

const addTab = () => {
  const newTab = { id: nanoid(), name: `Tab ${dashboardTabs.value.length + 1}`, chartIds: [] }
  dashboardTabs.value.push(newTab)
  activeTabId.value = newTab.id
  nextTick(() => {
    // Initialize GridStack for the new tab
    initializeGridStack()
  })
}

const removeTab = (tabId: string) => {
  if (dashboardTabs.value.length === 1) return
  const tab = dashboardTabs.value.find(t => t.id === tabId)
  if (!tab) return
  if (confirm(`Are you sure you want to remove the tab "${tab.name}" and all its charts? This cannot be undone.`)) {
    // Clean up GridStack
    if (gridStack) {
      gridStack.destroy(false)
      gridStack = null
    }
    
    const idx = dashboardTabs.value.findIndex(t => t.id === tabId)
    dashboardTabs.value.splice(idx, 1)
    if (activeTabId.value === tabId) {
      activeTabId.value = dashboardTabs.value[Math.max(0, idx - 1)].id
      nextTick(() => {
        // Reinitialize GridStack for the new active tab
        initializeGridStack()
      })
    }
  }
}

const startRenameTab = (tabId: string) => {
  const tab = dashboardTabs.value.find(t => t.id === tabId)
  if (tab) {
    editingTabId.value = tabId
    editingTabName.value = tab.name
    nextTick(() => {
      const input = document.getElementById(`tab-edit-input-${tabId}`) as HTMLInputElement
      if (input) input.focus()
    })
  }
}

const finishRenameTab = (tabId: string) => {
  if (!editingTabName.value.trim()) return
  const tab = dashboardTabs.value.find(t => t.id === tabId)
  if (tab) tab.name = editingTabName.value.trim()
  editingTabId.value = null
}

const cancelRenameTab = () => {
  editingTabId.value = null
}

const handleTabEditKey = (tabId: string, e: KeyboardEvent) => {
  if (e.key === 'Enter') finishRenameTab(tabId)
  if (e.key === 'Escape') cancelRenameTab()
}

const charts = computed(() => {
  const dashboard = currentDashboardId.value ? dashboardStore.getDashboardById(currentDashboardId.value) : null
  if (!dashboard) return []
  
  const activeTab = dashboardTabs.value.find(t => t.id === activeTabId.value)
  if (!activeTab) return []
  
  return dashboard.charts.filter(chart => activeTab.chartIds.includes(chart.id))
})

// Watch for tab changes and reinitialize GridStack
watch(activeTabId, (newTabId) => {
  if (newTabId) {
    nextTick(() => {
      initializeGridStack()
    })
  }
})

// Watch for charts changes and reinitialize GridStack if needed
watch(charts, () => {
  nextTick(() => {
    // Reinitialize if we don't have a GridStack yet
    if (!gridStack) {
      initializeGridStack()
    }
  })
}, { deep: true })

const chartTypes = [
  { value: 'bar' as const, label: 'Bar', icon: ChartBarIcon },
  { value: 'line' as const, label: 'Line', icon: PresentationChartLineIcon },
  { value: 'pie' as const, label: 'Pie', icon: ChartPieIcon },
  { value: 'scatter' as const, label: 'Scatter', icon: CircleStackIcon },
  { value: 'card' as const, label: 'Card', icon: Cog6ToothIcon }
] as const

const colorSchemes = [
  { value: 'default', label: 'Default' },
  { value: 'pastel', label: 'Pastel' },
  { value: 'vivid', label: 'Vivid' },
  { value: 'earth', label: 'Earth' }
]

const colorPalettes: Record<string, string[]> = {
  default: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'],
  pastel: ['#a5b4fc', '#fbcfe8', '#bbf7d0', '#fde68a', '#ddd6fe'],
  vivid: ['#e11d48', '#2563eb', '#059669', '#f59e42', '#a21caf'],
  earth: ['#a16207', '#713f12', '#166534', '#155e75', '#7c2d12']
}

const onFieldDragStart = (event: DragEvent, column: DataSourceColumn, dataSourceId: string) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', JSON.stringify({
      name: column.name,
      type: column.type,
      dataSourceId
    }))
  }
}

const onFieldDrop = (event: DragEvent, target: 'xAxis' | 'yAxis' | 'category' | 'value' | 'keyMetric') => {
  event.preventDefault()
  if (!event.dataTransfer) return
  try {
    const fieldData = JSON.parse(event.dataTransfer.getData('text/plain'))
    
    if (target === 'yAxis' && fieldData.type !== 'number') {
      alert('Y-axis requires a numeric field')
      return
    }

    if (chartConfig.dataSourceId && chartConfig.dataSourceId !== fieldData.dataSourceId) {
      if (selectedChartType.value === 'bar' && chartConfig.xAxis.length > 0) {
        alert('Cannot mix fields from different data sources in the same chart')
        return
      }
    }

    if (target === 'xAxis' && selectedChartType.value === 'bar') {
      if (!chartConfig.xAxis.includes(fieldData.name)) {
        chartConfig.xAxis.push(fieldData.name)
      }
    } else if (target === 'xAxis') {
      chartConfig.xAxis = [fieldData.name]
    } else if (target === 'yAxis') {
      chartConfig.yAxis = fieldData.name
    } else if (target === 'category') {
      chartConfig.category = fieldData.name
    } else if (target === 'value') {
      chartConfig.value = fieldData.name
    } else if (target === 'keyMetric') {
      chartConfig.keyMetric = fieldData.name
    }
    
    chartConfig.dataSourceId = fieldData.dataSourceId
  } catch (error) {
    console.error('Failed to parse dropped field data:', error)
  }
}

const showDragPreview = ref(false)
const dragPreviewStyle = ref({
  left: 0,
  top: 0,
  width: 0,
  height: 0
})

const onDragEnter = (event: DragEvent) => {
  event.preventDefault()
  if (!event.dataTransfer) return
  
  try {
    const data = JSON.parse(event.dataTransfer.getData('application/json'))
    if (data.chartType) {
      showDragPreview.value = true
      updateDragPreviewPosition(event)
    }
  } catch (error) {
    showDragPreview.value = true
    updateDragPreviewPosition(event)
  }
}

const onDragLeave = (event: DragEvent) => {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX
  const y = event.clientY
  
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    showDragPreview.value = false
  }
}

const updateDragPreviewPosition = (event: DragEvent) => {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  const cellWidth = (window.innerWidth - 240 - 260 - 48) / 12
  const cellHeight = 70 + 10
  const previewWidth = 4 * cellWidth - 24
  const previewHeight = 3 * cellHeight - 24
  
  let previewLeft = x - (previewWidth / 2)
  let previewTop = y - (previewHeight / 2)
  
  const dashboardWidth = rect.width - 24
  const dashboardHeight = rect.height - 24
  
  previewLeft = Math.max(12, Math.min(previewLeft, dashboardWidth - previewWidth - 12))
  previewTop = Math.max(12, Math.min(previewTop, dashboardHeight - previewHeight - 12))
  
  const isWithinBoundaries = 
    previewLeft >= 12 && 
    previewTop >= 12 && 
    previewLeft + previewWidth <= dashboardWidth - 12 && 
    previewTop + previewHeight <= dashboardHeight - 12
  
  if (!isWithinBoundaries) {
    showDragPreview.value = false
    return
  }
  
  dragPreviewStyle.value = {
    left: previewLeft,
    top: previewTop,
    width: previewWidth,
    height: previewHeight
  }
  
  if (!showDragPreview.value) {
    showDragPreview.value = true
  }
}

const onChartTypeDrop = (event: DragEvent) => {
  event.preventDefault()
  showDragPreview.value = false
  
  if (!event.dataTransfer) return
  
  try {
    const data = JSON.parse(event.dataTransfer.getData('application/json'))
    if (data.chartType) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      createEmptyChart(data.chartType, x, y)
    }
  } catch (error) {
    console.error('Failed to parse dropped chart type data:', error)
  }
}

const onDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (showDragPreview.value) {
    updateDragPreviewPosition(event)
  }
}

const createEmptyChart = (chartType: string, mouseX?: number, mouseY?: number) => {
  if (!currentDashboardId.value) {
    const tempDashboard = dashboardStore.createDashboard('Untitled Dashboard')
    currentDashboardId.value = tempDashboard.id
  }
  
  let gridX = 0
  let gridY = 0
  
  if (mouseX !== undefined && mouseY !== undefined) {
    const cellWidth = (window.innerWidth - 240 - 260 - 48) / 12
    const cellHeight = 70 + 10
    
    const chartWidth = 4
    const chartHeight = 3
    
    const chartCenterX = chartWidth / 2
    const chartCenterY = chartHeight / 2
    
    const mouseGridX = mouseX / cellWidth
    const mouseGridY = mouseY / cellHeight
    
    gridX = Math.round(mouseGridX - chartCenterX)
    gridY = Math.round(mouseGridY - chartCenterY)
    
    gridX = Math.max(0, Math.min(gridX, 12 - chartWidth))
    gridY = Math.max(0, gridY)
  }
  
  let newChart: DashboardChart
  
  switch (chartType) {
    case 'bar':
      newChart = createBarChart({
        title: 'Bar Chart',
        dataSourceId: '',
        xAxis: [],
        yAxis: '',
        backgroundColor: '#3b82f6',
        borderColor: '#1d4ed8',
        colorScheme: 'default'
      })
      break
    case 'line':
      newChart = createLineChart({
        title: 'Line Chart',
        dataSourceId: '',
        xAxis: '',
        yAxis: '',
        backgroundColor: '#3b82f6',
        borderColor: '#1d4ed8',
        colorScheme: 'default'
      })
      break
    case 'pie':
      newChart = createPieChart({
        title: 'Pie Chart',
        dataSourceId: '',
        category: '',
        value: '',
        backgroundColor: '#3b82f6',
        borderColor: '#1d4ed8',
        colorScheme: 'default'
      })
      break
    case 'scatter':
      newChart = createScatterChart({
        title: 'Scatter Chart',
        dataSourceId: '',
        xAxis: '',
        yAxis: '',
        backgroundColor: '#3b82f6',
        borderColor: '#1d4ed8',
        colorScheme: 'default'
      })
      break
    case 'card':
      newChart = createCardChart({
        title: 'KPI Card',
        dataSourceId: '',
        keyMetric: '',
        backgroundColor: '#3b82f6',
        borderColor: '#1d4ed8',
        colorScheme: 'default'
      })
      break
    default:
      console.error('Unknown chart type:', chartType)
      return
  }
  
  newChart.layout = { x: gridX, y: gridY, w: 4, h: 3 }
  
  try {
    const savedChart = dashboardStore.addChart(currentDashboardId.value, newChart)
    
    const activeTab = dashboardTabs.value.find(t => t.id === activeTabId.value)
    if (activeTab) {
      activeTab.chartIds.push(savedChart.id)
    }
  
    selectedChartType.value = chartType as 'bar' | 'line' | 'pie' | 'scatter' | 'card'
  
    chartConfig.title = newChart.base.title
    chartConfig.dataSourceId = newChart.base.dataSourceId
    chartConfig.backgroundColor = newChart.base.backgroundColor || '#3b82f6'
    chartConfig.borderColor = newChart.base.borderColor || '#1d4ed8'
    chartConfig.colorScheme = newChart.base.colorScheme || 'default'
    
    switch (chartType) {
      case 'bar':
        if (newChart.properties.bar) {
          chartConfig.xAxis = newChart.properties.bar.xAxis
          chartConfig.yAxis = newChart.properties.bar.yAxis
          chartConfig.horizontal = newChart.properties.bar.horizontal || false
        }
        break
      case 'line':
        if (newChart.properties.line) {
          chartConfig.xAxis = [newChart.properties.line.xAxis]
          chartConfig.yAxis = newChart.properties.line.yAxis
          chartConfig.smooth = newChart.properties.line.smooth || false
          chartConfig.fillArea = newChart.properties.line.fillArea || false
        }
        break
      case 'pie':
        if (newChart.properties.pie) {
          chartConfig.category = newChart.properties.pie.category
          chartConfig.value = newChart.properties.pie.value
        }
        break
      case 'scatter':
        if (newChart.properties.scatter) {
          chartConfig.xAxis = [newChart.properties.scatter.xAxis]
          chartConfig.yAxis = newChart.properties.scatter.yAxis
        }
        break
      case 'card':
        if (newChart.properties.card) {
          chartConfig.keyMetric = newChart.properties.card.keyMetric || ''
          chartConfig.previousMetric = newChart.properties.card.previousMetric || ''
          chartConfig.differenceType = newChart.properties.card.differenceType || 'percentage'
          chartConfig.aggregation = newChart.properties.card.aggregation || 'sum'
        }
        break
    }
  
    editingChartId.value = savedChart.id
  
    setTimeout(() => {
      nextTick(() => {
        // Reinitialize GridStack for the current tab
        initializeGridStack()
      })
    }, 100)
  } catch (error) {
    console.error('Error adding chart to dashboard:', error)
  }
}

const isFieldInUse = (fieldName: string, dataSourceId: string) => {
  if (!selectedChartType.value || !chartConfig.dataSourceId) return false
  
  if (chartConfig.dataSourceId !== dataSourceId) return false

  if (selectedChartType.value === 'pie') {
    return chartConfig.category === fieldName || chartConfig.value === fieldName
  } else if (selectedChartType.value === 'bar') {
    return (
      chartConfig.xAxis.includes(fieldName) ||
      chartConfig.yAxis === fieldName
    )
  } else if (selectedChartType.value === 'line' || selectedChartType.value === 'scatter') {
    return chartConfig.xAxis.includes(fieldName) || chartConfig.yAxis === fieldName
  } else if (selectedChartType.value === 'card') {
    return chartConfig.keyMetric === fieldName || chartConfig.previousMetric === fieldName
  }
  return false
}

const openDataSourceManager = () => {
  if (dataPanelRef.value) {
    dataPanelRef.value.openDataSourceManager()
  }
}

onMounted(async () => {
  const dashboardId = route.query.id as string | undefined
  if (dashboardId) {
    await loadDashboard(dashboardId)
    await nextTick()
    // Initialize GridStack for the current tab
    const tabId = activeTabId.value
    if (tabId) {
      initializeGridStack()
    }
  }
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  if (gridStack) {
    gridStack.destroy(false)
  }
  document.removeEventListener('mousemove', onResizing)
  document.removeEventListener('mouseup', stopResizing)
  document.removeEventListener('click', handleClickOutside)
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

:deep(.grid-stack-item.ui-draggable-dragging) {
  opacity: 0.8;
}

:deep(.grid-stack-item.ui-resizable-resizing) {
  opacity: 0.8;
}

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