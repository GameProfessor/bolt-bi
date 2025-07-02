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
            <DialogPanel class="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
              <!-- Header -->
              <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div>
                  <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                    Manage Group Members
                  </DialogTitle>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ group?.name }} - {{ currentMembers.length }} members
                  </p>
                </div>
                <button
                  @click="$emit('close')"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon class="h-6 w-6" />
                </button>
              </div>

              <!-- Content -->
              <div class="px-6 py-4">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <!-- Current Members -->
                  <div>
                    <div class="flex items-center justify-between mb-4">
                      <h4 class="text-sm font-medium text-gray-900">Current Members</h4>
                      <span class="text-sm text-gray-500">{{ currentMembers.length }} users</span>
                    </div>
                    
                    <!-- Search Current Members -->
                    <div class="relative mb-4">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon class="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        v-model="currentMembersSearch"
                        type="text"
                        placeholder="Search current members..."
                        class="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
                      />
                    </div>

                    <!-- Current Members List -->
                    <div class="border border-gray-200 rounded-md bg-white max-h-80 overflow-y-auto">
                      <div v-if="filteredCurrentMembers.length === 0" class="p-4 text-center text-gray-500 text-sm">
                        {{ currentMembersSearch ? 'No members found' : 'No members in this group' }}
                      </div>
                      <div
                        v-for="user in filteredCurrentMembers"
                        :key="user.id"
                        class="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div class="flex items-center min-w-0 flex-1">
                          <div class="flex-shrink-0 h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <UserIcon class="h-4 w-4 text-primary-600" />
                          </div>
                          <div class="ml-3 min-w-0 flex-1">
                            <div class="text-sm font-medium text-gray-900 truncate">{{ user.fullName || user.username }}</div>
                            <div class="text-xs text-gray-500 truncate">{{ user.role }} • {{ user.email || user.username }}</div>
                          </div>
                        </div>
                        <button
                          @click="removeMember(user.id)"
                          class="ml-2 p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                          title="Remove from group"
                        >
                          <XMarkIcon class="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- Available Users -->
                  <div>
                    <div class="flex items-center justify-between mb-4">
                      <h4 class="text-sm font-medium text-gray-900">Available Users</h4>
                      <span class="text-sm text-gray-500">{{ availableUsers.length }} users</span>
                    </div>
                    
                    <!-- Search Available Users -->
                    <div class="relative mb-4">
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon class="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        v-model="availableUsersSearch"
                        type="text"
                        placeholder="Search available users..."
                        class="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
                      />
                    </div>

                    <!-- Available Users List -->
                    <div class="border border-gray-200 rounded-md bg-white max-h-80 overflow-y-auto">
                      <div v-if="filteredAvailableUsers.length === 0" class="p-4 text-center text-gray-500 text-sm">
                        {{ availableUsersSearch ? 'No users found' : 'No available users' }}
                      </div>
                      <div
                        v-for="user in filteredAvailableUsers"
                        :key="user.id"
                        class="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div class="flex items-center min-w-0 flex-1">
                          <div class="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <UserIcon class="h-4 w-4 text-gray-600" />
                          </div>
                          <div class="ml-3 min-w-0 flex-1">
                            <div class="text-sm font-medium text-gray-900 truncate">{{ user.fullName || user.username }}</div>
                            <div class="text-xs text-gray-500 truncate">{{ user.role }} • {{ user.email || user.username }}</div>
                          </div>
                        </div>
                        <button
                          @click="addMember(user.id)"
                          class="ml-2 p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                          title="Add to group"
                        >
                          <PlusIcon class="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Bulk Actions -->
                <div class="mt-6 pt-4 border-t border-gray-200">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                      <button
                        @click="selectAllAvailable"
                        :disabled="filteredAvailableUsers.length === 0"
                        class="text-sm text-primary-600 hover:text-primary-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        Add All Visible
                      </button>
                      <button
                        @click="removeAllMembers"
                        :disabled="currentMembers.length === 0"
                        class="text-sm text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        Remove All Members
                      </button>
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ pendingChanges }} pending changes
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="flex justify-end space-x-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
                <button
                  type="button"
                  @click="$emit('close')"
                  class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  @click="saveChanges"
                  :disabled="pendingChanges === 0"
                  class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Changes ({{ pendingChanges }})
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
import { 
  XMarkIcon, 
  UserIcon, 
  MagnifyingGlassIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'
import type { User, UserGroup } from '@/types/user'

interface Props {
  show: boolean
  group?: UserGroup | null
  users: User[]
}

interface Emits {
  close: []
  save: [groupId: string, userIds: string[]]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const currentMembersSearch = ref('')
const availableUsersSearch = ref('')
const tempMemberIds = ref<string[]>([])

// Initialize temp member IDs when group changes
watch(() => props.group, (group) => {
  if (group) {
    tempMemberIds.value = [...group.userIds]
  } else {
    tempMemberIds.value = []
  }
}, { immediate: true })

// Current members (users in the group)
const currentMembers = computed(() => {
  if (!props.group) return []
  return props.users.filter(user => tempMemberIds.value.includes(user.id))
})

// Available users (users not in the group)
const availableUsers = computed(() => {
  return props.users.filter(user => !tempMemberIds.value.includes(user.id))
})

// Filtered current members based on search
const filteredCurrentMembers = computed(() => {
  if (!currentMembersSearch.value) {
    return currentMembers.value
  }
  
  const query = currentMembersSearch.value.toLowerCase()
  return currentMembers.value.filter(user =>
    user.username.toLowerCase().includes(query) ||
    (user.fullName && user.fullName.toLowerCase().includes(query)) ||
    (user.email && user.email.toLowerCase().includes(query)) ||
    user.role.toLowerCase().includes(query)
  )
})

// Filtered available users based on search
const filteredAvailableUsers = computed(() => {
  if (!availableUsersSearch.value) {
    return availableUsers.value
  }
  
  const query = availableUsersSearch.value.toLowerCase()
  return availableUsers.value.filter(user =>
    user.username.toLowerCase().includes(query) ||
    (user.fullName && user.fullName.toLowerCase().includes(query)) ||
    (user.email && user.email.toLowerCase().includes(query)) ||
    user.role.toLowerCase().includes(query)
  )
})

// Count pending changes
const pendingChanges = computed(() => {
  if (!props.group) return 0
  const originalIds = new Set(props.group.userIds)
  const currentIds = new Set(tempMemberIds.value)
  
  let changes = 0
  
  // Count additions
  currentIds.forEach(id => {
    if (!originalIds.has(id)) changes++
  })
  
  // Count removals
  originalIds.forEach(id => {
    if (!currentIds.has(id)) changes++
  })
  
  return changes
})

const addMember = (userId: string) => {
  if (!tempMemberIds.value.includes(userId)) {
    tempMemberIds.value.push(userId)
  }
}

const removeMember = (userId: string) => {
  const index = tempMemberIds.value.indexOf(userId)
  if (index > -1) {
    tempMemberIds.value.splice(index, 1)
  }
}

const selectAllAvailable = () => {
  filteredAvailableUsers.value.forEach(user => {
    addMember(user.id)
  })
}

const removeAllMembers = () => {
  if (confirm('Are you sure you want to remove all members from this group?')) {
    tempMemberIds.value = []
  }
}

const saveChanges = () => {
  if (props.group) {
    emit('save', props.group.id, tempMemberIds.value)
  }
}

// Reset search when modal opens/closes
watch(() => props.show, (show) => {
  if (!show) {
    currentMembersSearch.value = ''
    availableUsersSearch.value = ''
  }
})
</script>