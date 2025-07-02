<template>
  <TransitionRoot :show="show" as="template">
    <Dialog @close="$emit('close')" class="relative z-10">
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
            <DialogPanel class="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <!-- Header -->
              <div class="flex items-center justify-between mb-6 px-4 pt-5">
                <div class="flex items-center justify-between">
                  <div>
                    <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                      {{ user ? 'Edit User' : 'Create User' }}
                    </DialogTitle>
                    <p class="text-sm text-gray-500 mt-1">
                      {{ user ? 'Update user information and permissions' : 'Add a new user to the system' }}
                    </p>
                  </div>
                </div>
                <button
                  @click="$emit('close')"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon class="h-6 w-6" />
                </button>
              </div>

              <!-- Compact Form Content -->
              <div class="px-4 pb-4 max-h-[70vh] overflow-y-auto">
                <form @submit.prevent="handleSubmit" class="space-y-4">
                  <!-- Basic Information - Inline Layout -->
                  <div class="space-y-3">
                    <h4 class="text-sm font-medium text-gray-900 flex items-center border-b border-gray-200 pb-1">
                      <UserIcon class="h-4 w-4 mr-2 text-primary-600" />
                      Basic Information
                    </h4>
                    
                    <div class="grid grid-cols-2 gap-3">
                      <!-- Username -->
                      <div>
                        <label for="username" class="block text-xs font-medium text-gray-700 mb-1">
                          Username <span class="text-red-500">*</span>
                        </label>
                        <input
                          id="username"
                          v-model="form.username"
                          type="text"
                          required
                          class="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-200 transition-all duration-200 text-sm"
                          placeholder="Username"
                        />
                      </div>

                      <!-- Full Name -->
                      <div>
                        <label for="fullName" class="block text-xs font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          id="fullName"
                          v-model="form.fullName"
                          type="text"
                          class="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-200 transition-all duration-200 text-sm"
                          placeholder="Full name"
                        />
                      </div>

                      <!-- Email -->
                      <div>
                        <label for="email" class="block text-xs font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          id="email"
                          v-model="form.email"
                          type="email"
                          class="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-200 transition-all duration-200 text-sm"
                          placeholder="Email address"
                        />
                      </div>

                      <!-- Phone -->
                      <div>
                        <label for="phone" class="block text-xs font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          id="phone"
                          v-model="form.phone"
                          type="tel"
                          class="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-200 transition-all duration-200 text-sm"
                          placeholder="Phone number"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Account Settings - Compact Layout -->
                  <div class="space-y-3">
                    <h4 class="text-sm font-medium text-gray-900 flex items-center border-b border-gray-200 pb-1">
                      <CogIcon class="h-4 w-4 mr-2 text-blue-600" />
                      Account Settings
                    </h4>
                    
                    <div class="grid grid-cols-2 gap-3">
                      <!-- User Type -->
                      <div>
                        <label for="type" class="block text-xs font-medium text-gray-700 mb-1">
                          Type <span class="text-red-500">*</span>
                        </label>
                        <select
                          id="type"
                          v-model="form.type"
                          required
                          class="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-200 transition-all duration-200 text-sm bg-white"
                        >
                          <option value="local">Local</option>
                          <option value="sso">SSO</option>
                        </select>
                      </div>

                      <!-- Role -->
                      <div>
                        <label for="role" class="block text-xs font-medium text-gray-700 mb-1">
                          Role <span class="text-red-500">*</span>
                        </label>
                        <select
                          id="role"
                          v-model="form.role"
                          required
                          class="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-200 transition-all duration-200 text-sm bg-white"
                        >
                          <option value="Admin">Admin</option>
                          <option value="Dashboard Designer">Designer</option>
                          <option value="Dashboard Viewer">Viewer</option>
                        </select>
                      </div>
                    </div>

                    <!-- Password (only for local users) -->
                    <div v-if="form.type === 'local'">
                      <label for="password" class="block text-xs font-medium text-gray-700 mb-1">
                        Password <span v-if="!user" class="text-red-500">*</span>
                      </label>
                      <input
                        id="password"
                        v-model="form.password"
                        type="password"
                        :required="!user && form.type === 'local'"
                        class="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-200 transition-all duration-200 text-sm"
                        :placeholder="user ? 'Leave blank to keep current' : 'Enter password'"
                      />
                    </div>

                    <!-- Status -->
                    <div>
                      <label class="flex items-center">
                        <input
                          v-model="form.isActive"
                          type="checkbox"
                          class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 h-4 w-4"
                        />
                        <span class="ml-2 text-sm text-gray-700">Active account</span>
                      </label>
                    </div>
                  </div>

                  <!-- Groups Section - Compact -->
                  <div class="space-y-3">
                    <h4 class="text-sm font-medium text-gray-900 flex items-center border-b border-gray-200 pb-1">
                      <UserGroupIcon class="h-4 w-4 mr-2 text-green-600" />
                      Groups
                    </h4>
                    
                    <!-- Multi-select Groups Dropdown -->
                    <div class="relative">
                      <label class="block text-xs font-medium text-gray-700 mb-1">
                        Select Groups
                      </label>
                      <div class="relative">
                        <button
                          type="button"
                          @click="showGroupDropdown = !showGroupDropdown"
                          class="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
                        >
                          <span v-if="selectedGroupNames.length === 0" class="text-gray-500">
                            Select groups...
                          </span>
                          <span v-else-if="selectedGroupNames.length === 1" class="text-gray-900">
                            {{ selectedGroupNames[0] }}
                          </span>
                          <span v-else class="text-gray-900">
                            {{ selectedGroupNames.length }} groups selected
                          </span>
                          <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                            <ChevronDownIcon class="h-4 w-4 text-gray-400" />
                          </span>
                        </button>

                        <!-- Dropdown Panel -->
                        <div
                          v-if="showGroupDropdown"
                          class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-48 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none text-sm"
                        >
                          <!-- Search Input -->
                          <div class="sticky top-0 bg-white border-b border-gray-100 p-2">
                            <div class="relative">
                              <div class="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon class="h-4 w-4 text-gray-400" />
                              </div>
                              <input
                                v-model="groupSearchQuery"
                                type="text"
                                placeholder="Search groups..."
                                class="block w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                                @click.stop
                              />
                            </div>
                          </div>

                          <!-- Group Options -->
                          <div v-if="filteredGroups.length === 0" class="p-3 text-center text-gray-500 text-sm">
                            {{ groupSearchQuery ? 'No groups found' : 'No groups available' }}
                          </div>
                          <label
                            v-for="group in filteredGroups"
                            :key="group.id"
                            class="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                            @click.stop
                          >
                            <input
                              type="checkbox"
                              :value="group.id"
                              v-model="form.groupIds"
                              class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 h-4 w-4"
                            />
                            <div class="ml-2 flex-1 min-w-0">
                              <div class="text-sm font-medium text-gray-900 truncate">{{ group.name }}</div>
                              <div class="text-xs text-gray-500 truncate">{{ group.userIds.length }} members</div>
                            </div>
                            <span
                              class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ml-2"
                              :class="group.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                            >
                              {{ group.isActive ? 'Active' : 'Inactive' }}
                            </span>
                          </label>
                        </div>
                      </div>

                      <!-- Selected Groups Tags -->
                      <div v-if="selectedGroupNames.length > 0" class="mt-2 flex flex-wrap gap-1">
                        <span
                          v-for="(groupName, index) in selectedGroupNames"
                          :key="index"
                          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                        >
                          {{ groupName }}
                          <button
                            type="button"
                            @click="removeGroup(form.groupIds[index])"
                            class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-primary-600 hover:bg-primary-200 hover:text-primary-800"
                          >
                            <XMarkIcon class="h-3 w-3" />
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <!-- Compact Action Buttons -->
              <div class="flex justify-end space-x-3 px-4 py-3 bg-gray-50 border-t border-gray-200">
                <button
                  type="button"
                  @click="$emit('close')"
                  class="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  @click="handleSubmit"
                  class="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-sm"
                >
                  <UserPlusIcon v-if="!user" class="h-4 w-4 mr-1" />
                  <PencilIcon v-else class="h-4 w-4 mr-1" />
                  {{ user ? 'Update' : 'Create' }}
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
import { ref, reactive, watch, computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { 
  XMarkIcon, 
  UserIcon, 
  CogIcon, 
  UserGroupIcon, 
  MagnifyingGlassIcon,
  UserPlusIcon,
  PencilIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'
import type { User, UserGroup } from '@/types/user'

interface Props {
  show: boolean
  user?: User | null
  groups: UserGroup[]
}

interface Emits {
  close: []
  save: [userData: any]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const groupSearchQuery = ref('')
const showGroupDropdown = ref(false)

const form = reactive({
  username: '',
  fullName: '',
  email: '',
  phone: '',
  type: 'local' as 'local' | 'sso',
  password: '',
  role: 'Dashboard Viewer' as 'Admin' | 'Dashboard Designer' | 'Dashboard Viewer',
  groupIds: [] as string[],
  isActive: true
})

// Filtered groups based on search query
const filteredGroups = computed(() => {
  if (!groupSearchQuery.value) {
    return props.groups
  }
  
  const query = groupSearchQuery.value.toLowerCase()
  return props.groups.filter(group =>
    group.name.toLowerCase().includes(query) ||
    (group.description && group.description.toLowerCase().includes(query))
  )
})

// Computed property for selected group names
const selectedGroupNames = computed(() => {
  return form.groupIds.map(groupId => {
    const group = props.groups.find(g => g.id === groupId)
    return group ? group.name : ''
  }).filter(Boolean)
})

// Function to remove a group
const removeGroup = (groupId: string) => {
  const index = form.groupIds.indexOf(groupId)
  if (index > -1) {
    form.groupIds.splice(index, 1)
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.relative')) {
    showGroupDropdown.value = false
  }
}

// Add event listener for clicking outside
watch(() => props.show, (isShown) => {
  if (isShown) {
    document.addEventListener('click', handleClickOutside)
  } else {
    document.removeEventListener('click', handleClickOutside)
    showGroupDropdown.value = false
  }
})

// Watch for user prop changes to populate form
watch(() => props.user, (user) => {
  if (user) {
    form.username = user.username
    form.fullName = user.fullName || ''
    form.email = user.email || ''
    form.phone = user.phone || ''
    form.type = user.type
    form.password = ''
    form.role = user.role
    form.groupIds = [...user.groupIds]
    form.isActive = user.isActive
  } else {
    // Reset form for new user
    form.username = ''
    form.fullName = ''
    form.email = ''
    form.phone = ''
    form.type = 'local'
    form.password = ''
    form.role = 'Dashboard Viewer'
    form.groupIds = []
    form.isActive = true
  }
  
  // Reset search when modal opens/closes
  groupSearchQuery.value = ''
  showGroupDropdown.value = false
}, { immediate: true })

const handleSubmit = () => {
  const userData = {
    username: form.username,
    fullName: form.fullName || undefined,
    email: form.email || undefined,
    phone: form.phone || undefined,
    type: form.type,
    role: form.role,
    groupIds: form.groupIds,
    isActive: form.isActive
  }

  // Only include password if it's provided
  if (form.password && form.type === 'local') {
    userData.password = form.password
  }

  emit('save', userData)
}
</script>