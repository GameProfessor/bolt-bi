<template>
  <div class="bg-white border-r border-gray-200 flex flex-col" :style="{ minWidth: '180px', maxWidth: '400px', width: width + 'px' }">
    <!-- Enhanced Tab Navigation -->
    <div class="bg-gray-50 border-b border-gray-200 p-2">
      <div class="bg-white rounded-lg p-1 shadow-sm">
        <nav class="flex space-x-1" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'flex-1 flex items-center justify-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-200 relative group',
              activeTab === tab.id
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            ]"
            :title="tab.name"
          >
            <component 
              :is="tab.icon" 
              :class="[
                'h-5 w-5 transition-transform duration-200',
                activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'
              ]" 
            />
            <!-- Active indicator -->
            <div 
              v-if="activeTab === tab.id"
              class="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"
            ></div>
          </button>
        </nav>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="flex-1 overflow-y-auto">
      <!-- Overview Tab -->
      <div v-if="activeTab === 'overview'" class="p-6">
        <div class="text-center py-8">
          <div class="mx-auto h-16 w-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-8 w-8 text-primary-600">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0018 16.5h-2.25m-2.25 0h2.25m-2.25 0h2.25m0 0v-1.5m0 1.5h-1.5m1.5 0v-1.5m0 1.5H9.75m0 0H7.5m2.25 0v-1.5m0 1.5H9.75" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Dashboard Overview</h3>
          <p class="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
            Get insights about your dashboard performance and data sources
          </p>
          <div class="mt-6 space-y-3">
            <div class="bg-gray-50 rounded-lg p-3 text-left">
              <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-gray-600">Charts Created</span>
                <span class="text-sm font-semibold text-gray-900">0</span>
              </div>
            </div>
            <div class="bg-gray-50 rounded-lg p-3 text-left">
              <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-gray-600">Data Sources</span>
                <span class="text-sm font-semibold text-gray-900">{{ selectedDataSources.length }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Sources Tab -->
      <div v-if="activeTab === 'data-sources'">
        <div class="p-4 border-b border-gray-100 bg-gray-50">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="h-8 w-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                <CircleStackIcon class="h-4 w-4 text-primary-600" />
              </div>
              <h3 class="text-sm font-semibold text-gray-900">Data Sources</h3>
            </div>
            <button
              @click="$emit('open-manager')"
              class="inline-flex items-center px-2.5 py-1.5 text-xs font-medium rounded-lg text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              <Cog6ToothIcon class="h-3.5 w-3.5 mr-1" />
              Manage
            </button>
          </div>
        </div>
        
        <div class="p-4 space-y-3">
          <div v-if="selectedDataSources.length === 0" class="text-center py-8">
            <div class="mx-auto h-12 w-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
              <CircleStackIcon class="h-6 w-6 text-gray-400" />
            </div>
            <p class="text-sm text-gray-500 mb-3">No data sources selected</p>
            <button
              @click="$emit('open-manager')"
              class="inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors duration-200"
            >
              <Cog6ToothIcon class="h-3.5 w-3.5 mr-1" />
              Select Data Sources
            </button>
          </div>
          
          <div v-for="ds in selectedDataSources" :key="ds.id" class="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
            <button
              @click="$emit('toggle-expand', ds.id)"
              class="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200"
            >
              <div class="flex items-center">
                <div class="h-8 w-8 bg-white rounded-lg shadow-sm flex items-center justify-center mr-3">
                  <CircleStackIcon class="h-4 w-4 text-gray-600" />
                </div>
                <span class="text-sm font-semibold text-gray-900">{{ ds.name }}</span>
              </div>
              <ChevronDownIcon
                class="h-5 w-5 text-gray-500 transform transition-transform duration-200"
                :class="{ 'rotate-180': expandedDataSources.includes(ds.id) }"
              />
            </button>
            
            <div v-if="expandedDataSources.includes(ds.id)" class="p-3 bg-white space-y-2">
              <!-- Normal fields -->
              <div
                v-for="column in ds.columns.filter(c => !c.isCustom)"
                :key="column.name"
                :draggable="true"
                @dragstart="$emit('field-drag', $event, column, ds.id)"
                class="flex items-center justify-between p-3 rounded-lg cursor-move transition-all duration-200 border"
                :class="{
                  'bg-primary-50 border-primary-200 shadow-sm': isFieldInUse(column.name, ds.id),
                  'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300': !isFieldInUse(column.name, ds.id)
                }"
              >
                <div class="flex items-center">
                  <div 
                    v-if="isFieldInUse(column.name, ds.id)"
                    class="h-5 w-5 bg-primary-600 rounded-full flex items-center justify-center mr-3"
                  >
                    <CheckIcon class="h-3 w-3 text-white" />
                  </div>
                  <div 
                    v-else
                    class="h-5 w-5 bg-gray-300 rounded-full mr-3 flex items-center justify-center"
                  >
                    <div class="h-2 w-2 bg-white rounded-full"></div>
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{ column.name }}</span>
                </div>
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
                  :class="{
                    'bg-blue-100 text-blue-800': column.type === 'number',
                    'bg-green-100 text-green-800': column.type === 'date',
                    'bg-gray-100 text-gray-800': column.type === 'string'
                  }"
                >
                  {{ column.type }}
                </span>
              </div>
              
              <!-- Custom fields section -->
              <div v-if="ds.columns.some(c => c.isCustom) || true" class="mt-4 pt-3 border-t border-gray-200">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center">
                    <div class="h-6 w-6 bg-yellow-100 rounded-lg flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-3.5 w-3.5 text-yellow-600">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                    <span class="text-xs font-semibold text-yellow-700">Custom Fields</span>
                  </div>
                  <button 
                    @click="openCustomFieldModal(ds)" 
                    class="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100 transition-colors duration-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-3 w-3 mr-1">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add
                  </button>
                </div>
                
                <div v-for="column in ds.columns.filter(c => c.isCustom)" :key="column.name" class="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200 mb-2">
                  <div class="flex items-center">
                    <div 
                      v-if="isFieldInUse(column.name, ds.id)"
                      class="h-5 w-5 bg-yellow-600 rounded-full flex items-center justify-center mr-3"
                    >
                      <CheckIcon class="h-3 w-3 text-white" />
                    </div>
                    <div 
                      v-else
                      class="h-5 w-5 bg-yellow-300 rounded-full mr-3 flex items-center justify-center"
                    >
                      <div class="h-2 w-2 bg-white rounded-full"></div>
                    </div>
                    <span 
                      class="text-sm font-medium text-yellow-800 cursor-move" 
                      :draggable="true" 
                      @dragstart="$emit('field-drag', $event, column, ds.id)"
                    >
                      {{ column.name }}
                    </span>
                  </div>
                  <div class="flex items-center gap-1">
                    <button 
                      @click="editCustomFieldModal(ds, column)" 
                      class="p-1.5 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded-md transition-colors duration-200" 
                      title="Edit"
                    >
                      <PencilIcon class="h-3.5 w-3.5" />
                    </button>
                    <button 
                      @click="removeCustomFieldModal(ds, column)" 
                      class="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200" 
                      title="Remove"
                    >
                      <TrashIcon class="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Custom Field Modal -->
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
          <div class="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
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
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                <!-- Modal Header -->
                <div class="bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-4">
                  <div class="flex items-center">
                    <div class="h-10 w-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-5 w-5 text-white">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                      </svg>
                    </div>
                    <DialogTitle as="h3" class="text-lg font-semibold text-white">
                      {{ customFieldEditMode ? 'Edit Custom Field' : 'Create Custom Field' }}
                    </DialogTitle>
                  </div>
                </div>

                <!-- Modal Content -->
                <div class="p-6 space-y-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-900 mb-2">Field Name</label>
                    <input 
                      v-model="customFieldForm.name" 
                      type="text" 
                      class="w-full rounded-lg border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 text-sm"
                      placeholder="Enter field name"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-900 mb-2">Expression</label>
                    <input 
                      v-model="customFieldForm.expression" 
                      type="text" 
                      class="w-full rounded-lg border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 text-sm" 
                      placeholder="e.g. revenue - cost" 
                    />
                    <p class="text-xs text-gray-500 mt-2 bg-gray-50 rounded-lg p-2">
                      <strong>Tip:</strong> Use existing field names as variables. Example: <span class="font-mono bg-white px-1 rounded">revenue - cost</span>
                    </p>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-900 mb-2">Data Type</label>
                    <select 
                      v-model="customFieldForm.type" 
                      class="w-full rounded-lg border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 text-sm"
                    >
                      <option value="number">Number</option>
                      <option value="string">String</option>
                      <option value="date">Date</option>
                    </select>
                  </div>
                </div>

                <!-- Modal Actions -->
                <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                  <button 
                    @click="closeCustomFieldModal" 
                    class="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button 
                    @click="saveCustomField" 
                    class="px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 font-medium text-sm transition-colors duration-200"
                  >
                    {{ customFieldEditMode ? 'Update Field' : 'Create Field' }}
                  </button>
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
  CircleStackIcon,
  InformationCircleIcon
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
  { id: 'overview', name: 'Overview', icon: InformationCircleIcon },
  { id: 'data-sources', name: 'Data Sources', icon: CircleStackIcon }
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