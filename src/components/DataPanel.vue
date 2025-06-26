<template>
  <div class="bg-white border-r border-gray-200 flex flex-col" :style="{ minWidth: '180px', maxWidth: '400px', width: width + 'px' }">
    <!-- Tab Navigation -->
    <div class="border-b border-gray-200">
      <nav class="flex space-x-8 px-4" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200',
            activeTab === tab.id
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          <component :is="tab.icon" class="h-4 w-4 mr-2 inline" />
          {{ tab.name }}
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="flex-1 overflow-y-auto">
      <!-- Overview Tab -->
      <div v-if="activeTab === 'overview'" class="p-4">
        <div class="text-center py-8">
          <div class="mx-auto h-12 w-12 text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0018 16.5h-2.25m-2.25 0h2.25m-2.25 0h2.25m0 0v-1.5m0 1.5h-1.5m1.5 0v-1.5m0 1.5H9.75m0 0H7.5m2.25 0v-1.5m0 1.5H9.75" />
            </svg>
          </div>
          <h3 class="text-sm font-medium text-gray-900 mb-2">Dashboard Overview</h3>
          <p class="text-xs text-gray-500">
            Overview content will be available here
          </p>
        </div>
      </div>

      <!-- Data Sources Tab -->
      <div v-if="activeTab === 'data-sources'">
        <div class="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-sm font-medium text-gray-700">Data Sources</h3>
          <button
            @click="$emit('open-manager')"
            class="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Cog6ToothIcon class="h-4 w-4 mr-1" />
            Manage
          </button>
        </div>
        <div class="p-4 space-y-2">
          <div v-for="ds in selectedDataSources" :key="ds.id" class="border rounded-lg overflow-hidden">
            <button
              @click="$emit('toggle-expand', ds.id)"
              class="w-full px-3 py-2 flex items-center justify-between bg-gray-50 hover:bg-gray-100"
            >
              <span class="text-sm font-medium text-gray-900">{{ ds.name }}</span>
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
                class="flex items-center justify-between p-2 rounded cursor-move transition-colors duration-200"
                :class="{
                  'bg-primary-50': isFieldInUse(column.name, ds.id),
                  'bg-white hover:bg-gray-50': !isFieldInUse(column.name, ds.id)
                }"
              >
                <div class="flex items-center">
                  <CheckIcon
                    v-if="isFieldInUse(column.name, ds.id)"
                    class="h-4 w-4 text-primary-600 mr-2"
                  />
                  <span class="text-sm font-medium text-gray-900">{{ column.name }}</span>
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
                  <span class="text-xs font-semibold text-primary-700">Custom Fields</span>
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
    </div>

    <!-- Custom Field Modal -->
    <TransitionRoot appear :show="showCustomFieldModal" as="template">
      <Dialog as="div" @close="closeCustomFieldModal" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  {{ customFieldEditMode ? 'Edit Custom Field' : 'Add Custom Field' }}
                </DialogTitle>
                <div class="mt-4 space-y-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Field Name</label>
                    <input v-model="customFieldForm.name" type="text" class="w-full rounded border-gray-300 text-sm" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Expression</label>
                    <input v-model="customFieldForm.expression" type="text" class="w-full rounded border-gray-300 text-sm" placeholder="e.g. revenue - cost" />
                    <p class="text-xs text-gray-500 mt-1">Use existing field names as variables. Example: <span class="font-mono">revenue - cost</span></p>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Type</label>
                    <select v-model="customFieldForm.type" class="w-full rounded border-gray-300 text-sm">
                      <option value="number">Number</option>
                      <option value="string">String</option>
                      <option value="date">Date</option>
                    </select>
                  </div>
                </div>
                <div class="mt-6 flex justify-end gap-2">
                  <button @click="closeCustomFieldModal" class="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200">Cancel</button>
                  <button @click="saveCustomField" class="px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700">Save</button>
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
import { ref } from 'vue'
import { 
  Cog6ToothIcon, 
  ChevronDownIcon, 
  CheckIcon, 
  PencilIcon, 
  TrashIcon,
  TableCellsIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useDataSourceStore, type DataSourceColumn } from '../stores/dataSource'

defineProps<{
  selectedDataSources: Array<{ id: string; name: string; columns: DataSourceColumn[] }>
  expandedDataSources: string[]
  isFieldInUse: (fieldName: string, dataSourceId: string) => boolean
  width: number
}>()

const { addCustomField, editCustomField, removeCustomField } = useDataSourceStore()

// Tab management
const activeTab = ref('overview')
const tabs = [
  { id: 'overview', name: 'Overview', icon: ChartBarIcon },
  { id: 'data-sources', name: 'Data Sources', icon: TableCellsIcon }
]

// Custom field modal state
const showCustomFieldModal = ref(false)
const customFieldForm = ref({ name: '', expression: '', type: 'number' })
const customFieldEditMode = ref(false)
let customFieldTargetDataSource: any = null
let customFieldOriginalName = ''

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
</script>