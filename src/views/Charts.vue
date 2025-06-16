<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-bold text-gray-900">Charts</h1>
          <p class="mt-2 text-sm text-gray-700">
            Create and manage charts from your data sources.
          </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            @click="showCreateModal = true"
            :disabled="dataSourceStore.dataSources.length === 0"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <PlusIcon class="w-4 h-4 mr-2" />
            Create Chart
          </button>
        </div>
      </div>

      <!-- No Data Sources Warning -->
      <div v-if="dataSourceStore.dataSources.length === 0" class="mt-8">
        <div class="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-yellow-800">No Data Sources Available</h3>
              <div class="mt-2 text-sm text-yellow-700">
                <p>You need to upload at least one CSV file before creating charts.</p>
              </div>
              <div class="mt-4">
                <div class="-mx-2 -my-1.5 flex">
                  <router-link
                    to="/data-sources"
                    class="bg-yellow-50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
                  >
                    Upload Data Source
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts List -->
      <div class="mt-8">
        <div v-if="chartStore.charts.length === 0 && dataSourceStore.dataSources.length > 0" class="text-center">
          <PresentationChartLineIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No charts</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by creating your first chart.</p>
          <div class="mt-6">
            <button
              type="button"
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <PlusIcon class="w-4 h-4 mr-2" />
              Create Chart
            </button>
          </div>
        </div>

        <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="chart in chartStore.charts"
            :key="chart.id"
            class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
          >
            <div class="p-6">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900 truncate">{{ chart.name }}</h3>
                <div class="ml-2 flex-shrink-0 flex">
                  <button
                    @click="editChart(chart)"
                    class="text-primary-600 hover:text-primary-900 mr-2"
                    title="Edit Chart"
                  >
                    <PencilIcon class="h-5 w-5" />
                  </button>
                  <button
                    @click="deleteChart(chart.id)"
                    class="text-red-600 hover:text-red-900"
                    title="Delete Chart"
                  >
                    <TrashIcon class="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div class="mt-2">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-blue-100 text-blue-800': chart.type === 'bar',
                    'bg-green-100 text-green-800': chart.type === 'line',
                    'bg-yellow-100 text-yellow-800': chart.type === 'pie',
                    'bg-purple-100 text-purple-800': chart.type === 'scatter'
                  }"
                >
                  {{ chart.type.charAt(0).toUpperCase() + chart.type.slice(1) }} Chart
                </span>
              </div>
              <div class="mt-4">
                <p class="text-sm text-gray-600">
                  Data Source: {{ getDataSourceName(chart.dataSourceId) }}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  Created {{ formatDate(chart.createdAt) }}
                </p>
              </div>
              <!-- Chart Preview -->
              <div class="mt-4 h-32 bg-gray-50 rounded flex items-center justify-center">
                <ChartPreview :chart="chart" class="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Chart Modal -->
    <TransitionRoot :show="showCreateModal" as="template">
      <Dialog @close="closeCreateModal" class="relative z-10">
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
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
                <div>
                  <div class="flex items-center justify-between mb-6">
                    <div>
                      <h3 class="text-lg font-medium text-gray-900">
                        {{ editingChart ? 'Edit Chart' : 'Create New Chart' }}
                      </h3>
                      <p class="text-sm text-gray-500 mt-1">
                        Configure your chart settings and see a live preview
                      </p>
                    </div>
                    <button
                      @click="closeCreateModal"
                      class="text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon class="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Configuration Form -->
                    <div>
                      <form @submit.prevent="saveChart" class="space-y-4">
                        <div>
                          <label for="chartName" class="block text-sm font-medium text-gray-700">
                            Chart Name
                          </label>
                          <input
                            id="chartName"
                            v-model="chartForm.name"
                            type="text"
                            required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            placeholder="Enter chart name"
                          />
                        </div>

                        <div>
                          <label for="dataSource" class="block text-sm font-medium text-gray-700">
                            Data Source
                          </label>
                          <select
                            id="dataSource"
                            v-model="chartForm.dataSourceId"
                            required
                            @change="onDataSourceChange"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          >
                            <option value="">Select a data source</option>
                            <option
                              v-for="ds in dataSourceStore.dataSources"
                              :key="ds.id"
                              :value="ds.id"
                            >
                              {{ ds.name }}
                            </option>
                          </select>
                        </div>

                        <div>
                          <label for="chartType" class="block text-sm font-medium text-gray-700">
                            Chart Type
                          </label>
                          <select
                            id="chartType"
                            v-model="chartForm.type"
                            required
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          >
                            <option value="bar">Bar Chart</option>
                            <option value="line">Line Chart</option>
                            <option value="pie">Pie Chart</option>
                            <option value="scatter">Scatter Chart</option>
                          </select>
                        </div>

                        <div v-if="selectedDataSource">
                          <div v-if="chartForm.type === 'pie'">
                            <label for="category" class="block text-sm font-medium text-gray-700">
                              Category Column
                            </label>
                            <select
                              id="category"
                              v-model="chartForm.category"
                              required
                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            >
                              <option value="">Select category column</option>
                              <option
                                v-for="column in selectedDataSource.columns"
                                :key="column.name"
                                :value="column.name"
                              >
                                {{ column.name }} ({{ column.type }})
                              </option>
                            </select>
                          </div>
                          <div v-else>
                            <div class="grid grid-cols-2 gap-4">
                              <div>
                                <label for="xAxis" class="block text-sm font-medium text-gray-700">
                                  X-Axis
                                </label>
                                <select
                                  id="xAxis"
                                  v-model="chartForm.xAxis"
                                  required
                                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                >
                                  <option value="">Select X-axis</option>
                                  <option
                                    v-for="column in selectedDataSource.columns"
                                    :key="column.name"
                                    :value="column.name"
                                  >
                                    {{ column.name }} ({{ column.type }})
                                  </option>
                                </select>
                              </div>
                              <div>
                                <label for="yAxis" class="block text-sm font-medium text-gray-700">
                                  Y-Axis
                                </label>
                                <select
                                  id="yAxis"
                                  v-model="chartForm.yAxis"
                                  required
                                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                >
                                  <option value="">Select Y-axis</option>
                                  <option
                                    v-for="column in selectedDataSource.columns.filter(c => c.type === 'number')"
                                    :key="column.name"
                                    :value="column.name"
                                  >
                                    {{ column.name }} ({{ column.type }})
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label for="chartTitle" class="block text-sm font-medium text-gray-700">
                            Chart Title
                          </label>
                          <input
                            id="chartTitle"
                            v-model="chartForm.title"
                            type="text"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            placeholder="Enter chart title"
                          />
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                          <div>
                            <label for="backgroundColor" class="block text-sm font-medium text-gray-700">
                              Background Color
                            </label>
                            <input
                              id="backgroundColor"
                              v-model="chartForm.backgroundColor"
                              type="color"
                              class="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                          </div>
                          <div>
                            <label for="borderColor" class="block text-sm font-medium text-gray-700">
                              Border Color
                            </label>
                            <input
                              id="borderColor"
                              v-model="chartForm.borderColor"
                              type="color"
                              class="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                          </div>
                        </div>

                        <div class="flex justify-end space-x-3 pt-4">
                          <button
                            type="button"
                            @click="closeCreateModal"
                            class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            :disabled="!isFormValid"
                            class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {{ editingChart ? 'Update Chart' : 'Create Chart' }}
                          </button>
                        </div>
                      </form>
                    </div>

                    <!-- Chart Preview -->
                    <div>
                      <h4 class="text-sm font-medium text-gray-900 mb-3">Preview</h4>
                      <div class="bg-gray-50 rounded-lg p-4 h-80">
                        <ChartPreview v-if="isFormValid" :chart="chartForm" class="w-full h-full" />
                        <div v-else class="flex items-center justify-center h-full text-gray-500">
                          <PresentationChartLineIcon class="h-12 w-12 mr-3" />
                          <span>Configure chart to see preview</span>
                        </div>
                      </div>
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
import { ref, reactive, computed } from 'vue'
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import {
  PlusIcon,
  PresentationChartLineIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import { useDataSourceStore } from '../stores/dataSource'
import { useChartStore, type ChartConfig } from '../stores/chart'
import ChartPreview from '../components/ChartPreview.vue'

const dataSourceStore = useDataSourceStore()
const chartStore = useChartStore()

const showCreateModal = ref(false)
const editingChart = ref<ChartConfig | null>(null)

const chartForm = reactive({
  name: '',
  type: 'bar' as ChartConfig['type'],
  dataSourceId: '',
  xAxis: '',
  yAxis: '',
  category: '',
  title: '',
  backgroundColor: '#3b82f6',
  borderColor: '#1d4ed8'
})

const selectedDataSource = computed(() => {
  if (!chartForm.dataSourceId) return null
  return dataSourceStore.getDataSourceById(chartForm.dataSourceId)
})

const isFormValid = computed(() => {
  if (!chartForm.name || !chartForm.dataSourceId || !chartForm.type) return false
  
  if (chartForm.type === 'pie') {
    return !!chartForm.category
  } else {
    return !!chartForm.xAxis && !!chartForm.yAxis
  }
})

const getDataSourceName = (id: string) => {
  const ds = dataSourceStore.getDataSourceById(id)
  return ds?.name || 'Unknown'
}

const onDataSourceChange = () => {
  chartForm.xAxis = ''
  chartForm.yAxis = ''
  chartForm.category = ''
}

const editChart = (chart: ChartConfig) => {
  editingChart.value = chart
  Object.assign(chartForm, chart)
  showCreateModal.value = true
}

const resetForm = () => {
  chartForm.name = ''
  chartForm.type = 'bar'
  chartForm.dataSourceId = ''
  chartForm.xAxis = ''
  chartForm.yAxis = ''
  chartForm.category = ''
  chartForm.title = ''
  chartForm.backgroundColor = '#3b82f6'
  chartForm.borderColor = '#1d4ed8'
}

const closeCreateModal = () => {
  showCreateModal.value = false
  editingChart.value = null
  resetForm()
}

const saveChart = () => {
  if (editingChart.value) {
    chartStore.updateChart(editingChart.value.id, { ...chartForm })
  } else {
    chartStore.createChart({ ...chartForm })
  }
  closeCreateModal()
}

const deleteChart = (id: string) => {
  if (confirm('Are you sure you want to delete this chart? This action cannot be undone.')) {
    chartStore.deleteChart(id)
  }
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}
</script>