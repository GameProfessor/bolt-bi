<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200 relative">
      <!-- Panel Toggles: Hide in view mode -->
      <div v-if="!viewMode" class="absolute left-0 bottom-1 flex items-center pl-4 z-10" style="height:40px;">
        <div class="flex items-center gap-1">
          <div class="relative group">
            <button
              @click="showDataPanel = !showDataPanel"
              :class="[
                'p-2 rounded-md transition-colors duration-200',
                showDataPanel 
                  ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                  : 'text-gray-400 bg-gray-100 border border-transparent hover:bg-gray-100'
              ]"
            >
              <CircleStackIcon class="h-4 w-4" />
            </button>
            <!-- Custom Tooltip (right) -->
            <div class="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50 shadow-lg">
              {{ showDataPanel ? 'Hide Data Panel' : 'Show Data Panel' }}
              <div class="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
            </div>
          </div>
          <div class="relative group">
            <button
              @click="showChartPanel = !showChartPanel"
              :class="[
                'p-2 rounded-md transition-colors duration-200',
                showChartPanel 
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                : 'text-gray-400 bg-gray-100 border border-transparent hover:bg-gray-100'
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </button>
            <!-- Custom Tooltip (right) -->
            <div class="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50 shadow-lg">
              {{ showChartPanel ? 'Hide Chart Panel' : 'Show Chart Panel' }}
              <div class="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style="padding-left:72px;">
        <div class="flex items-center h-16 justify-between">
          <!-- Left: Dashboard Name Input -->
          <div class="flex items-center gap-3">
            <button
              @click="goBack"
              class="ml-2 mr-2 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeftIcon class="h-6 w-6" />
            </button>
            <template v-if="!viewMode">
            <input
              id="dashboardName"
              v-model="dashboardName"
              type="text"
              placeholder="Enter dashboard name"
              class="text-xl font-semibold text-gray-900 bg-transparent border-none focus:ring-0 focus:border-b-2 focus:border-primary-500 px-1 py-0.5 w-64"
            />
            </template>
            <template v-else>
              <span class="text-xl font-semibold text-gray-900 px-1 py-0.5 w-64 truncate" style="background:transparent; border:none;">{{ dashboardName }}</span>
            </template>
          </div>
          <!-- Right: Action Buttons -->
          <div class="flex items-center gap-3 ml-auto">
            <button
              v-if="!viewMode"
              @click="openShareModal"
              class="inline-flex items-center px-4 py-2 border border-primary-200 text-sm font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
              title="Share dashboard"
            >
              <ShareIcon class="h-4 w-4 mr-2" />
              Share
            </button>
            <button
              v-if="!viewMode"
              @click="goToPreviewMode"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A2 2 0 0020 6.382V5a2 2 0 00-2-2H6a2 2 0 00-2 2v1.382a2 2 0 00.447 1.342L9 10m6 0v4m0 0l-4.553 2.276A2 2 0 014 17.618V19a2 2 0 002 2h12a2 2 0 002-2v-1.382a2 2 0 00-.447-1.342L15 14z" /></svg>
              Preview
            </button>
            <div v-if="!viewMode" class="relative group inline-block text-left align-middle">
              <div class="flex shadow-sm rounded-md overflow-hidden">
            <button
              @click="saveDashboard"
                  :disabled="!dashboardName"
                  class="inline-flex items-center px-4 py-2 text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 border-0 rounded-l-md"
                  style="border-right: 1px solid rgba(255,255,255,0.15);"
            >
              <DocumentCheckIcon class="h-4 w-4 mr-2" />
              Save Dashboard
            </button>
                <button
                  @click="showSaveDropdown = !showSaveDropdown"
                  :disabled="!dashboardName"
                  :class="[
                    'inline-flex items-center px-2 py-2 text-sm font-medium bg-primary-600 text-white focus:outline-none border-0 rounded-r-md',
                    !dashboardName ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-700'
                  ]"
                  aria-haspopup="true"
                  :aria-expanded="showSaveDropdown ? 'true' : 'false'"
                  style="border-left: 1px solid rgba(255,255,255,0.15);"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
              <transition name="fade">
                <div v-if="showSaveDropdown" class="absolute right-0 z-50 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div class="py-1">
                    <button @click="saveAsTemplate" class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Save as Template</button>
                  </div>
                </div>
              </transition>
            </div>
            <button
              v-if="viewMode && comingFromPreview"
              @click="exitPreviewMode"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              Exit Preview
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex h-[calc(100vh-4rem)] min-h-0">
      <!-- Left Sidebar with Tabs -->
      <transition name="fade-slide-panel">
      <DataPanel
          v-if="!previewMode && showDataPanel && !viewMode"
        ref="dataPanelRef"
        :selectedDataSources="selectedDataSources"
        :expandedDataSources="expandedDataSources"
        :isFieldInUse="isFieldInUse"
        :width="leftSidebarWidth"
        :category="dashboardCategory"
        :description="dashboardDescription"
          :showDashboardTabs="showDashboardTabs"
          :panelHeight="null"
        @open-manager="openDataSourceManager"
        @toggle-expand="toggleDataSource"
        @field-drag="onFieldDragStart"
        @update-selected-data-sources="updateSelectedDataSources"
        @toggle-dashboard-tabs="handleToggleDashboardTabs"
        @update-dashboard-info="onUpdateDashboardInfo"
      />
      </transition>

      <!-- Draggable Divider (between left sidebar and chart type col) -->
      <div
        v-if="!previewMode && showDataPanel && showChartPanel && !viewMode"
        class="resizer"
        @mousedown="startResizing('left')"
        :class="{ dimmed: confirmDialog.show || showLeaveConfirmDialog }"
        :style="{ cursor: 'col-resize', width: '6px', background: '#e5e7eb', zIndex: 20 }"
      ></div>

      <!-- Chart Type & Properties Column -->
      <transition name="fade-slide-panel">
      <ChartPanel
          v-if="!previewMode && showChartPanel && !viewMode"
        :chartTypes="chartTypes"
        :selectedChartType="selectedChartType"
        :chartConfig="chartConfig"
        :colorSchemes="colorSchemes"
        :colorPalettes="colorPalettes"
        :isChartConfigValid="isCurrentChartConfigValid"
        :editingChartId="editingChartId"
        :selectedDataSources="selectedDataSources"
        :width="chartTypeColWidth"
          :panelHeight="null"
        :alwaysShowProperties="true"
        @update:selectedChartType="selectedChartType = $event"
        @field-drop="onFieldDrop"
        @remove-x-axis="(idx) => { 
          if (chartConfig && isBarChartConfig(chartConfig) && Array.isArray(chartConfig.xAxis)) {
            chartConfig.xAxis.splice(idx, 1)
          } else if (chartConfig && (isLineChartConfig(chartConfig) || isScatterChartConfig(chartConfig)) && Array.isArray(chartConfig.xAxis)) {
            chartConfig.xAxis.splice(idx, 1)
          }
        }"
        @remove-y-axis="(idx) => { 
          if (chartConfig && isBarChartConfig(chartConfig) && Array.isArray(chartConfig.yAxis)) {
            chartConfig.yAxis.splice(idx, 1)
          } else if (chartConfig && (isLineChartConfig(chartConfig) || isScatterChartConfig(chartConfig)) && Array.isArray(chartConfig.yAxis)) {
            chartConfig.yAxis.splice(idx, 1)
          }
        }"
        @remove-stacked-dimension="(idx) => { 
          if (chartConfig && isBarChartConfig(chartConfig) && Array.isArray(chartConfig.stackedDimension)) {
            chartConfig.stackedDimension.splice(idx, 1)
          }
        }"
        @add-or-update-chart="addOrUpdateChart"
        @cancel-edit="cancelEdit"
          @chart-type-drag-start="onChartTypeDragStart"
      />
      </transition>

      <!-- Draggable Divider (between chart type col and main dashboard) -->
      <div
        v-if="!previewMode && showChartPanel && !viewMode"
        class="resizer"
        @mousedown="startResizing('chartType')"
        :class="{ dimmed: confirmDialog.show || showLeaveConfirmDialog }"
        :style="{ cursor: 'col-resize', width: '6px', background: '#e5e7eb', zIndex: 20 }"
      ></div>

      <!-- Main Dashboard Area -->
      <div 
        :class="['flex-1 h-full min-h-0 flex flex-col p-3']" 
        style="position:relative;"
        @drop="onChartTypeDrop"
        @dragover="onDragOver"
        @dragenter.prevent="onDragEnter"
        @dragleave="onDragLeave"
        @dragstart="onDashboardDragStart"
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
                  v-if="tab.id === editingTabId && !viewMode"
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
                    v-if="tabHoverId === tab.id && !viewMode"
                    @click.stop="startRenameTab(tab.id)"
                    class="h-4 w-4 ml-1 text-gray-400 hover:text-primary-600 cursor-pointer transition-opacity duration-150 opacity-80 group-hover:opacity-100"
                  />
            <button
                    v-if="dashboardTabs.length > 1 && tabHoverId === tab.id && !viewMode"
                    @click.stop="removeTab(tab.id)"
                    class="ml-1 text-gray-400 hover:text-red-500 bg-transparent rounded-full p-0.5 transition-opacity duration-150 opacity-80 group-hover:opacity-100"
                    style="z-index:20"
                  >
                    &times;
            </button>
                </button>
          </div>
            </transition-group>
            <button v-if="!viewMode" @click="addTab" class="ml-2 px-2 py-1 bg-gray-100 text-gray-500 rounded hover:bg-primary-100 hover:text-primary-700 transition-colors duration-150 focus:outline-none border-none shadow-none">+</button>
        </div>
        </nav>
        <div class="flex-1 min-h-0 p-6 overflow-y-auto bg-white rounded-lg shadow-sm">
          <!-- Tab-specific containers -->
          <div v-for="tab in dashboardTabs" :key="tab.id" 
               v-show="activeTabId === tab.id"
               :data-tab-id="tab.id"
               class="tab-container">
            
            <!-- Empty state for this tab -->
            <div v-if="getChartsForTab(tab.id).length === 0" class="flex items-center justify-center min-h-40 text-gray-500">
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
              
            <!-- GridStack Container for this tab -->
            <div v-else :ref="`gridStackContainer-${tab.id}`" class="grid-stack">
              <div
                v-for="chart in getChartsForTab(tab.id)"
                :key="chart.id"
                class="grid-stack-item"
                :gs-id="chart.id"
                :gs-x="chart.layout.x"
                :gs-y="chart.layout.y"
                :gs-w="chart.layout.w"
                :gs-h="chart.layout.h"
                :gs-no-drag="viewMode"
              >
                <div class="grid-stack-item-content shadow-lg">
                  <div class="chart-header flex justify-end items-center gap-2">
                    <!-- 3-dot menu -->
                    <div class="relative chart-menu-container">
                      <button v-if="!previewMode" @click="toggleChartMenu(chart.id)" class="chart-menu-btn p-1 rounded-full hover:bg-gray-100 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>
                      </button>
                      <div v-if="openChartMenuId === chart.id && !previewMode" class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-30">
                        <button v-if="!viewMode" @click="editChart(chart)" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Edit</button>
                        <button @click="exportChart(chart, 'pdf')" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Export PDF</button>
                        <button @click="exportChart(chart, 'png')" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Export to PNG</button>
                        <button @click="exportChart(chart, 'csv')" class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Export to CSV</button>
                        <button v-if="!viewMode" @click="removeChart(chart.id)" class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Remove</button>
                      </div>
                    </div>
                  </div>
                  <div 
                    class="chart-content"
                    @click="!viewMode && editChart(chart)"
                    :class="{ 'cursor-pointer': !previewMode && !viewMode }"
                  >
                    <ChartPreview :chart="chart" :key="`${chart.id}-${chart.updatedAt?.getTime() || chart.createdAt.getTime()}`" class="w-full h-full" />
                  </div>
                </div>
              </div>
            </div>
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

    <!-- Confirm Dialog for chart removal and other actions -->
    <ConfirmDialog
      :show="confirmDialog.show"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      :type="confirmDialog.type"
      :confirmText="confirmDialog.confirmText"
      :cancelText="confirmDialog.cancelText"
      @confirm="handleConfirmDialogConfirm"
      @close="handleConfirmDialogClose"
    />

    <!-- Confirm Dialog for navigation leave -->
    <ConfirmDialog
      :show="showLeaveConfirmDialog"
      title="Leave Dashboard?"
      message="You have unsaved changes. Are you sure you want to leave? Unsaved changes will be lost."
      type="warning"
      confirmText="Leave"
      cancelText="Stay"
      @confirm="handleLeaveConfirm"
      @close="handleLeaveCancel"
    />

    <ShareDashboardModal
      :show="showShareModal"
      :users="userStore.users"
      :groups="userStore.groups"
      :shareList="shareList"
      @close="closeShareModal"
      @save="saveShareList"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter, useRoute, onBeforeRouteLeave, RouteLocationNormalizedLoaded, NavigationGuardNext } from 'vue-router'
import { nanoid } from 'nanoid'
import {
  ArrowLeftIcon,
  Squares2X2Icon,
  DocumentCheckIcon,
  ShareIcon,
  ChartBarIcon,
  PresentationChartLineIcon,
  ChartPieIcon,
  CircleStackIcon,
  PencilIcon
} from '@heroicons/vue/24/outline'
import { GridStack } from 'gridstack'
import { useDashboardStore } from '@/stores'
import type { DataSourceColumn } from '@/stores/modules/dataSource'
import type { DashboardChart } from '@/types/dashboard'
import type { ChartType } from '@/types/chart'
import { createBarChart, createPieChart, createLineChart, createScatterChart, createCardChart, CHART_TYPE_DEFAULT_LAYOUT } from '@/types/dashboard'
import type { 
  ChartConfig
} from '@/types/chartConfig'
import { 
  createDefaultChartConfig,
  isChartConfigValid,
  isBarChartConfig,
  isPieChartConfig,
  isLineChartConfig,
  isScatterChartConfig,
  isCardChartConfig
} from '@/types/chartConfig'
import ChartPreview from '@/components/charts/ChartPreview.vue'
import DataPanel from './components/DataPanel.vue'
import ChartPanel from './components/ChartPanel.vue'
import Toast from '@/components/ui/Toast.vue'
import { useDashboardState } from './composables/useDashboardState'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import ShareDashboardModal from './components/ShareDashboardModal.vue'
import { useUserStore } from '@/stores/modules/user'

const router = useRouter()
const route = useRoute()
const dashboardStore = useDashboardStore()
const userStore = useUserStore()

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

  hideToast,
  goBack,
  toggleDataSource,
  updateSelectedDataSources,
  handleToggleDashboardTabs,
  onUpdateDashboardInfo,
  markUnsaved
} = useDashboardState()


const selectedChartType = ref<ChartType | ''>('')
const dataPanelRef = ref<InstanceType<typeof DataPanel>>()

// Add viewMode support
const viewMode = computed(() => String(route.query.view) === '1')

// Use viewMode to control UI
// Panel visibility state
const showDataPanel = ref(true)
const showChartPanel = ref(true)
watch(viewMode, (v) => {
  if (v) {
    showDataPanel.value = false
    showChartPanel.value = false
  }
})
onMounted(() => {
  if (viewMode.value) {
    showDataPanel.value = false
    showChartPanel.value = false
  }
})

// Multiple GridStack instances - one per tab
const tabGridStacks = ref<Map<string, GridStack>>(new Map())

// Helper function to get charts for a specific tab
const getChartsForTab = (tabId: string) => {
  const dashboard = currentDashboardId.value ? dashboardStore.getDashboardById(currentDashboardId.value) : null
  if (!dashboard) return []
  
  const tab = dashboardTabs.value.find(t => t.id === tabId)
  if (!tab) return []
  
  return dashboard.charts.filter(chart => tab.chartIds.includes(chart.id))
}

// Initialize GridStack for a specific tab
const initializeTabGridStack = (tabId: string) => {
  nextTick(() => {
    try {
      // Get the container for this specific tab using Vue ref
      const container = document.querySelector(`[data-tab-id="${tabId}"] .grid-stack`) as HTMLElement
      if (!container || tabGridStacks.value.has(tabId)) return

      // Create new GridStack instance for this tab
      const gridStack = GridStack.init({
        // column: 12,        // more columns = finer grid. default is 12
        cellHeight: 70,    // smaller cell height = finer vertical movement
        margin: 10,
        minRow: 1,
        animate: true,
        float: true,  // allow floating charts
        resizable: {
          handles: 'e, se, s, sw, w'
        },
        draggable: {
          handle: '.grid-stack-item-content',
          scroll: true
        }
      }, container)

      // Disable move/resize in view mode
      if (viewMode.value) {
        gridStack.enableMove(false)
        gridStack.enableResize(false)
      }

      // Store the instance for this tab
      tabGridStacks.value.set(tabId, gridStack)

      // Set up change event handler
      gridStack.on('change', (_event, items) => {
        items.forEach(item => {
          if (currentDashboardId.value && item.id && item.x !== undefined && item.y !== undefined && item.w !== undefined && item.h !== undefined) {
            dashboardStore.updateChartLayout(currentDashboardId.value, item.id, {
              x: item.x,
              y: item.y,
              w: item.w,
              h: item.h
            })
            markUnsaved()
          }
        })
      })
    } catch (error) {
      console.error('Failed to initialize GridStack for tab:', tabId, error)
    }
  })
}

// Initialize all tab GridStacks
const initializeAllTabGridStacks = () => {
  dashboardTabs.value.forEach(tab => {
    initializeTabGridStack(tab.id)
  })
}

// Clean up GridStack for a specific tab
const cleanupTabGridStack = (tabId: string) => {
  if (tabGridStacks.value.has(tabId)) {
    const gridStack = tabGridStacks.value.get(tabId)
    if (gridStack) {
      gridStack.destroy(false)
    }
    tabGridStacks.value.delete(tabId)
  }
}

// Clean up all GridStack instances
const cleanupAllGridStacks = () => {
  tabGridStacks.value.forEach((gridStack, _tabId) => {
    if (gridStack) {
      gridStack.destroy(false)
    }
  })
  tabGridStacks.value.clear()
}




// Chart configuration for editing - type-safe
const chartConfig = ref<ChartConfig | null>(null)

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
  chartConfig.value = null
}

const addOrUpdateChart = () => {
  if (!chartConfig.value || !isCurrentChartConfigValid.value) return
  if (editingChartId.value) {
    if (!currentDashboardId.value) return
    const dashboard = dashboardStore.getDashboardById(currentDashboardId.value)
    if (dashboard) {
      const chart = dashboard.charts.find(c => c.id === editingChartId.value)
      if (chart) {
        const updates: Partial<DashboardChart> = {
          base: {
            title: chartConfig.value.title,
            dataSourceId: chartConfig.value.dataSourceId,
            backgroundColor: chartConfig.value.backgroundColor,
            borderColor: chartConfig.value.borderColor,
            colorScheme: chartConfig.value.colorScheme
          }
        }
        switch (chartConfig.value.type) {
          case 'bar':
            updates.properties = { 
              bar: { 
                xAxis: chartConfig.value.xAxis, 
                yAxis: chartConfig.value.yAxis, 
                horizontal: chartConfig.value.horizontal 
              } 
            }
            break
          case 'line':
            updates.properties = { 
              line: { 
                xAxis: chartConfig.value.xAxis[0] || '', 
                yAxis: chartConfig.value.yAxis[0] || '', 
                smooth: chartConfig.value.smooth, 
                fillArea: chartConfig.value.fillArea 
              } 
            }
            break
          case 'pie':
            updates.properties = { 
              pie: { 
                category: chartConfig.value.category, 
                value: chartConfig.value.value 
              } 
            }
            break
          case 'scatter':
            updates.properties = { 
              scatter: { 
                xAxis: chartConfig.value.xAxis[0] || '', 
                yAxis: chartConfig.value.yAxis[0] || '' 
              } 
            }
            break
          case 'card':
            updates.properties = { 
              card: { 
                keyMetric: chartConfig.value.keyMetric, 
                previousMetric: chartConfig.value.previousMetric, 
                differenceType: chartConfig.value.differenceType, 
                aggregation: chartConfig.value.aggregation 
              } 
            }
            break
        }
        dashboardStore.updateChart(currentDashboardId.value, editingChartId.value, updates)
        markUnsaved()
      }
    }
    setTimeout(() => {
      nextTick(() => {
        if (activeTabId.value) {
          if (tabGridStacks.value.has(activeTabId.value)) {
            tabGridStacks.value.get(activeTabId.value)?.destroy(false)
            tabGridStacks.value.delete(activeTabId.value)
          }
          initializeTabGridStack(activeTabId.value)
        }
      })
    }, 100)
    return
  }
  addChart()
}

const addChart = async () => {
  if (!chartConfig.value || !isCurrentChartConfigValid.value) return
  if (!currentDashboardId.value) {
    createTemporaryDashboard()
  }
  let newChart: DashboardChart
  switch (chartConfig.value.type) {
    case 'bar':
      newChart = createBarChart({
        title: chartConfig.value.title,
        dataSourceId: chartConfig.value.dataSourceId,
        xAxis: chartConfig.value.xAxis,
        yAxis: chartConfig.value.yAxis,
        horizontal: chartConfig.value.horizontal,
        backgroundColor: chartConfig.value.backgroundColor,
        borderColor: chartConfig.value.borderColor,
        colorScheme: chartConfig.value.colorScheme
      })
      break
    case 'line':
      newChart = createLineChart({
        title: chartConfig.value.title,
        dataSourceId: chartConfig.value.dataSourceId,
        xAxis: chartConfig.value.xAxis[0] || '',
        yAxis: chartConfig.value.yAxis[0] || '',
        smooth: chartConfig.value.smooth,
        fillArea: chartConfig.value.fillArea,
        backgroundColor: chartConfig.value.backgroundColor,
        borderColor: chartConfig.value.borderColor,
        colorScheme: chartConfig.value.colorScheme
      })
      break
    case 'pie':
      newChart = createPieChart({
        title: chartConfig.value.title,
        dataSourceId: chartConfig.value.dataSourceId,
        category: chartConfig.value.category || '',
        value: chartConfig.value.value || '',
        backgroundColor: chartConfig.value.backgroundColor,
        borderColor: chartConfig.value.borderColor,
        colorScheme: chartConfig.value.colorScheme
      })
      break
    case 'scatter':
      newChart = createScatterChart({
        title: chartConfig.value.title,
        dataSourceId: chartConfig.value.dataSourceId,
        xAxis: chartConfig.value.xAxis[0] || '',
        yAxis: chartConfig.value.yAxis[0] || '',
        backgroundColor: chartConfig.value.backgroundColor,
        borderColor: chartConfig.value.borderColor,
        colorScheme: chartConfig.value.colorScheme
      })
      break
    case 'card':
      newChart = createCardChart({
        title: chartConfig.value.title,
        dataSourceId: chartConfig.value.dataSourceId,
        keyMetric: chartConfig.value.keyMetric || '',
        previousMetric: chartConfig.value.previousMetric,
        differenceType: chartConfig.value.differenceType,
        aggregation: chartConfig.value.aggregation,
        backgroundColor: chartConfig.value.backgroundColor,
        borderColor: chartConfig.value.borderColor,
        colorScheme: chartConfig.value.colorScheme
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
  markUnsaved()
  resetChartConfig()
  await nextTick()
  if (activeTabId.value) {
    if (tabGridStacks.value.has(activeTabId.value)) {
      tabGridStacks.value.get(activeTabId.value)?.destroy(false)
      tabGridStacks.value.delete(activeTabId.value)
    }
    initializeTabGridStack(activeTabId.value)
  }
}

const editChart = (chart: DashboardChart) => {
  openChartMenuId.value = null
  editingChartId.value = chart.id
  selectedChartType.value = chart.type
  
  // Create new chart config based on chart type
  chartConfig.value = createDefaultChartConfig(chart.type)
  
  // Set base properties
  chartConfig.value.title = chart.base.title
  chartConfig.value.dataSourceId = chart.base.dataSourceId
  chartConfig.value.backgroundColor = chart.base.backgroundColor || '#3b82f6'
  chartConfig.value.borderColor = chart.base.borderColor || '#1d4ed8'
  chartConfig.value.colorScheme = chart.base.colorScheme || 'default'
  
  switch (chart.type) {
    case 'bar':
      if (chart.properties.bar && isBarChartConfig(chartConfig.value)) {
        chartConfig.value.xAxis = chart.properties.bar.xAxis
        chartConfig.value.yAxis = Array.isArray(chart.properties.bar.yAxis)
          ? chart.properties.bar.yAxis
          : [chart.properties.bar.yAxis].filter(Boolean)
        chartConfig.value.horizontal = chart.properties.bar.horizontal || false
      }
      break
    case 'line':
      if (chart.properties.line && isLineChartConfig(chartConfig.value)) {
        chartConfig.value.xAxis = [chart.properties.line.xAxis]
        chartConfig.value.yAxis = [chart.properties.line.yAxis]
        chartConfig.value.smooth = chart.properties.line.smooth || false
        chartConfig.value.fillArea = chart.properties.line.fillArea || false
      }
      break
    case 'pie':
      if (chart.properties.pie && isPieChartConfig(chartConfig.value)) {
        chartConfig.value.category = chart.properties.pie.category
        chartConfig.value.value = chart.properties.pie.value
      }
      break
    case 'scatter':
      if (chart.properties.scatter && isScatterChartConfig(chartConfig.value)) {
        chartConfig.value.xAxis = [chart.properties.scatter.xAxis]
        chartConfig.value.yAxis = [chart.properties.scatter.yAxis]
      }
      break
    case 'card':
      if (chart.properties.card && isCardChartConfig(chartConfig.value)) {
        chartConfig.value.keyMetric = chart.properties.card.keyMetric || ''
        chartConfig.value.previousMetric = chart.properties.card.previousMetric || ''
        chartConfig.value.differenceType = chart.properties.card.differenceType || 'percentage'
        chartConfig.value.aggregation = chart.properties.card.aggregation || 'sum'
      }
      break
  }
}

// Confirm dialog state
const confirmDialog = ref({
  show: false,
  title: '',
  message: '',
  type: 'danger' as 'danger' | 'warning' | 'info',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  onConfirm: () => {}
})

function showConfirmDialog({ title, message, type = 'danger', confirmText = 'Confirm', cancelText = 'Cancel', onConfirm }: {
  title: string,
  message: string,
  type?: 'danger' | 'warning' | 'info',
  confirmText?: string,
  cancelText?: string,
  onConfirm: () => void
}) {
  confirmDialog.value = {
    show: true,
    title,
    message,
    type,
    confirmText,
    cancelText,
    onConfirm
  }
}

function handleConfirmDialogConfirm() {
  confirmDialog.value.show = false
  confirmDialog.value.onConfirm()
}
function handleConfirmDialogClose() {
  confirmDialog.value.show = false
}

const removeChart = (chartId: string) => {
  showConfirmDialog({
    title: 'Remove Chart',
    message: 'Are you sure you want to remove this chart?',
    type: 'danger',
    confirmText: 'Remove',
    cancelText: 'Cancel',
    onConfirm: () => {
    if (currentDashboardId.value) {
        dashboardStore.removeChart(currentDashboardId.value, chartId)
        dashboardTabs.value.forEach(tab => {
          tab.chartIds = tab.chartIds.filter(id => id !== chartId)
        })
        markUnsaved()
        nextTick(() => {
          if (activeTabId.value) {
            if (tabGridStacks.value.has(activeTabId.value)) {
              tabGridStacks.value.get(activeTabId.value)?.destroy(false)
              tabGridStacks.value.delete(activeTabId.value)
            }
            initializeTabGridStack(activeTabId.value)
          }
        })
      }
    }
  })
}

const removeTab = (tabId: string) => {
  if (dashboardTabs.value.length === 1) return
  const tab = dashboardTabs.value.find(t => t.id === tabId)
  if (!tab) return
  showConfirmDialog({
    title: 'Remove Tab',
    message: `Are you sure you want to remove the tab "${tab.name}" and all its charts? This cannot be undone.`,
    type: 'danger',
    confirmText: 'Remove',
    cancelText: 'Cancel',
    onConfirm: () => {
      cleanupTabGridStack(tabId)
      const idx = dashboardTabs.value.findIndex(t => t.id === tabId)
      dashboardTabs.value.splice(idx, 1)
      markUnsaved()
      if (activeTabId.value === tabId) {
        activeTabId.value = dashboardTabs.value[Math.max(0, idx - 1)].id
        nextTick(() => {
          if (activeTabId.value) {
            initializeTabGridStack(activeTabId.value)
          }
        })
      }
    }
  })
}

const toggleChartMenu = (id: string) => {
  openChartMenuId.value = openChartMenuId.value === id ? null : id
}

const isCurrentChartConfigValid = computed(() => {
  if (!chartConfig.value) return false
  return isChartConfigValid(chartConfig.value)
})

const addTab = () => {
  const newTab = { id: nanoid(), name: `Tab ${dashboardTabs.value.length + 1}`, chartIds: [] }
  dashboardTabs.value.push(newTab)
  activeTabId.value = newTab.id
  markUnsaved()
  nextTick(() => {
    initializeTabGridStack(newTab.id)
  })
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

const chartTypes = [
  { value: 'bar' as const, label: 'Bar', icon: ChartBarIcon },
  { value: 'line' as const, label: 'Line', icon: PresentationChartLineIcon },
  { value: 'pie' as const, label: 'Pie', icon: ChartPieIcon },
  { value: 'scatter' as const, label: 'Scatter', icon: CircleStackIcon },
  { value: 'card' as const, label: 'Card', icon: Squares2X2Icon }
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

const onFieldDrop = (event: DragEvent, target: 'xAxis' | 'yAxis' | 'category' | 'value' | 'keyMetric' | 'stackedDimension') => {
  event.preventDefault()
  if (!event.dataTransfer || !chartConfig.value) return
  try {
    const fieldData = JSON.parse(event.dataTransfer.getData('text/plain'))
    
    if (target === 'yAxis' && fieldData.type !== 'number') {
      alert('Y-axis requires a numeric field')
      return
    }

    if (chartConfig.value.dataSourceId && chartConfig.value.dataSourceId !== fieldData.dataSourceId) {
      if (isBarChartConfig(chartConfig.value) && chartConfig.value.xAxis.length > 0) {
        alert('Cannot mix fields from different data sources in the same chart')
        return
      }
    }

    // Use type guards for type-safe access
    if (target === 'xAxis' && isBarChartConfig(chartConfig.value)) {
      if (!chartConfig.value.xAxis.includes(fieldData.name)) {
        chartConfig.value.xAxis.push(fieldData.name)
      }
    } else if (target === 'xAxis' && (isLineChartConfig(chartConfig.value) || isScatterChartConfig(chartConfig.value))) {
      chartConfig.value.xAxis = [fieldData.name]
    } else if (target === 'yAxis' && isBarChartConfig(chartConfig.value)) {
      if (!chartConfig.value.yAxis.includes(fieldData.name)) {
        chartConfig.value.yAxis.push(fieldData.name)
      }
    } else if (target === 'yAxis' && (isLineChartConfig(chartConfig.value) || isScatterChartConfig(chartConfig.value))) {
      chartConfig.value.yAxis = [fieldData.name]
    } else if (target === 'stackedDimension' && isBarChartConfig(chartConfig.value)) {
      chartConfig.value.stackedDimension = [fieldData.name]
    } else if (target === 'category' && isPieChartConfig(chartConfig.value)) {
      chartConfig.value.category = fieldData.name
    } else if (target === 'value' && isPieChartConfig(chartConfig.value)) {
      chartConfig.value.value = fieldData.name
    } else if (target === 'keyMetric' && isCardChartConfig(chartConfig.value)) {
      chartConfig.value.keyMetric = fieldData.name
    }
    
    chartConfig.value.dataSourceId = fieldData.dataSourceId

    // Real-time update: if editing a chart, update it immediately
    if (editingChartId.value && currentDashboardId.value) {
      const updates: Partial<DashboardChart> = {
        base: {
          title: chartConfig.value.title,
          dataSourceId: chartConfig.value.dataSourceId,
          backgroundColor: chartConfig.value.backgroundColor,
          borderColor: chartConfig.value.borderColor,
          colorScheme: chartConfig.value.colorScheme
        }
      }
      switch (chartConfig.value.type) {
        case 'bar':
          updates.properties = { 
            bar: { 
              xAxis: chartConfig.value.xAxis, 
              yAxis: chartConfig.value.yAxis, 
              horizontal: chartConfig.value.horizontal 
            } 
          }
          break
        case 'line':
          updates.properties = { 
            line: { 
              xAxis: chartConfig.value.xAxis[0] || '', 
              yAxis: chartConfig.value.yAxis[0] || '', 
              smooth: chartConfig.value.smooth, 
              fillArea: chartConfig.value.fillArea 
            } 
          }
          break
        case 'pie':
          updates.properties = { 
            pie: { 
              category: chartConfig.value.category, 
              value: chartConfig.value.value 
            } 
          }
          break
        case 'scatter':
          updates.properties = { 
            scatter: { 
              xAxis: chartConfig.value.xAxis[0] || '', 
              yAxis: chartConfig.value.yAxis[0] || '' 
            } 
          }
          break
        case 'card':
          updates.properties = { 
            card: { 
              keyMetric: chartConfig.value.keyMetric, 
              previousMetric: chartConfig.value.previousMetric, 
              differenceType: chartConfig.value.differenceType, 
              aggregation: chartConfig.value.aggregation 
            } 
          }
          break
      }
      dashboardStore.updateChart(currentDashboardId.value, editingChartId.value, updates)
      markUnsaved()
    }
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

// Track the currently dragged chart type
const draggedChartType = ref<string | null>(null)

const onDragEnter = (event: DragEvent) => {
  event.preventDefault()
  if (!event.dataTransfer) return
  
  // Show preview if we have a dragged chart type
  if (draggedChartType.value) {
      showDragPreview.value = true
      updateDragPreviewPosition(event)
  } else {
    showDragPreview.value = true
    updateDragPreviewPosition(event)
  }
}

const onDashboardDragStart = (_event: DragEvent) => {
  // This is just to capture any drag start events on the dashboard
}

const onDragLeave = (event: DragEvent) => {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX
  const y = event.clientY
  
  if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
    showDragPreview.value = false
    draggedChartType.value = null
  }
}

const updateDragPreviewPosition = (event: DragEvent) => {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  // Calculate available width based on visible panels
  let availableWidth = window.innerWidth - 48 // Account for padding
  if (showDataPanel.value) availableWidth -= leftSidebarWidth.value
  if (showChartPanel.value) availableWidth -= chartTypeColWidth.value
  
  const cellWidth = availableWidth / 12
  // Dynamically get cellHeight from GridStack instance
  let cellHeight = 70
  if (activeTabId.value && tabGridStacks.value.has(activeTabId.value)) {
    const grid = tabGridStacks.value.get(activeTabId.value)
    if (grid && typeof grid.getCellHeight === 'function') {
      cellHeight = grid.getCellHeight()
    } 
  }

  // Use the dragged chart type, fallback to selectedChartType if not available
  const chartType = draggedChartType.value || selectedChartType.value

  // Use layout mapping for preview size
  const { w, h } = CHART_TYPE_DEFAULT_LAYOUT[chartType] || { w: 4, h: 3 }
  const previewWidth = w * cellWidth
  const previewHeight = h * cellHeight
  
  let previewLeft = x - (previewWidth / 2)
  let previewTop = y - (previewHeight / 2)
  
  const dashboardWidth = rect.width
  const dashboardHeight = rect.height
  
  previewLeft = Math.max(0, Math.min(previewLeft, dashboardWidth - previewWidth))
  previewTop = Math.max(0, Math.min(previewTop, dashboardHeight - previewHeight))
  
  const isWithinBoundaries = 
    previewLeft >= 0 && 
    previewTop >= 0 && 
    previewLeft + previewWidth <= dashboardWidth && 
    previewTop + previewHeight <= dashboardHeight
  
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
  
  // Clear the dragged chart type
  draggedChartType.value = null
}

const onDragOver = (event: DragEvent) => {
  event.preventDefault()
  if (showDragPreview.value) {
    updateDragPreviewPosition(event)
  }
}

const createEmptyChart = async (chartType: ChartType, mouseX?: number, mouseY?: number) => {
  // Reset config to empty for new chart
  resetChartConfig();
  selectedChartType.value = chartType;
  
  // Create default config for the selected chart type
  chartConfig.value = createDefaultChartConfig(chartType);
  
  if (!currentDashboardId.value) {
    const tempDashboard = dashboardStore.createDashboard('Untitled Dashboard')
    currentDashboardId.value = tempDashboard.id
  }
  
  let gridX = 0
  let gridY = 0
  
  if (mouseX !== undefined && mouseY !== undefined) {
    // Calculate available width based on visible panels
    let availableWidth = window.innerWidth - 48 // Account for padding
    if (showDataPanel.value) availableWidth -= leftSidebarWidth.value
    if (showChartPanel.value) availableWidth -= chartTypeColWidth.value
    
    const cellWidth = availableWidth / 12
    const cellHeight = 70 + 10
    
    // Use the proper layout configuration for this chart type
    const { w: chartWidth, h: chartHeight } = CHART_TYPE_DEFAULT_LAYOUT[chartType] || { w: 4, h: 3 }
    
    const chartCenterX = chartWidth / 2
    const chartCenterY = chartHeight / 2
    
    const mouseGridX = mouseX / cellWidth
    const mouseGridY = mouseY / cellHeight
    
    gridX = Math.floor(mouseGridX - chartCenterX)
    gridY = Math.floor(mouseGridY - chartCenterY)
    
    gridX = Math.max(0, Math.min(gridX, 12 - chartWidth))
    gridY = Math.max(0, gridY)
  }
  
  let newChart: DashboardChart
  
  if (!chartConfig.value) {
    console.error('Failed to create chart config for type:', chartType)
    return
  }
  
  switch (chartType) {
    case 'bar':
      if (isBarChartConfig(chartConfig.value)) {
        newChart = createBarChart({
          title: chartConfig.value.title,
          dataSourceId: chartConfig.value.dataSourceId,
          xAxis: chartConfig.value.xAxis,
          yAxis: chartConfig.value.yAxis,
          horizontal: chartConfig.value.horizontal,
          backgroundColor: chartConfig.value.backgroundColor,
          borderColor: chartConfig.value.borderColor,
          colorScheme: chartConfig.value.colorScheme
        })
      } else {
        console.error('Invalid bar chart config')
        return
      }
      break
    case 'line':
      if (isLineChartConfig(chartConfig.value)) {
        newChart = createLineChart({
          title: chartConfig.value.title,
          dataSourceId: chartConfig.value.dataSourceId,
          xAxis: chartConfig.value.xAxis[0] || '',
          yAxis: chartConfig.value.yAxis[0] || '',
          smooth: chartConfig.value.smooth,
          fillArea: chartConfig.value.fillArea,
          backgroundColor: chartConfig.value.backgroundColor,
          borderColor: chartConfig.value.borderColor,
          colorScheme: chartConfig.value.colorScheme
        })
      } else {
        console.error('Invalid line chart config')
        return
      }
      break
    case 'pie':
      if (isPieChartConfig(chartConfig.value)) {
        newChart = createPieChart({
          title: chartConfig.value.title,
          dataSourceId: chartConfig.value.dataSourceId,
          category: chartConfig.value.category || '',
          value: chartConfig.value.value || '',
          backgroundColor: chartConfig.value.backgroundColor,
          borderColor: chartConfig.value.borderColor,
          colorScheme: chartConfig.value.colorScheme
        })
      } else {
        console.error('Invalid pie chart config')
        return
      }
      break
    case 'scatter':
      if (isScatterChartConfig(chartConfig.value)) {
        newChart = createScatterChart({
          title: chartConfig.value.title,
          dataSourceId: chartConfig.value.dataSourceId,
          xAxis: chartConfig.value.xAxis[0] || '',
          yAxis: chartConfig.value.yAxis[0] || '',
          backgroundColor: chartConfig.value.backgroundColor,
          borderColor: chartConfig.value.borderColor,
          colorScheme: chartConfig.value.colorScheme
        })
      } else {
        console.error('Invalid scatter chart config')
        return
      }
      break
    case 'card':
      if (isCardChartConfig(chartConfig.value)) {
        newChart = createCardChart({
          title: chartConfig.value.title,
          dataSourceId: chartConfig.value.dataSourceId,
          keyMetric: chartConfig.value.keyMetric || '',
          previousMetric: chartConfig.value.previousMetric,
          differenceType: chartConfig.value.differenceType,
          aggregation: chartConfig.value.aggregation,
          backgroundColor: chartConfig.value.backgroundColor,
          borderColor: chartConfig.value.borderColor,
          colorScheme: chartConfig.value.colorScheme
        })
      } else {
        console.error('Invalid card chart config')
        return
      }
      break
    default:
      console.error('Unknown chart type:', chartType)
      return
  }
  
  // Update the layout with the calculated position, but keep the default w/h from the chart creation
  newChart.layout = { 
      x: gridX,
      y: gridY,
    w: newChart.layout.w, 
    h: newChart.layout.h 
  }
  
  try {
    const savedChart = dashboardStore.addChart(currentDashboardId.value, newChart)
    
    const activeTab = dashboardTabs.value.find(t => t.id === activeTabId.value)
    if (activeTab) {
      activeTab.chartIds.push(savedChart.id)
    }
  
    selectedChartType.value = chartType as 'bar' | 'line' | 'pie' | 'scatter' | 'card'
  
    // Update chartConfig with the saved chart data
    chartConfig.value = createDefaultChartConfig(chartType);
    chartConfig.value.title = newChart.base.title
    chartConfig.value.dataSourceId = newChart.base.dataSourceId
    chartConfig.value.backgroundColor = newChart.base.backgroundColor || '#3b82f6'
    chartConfig.value.borderColor = newChart.base.borderColor || '#1d4ed8'
    chartConfig.value.colorScheme = newChart.base.colorScheme || 'default'
    
    switch (chartType) {
      case 'bar':
        if (newChart.properties.bar && isBarChartConfig(chartConfig.value)) {
          chartConfig.value.xAxis = newChart.properties.bar.xAxis
          chartConfig.value.yAxis = Array.isArray(newChart.properties.bar.yAxis)
            ? newChart.properties.bar.yAxis
            : [newChart.properties.bar.yAxis].filter(Boolean)
          chartConfig.value.horizontal = newChart.properties.bar.horizontal || false
        }
        break
      case 'line':
        if (newChart.properties.line && isLineChartConfig(chartConfig.value)) {
          chartConfig.value.xAxis = [newChart.properties.line.xAxis]
          chartConfig.value.yAxis = [newChart.properties.line.yAxis]
          chartConfig.value.smooth = newChart.properties.line.smooth || false
          chartConfig.value.fillArea = newChart.properties.line.fillArea || false
        }
        break
      case 'pie':
        if (newChart.properties.pie && isPieChartConfig(chartConfig.value)) {
          chartConfig.value.category = newChart.properties.pie.category
          chartConfig.value.value = newChart.properties.pie.value
        }
        break
      case 'scatter':
        if (newChart.properties.scatter && isScatterChartConfig(chartConfig.value)) {
          chartConfig.value.xAxis = [newChart.properties.scatter.xAxis]
          chartConfig.value.yAxis = [newChart.properties.scatter.yAxis]
        }
        break
      case 'card':
        if (newChart.properties.card && isCardChartConfig(chartConfig.value)) {
          chartConfig.value.keyMetric = newChart.properties.card.keyMetric || ''
          chartConfig.value.previousMetric = newChart.properties.card.previousMetric || ''
          chartConfig.value.differenceType = newChart.properties.card.differenceType || 'percentage'
          chartConfig.value.aggregation = newChart.properties.card.aggregation || 'sum'
        }
        break
    }
  
    editingChartId.value = savedChart.id
  
    await nextTick()
    if (activeTabId.value) {
      if (tabGridStacks.value.has(activeTabId.value)) {
        tabGridStacks.value.get(activeTabId.value)?.destroy(false)
        tabGridStacks.value.delete(activeTabId.value)
      }
      initializeTabGridStack(activeTabId.value)
    }
  } catch (error) {
    console.error('Error adding chart to dashboard:', error)
  }
}

const isFieldInUse = (fieldName: string, dataSourceId: string) => {
  if (!chartConfig.value || !chartConfig.value.dataSourceId) return false
  
  if (chartConfig.value.dataSourceId !== dataSourceId) return false

  if (isPieChartConfig(chartConfig.value)) {
    return chartConfig.value.category === fieldName || chartConfig.value.value === fieldName
  } else if (isBarChartConfig(chartConfig.value)) {
    return (
      chartConfig.value.xAxis.includes(fieldName) ||
      chartConfig.value.yAxis.includes(fieldName)
    )
  } else if (isLineChartConfig(chartConfig.value) || isScatterChartConfig(chartConfig.value)) {
    return chartConfig.value.xAxis.includes(fieldName) || chartConfig.value.yAxis.includes(fieldName)
  } else if (isCardChartConfig(chartConfig.value)) {
    return chartConfig.value.keyMetric === fieldName || chartConfig.value.previousMetric === fieldName
  }
  return false
}

const openDataSourceManager = () => {
  if (dataPanelRef.value) {
    dataPanelRef.value.openDataSourceManager()
  }
}

// Watch for tab changes to ensure GridStack instances are initialized
watch(activeTabId, (newTabId) => {
  if (newTabId && !tabGridStacks.value.has(newTabId)) {
  nextTick(() => {
      initializeTabGridStack(newTabId)
    })
  }
})

// Watch for dashboard tabs changes to initialize new tabs
watch(dashboardTabs, (newTabs) => {
  newTabs.forEach(tab => {
    if (!tabGridStacks.value.has(tab.id)) {
      nextTick(() => {
        initializeTabGridStack(tab.id)
      })
    }
  })
}, { deep: true })

// Watch for charts changes to reinitialize GridStack if needed
watch(() => dashboardTabs.value.map(tab => getChartsForTab(tab.id)), () => {
  // Reinitialize GridStack for tabs that don't have instances yet
  dashboardTabs.value.forEach(tab => {
    if (!tabGridStacks.value.has(tab.id)) {
      nextTick(() => {
        initializeTabGridStack(tab.id)
      })
    }
  })
}, { deep: true })

const cancelEdit = () => {
  editingChartId.value = null
  resetChartConfig()
}

const exportChart = (chart: DashboardChart, type: 'pdf' | 'png' | 'csv') => {
  openChartMenuId.value = null
  if (type === 'csv') {
    // Find the ChartPreview component for this chart and call its exportCSV method
    // We'll use an event bus or expose a method via ref if needed
    // For now, emit an event or call a method (to be implemented in ChartPreview.vue)
    // Example: $refs[`chartPreviewRef-${chart.id}`]?.exportCSV?.()
    // For now, just alert as a stub
    alert(`Exporting chart '${chart.base.title}' as CSV (stub)`)
    return
  }
  alert(`Exporting chart '${chart.base.title}' as ${type.toUpperCase()} (stub)`)
}

// Add state for navigation confirmation
const pendingNavigation = ref<null | { next: NavigationGuardNext }> (null)
const showLeaveConfirmDialog = ref(false)

// Replace onBeforeRouteLeave logic
onBeforeRouteLeave((_to: RouteLocationNormalizedLoaded, _from: RouteLocationNormalizedLoaded, next: NavigationGuardNext) => {
  if (hasUnsavedChanges.value) {
    pendingNavigation.value = { next }
    showLeaveConfirmDialog.value = true
  } else {
    // Reset dashboard state
    currentDashboardId.value = null
    dashboardName.value = ''
    dashboardDescription.value = ''
    dashboardCategory.value = ''
    dashboardTabs.value = []
    activeTabId.value = ''
    next()
  }
})

function handleLeaveConfirm() {
  showLeaveConfirmDialog.value = false
  if (pendingNavigation.value) {
    // Reset dashboard state
    currentDashboardId.value = null
    dashboardName.value = ''
    dashboardDescription.value = ''
    dashboardCategory.value = ''
    dashboardTabs.value = []
    activeTabId.value = ''
    pendingNavigation.value.next()
    pendingNavigation.value = null
  }
}

function handleLeaveCancel() {
  showLeaveConfirmDialog.value = false
  if (pendingNavigation.value) {
    pendingNavigation.value.next(false)
    pendingNavigation.value = null
  }
}

const onChartTypeDragStart = (chartType: string) => {
  // Store the dragged chart type when drag starts
  draggedChartType.value = chartType
}

const comingFromPreview = ref(false)

const goToPreviewMode = () => {
  comingFromPreview.value = true
  router.replace({
    path: route.path,
    query: { ...route.query, view: '1' }
  })
}

const exitPreviewMode = () => {
  comingFromPreview.value = false
  showDataPanel.value = true
  showChartPanel.value = true
  const { view, ...rest } = route.query
  router.replace({
    path: route.path,
    query: rest
  })
}

const showSaveDropdown = ref(false)

function saveAsTemplate() {
  showSaveDropdown.value = false
  // TODO: Implement save as template logic
  alert('Save as Template (not yet implemented)')
}

const showShareModal = ref(false)
const shareList = ref([])

function openShareModal() {
  showShareModal.value = true
}
function closeShareModal() {
  showShareModal.value = false
}
function saveShareList(newList: any) {
  shareList.value = newList
  showShareModal.value = false
}

onMounted(async () => {
  const dashboardId = route.query.id as string | undefined
  if (dashboardId) {
    dashboardStore.loadFromStorage()
    await loadDashboard(dashboardId)
      await nextTick()
    initializeAllTabGridStacks()
  }
  document.addEventListener('click', handleClickOutside)
  if (viewMode.value) {
    showDataPanel.value = false
    showChartPanel.value = false
  }
  if (String(route.query.view) !== '1') {
    comingFromPreview.value = false
  }
})

onUnmounted(() => {
  cleanupAllGridStacks()
  document.removeEventListener('mousemove', onResizing)
  document.removeEventListener('mouseup', stopResizing)
  document.removeEventListener('click', handleClickOutside)
})

watch(
  () => route.query.id,
  async (dashboardId) => {
    if (dashboardId) {
      dashboardStore.loadFromStorage()
      await loadDashboard(dashboardId as string)
      await nextTick()
      initializeAllTabGridStacks()
    }
  }
)
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

.chart-content,
.chart-factory,
.chart-container {
  box-sizing: border-box;
}

.grid-stack-item-content {
  position: relative;
  /* height: 100%; */
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
  transition: background 0.2s, opacity 0.2s;
}
.resizer:hover {
  background: #d1d5db;
}
.resizer.dimmed {
  display: none !important;
}

/* Panel transitions */
.tab-container {
  transition: all 0.3s ease-in-out;
}

/* Smooth transitions for panel visibility */
.DataPanel-enter-active,
.DataPanel-leave-active,
.ChartPanel-enter-active,
.ChartPanel-leave-active {
  transition: all 0.3s ease-in-out;
}

.DataPanel-enter-from,
.DataPanel-leave-to,
.ChartPanel-enter-from,
.ChartPanel-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.fade-slide-panel-enter-active, .fade-slide-panel-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1);
}
.fade-slide-panel-enter-from, .fade-slide-panel-leave-to {
  opacity: 0;
  transform: translateX(-16px);
}
.fade-slide-panel-leave-from, .fade-slide-panel-enter-to {
  opacity: 1;
  transform: translateX(0);
}
</style>