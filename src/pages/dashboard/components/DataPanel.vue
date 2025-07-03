<template>
  <div class="bg-white border-r border-gray-200 flex flex-col min-h-0 h-full" :style="{ minWidth: '180px', maxWidth: '400px', width: width + 'px' }">
    <!-- Tab Navigation -->
    <div class="border-b border-gray-200 p-3">
      <nav class="flex gap-2" aria-label="Tabs">
        <div v-for="tab in tabs" :key="tab.id" class="relative group flex-1">
        <button
          @click="activeTab = tab.id"
          :class="[
              'w-full py-2.5 px-3 text-center font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 rounded-lg shadow-sm border',
            activeTab === tab.id
              ? 'border-primary-200 text-primary-700 bg-primary-50 shadow-md'
              : 'border-gray-200 text-gray-600 bg-white hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md'
          ]"
        >
          <component :is="tab.icon" class="h-5 w-5" />
          <!--<span class="text-xs font-medium">{{ tab.name }}</span>-->
        </button>
          <!-- Custom Tooltip -->
          <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-50">
            {{ tab.name }}
            <div class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="flex-1 min-h-0 overflow-y-auto">
      <!-- Overview Tab -->
      <div v-if="activeTab === 'overview'" class="p-4">
        <div class="space-y-6">

          <!-- Category & Description Section (Refined) -->
          <div class="mb-6">
            <div class="mb-4">
              <label for="dashboardCategory" class="block text-sm font-medium text-gray-800 mb-1">
                Category
              </label>
              <select
                id="dashboardCategory"
                v-model="dashboardCategory"
                class="block w-full border border-gray-300 rounded-md focus:border-primary-500 focus:ring-primary-500 text-sm text-gray-900 bg-white px-3 py-2 transition placeholder-gray-400"
              >
                <option value="">Select category</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="HR">HR</option>
                <option value="Customer">Customer</option>
                <option value="Product">Product</option>
                <option value="Analytics">Analytics</option>
                <option value="Executive">Executive</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label for="dashboardDescription" class="block text-sm font-medium text-gray-800 mb-1">
                Description
              </label>
              <textarea
                id="dashboardDescription"
                v-model="dashboardDescription"
                rows="3"
                class="block w-full border border-gray-300 rounded-md focus:border-primary-500 focus:ring-primary-500 text-sm text-gray-900 bg-white px-3 py-2 transition placeholder-gray-400 resize-none"
                placeholder="Dashboard description"
              />
            </div>
          </div>

          <!-- Toggle Dashboard Tabs -->
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm text-gray-900">Show dashboard tabs</span>
            <label for="toggle-dashboard-tabs" class="flex items-center cursor-pointer select-none">
              <span class="relative">
                <input
                  id="toggle-dashboard-tabs"
                  type="checkbox"
                  v-model="showDashboardTabs"
                  @change="emit('toggle-dashboard-tabs', showDashboardTabs)"
                  class="sr-only peer"
                  :aria-checked="showDashboardTabs"
                />
                <span class="block w-10 h-6 bg-gray-200 rounded-full shadow-inner transition peer-checked:bg-primary-500"></span>
                <span class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-4"></span>
              </span>
            </label>
          </div>
        </div>
      </div>

      <!-- Data Sources Tab -->
      <div v-if="activeTab === 'data-sources'" class="flex-1">
        <div class="p-4 flex items-center justify-between">
          <h3 class="text-sm font-medium text-gray-700">Datasets</h3>
          <button
            @click="$emit('open-manager')"
            class="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Cog6ToothIcon class="h-4 w-4 mr-1" />
            Manage
          </button>
        </div>
        <div class="px-4 pb-4 space-y-2">
          <div v-for="ds in selectedDataSources" :key="ds.id" class="border rounded-lg overflow-hidden">
            <button
              @click="$emit('toggle-expand', ds.id)"
              @dblclick="openManageDataField(ds)"
              class="w-full px-3 py-2 flex items-center justify-between bg-gray-50 hover:bg-gray-100"
            >
              <span class="flex-1 min-w-0 text-sm font-medium text-gray-900 truncate text-left" :title="ds.name">{{ ds.name }}</span>
              <ChevronDownIcon
                class="h-5 w-5 text-gray-500 transform transition-transform"
                :class="{ 'rotate-180': expandedDataSources.includes(ds.id) }"
              />
            </button>
            <div v-if="expandedDataSources.includes(ds.id)" class="p-2 space-y-1">
              <!-- Normal fields -->
              <div
                v-for="column in ds.columns.filter(c => !c.isCustom)"
                :key="column.name"
                :draggable="true"
                @dragstart="$emit('field-drag', $event, column, ds.id)"
                class="flex items-center justify-between p-2 rounded cursor-move transition-colors duration-200 min-w-0"
                :class="{
                  'bg-primary-50': isFieldInUse(column.name, ds.id),
                  'bg-white hover:bg-gray-50': !isFieldInUse(column.name, ds.id)
                }"
              >
                <div class="flex items-center min-w-0">
                  <CheckIcon
                    v-if="isFieldInUse(column.name, ds.id)"
                    class="h-4 w-4 text-primary-600 mr-2"
                  />
                  <span class="text-sm font-medium text-gray-900 truncate flex-1 min-w-0 text-left" :title="column.name">{{ column.name }}</span>
                </div>
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
              <!-- Custom fields -->
              <div class="mt-2 border-t pt-2">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-semibold text-primary-700 cursor-pointer" @click="openManageDataField(ds)">Custom Fields</span>
                  <button @click="openCustomFieldModal(ds)" class="text-xs text-primary-600 hover:underline">+ Add</button>
                </div>
                <div v-for="column in ds.columns.filter(c => c.isCustom)" :key="column.name" class="flex items-center justify-between p-2 rounded mt-1">
                  <div class="flex items-center">
                    <CheckIcon
                      v-if="isFieldInUse(column.name, ds.id)"
                      class="h-4 w-4 text-primary-600 mr-2"
                    />
                    <span class="text-sm font-medium text-yellow-700 cursor-move" :draggable="true" @dragstart="$emit('field-drag', $event, column, ds.id)">{{ column.name }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <button @click="editCustomFieldModal(ds, column)" class="p-1 text-gray-500 hover:text-primary-600" title="Edit">
                      <PencilIcon class="h-4 w-4" />
                    </button>
                    <button @click="removeCustomFieldModal(ds, column)" class="p-1 text-red-500 hover:text-red-700" title="Remove">
                      <TrashIcon class="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tools Tab -->
      <div v-if="activeTab === 'tools'" class="p-4">
        <div class="text-center py-8">
          <div class="mx-auto h-12 w-12 text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
            </svg>
          </div>
          <h3 class="text-sm font-medium text-gray-900 mb-2">Dashboard Tools</h3>
          <p class="text-xs text-gray-500">
            Tools and utilities will be available here
          </p>
        </div>
      </div>
    </div>

    <!-- Data Source Manager Modal -->
    <DataSetModal
      :show="showDataSourceManager"
      :data-sources="dataSources"
      :selected-data-sources="tempSelectedDataSources"
      :search-query="searchQuery"
      :selected-category="selectedCategory"
      :current-page="currentPage"
      :items-per-page="itemsPerPage"
      @close="showDataSourceManager = false"
      @save="saveSelectedDataSources"
      @update:selectedDataSources="val => tempSelectedDataSources = val"
      @update:searchQuery="val => searchQuery = val"
      @update:selectedCategory="val => selectedCategory = val"
      @update:currentPage="val => currentPage = val"
    />

    <!-- Custom Field Modal -->
    <CustomFieldModal
      :show="showCustomFieldModal"
      :edit-mode="customFieldEditMode"
      :form="customFieldForm"
      @close="closeCustomFieldModal"
      @save="onCustomFieldModalSave"
    />

    <ManageDataField
      :show="showManageDataField"
      :data-fields="manageDataFieldDataFields"
      :custom-fields="manageDataFieldCustomFields"
      @close="showManageDataField = false"
      @add-custom="handleAddCustomField"
      @edit-custom="handleEditCustomField"
      @delete-custom="handleDeleteCustomField"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import {
  Cog6ToothIcon,
  ChevronDownIcon,
  CheckIcon,
  PencilIcon,
  TrashIcon,
  CircleStackIcon,
  InformationCircleIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useDataSourceStore } from '@/stores'
import type { DataSourceColumn } from '@/stores/modules/dataSource'
import ManageDataField from './ManageDataField.vue'
import CustomFieldModal from './CustomFieldModal.vue'
import DataSetModal from './DataSetModal.vue'

const props = defineProps<{
  selectedDataSources: Array<{ id: string; name: string; columns: DataSourceColumn[] }>
  expandedDataSources: string[]
  isFieldInUse: (fieldName: string, dataSourceId: string) => boolean
  width: number
  category?: string
  description?: string
  showDashboardTabs: boolean
}>()

const emit = defineEmits<{
  'open-manager': []
  'toggle-expand': [id: string]
  'field-drag': [event: DragEvent, column: DataSourceColumn, dataSourceId: string]
  'update-selected-data-sources': [dataSources: Array<{ id: string; name: string; columns: DataSourceColumn[] }>]
  'update-dashboard-info': [info: { category: string; description: string; saveAsTemplate: boolean }]
  'toggle-dashboard-tabs': [show: boolean]
}>()

const dataSourceStore = useDataSourceStore()
const { dataSources } = storeToRefs(dataSourceStore)
const { addCustomField, editCustomField, removeCustomField } = dataSourceStore

// Tab management
const activeTab = ref('overview')
const tabs = [
  { id: 'overview', name: 'Overview', icon: InformationCircleIcon },
  { id: 'data-sources', name: 'Data', icon: CircleStackIcon },
  { id: 'tools', name: 'Tools', icon: WrenchScrewdriverIcon }
]

// Overview tab state
const dashboardCategory = ref(props.category || '')
const dashboardDescription = ref(props.description || '')
// Keep local refs in sync with props
watch(() => props.category, (val) => { dashboardCategory.value = val || '' })
watch(() => props.description, (val) => { dashboardDescription.value = val || '' })
const showDashboardTabs = ref(props.showDashboardTabs)
watch(() => props.showDashboardTabs, (val) => { showDashboardTabs.value = val })

// Watch for changes and emit to parent
const emitDashboardInfo = () => {
  console.log('emitDashboardInfo', dashboardCategory.value);
  emit('update-dashboard-info', {
    category: dashboardCategory.value,
    description: dashboardDescription.value,
    saveAsTemplate: false
  })
}

watch(
  [dashboardCategory, dashboardDescription],
  () => {
    emitDashboardInfo();
  }
);

// Data source manager modal state
const showDataSourceManager = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(4)
const tempSelectedDataSources = ref<Array<{ id: string; name: string; columns: DataSourceColumn[] }>>([])

// Custom field modal state
const showCustomFieldModal = ref(false)
const customFieldForm = ref({ name: '', expression: '', type: 'number' })
const customFieldEditMode = ref(false)
let customFieldTargetDataSource: any = null
let customFieldOriginalName = ''

// Modal state for ManageDataField
const showManageDataField = ref(false)
const manageDataFieldDataFields = ref<any[]>([])
const manageDataFieldCustomFields = ref<any[]>([])

// Computed properties for data source manager
const availableCategories = computed(() => {
  const categories = new Set<string>()
  if (dataSources.value) {
    dataSources.value.forEach(ds => {
      categories.add(ds.category || 'General')
    })
  }
  return Array.from(categories).sort()
})

const filteredDataSources = computed(() => {
  let filtered = dataSources.value || []

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(ds =>
      ds.name.toLowerCase().includes(query) ||
      ds.id.toLowerCase().includes(query)
    )
  }

  // Apply category filter
  if (selectedCategory.value) {
    filtered = filtered.filter(ds => (ds.category || 'General') === selectedCategory.value)
  }

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredDataSources.value.length / itemsPerPage.value)
})

const paginatedDataSources = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredDataSources.value.slice(start, end)
})

const paginationInfo = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value + 1
  const end = Math.min(currentPage.value * itemsPerPage.value, filteredDataSources.value.length)
  const total = filteredDataSources.value.length
  return `${start} - ${end} of ${total} items`
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  // Show up to 5 pages around current page
  const start = Math.max(1, current - 2)
  const end = Math.min(total, current + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const isAllSelected = computed(() => {
  return paginatedDataSources.value.length > 0 && 
         paginatedDataSources.value.every(ds => isDataSourceSelected(ds))
})

// Data source manager methods
const openDataSourceManager = () => {
  showDataSourceManager.value = true
  tempSelectedDataSources.value = [...props.selectedDataSources]
  searchQuery.value = ''
  selectedCategory.value = ''
  currentPage.value = 1
}

const isDataSourceSelected = (dataSource: any) => {
  return tempSelectedDataSources.value.some(ds => ds.id === dataSource.id)
}

const toggleDataSource = (dataSource: any) => {
  const index = tempSelectedDataSources.value.findIndex(ds => ds.id === dataSource.id)
  if (index === -1) {
    tempSelectedDataSources.value.push(dataSource)
  } else {
    tempSelectedDataSources.value.splice(index, 1)
  }
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    // Deselect all visible items
    paginatedDataSources.value.forEach(ds => {
      const index = tempSelectedDataSources.value.findIndex(selected => selected.id === ds.id)
      if (index !== -1) {
        tempSelectedDataSources.value.splice(index, 1)
      }
    })
  } else {
    // Select all visible items
    paginatedDataSources.value.forEach(ds => {
      if (!isDataSourceSelected(ds)) {
        tempSelectedDataSources.value.push(ds)
      }
    })
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const saveSelectedDataSources = () => {
  emit('update-selected-data-sources', tempSelectedDataSources.value)
  showDataSourceManager.value = false
}

// Custom field modal methods
function openCustomFieldModal(ds: any) {
  showCustomFieldModal.value = true
  customFieldEditMode.value = false
  customFieldForm.value = { name: '', expression: '', type: 'number' }
  customFieldTargetDataSource = ds
  customFieldOriginalName = ''
}

function editCustomFieldModal(ds: any, column: any) {
  showCustomFieldModal.value = true
  customFieldEditMode.value = true
  customFieldForm.value = { name: column.name, expression: column.expression || '', type: column.type }
  customFieldTargetDataSource = ds
  customFieldOriginalName = column.name
}

function closeCustomFieldModal() {
  showCustomFieldModal.value = false
  customFieldTargetDataSource = null
  customFieldOriginalName = ''
}

function saveCustomField() {
  if (!customFieldTargetDataSource) return
  if (!customFieldForm.value.name || !customFieldForm.value.expression) return
  if (customFieldEditMode.value) {
    editCustomField(customFieldTargetDataSource, customFieldOriginalName, customFieldForm.value.name, customFieldForm.value.expression, customFieldForm.value.type as 'string' | 'number' | 'date')
  } else {
    addCustomField(customFieldTargetDataSource, customFieldForm.value.name, customFieldForm.value.expression, customFieldForm.value.type as 'string' | 'number' | 'date')
  }
  closeCustomFieldModal()
}

function removeCustomFieldModal(ds: any, column: any) {
  removeCustomField(ds, column.name)
}

function openManageDataField(ds: any) {
  // Separate normal and custom fields
  manageDataFieldDataFields.value = ds.columns.filter((c: any) => !c.isCustom).map((c: any, idx: number) => ({ id: idx + 1, name: c.name, type: c.type }))
  manageDataFieldCustomFields.value = ds.columns.filter((c: any) => c.isCustom).map((c: any, idx: number) => ({ id: idx + 1, name: c.name, expression: c.expression, type: c.type }))
  showManageDataField.value = true
}

function handleAddCustomField() {
  // You can open your custom field modal here, or emit to parent
  // For now, just close the manage modal
  showManageDataField.value = false
}

function handleEditCustomField(field: any) {
  // You can open your custom field modal here, or emit to parent
  // For now, just close the manage modal
  showManageDataField.value = false
}

function handleDeleteCustomField(field: any) {
  // You can handle delete logic here, or emit to parent
  // For now, just close the manage modal
  showManageDataField.value = false
}

// Handler for save event from CustomFieldModal
function onCustomFieldModalSave(field: { name: string; expression: string; type: string }) {
  customFieldForm.value = { ...field }
  saveCustomField()
}

// Expose the openDataSourceManager method to parent
defineExpose({
  openDataSourceManager
})
</script>