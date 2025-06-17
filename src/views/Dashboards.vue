<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-bold text-gray-900">Dashboards</h1>
          <p class="mt-2 text-sm text-gray-700">
            Create and manage interactive dashboards with your charts.
          </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <div class="flex space-x-3">
            <button
              type="button"
              @click="showCreateModal = true"
              class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <PlusIcon class="w-4 h-4 mr-2" />
              Create Dashboard
            </button>
            <router-link
              to="/quick-dashboard"
              class="inline-flex items-center justify-center rounded-md border border-primary-600 bg-white px-4 py-2 text-sm font-medium text-primary-600 shadow-sm hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <BoltIcon class="w-4 h-4 mr-2" />
              Quick Dashboard
            </router-link>
          </div>
        </div>
      </div>

      <!-- Dashboards List -->
      <div class="mt-8">
        <div v-if="dashboardStore.dashboards.length === 0" class="text-center">
          <Squares2X2Icon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">No dashboards</h3>
          <p class="mt-1 text-sm text-gray-500">Get started by creating your first dashboard.</p>
          <div class="mt-6 flex justify-center space-x-3">
            <button
              type="button"
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <PlusIcon class="w-4 h-4 mr-2" />
              Create Dashboard
            </button>
            <router-link
              to="/quick-dashboard"
              class="inline-flex items-center px-4 py-2 border border-primary-600 shadow-sm text-sm font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <BoltIcon class="w-4 h-4 mr-2" />
              Quick Dashboard
            </router-link>
          </div>
        </div>

        <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="dashboard in dashboardStore.dashboards"
            :key="dashboard.id"
            class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer"
            @click="openDashboard(dashboard.id)"
          >
            <div class="p-6">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900 truncate">{{ dashboard.name }}</h3>
                <div class="ml-2 flex-shrink-0 flex" @click.stop>
                  <button
                    @click="editDashboard(dashboard)"
                    class="text-primary-600 hover:text-primary-900 mr-2"
                    title="Edit Dashboard"
                  >
                    <PencilIcon class="h-5 w-5" />
                  </button>
                  <button
                    @click="deleteDashboard(dashboard.id)"
                    class="text-red-600 hover:text-red-900"
                    title="Delete Dashboard"
                  >
                    <TrashIcon class="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div class="mt-4">
                <div class="text-sm text-gray-600">
                  <p>{{ dashboard.widgets.length }} widgets</p>
                  <p class="text-xs text-gray-500 mt-1">
                    Created {{ formatDate(dashboard.createdAt) }}
                  </p>
                </div>
              </div>
              <!-- Dashboard Preview -->
              <div class="mt-4 h-32 bg-gray-50 rounded flex items-center justify-center">
                <div v-if="dashboard.widgets.length > 0" class="grid grid-cols-2 gap-1 w-full h-full p-2">
                  <div
                    v-for="(widget, index) in dashboard.widgets.slice(0, 4)"
                    :key="widget.id"
                    class="bg-white rounded shadow-sm flex items-center justify-center text-xs text-gray-500"
                  >
                    Chart {{ index + 1 }}
                  </div>
                </div>
                <div v-else class="text-gray-500 text-sm">
                  <Squares2X2Icon class="h-8 w-8 mx-auto mb-2" />
                  Empty Dashboard
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Dashboard Modal -->
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
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                    <Squares2X2Icon class="h-6 w-6 text-primary-600" />
                  </div>
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                      {{ editingDashboard ? 'Edit Dashboard' : 'Create New Dashboard' }}
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        {{ editingDashboard ? 'Update the dashboard name.' : 'Enter a name for your new dashboard.' }}
                      </p>
                    </div>
                  </div>
                </div>
                <form @submit.prevent="saveDashboard" class="mt-5 sm:mt-6">
                  <div class="mb-4">
                    <label for="dashboardName" class="block text-sm font-medium text-gray-700">
                      Dashboard Name
                    </label>
                    <input
                      id="dashboardName"
                      v-model="dashboardForm.name"
                      type="text"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="Enter dashboard name"
                    />
                  </div>
                  <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button
                      type="submit"
                      :disabled="!dashboardForm.name"
                      class="inline-flex w-full justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed sm:col-start-2 sm:text-sm transition-colors duration-200"
                    >
                      {{ editingDashboard ? 'Update Dashboard' : 'Create Dashboard' }}
                    </button>
                    <button
                      type="button"
                      @click="closeCreateModal"
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import {
  PlusIcon,
  Squares2X2Icon,
  PencilIcon,
  TrashIcon,
  BoltIcon
} from '@heroicons/vue/24/outline'
import { useDashboardStore, type Dashboard } from '../stores/dashboard'

const router = useRouter()
const dashboardStore = useDashboardStore()

const showCreateModal = ref(false)
const editingDashboard = ref<Dashboard | null>(null)

const dashboardForm = reactive({
  name: ''
})

const openDashboard = (id: string) => {
  router.push(`/dashboard/${id}`)
}

const editDashboard = (dashboard: Dashboard) => {
  editingDashboard.value = dashboard
  dashboardForm.name = dashboard.name
  showCreateModal.value = true
}

const resetForm = () => {
  dashboardForm.name = ''
}

const closeCreateModal = () => {
  showCreateModal.value = false
  editingDashboard.value = null
  resetForm()
}

const saveDashboard = () => {
  if (editingDashboard.value) {
    dashboardStore.updateDashboard(editingDashboard.value.id, { name: dashboardForm.name })
  } else {
    const dashboard = dashboardStore.createDashboard(dashboardForm.name)
    router.push(`/dashboard/${dashboard.id}`)
  }
  closeCreateModal()
}

const deleteDashboard = (id: string) => {
  if (confirm('Are you sure you want to delete this dashboard? This action cannot be undone.')) {
    dashboardStore.deleteDashboard(id)
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