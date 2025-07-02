<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <!-- Header -->
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-bold text-gray-900">Access Logs</h1>
          <p class="mt-2 text-sm text-gray-700">
            Monitor user activities and system access across the platform.
          </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
          <button
            @click="exportLogs"
            class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button
            @click="refreshLogs"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <ArrowPathIcon class="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <DocumentTextIcon class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Logs</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ accessLogStore.stats.totalLogs.toLocaleString() }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <UsersIcon class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Active Users</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ accessLogStore.stats.uniqueUsers }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <CheckCircleIcon class="h-6 w-6 text-green-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Success Rate</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ accessLogStore.stats.successRate.toFixed(1) }}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <ClockIcon class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Peak Hour</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ accessLogStore.stats.peakHour }}:00</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="mt-8 bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Filters</h3>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <!-- User Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">User</label>
              <input
                v-model="filters.username"
                type="text"
                placeholder="Search by username..."
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>

            <!-- Action Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Action</label>
              <select
                v-model="filters.action"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">All Actions</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
                <option value="view_dashboard">View Dashboard</option>
                <option value="edit_dashboard">Edit Dashboard</option>
                <option value="create_dashboard">Create Dashboard</option>
                <option value="delete_dashboard">Delete Dashboard</option>
                <option value="view_data_source">View Data Source</option>
                <option value="upload_data_source">Upload Data Source</option>
                <option value="delete_data_source">Delete Data Source</option>
                <option value="create_chart">Create Chart</option>
                <option value="edit_chart">Edit Chart</option>
                <option value="delete_chart">Delete Chart</option>
                <option value="export_data">Export Data</option>
                <option value="share_dashboard">Share Dashboard</option>
                <option value="access_admin">Access Admin</option>
                <option value="manage_users">Manage Users</option>
                <option value="view_logs">View Logs</option>
                <option value="change_settings">Change Settings</option>
                <option value="api_call">API Call</option>
                <option value="error">Error</option>
              </select>
            </div>

            <!-- Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                v-model="filters.status"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">All Status</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="warning">Warning</option>
              </select>
            </div>

            <!-- Date Range -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select
                v-model="dateRange"
                @change="updateDateFilter"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              >
                <option value="">All Time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>

          <!-- Custom Date Range -->
          <div v-if="dateRange === 'custom'" class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                v-model="customDateFrom"
                type="datetime-local"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                v-model="customDateTo"
                type="datetime-local"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              />
            </div>
          </div>

          <!-- Filter Actions -->
          <div class="mt-4 flex justify-between">
            <button
              @click="clearFilters"
              class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Clear Filters
            </button>
            <div class="text-sm text-gray-500">
              {{ filteredResult.total }} results found
            </div>
          </div>
        </div>
      </div>

      <!-- Logs Table -->
      <div class="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <div v-if="filteredResult.logs.length === 0" class="text-center py-12">
          <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No logs found</h3>
          <p class="mt-1 text-sm text-gray-500">
            Try adjusting your filters or date range.
          </p>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="log in filteredResult.logs"
                :key="log.id"
                class="hover:bg-gray-50"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    <div class="font-medium">{{ formatDate(log.timestamp) }}</div>
                    <div class="text-gray-500">{{ formatTime(log.timestamp) }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-8 w-8">
                      <div class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                        <UserIcon class="h-5 w-5 text-primary-600" />
                      </div>
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900">{{ log.username }}</div>
                      <div class="text-sm text-gray-500">{{ log.userRole }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getActionColor(log.action)"
                  >
                    {{ formatAction(log.action) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ log.resource || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ log.ipAddress }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getStatusColor(log.status)"
                  >
                    {{ log.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ log.duration ? formatDuration(log.duration) : '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="viewLogDetails(log)"
                    class="text-primary-600 hover:text-primary-900"
                    title="View Details"
                  >
                    <EyeIcon class="h-5 w-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="filteredResult.totalPages > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === filteredResult.totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing
                <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                to
                <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredResult.total) }}</span>
                of
                <span class="font-medium">{{ filteredResult.total }}</span>
                results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeftIcon class="h-5 w-5" />
                </button>
                
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    page === currentPage
                      ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
                
                <button
                  @click="nextPage"
                  :disabled="currentPage === filteredResult.totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRightIcon class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Log Details Modal -->
    <TransitionRoot :show="showDetailsModal" as="template">
      <Dialog @close="showDetailsModal = false" class="relative z-10">
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
                <div v-if="selectedLog">
                  <div class="flex items-center justify-between mb-4">
                    <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                      Log Details
                    </DialogTitle>
                    <button
                      @click="showDetailsModal = false"
                      class="text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon class="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700">User</label>
                        <p class="mt-1 text-sm text-gray-900">{{ selectedLog.username }}</p>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Role</label>
                        <p class="mt-1 text-sm text-gray-900">{{ selectedLog.userRole }}</p>
                      </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Action</label>
                        <p class="mt-1 text-sm text-gray-900">{{ formatAction(selectedLog.action) }}</p>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Status</label>
                        <span
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          :class="getStatusColor(selectedLog.status)"
                        >
                          {{ selectedLog.status }}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Timestamp</label>
                      <p class="mt-1 text-sm text-gray-900">{{ formatDateTime(selectedLog.timestamp) }}</p>
                    </div>
                    
                    <div v-if="selectedLog.resource">
                      <label class="block text-sm font-medium text-gray-700">Resource</label>
                      <p class="mt-1 text-sm text-gray-900">{{ selectedLog.resource }}</p>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700">IP Address</label>
                        <p class="mt-1 text-sm text-gray-900">{{ selectedLog.ipAddress }}</p>
                      </div>
                      <div v-if="selectedLog.duration">
                        <label class="block text-sm font-medium text-gray-700">Duration</label>
                        <p class="mt-1 text-sm text-gray-900">{{ formatDuration(selectedLog.duration) }}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Session ID</label>
                      <p class="mt-1 text-sm text-gray-900 font-mono">{{ selectedLog.sessionId }}</p>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700">User Agent</label>
                      <p class="mt-1 text-sm text-gray-900 break-all">{{ selectedLog.userAgent }}</p>
                    </div>
                    
                    <div v-if="selectedLog.details">
                      <label class="block text-sm font-medium text-gray-700">Additional Details</label>
                      <pre class="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded overflow-auto">{{ JSON.stringify(selectedLog.details, null, 2) }}</pre>
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
import { ref, computed, reactive, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
  DocumentTextIcon,
  UsersIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentArrowDownIcon,
  ArrowPathIcon,
  EyeIcon,
  UserIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'
import { useAccessLogStore } from '@/stores/modules/accessLog'
import type { AccessLog, AccessLogFilter, AccessLogAction } from '@/types/accessLog'

const accessLogStore = useAccessLogStore()

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(50)

// Filters
const filters = reactive<{
  username: string
  action: AccessLogAction | ''
  status: 'success' | 'failed' | 'warning' | ''
  dateFrom?: Date
  dateTo?: Date
}>({
  username: '',
  action: '',
  status: ''
})

const dateRange = ref('')
const customDateFrom = ref('')
const customDateTo = ref('')

// Modal
const showDetailsModal = ref(false)
const selectedLog = ref<AccessLog | null>(null)

// Computed
const filteredResult = computed(() => {
  const filter: AccessLogFilter = {}
  
  if (filters.username) {
    // Find user by username (simplified - in real app would search by ID)
    filter.userId = filters.username
  }
  
  if (filters.action) {
    filter.action = filters.action
  }
  
  if (filters.status) {
    filter.status = filters.status
  }
  
  if (filters.dateFrom) {
    filter.dateFrom = filters.dateFrom
  }
  
  if (filters.dateTo) {
    filter.dateTo = filters.dateTo
  }

  return accessLogStore.getFilteredLogs(filter, currentPage.value, itemsPerPage.value)
})

const visiblePages = computed(() => {
  const pages = []
  const total = filteredResult.value.totalPages
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

// Methods
const updateDateFilter = () => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  switch (dateRange.value) {
    case 'today':
      filters.dateFrom = today
      filters.dateTo = new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1)
      break
    case 'yesterday':
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
      filters.dateFrom = yesterday
      filters.dateTo = new Date(yesterday.getTime() + 24 * 60 * 60 * 1000 - 1)
      break
    case 'last7days':
      filters.dateFrom = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      filters.dateTo = now
      break
    case 'last30days':
      filters.dateFrom = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
      filters.dateTo = now
      break
    case '':
      filters.dateFrom = undefined
      filters.dateTo = undefined
      break
  }
  currentPage.value = 1
}

const clearFilters = () => {
  filters.username = ''
  filters.action = ''
  filters.status = ''
  filters.dateFrom = undefined
  filters.dateTo = undefined
  dateRange.value = ''
  customDateFrom.value = ''
  customDateTo.value = ''
  currentPage.value = 1
}

const refreshLogs = () => {
  accessLogStore.generateMockLogs()
  currentPage.value = 1
}

const exportLogs = () => {
  const filter: AccessLogFilter = {}
  
  if (filters.username) {
    filter.userId = filters.username
  }
  
  if (filters.action) {
    filter.action = filters.action
  }
  
  if (filters.status) {
    filter.status = filters.status
  }
  
  if (filters.dateFrom) {
    filter.dateFrom = filters.dateFrom
  }
  
  if (filters.dateTo) {
    filter.dateTo = filters.dateTo
  }

  accessLogStore.exportLogs(filter)
}

const viewLogDetails = (log: AccessLog) => {
  selectedLog.value = log
  showDetailsModal.value = true
}

// Pagination
const goToPage = (page: number | string) => {
  if (typeof page === 'number' && page >= 1 && page <= filteredResult.value.totalPages) {
    currentPage.value = page
  }
}

const nextPage = () => {
  if (currentPage.value < filteredResult.value.totalPages) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Formatting functions
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date)
}

const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date)
}

const formatDuration = (ms: number) => {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${(ms / 60000).toFixed(1)}m`
}

const formatAction = (action: AccessLogAction) => {
  return action.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

const getActionColor = (action: AccessLogAction) => {
  const colors: Record<string, string> = {
    login: 'bg-green-100 text-green-800',
    logout: 'bg-gray-100 text-gray-800',
    view_dashboard: 'bg-blue-100 text-blue-800',
    edit_dashboard: 'bg-yellow-100 text-yellow-800',
    create_dashboard: 'bg-green-100 text-green-800',
    delete_dashboard: 'bg-red-100 text-red-800',
    view_data_source: 'bg-blue-100 text-blue-800',
    upload_data_source: 'bg-green-100 text-green-800',
    delete_data_source: 'bg-red-100 text-red-800',
    create_chart: 'bg-green-100 text-green-800',
    edit_chart: 'bg-yellow-100 text-yellow-800',
    delete_chart: 'bg-red-100 text-red-800',
    export_data: 'bg-purple-100 text-purple-800',
    share_dashboard: 'bg-indigo-100 text-indigo-800',
    access_admin: 'bg-orange-100 text-orange-800',
    manage_users: 'bg-orange-100 text-orange-800',
    view_logs: 'bg-gray-100 text-gray-800',
    change_settings: 'bg-yellow-100 text-yellow-800',
    api_call: 'bg-blue-100 text-blue-800',
    error: 'bg-red-100 text-red-800'
  }
  return colors[action] || 'bg-gray-100 text-gray-800'
}

const getStatusColor = (status: string) => {
  const colors = {
    success: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800'
  }
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

// Watch for custom date changes
watch([customDateFrom, customDateTo], () => {
  if (dateRange.value === 'custom') {
    if (customDateFrom.value) {
      filters.dateFrom = new Date(customDateFrom.value)
    }
    if (customDateTo.value) {
      filters.dateTo = new Date(customDateTo.value)
    }
    currentPage.value = 1
  }
})

// Reset page when filters change
watch(filters, () => {
  currentPage.value = 1
}, { deep: true })
</script>