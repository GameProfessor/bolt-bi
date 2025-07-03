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

      <!-- Statistics Cards -->
      <!-- <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <UserGroupIcon class="h-6 w-6 text-blue-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">User đăng nhập trong ngày</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ accessLogStore.stats.uniqueUsers }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div> -->

      <!-- Filters -->
      <div class="mt-8 bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <!-- Search -->
            <div>
              <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search User</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  v-model="filters.search"
                  type="text"
                  placeholder="Search by username..."
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <!-- Action Filter -->
            <div>
              <label for="action" class="block text-sm font-medium text-gray-700 mb-1">Action</label>
              <select
                id="action"
                v-model="filters.action"
                class="block w-full pl-3 pr-10 py-2 text-base border border-gray-200 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white"
              >
                <option value="">All Actions</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
                <option value="view_dashboard">View Dashboard</option>
                <option value="edit_dashboard">Edit Dashboard</option>
                <option value="create_dashboard">Create Dashboard</option>
                <option value="delete_dashboard">Delete Dashboard</option>
                <option value="upload_data">Upload Data</option>
                <option value="view_data">View Data</option>
                <option value="create_chart">Create Chart</option>
                <option value="edit_chart">Edit Chart</option>
                <option value="admin_access">Admin Access</option>
              </select>
            </div>

            <!-- Status Filter -->
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                id="status"
                v-model="filters.status"
                class="block w-full pl-3 pr-10 py-2 text-base border border-gray-200 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-white"
              >
                <option value="">All Status</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="warning">Warning</option>
              </select>
            </div>

            <!-- Start Date -->
            <div>
              <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                id="startDate"
                v-model="filters.startDate"
                type="date"
                class="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
            <!-- End Date -->
            <div>
              <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                id="endDate"
                v-model="filters.endDate"
                type="date"
                class="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>
        </div>

        <!-- Results Info -->
        <div class="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <p class="text-sm text-gray-700">
              Showing {{ paginatedLogs.length }} of {{ filteredLogs.logs.length }} logs
            </p>
            <div class="flex items-center space-x-2">
              <label for="pageSize" class="text-sm text-gray-700">Show:</label>
              <select
                id="pageSize"
                v-model="pageSize"
                class="border border-gray-300 rounded text-sm"
              >
                <option :value="25">25</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select>
              <span class="text-sm text-gray-700">per page</span>
            </div>
          </div>
        </div>

        <!-- Logs Table -->
        <div class="overflow-hidden">
          <div v-if="filteredLogs.logs.length === 0" class="text-center py-12">
            <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">No logs found</h3>
            <p class="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or date range.
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
                    Status
                  </th>
                  <th scope="col" class="relative px-6 py-3">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="log in paginatedLogs"
                  :key="log.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDateTime(log.timestamp) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-8 w-8">
                        <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserIcon class="h-4 w-4 text-gray-500" />
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
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getStatusColor(log.status)"
                    >
                      {{ log.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      @click="viewLogDetails(log)"
                      class="text-primary-600 hover:text-primary-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
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
                :disabled="currentPage === totalPages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing
                  <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span>
                  to
                  <span class="font-medium">{{ Math.min(currentPage * pageSize, filteredLogs.logs.length) }}</span>
                  of
                  <span class="font-medium">{{ filteredLogs.logs.length }}</span>
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
                    :disabled="currentPage === totalPages"
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
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div v-if="selectedLog">
                  <div class="flex items-center justify-between mb-6">
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
                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <dt class="text-sm font-medium text-gray-500">Timestamp</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ formatDateTime(selectedLog.timestamp) }}</dd>
                      </div>
                      <div>
                        <dt class="text-sm font-medium text-gray-500">User</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ selectedLog.username }} ({{ selectedLog.userRole }})</dd>
                      </div>
                      <div>
                        <dt class="text-sm font-medium text-gray-500">Action</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ formatAction(selectedLog.action) }}</dd>
                      </div>
                      <div>
                        <dt class="text-sm font-medium text-gray-500">Status</dt>
                        <dd class="mt-1">
                          <span
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            :class="getStatusColor(selectedLog.status)"
                          >
                            {{ selectedLog.status }}
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt class="text-sm font-medium text-gray-500">Resource</dt>
                        <dd class="mt-1 text-sm text-gray-900">{{ selectedLog.resource || 'N/A' }}</dd>
                      </div>
                      <div>
                        <dt class="text-sm font-medium text-gray-500">Session ID</dt>
                        <dd class="mt-1 text-sm text-gray-900 font-mono">{{ selectedLog.sessionId }}</dd>
                      </div>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500">IP Address</dt>
                      <dd class="mt-1 text-sm text-gray-900 break-all">IP address of the user</dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500">User Agent</dt>
                      <dd class="mt-1 text-sm text-gray-900 break-all">{{ selectedLog.userAgent }}</dd>
                    </div>

                    <div>
                      <dt class="text-sm font-medium text-gray-500">Additional Details</dt>
                      <dd class="mt-1 text-sm text-gray-900 break-all">{{ selectedLog.details }} More detail if possible </dd>
                    </div>
                  </div>

                  <div class="mt-6 flex justify-end">
                    <button
                      @click="showDetailsModal = false"
                      class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    >
                      Close
                    </button>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
  DocumentArrowDownIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'
import { useAccessLogStore } from '@/stores'
import type { AccessLog } from '@/types/accessLog'

const accessLogStore = useAccessLogStore()

// State
const showDetailsModal = ref(false)
const selectedLog = ref<AccessLog | null>(null)
const currentPage = ref(1)
const pageSize = ref(50)

// Filters
const filters = reactive({
  search: '',
  action: '',
  status: '',
  startDate: '',
  endDate: ''
})

// Computed
const filteredLogs = computed(() => {
  return accessLogStore.getFilteredLogs({
    userId: filters.search ? undefined : undefined,
    action: filters.action as any || undefined,
    status: (filters.status as 'success' | 'failed' | 'warning') || undefined,
    dateFrom: filters.startDate ? new Date(filters.startDate) : undefined,
    dateTo: filters.endDate ? new Date(filters.endDate) : undefined,
    ipAddress: undefined,
    resource: undefined
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredLogs.value.logs.length / pageSize.value)
})

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredLogs.value.logs.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
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

const formatAction = (action: string) => {
  return action.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

const getActionColor = (action: string) => {
  const colors: Record<string, string> = {
    login: 'bg-green-100 text-green-800',
    logout: 'bg-gray-100 text-gray-800',
    view_dashboard: 'bg-blue-100 text-blue-800',
    edit_dashboard: 'bg-yellow-100 text-yellow-800',
    create_dashboard: 'bg-green-100 text-green-800',
    delete_dashboard: 'bg-red-100 text-red-800',
    upload_data: 'bg-purple-100 text-purple-800',
    view_data: 'bg-indigo-100 text-indigo-800',
    create_chart: 'bg-teal-100 text-teal-800',
    edit_chart: 'bg-orange-100 text-orange-800',
    admin_access: 'bg-red-100 text-red-800'
  }
  return colors[action] || 'bg-gray-100 text-gray-800'
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    success: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const viewLogDetails = (log: AccessLog) => {
  selectedLog.value = log
  showDetailsModal.value = true
}

const refreshLogs = () => {
  accessLogStore.generateMockLogs()
}

const exportLogs = () => {
  const logs = filteredLogs.value.logs
  const csvContent = [
    // Header
    'Timestamp,Username,User Role,Action,Resource,Status,Session ID,User Agent',
    // Data rows
    ...logs.map((log: any) => [
      formatDateTime(log.timestamp),
      log.username,
      log.userRole,
      formatAction(log.action),
      log.resource || '',
      log.status,
      log.sessionId,
      `"${log.userAgent}"`
    ].join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `access-logs-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Pagination
const goToPage = (page: number | string) => {
  if (typeof page === 'number' && page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// Lifecycle
onMounted(() => {
  // Store is already initialized with mock data
})
</script>