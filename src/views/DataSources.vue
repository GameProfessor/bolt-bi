<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-bold text-gray-900">Data Sources</h1>
          <p class="mt-2 text-sm text-gray-700">
            Upload and manage CSV files to create data sources for your charts and dashboards.
          </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            @click="showUploadModal = true"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <PlusIcon class="w-4 h-4 mr-2" />
            Upload CSV
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="dataSourceStore.loading" class="mt-8">
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <span class="ml-3 text-gray-600">Processing CSV file...</span>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="dataSourceStore.error" class="mt-8">
        <div class="bg-red-50 border border-red-200 rounded-md p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Upload Error</h3>
              <div class="mt-2 text-sm text-red-700">
                {{ dataSourceStore.error }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Sources List -->
      <div class="mt-8">
        <div v-if="dataSourceStore.dataSources.length === 0 && !dataSourceStore.loading" class="text-center">
          <TableCellsIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No data sources</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by uploading your first CSV file.</p>
          <div class="mt-6">
            <button
              type="button"
              @click="showUploadModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <PlusIcon class="w-4 h-4 mr-2" />
              Upload CSV
            </button>
          </div>
        </div>

        <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="dataSource in dataSourceStore.dataSources"
            :key="dataSource.id"
            class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
          >
            <div class="p-6">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900 truncate">{{ dataSource.name }}</h3>
                <div class="ml-2 flex-shrink-0 flex">
                  <button
                    @click="selectedDataSource = dataSource"
                    class="text-primary-600 hover:text-primary-900 mr-2"
                    title="View Details"
                  >
                    <EyeIcon class="h-5 w-5" />
                  </button>
                  <button
                    @click="deleteDataSource(dataSource.id)"
                    class="text-red-600 hover:text-red-900"
                    title="Delete"
                  >
                    <TrashIcon class="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div class="mt-4">
                <div class="text-sm text-gray-600">
                  <p>{{ dataSource.rows.length }} rows</p>
                  <p>{{ dataSource.columns.length }} columns</p>
                  <p class="text-xs text-gray-500 mt-1">
                    Created {{ formatDate(dataSource.createdAt) }}
                  </p>
                </div>
              </div>
              <div class="mt-4">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="column in dataSource.columns.slice(0, 4)"
                    :key="column.name"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                    :class="{
                      'bg-blue-100 text-blue-800': column.type === 'number',
                      'bg-green-100 text-green-800': column.type === 'date',
                      'bg-gray-100 text-gray-800': column.type === 'string'
                    }"
                  >
                    {{ column.name }}
                  </span>
                  <span
                    v-if="dataSource.columns.length > 4"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    +{{ dataSource.columns.length - 4 }} more
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <TransitionRoot :show="showUploadModal" as="template">
      <Dialog @close="showUploadModal = false" class="relative z-10">
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
                <div>
                  <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                    <DocumentArrowUpIcon class="h-6 w-6 text-primary-600" />
                  </div>
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                      Upload CSV File
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Select a CSV file to create a new data source. The first row should contain column headers.
                      </p>
                    </div>
                  </div>
                </div>
                <form @submit.prevent="handleUpload" class="mt-5 sm:mt-6">
                  <div class="mb-4">
                    <label for="dataSourceName" class="block text-sm font-medium text-gray-700">
                      Data Source Name
                    </label>
                    <input
                      id="dataSourceName"
                      v-model="uploadForm.name"
                      type="text"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="Enter a name for your data source"
                    />
                  </div>
                  <div class="mb-4">
                    <label for="csvFile" class="block text-sm font-medium text-gray-700">
                      CSV File
                    </label>
                    <input
                      id="csvFile"
                      ref="fileInput"
                      type="file"
                      accept=".csv"
                      required
                      @change="handleFileSelect"
                      class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
                    />
                  </div>
                  <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="submit"
                      :disabled="!uploadForm.file || !uploadForm.name"
                      class="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:col-start-2 sm:text-sm transition-colors duration-200"
                    >
                      Upload
                    </button>
                    <button
                      type="button"
                      @click="showUploadModal = false"
                      class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Data Source Detail Modal -->
    <TransitionRoot :show="!!selectedDataSource" as="template">
      <Dialog @close="selectedDataSource = null" class="relative z-10">
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
                <div v-if="selectedDataSource">
                  <div class="flex items-center justify-between mb-4">
                    <div>
                      <h3 class="text-lg font-medium text-gray-900">{{ selectedDataSource.name }}</h3>
                      <p class="text-sm text-gray-500">
                        {{ selectedDataSource.rows.length }} rows, {{ selectedDataSource.columns.length }} columns
                      </p>
                    </div>
                    <button
                      @click="selectedDataSource = null"
                      class="text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon class="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div class="mb-4">
                    <h4 class="text-sm font-medium text-gray-900 mb-2">Columns</h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      <div
                        v-for="column in selectedDataSource.columns"
                        :key="column.name"
                        class="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <span class="text-sm font-medium">{{ column.name }}</span>
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

                  <div>
                    <h4 class="text-sm font-medium text-gray-900 mb-2">Data Preview (First 10 rows)</h4>
                    <div class="overflow-x-auto">
                      <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                          <tr>
                            <th
                              v-for="column in selectedDataSource.columns"
                              :key="column.name"
                              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {{ column.name }}
                            </th>
                          </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                          <tr
                            v-for="(row, index) in selectedDataSource.rows.slice(0, 10)"
                            :key="index"
                            class="hover:bg-gray-50"
                          >
                            <td
                              v-for="column in selectedDataSource.columns"
                              :key="column.name"
                              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                            >
                              {{ row[column.name] }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
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
import { ref, reactive } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import {
  PlusIcon,
  TableCellsIcon,
  DocumentArrowUpIcon,
  EyeIcon,
  TrashIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import { useDataSourceStore, type DataSource } from '../stores/dataSource'

const dataSourceStore = useDataSourceStore()

const showUploadModal = ref(false)
const selectedDataSource = ref<DataSource | null>(null)
const fileInput = ref<HTMLInputElement>()

const uploadForm = reactive({
  name: '',
  file: null as File | null
})

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  uploadForm.file = target.files?.[0] || null
  if (uploadForm.file && !uploadForm.name) {
    uploadForm.name = uploadForm.file.name.replace(/\.[^/.]+$/, '')
  }
}

const handleUpload = async () => {
  if (uploadForm.file && uploadForm.name) {
    await dataSourceStore.parseCSV(uploadForm.file, uploadForm.name)
    if (!dataSourceStore.error) {
      showUploadModal.value = false
      uploadForm.name = ''
      uploadForm.file = null
      if (fileInput.value) {
        fileInput.value.value = ''
      }
    }
  }
}

const deleteDataSource = (id: string) => {
  if (confirm('Are you sure you want to delete this data source? This action cannot be undone.')) {
    dataSourceStore.deleteDataSource(id)
  }
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>