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
              <h1 class="text-xl font-semibold text-gray-900">
                {{ dashboard?.name || 'Dashboard Editor' }}
              </h1>
              <p class="text-sm text-gray-500">
                {{ dashboard?.widgets.length || 0 }} widgets
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="showAddChartModal = true"
              :disabled="chartStore.charts.length === 0"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <PlusIcon class="h-4 w-4 mr-2" />
              Add Chart
            </button>
            <button
              @click="goBack"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- No Charts Warning -->
        <div v-if="chartStore.charts.length === 0" class="mb-8">
          <div class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" />
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-yellow-800">No Charts Available</h3>
                <div class="mt-2 text-sm text-yellow-700">
                  <p>You need to create charts before adding them to dashboards.</p>
                </div>
                <div class="mt-4">
                  <div class="-mx-2 -my-1.5 flex">
                    <router-link
                      to="/charts"
                      class="bg-yellow-50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
                    >
                      Create Charts
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Dashboard Grid -->
        <div v-if="dashboard" class="bg-white rounded-lg shadow-sm">
          <div class="p-6">
            <div v-if="dashboard.widgets.length === 0" class="text-center py-12">
              <Squares2X2Icon class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900">No widgets in dashboard</h3>
              <p class="mt-1 text-sm text-gray-500">Get started by adding your first chart widget.</p>
              <div class="mt-6">
                <button
                  @click="showAddChartModal = true"
                  :disabled="chartStore.charts.length === 0"
                  class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <PlusIcon class="h-4 w-4 mr-2" />
                  Add Chart
                </button>
              </div>
            </div>

            <!-- GridStack Container -->
            <div v-else ref="gridStackContainer" class="grid-stack">
              <div
                v-for="widget in dashboard.widgets"
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

    <!-- Add Chart Modal -->
    <TransitionRoot :show="showAddChartModal" as="template">
      <Dialog @close="showAddChartModal = false" class="relative z-10">
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
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div>
                  <div class="flex items-center justify-between mb-6">
                    <div>
                      <h3 class="text-lg font-medium text-gray-900">Add Chart to Dashboard</h3>
                      <p class="text-sm text-gray-500 mt-1">
                        Select a chart to add as a widget to your dashboard
                      </p>
                    </div>
                    <button
                      @click="showAddChartModal = false"
                      class="text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon class="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div class="grid gap-4 max-h-96 overflow-y-auto">
                    <div
                      v-for="chart in availableCharts"
                      :key="chart.id"
                      @click="addChartWidget(chart.id)"
                      class="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-colors duration-200"
                    >
                      <div class="flex items-center justify-between">
                        <div>
                          <h4 class="text-sm font-medium text-gray-900">{{ chart.name }}</h4>
                          <p class="text-xs text-gray-500 mt-1">
                            {{ chart.type.charAt(0).toUpperCase() + chart.type.slice(1) }} Chart
                          </p>
                          <p class="text-xs text-gray-500">
                            Data: {{ getDataSourceName(chart.dataSourceId) }}
                          </p>
                        </div>
                        <div class="flex-shrink-0">
                          <span
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            :class="{
                              'bg-blue-100 text-blue-800': chart.type === 'bar',
                              'bg-green-100 text-green-800': chart.type === 'line',
                              'bg-yellow-100 text-yellow-800': chart.type === 'pie',
                              'bg-purple-100 text-purple-800': chart.type === 'scatter'
                            }"
                          >
                            {{ chart.type }}
                          </span>
                        </div>
                      </div>
                      <div class="mt-3 h-20 bg-gray-50 rounded flex items-center justify-center">
                        <ChartPreview :chart="chart" class="w-full h-full" />
                      </div>
                    </div>
                  </div>

                  <div v-if="availableCharts.length === 0" class="text-center py-8">
                    <PresentationChartLineIcon class="mx-auto h-12 w-12 text-gray-400" />
                    <h3 class="mt-2 text-sm font-medium text-gray-900">No charts available</h3>
                    <p class="mt-1 text-sm text-gray-500">Create some charts first to add them to your dashboard.</p>
                    <div class="mt-6">
                      <router-link
                        to="/charts"
                        class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Create Charts
                      </router-link>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import {
  ArrowLeftIcon,
  PlusIcon,
  XMarkIcon,
  Squares2X2Icon,
  PresentationChartLineIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import { GridStack } from 'gridstack'
import { useDashboardStore } from '../stores/dashboard'
import { useChartStore } from '../stores/chart'
import { useDataSourceStore } from '../stores/dataSource'
import DashboardChart from '../components/DashboardChart.vue'
import ChartPreview from '../components/ChartPreview.vue'

interface Props {
  id: string
}

const props = defineProps<Props>()
const route = useRoute()
const router = useRouter()

const dashboardStore = useDashboardStore()
const chartStore = useChartStore()
const dataSourceStore = useDataSourceStore()

const showAddChartModal = ref(false)
const gridStackContainer = ref<HTMLElement>()
let gridStack: GridStack | null = null

const dashboard = computed(() => {
  return dashboardStore.getDashboardById(props.id)
})

const availableCharts = computed(() => {
  if (!dashboard.value) return []
  
  // Filter out charts that are already in the dashboard
  const usedChartIds = new Set(dashboard.value.widgets.map(w => w.chartId))
  return chartStore.charts.filter(chart => !usedChartIds.has(chart.id))
})

const getDataSourceName = (id: string) => {
  const ds = dataSourceStore.getDataSourceById(id)
  return ds?.name || 'Unknown'
}

const initializeGridStack = async () => {
  if (!gridStackContainer.value || !dashboard.value) return

  await nextTick()

  try {
    gridStack = GridStack.init({
      cellHeight: 80,
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
      if (!dashboard.value) return
      
      items.forEach(item => {
        const widget = dashboard.value!.widgets.find(w => w.id === item.id)
        if (widget && item.x !== undefined && item.y !== undefined && item.w !== undefined && item.h !== undefined) {
          dashboardStore.updateWidgetLayout(dashboard.value!.id, widget.id, {
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
}

const addChartWidget = (chartId: string) => {
  if (!dashboard.value) return
  
  dashboardStore.addWidget(dashboard.value.id, chartId)
  showAddChartModal.value = false
  
  // Reinitialize GridStack after adding widget
  nextTick(() => {
    if (gridStack) {
      gridStack.destroy(false)
      gridStack = null
    }
    initializeGridStack()
  })
}

const removeWidget = (widgetId: string) => {
  if (!dashboard.value) return
  
  if (confirm('Are you sure you want to remove this widget from the dashboard?')) {
    dashboardStore.removeWidget(dashboard.value.id, widgetId)
    
    // Reinitialize GridStack after removing widget
    nextTick(() => {
      if (gridStack) {
        gridStack.destroy(false)
        gridStack = null
      }
      initializeGridStack()
    })
  }
}

const goBack = () => {
  router.push('/dashboards')
}

onMounted(() => {
  if (dashboard.value && dashboard.value.widgets.length > 0) {
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
  top: 4px;
  right: 4px;
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
  width: 100%;
  overflow: hidden;
}

.grid-stack-item-content {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
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

/* Ensure proper sizing for chart containers */
:deep(.chart-container) {
  height: 100% !important;
  width: 100% !important;
}

:deep(.chart-container canvas) {
  height: 100% !important;
  width: 100% !important;
}
</style>