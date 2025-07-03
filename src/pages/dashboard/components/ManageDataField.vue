<template>
  <TransitionRoot :show="show" as="template">
    <Dialog @close="$emit('close')" class="relative z-[1000]">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />
      </TransitionChild>
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
              <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  Manage Data Fields
                </DialogTitle>
                <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
                  <XMarkIcon class="h-6 w-6" />
                </button>
              </div>
              <div class="px-6 pt-4">
                <div class="flex border-b mb-4">
                  <button
                    class="px-4 py-2 text-sm font-medium focus:outline-none"
                    :class="activeTab === 'fields' ? 'border-b-2 border-primary-600 text-primary-700' : 'text-gray-500'"
                    @click="activeTab = 'fields'"
                  >
                    Data Fields
                  </button>
                  <button
                    class="ml-4 px-4 py-2 text-sm font-medium focus:outline-none"
                    :class="activeTab === 'custom' ? 'border-b-2 border-primary-600 text-primary-700' : 'text-gray-500'"
                    @click="activeTab = 'custom'"
                  >
                    Custom Fields
                  </button>
                </div>
                <div class="h-[400px]">
                  <div v-if="activeTab === 'fields'" class="h-full flex flex-col">
                    <div class="flex-1 overflow-y-auto">
                      <table class="min-w-full divide-y divide-gray-200 mb-4">
                        <thead class="bg-gray-50">
                          <tr>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data Type</th>
                          </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                          <tr v-for="field in dataFields" :key="field.id">
                            <td class="px-4 py-2 text-sm text-gray-900">{{ field.id }}</td>
                            <td class="px-4 py-2 text-sm text-gray-900">{{ field.name }}</td>
                            <td class="px-4 py-2 text-sm text-gray-900">{{ field.type }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div v-else class="h-full flex flex-col">
                    <div class="flex justify-end mb-2">
                      <button
                        @click="startAdd"
                        v-if="!adding"
                        class="px-3 py-1 bg-primary-600 text-white text-xs rounded hover:bg-primary-700 flex items-center"
                      >
                        <PlusIcon class="h-4 w-4 mr-1" /> Add Custom Field
                      </button>
                    </div>
                    <div class="flex-1 overflow-y-auto">
                      <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                          <tr>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Expression</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data Type</th>
                            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                          </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                          <tr v-if="adding">
                            <td class="px-4 py-2 text-sm text-gray-900">—</td>
                            <td class="px-4 py-2 text-sm">
                              <input
                                v-model="editForm.name"
                                ref="addNameInput"
                                class="w-full border border-gray-300 rounded px-2 py-1"
                                placeholder="Name"
                              />
                            </td>
                            <td class="px-4 py-2 text-sm">
                              <input v-model="editForm.expression" class="w-full border border-gray-300 rounded px-2 py-1" placeholder="Expression" />
                            </td>
                            <td class="px-4 py-2 text-sm">
                              <select v-model="editForm.type" class="w-full border border-gray-300 rounded px-2 py-1">
                                <option value="number">Number</option>
                                <option value="string">String</option>
                                <option value="date">Date</option>
                              </select>
                            </td>
                            <td class="px-4 py-2 text-sm flex items-center gap-2">
                              <button @click="saveAdd" class="text-primary-600 hover:text-primary-800" title="Save"><CheckIcon class="h-5 w-5" /></button>
                              <button @click="cancelEdit" class="text-gray-400 hover:text-red-600" title="Cancel"><CancelIcon class="h-5 w-5" /></button>
                            </td>
                          </tr>
                          <tr v-for="field in customFields" :key="field.id">
                            <template v-if="editingId === field.id">
                              <td class="px-4 py-2 text-sm text-gray-900">{{ field.id }}</td>
                              <td class="px-4 py-2 text-sm">
                                <input v-model="editForm.name" class="w-full border border-gray-300 rounded px-2 py-1" />
                              </td>
                              <td class="px-4 py-2 text-sm">
                                <input v-model="editForm.expression" class="w-full border border-gray-300 rounded px-2 py-1" />
                              </td>
                              <td class="px-4 py-2 text-sm">
                                <select v-model="editForm.type" class="w-full border border-gray-300 rounded px-2 py-1">
                                  <option value="number">Number</option>
                                  <option value="string">String</option>
                                  <option value="date">Date</option>
                                </select>
                              </td>
                              <td class="px-4 py-2 text-sm flex items-center gap-2">
                                <button @click="saveEdit(field)" class="text-primary-600 hover:text-primary-800" title="Save"><CheckIcon class="h-5 w-5" /></button>
                                <button @click="cancelEdit" class="text-gray-400 hover:text-red-600" title="Cancel"><CancelIcon class="h-5 w-5" /></button>
                              </td>
                            </template>
                            <template v-else>
                              <td class="px-4 py-2 text-sm text-gray-900">{{ field.id }}</td>
                              <td class="px-4 py-2 text-sm text-gray-900">{{ field.name }}</td>
                              <td class="px-4 py-2 text-sm text-gray-900">{{ field.expression }}</td>
                              <td class="px-4 py-2 text-sm text-gray-900">{{ field.type }}</td>
                              <td class="px-4 py-2 text-sm flex items-center gap-2">
                                <button @click="startEdit(field)" class="text-gray-600 hover:text-primary-700" title="Edit"><PencilIcon class="h-5 w-5" /></button>
                                <button @click="remove(field)" class="text-red-600 hover:text-red-800" title="Delete"><TrashIcon class="h-5 w-5" /></button>
                              </td>
                            </template>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div class="px-6 py-4 border-t border-gray-200 flex justify-end">
                <button @click="$emit('close')" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Close
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon as CancelIcon, PlusIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  show: boolean
  dataFields: Array<{ id: string; name: string; type: string }>
  customFields: Array<{ id: string; name: string; expression: string; type: string }>
}>()
const emit = defineEmits(['close', 'add-custom', 'edit-custom', 'delete-custom', 'refresh-custom-fields'])

const activeTab = ref<'fields' | 'custom'>('fields')

// Inline editing/adding state
const editingId = ref<string | null>(null)
const adding = ref(false)
const editForm = ref({ name: '', expression: '', type: 'number' })
const addNameInput = ref<HTMLInputElement | null>(null)

function startAdd() {
  adding.value = true
  editForm.value = { name: '', expression: '', type: 'number' }
  editingId.value = null
}
function startEdit(field: any) {
  editingId.value = field.id
  adding.value = false
  editForm.value = { name: field.name, expression: field.expression, type: field.type }
}
function cancelEdit() {
  editingId.value = null
  adding.value = false
}
function saveEdit(field: any) {
  emit('edit-custom', { ...editForm.value, id: field.id })
  editingId.value = null
  emit('refresh-custom-fields')
}
function saveAdd() {
  emit('add-custom', { ...editForm.value })
  editForm.value = { name: '', expression: '', type: 'number' }
  adding.value = true
  emit('refresh-custom-fields')
  nextTick(() => {
    addNameInput.value?.focus()
  })
}
function remove(field: any) {
  emit('delete-custom', field)
  emit('refresh-custom-fields')
}
</script> 