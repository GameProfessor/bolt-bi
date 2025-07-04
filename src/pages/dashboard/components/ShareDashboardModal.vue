<template>
  <TransitionRoot :show="show" as="template">
    <Dialog @close="$emit('close')" class="relative">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 z-[9999] bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>
      <div class="fixed inset-0 z-[9999] overflow-y-auto">
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
            <DialogPanel class="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <!-- Header -->
              <div class="flex items-center justify-between mb-6 px-4 pt-5">
                <div>
                  <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                    Share Dashboard
                  </DialogTitle>
                  <p class="text-sm text-gray-500 mt-1">
                    Add users or groups to share this dashboard
                  </p>
                </div>
                <button
                  @click="$emit('close')"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon class="h-6 w-6" />
                </button>
              </div>
              <!-- Search -->
              <div class="px-4 pb-4 max-h-[70vh] overflow-y-auto">
                <div class="relative mb-4">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search users or groups..."
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <!-- Search Results (show many) -->
                <div class="mb-4">
                  <div v-if="searchQuery && filteredResults.length === 0" class="p-3 text-center text-gray-500 text-sm">
                    No users or groups found
                  </div>
                  <div v-else-if="searchQuery && filteredResults.length > 0">
                    <div v-for="item in filteredResults" :key="item.type + '-' + item.id" class="flex items-center p-2 bg-white border border-gray-200 rounded-md mb-2">
                      <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                        {{ item.type === 'user' ? 'User' : 'Group' }}
                      </span>
                      <span class="flex-1 min-w-0 truncate text-xs">{{ item.name }}</span>
                      <select v-model="permissionSelections[item.type + '-' + item.id]" class="ml-2 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500">
                        <option value="viewer">Viewer</option>
                        <option value="designer">Designer</option>
                      </select>
                      <button @click="addToShareListWithPermission(item, permissionSelections[item.type + '-' + item.id] || 'viewer')" class="ml-2 px-2 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200 text-xs">Add</button>
                    </div>
                  </div>
                  <div v-else class="p-3 text-center text-gray-500 text-sm">
                    Type to search
                  </div>
                </div>
                <!-- Share List -->
                <div class="mb-2 text-sm text-gray-700 font-medium">{{ shareListState.length }} shared</div>
                <div class="max-h-80 overflow-y-auto border border-gray-200 rounded-md bg-white">
                  <div v-if="shareListState.length === 0" class="p-3 text-center text-gray-500 text-sm">
                    No users or groups shared yet.
                  </div>
                  <div v-for="item in shareListState" :key="item.type + '-' + item.id" class="flex items-center p-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                    <span class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                      {{ item.type === 'user' ? 'User' : 'Group' }}
                    </span>
                    <span class="flex-1 min-w-0 truncate text-xs">{{ item.name }}</span>
                    <select v-model="item.permission" class="ml-2 px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary-500">
                      <option value="viewer">Viewer</option>
                      <option value="designer">Designer</option>
                    </select>
                    <button @click="removeFromShareList(item)" class="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs">Remove</button>
                  </div>
                </div>
              </div>
              <!-- Action Buttons -->
              <div class="flex justify-end space-x-3 px-4 py-3 bg-gray-50 border-t border-gray-200">
                <button
                  type="button"
                  @click="$emit('close')"
                  class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  @click="saveShareList"
                  class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-sm"
                >
                  Save
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
import { ref, computed, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import type { User, UserGroup } from '@/types/user'

interface ShareItem {
  id: string
  type: 'user' | 'group'
  name: string
  permission: 'viewer' | 'designer'
}

const props = defineProps<{
  show: boolean
  users: User[]
  groups: UserGroup[]
  shareList: ShareItem[]
}>()
const emit = defineEmits(['close', 'save'])

const searchQuery = ref('')
const shareListState = ref<ShareItem[]>([...props.shareList])
const permissionSelections = ref<Record<string, 'viewer' | 'designer'>>({})

watch(() => props.shareList, (newList) => {
  shareListState.value = [...newList]
})

const filteredResults = computed(() => {
  const query = searchQuery.value.toLowerCase()
  if (!query) return []
  const userResults = props.users
    .filter(u =>
      u.fullName?.toLowerCase().includes(query) ||
      u.username.toLowerCase().includes(query)
    )
    .map(u => ({ id: u.id, type: 'user' as const, name: u.fullName || u.username, permission: 'viewer' as const }))
  const groupResults = props.groups
    .filter(g =>
      g.name.toLowerCase().includes(query) ||
      (g.description && g.description.toLowerCase().includes(query))
    )
    .map(g => ({ id: g.id, type: 'group' as const, name: g.name, permission: 'viewer' as const }))
  // Exclude already shared
  return [...userResults, ...groupResults].filter(item =>
    !shareListState.value.some(s => s.id === item.id && s.type === item.type)
  )
})

watch(filteredResults, (results) => {
  results.forEach(item => {
    const key = item.type + '-' + item.id
    if (!permissionSelections.value[key]) {
      permissionSelections.value[key] = 'viewer'
    }
  })
})

function addToShareListWithPermission(item: ShareItem, permission: 'viewer' | 'designer' = 'viewer') {
  shareListState.value.push({ ...item, permission: permission || 'viewer' })
  // Remove from permissionSelections
  delete permissionSelections.value[item.type + '-' + item.id]
  searchQuery.value = ''
}
function removeFromShareList(item: ShareItem) {
  shareListState.value = shareListState.value.filter(s => !(s.id === item.id && s.type === item.type))
}
function saveShareList() {
  emit('save', shareListState.value)
}
</script> 