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
            <DialogPanel class="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
              <!-- Header -->
              <div class="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
                <div class="flex items-center justify-between">
                  <div>
                    <DialogTitle as="h3" class="text-xl font-semibold text-white">
                      {{ user ? 'Edit User' : 'Create New User' }}
                    </DialogTitle>
                    <p class="text-primary-100 text-sm mt-1">
                      {{ user ? 'Update user information' : 'Add a new user to the system' }}
                    </p>
                  </div>
                  <button
                    @click="$emit('close')"
                    class="text-primary-200 hover:text-white transition-colors duration-200 rounded-full p-1 hover:bg-primary-500"
                  >
                    <XMarkIcon class="h-6 w-6" />
                  </button>
                </div>
              </div>

              <!-- Form Content -->
              <div class="px-6 py-6">
                <form @submit.prevent="handleSubmit" class="space-y-6">
                  <!-- Basic Information Section -->
                  <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                      <UserIcon class="h-5 w-5 mr-2 text-primary-600" />
                      Basic Information
                    </h4>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <!-- Username -->
                      <div>
                        <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                          Username <span class="text-red-500">*</span>
                        </label>
                        <input
                          id="username"
                          v-model="form.username"
                          type="text"
                          required
                          class="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 text-sm"
                          placeholder="Enter username"
                        />
                      </div>

                      <!-- Full Name -->
                      <div>
                        <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          id="fullName"
                          v-model="form.fullName"
                          type="text"
                          class="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 text-sm"
                          placeholder="Enter full name"
                        />
                      </div>

                      <!-- Email -->
                      <div>
                        <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          id="email"
                          v-model="form.email"
                          type="email"
                          class="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 text-sm"
                          placeholder="Enter email address"
                        />
                      </div>

                      <!-- Phone -->
                      <div>
                        <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          id="phone"
                          v-model="form.phone"
                          type="tel"
                          class="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 text-sm"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Account Settings Section -->
                  <div class="bg-blue-50 rounded-lg p-4">
                    <h4 class="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                      <CogIcon class="h-5 w-5 mr-2 text-blue-600" />
                      Account Settings
                    </h4>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <!-- User Type -->
                      <div>
                        <label for="type" class="block text-sm font-medium text-gray-700 mb-2">
                          User Type <span class="text-red-500">*</span>
                        </label>
                        <select
                          id="type"
                          v-model="form.type"
                          required
                          class="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 text-sm bg-white"
                        >
                          <option value="local">Local User</option>
                          <option value="sso">SSO User</option>
                        </select>
                      </div>

                      <!-- Role -->
                      <div>
                        <label for="role" class="block text-sm font-medium text-gray-700 mb-2">
                          Role <span class="text-red-500">*</span>
                        </label>
                        <select
                          id="role"
                          v-model="form.role"
                          required
                          class="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 text-sm bg-white"
                        >
                          <option value="Admin">Admin</option>
                          <option value="Dashboard Designer">Dashboard Designer</option>
                          <option value="Dashboard Viewer">Dashboard Viewer</option>
                        </select>
                      </div>
                    </div>

                    <!-- Password (only for local users) -->
                    <div v-if="form.type === 'local'" class="mt-4">
                      <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                        Password <span v-if="!user" class="text-red-500">*</span>
                      </label>
                      <input
                        id="password"
                        v-model="form.password"
                        type="password"
                        :required="!user && form.type === 'local'"
                        class="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all duration-200 text-sm"
                        :placeholder="user ? 'Leave blank to keep current password' : 'Enter password'"
                      />
                    </div>

                    <!-- Status -->
                    <div class="mt-4">
                      <label class="flex items-center">
                        <input
                          v-model="form.isActive"
                          type="checkbox"
                          class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 h-4 w-4"
                        />
                        <span class="ml-3 text-sm font-medium text-gray-700">Active user account</span>
                      </label>
                    </div>
                  </div>

                  <!-- Groups Section -->
                  <div class="bg-green-50 rounded-lg p-4">
                    <h4 class="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                      <UserGroupIcon class="h-5 w-5 mr-2 text-green-600" />
                      Group Membership
                    </h4>
                    
                    <!-- Group Search -->
                    <div class="mb-3">
                      <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MagnifyingGlassIcon class="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          v-model="groupSearchQuery"
                          type="text"
                          placeholder="Search groups..."
                          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-sm"
                        />
                      </div>
                    </div>

                    <!-- Groups List -->
                    <div class="max-h-40 overflow-y-auto border border-gray-200 rounded-lg bg-white">
                      <div v-if="filteredGroups.length === 0" class="p-4 text-center text-gray-500 text-sm">
                        {{ groupSearchQuery ? 'No groups found matching your search' : 'No groups available' }}
                      </div>
                      <label
                        v-for="group in filteredGroups"
                        :key="group.id"
                        class="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          :value="group.id"
                          v-model="form.groupIds"
                          class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 h-4 w-4"
                        />
                        <div class="ml-3 flex-1">
                          <div class="text-sm font-medium text-gray-900">{{ group.name }}</div>
                          <div v-if="group.description" class="text-xs text-gray-500 mt-1">{{ group.description }}</div>
                          <div class="text-xs text-gray-400 mt-1">{{ group.userIds.length }} members</div>
                        </div>
                        <div class="ml-2">
                          <span
                            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                            :class="group.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                          >
                            {{ group.isActive ? 'Active' : 'Inactive' }}
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      @click="$emit('close')"
                      class="inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      class="inline-flex justify-center items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 shadow-sm"
                    >
                      <UserPlusIcon v-if="!user" class="h-4 w-4 mr-2" />
                      <PencilIcon v-else class="h-4 w-4 mr-2" />
                      {{ user ? 'Update User' : 'Create User' }}
                    </button>
                  </div>
                </form>
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
  PencilIcon
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