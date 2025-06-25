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

    <!-- Enhanced Upload Modal -->
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
          <div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel class="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <!-- Header with gradient background -->
                <div class="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-6">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <div class="flex-shrink-0">
                        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white bg-opacity-20 backdrop-blur-sm">
                          <DocumentArrowUpIcon class="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div class="ml-4">
                        <DialogTitle as="h3" class="text-xl font-semibold text-white">
                          Upload CSV File
                        </DialogTitle>
                        <p class="text-sm text-primary-100 mt-1">
                          Transform your data into powerful insights
                        </p>
                      </div>
                    </div>
                    <button
                      @click="showUploadModal = false"
                      class="rounded-lg p-2 text-white hover:bg-white hover:bg-opacity-20 transition-colors duration-200"
                    >
                      <XMarkIcon class="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <!-- Form Content -->
                <form @submit.prevent="handleUpload" class="px-6 py-6">
                  <div class="space-y-6">
                    <!-- Data Source Name -->
                    <div>
                      <label for="dataSourceName" class="block text-sm font-semibold text-gray-900 mb-2">
                        Data Source Name
                      </label>
                      <div class="relative">
                        <input
                          id="dataSourceName"
                          v-model="uploadForm.name"
                          type="text"
                          required
                          class="block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm transition-all duration-200"
                          placeholder="Enter a descriptive name for your data source"
                        />
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                          <span class="text-gray-400 text-sm">{{ uploadForm.name.length }}/50</span>
                        </div>
                      </div>
                    </div>

                    <!-- File Upload Area -->
                    <div>
                      <label class="block text-sm font-semibold text-gray-900 mb-2">
                        CSV File
                      </label>
                      <div
                        @drop="handleFileDrop"
                        @dragover.prevent
                        @dragenter.prevent
                        @dragleave="isDragOver = false"
                        @dragover="isDragOver = true"
                        class="relative"
                      >
                        <input
                          id="csvFile"
                          ref="fileInput"
                          type="file"
                          accept=".csv"
                          required
                          @change="handleFileSelect"
                          class="sr-only"
                        />
                        <label
                          for="csvFile"
                          :class="[
                            'flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200',
                            isDragOver || uploadForm.file
                              ? 'border-primary-400 bg-primary-50'
                              : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                          ]"
                        >
                          <div class="flex flex-col items-center justify-center pt-5 pb-6">
                            <div v-if="uploadForm.file" class="text-center">
                              <DocumentCheckIcon class="w-10 h-10 text-primary-600 mx-auto mb-2" />
                              <p class="text-sm font-medium text-primary-700">{{ uploadForm.file.name }}</p>
                              <p class="text-xs text-gray-500">{{ formatFileSize(uploadForm.file.size) }}</p>
                            </div>
                            <div v-else class="text-center">
                              <CloudArrowUpIcon class="w-10 h-10 text-gray-400 mx-auto mb-2" />
                              <p class="text-sm font-medium text-gray-700">
                                <span class="text-primary-600">Click to upload</span> or drag and drop
                              </p>
                              <p class="text-xs text-gray-500">CSV files only</p>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <!-- File Requirements -->
                    <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div class="flex">
                        <div class="flex-shrink-0">
                          <InformationCircleIcon class="h-5 w-5 text-blue-400" />
                        </div>
                        <div class="ml-3">
                          <h4 class="text-sm font-medium text-blue-800">File Requirements</h4>
                          <div class="mt-2 text-sm text-blue-700">
                            <ul class="list-disc list-inside space-y-1">
                              <li>First row should contain column headers</li>
                              <li>Maximum file size: 10MB</li>
                              <li>Supported format: CSV (.csv)</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
                    <button
                      type="button"
                      @click="showUploadModal = false"
                      class="inline-flex w-full justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto sm:text-sm transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      :disabled="!uploadForm.file || !uploadForm.name || dataSourceStore.loading"
                      class="inline-flex w-full justify-center items-center rounded-xl border border-transparent bg-primary-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto sm:text-sm transition-colors duration-200"
                    >
                      <span v-if="dataSourceStore.loading" class="flex items-center">
                        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                      <span v-else class="flex items-center">
                        <DocumentArrowUpIcon class="w-4 h-4 mr-2" />
                        Upload & Process
                      </span>
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
  DocumentCheckIcon,
  CloudArrowUpIcon,
  InformationCircleIcon,
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
const isDragOver = ref(false)

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

const handleFileDrop = (event: DragEvent) => {
  event.preventDefault()
  isDragOver.value = false
  
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      uploadForm.file = file
      if (!uploadForm.name) {
        uploadForm.name = file.name.replace(/\.[^/.]+$/, '')
      }
    } else {
      alert('Please upload a CSV file only.')
    }
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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