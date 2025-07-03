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
                <div class="flex items-center justify-between">
                  <div>
                    <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                      {{ props.title || (user ? 'Edit User' : 'Create User') }}
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
                          :disabled="props.readOnlyFields && props.readOnlyFields.includes('username')"
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
                       <!-- Password (only for local users) -->
                    <div v-if="form.type === 'local' && !user">
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
                      <div v-if="!props.hideAccountType">
                        <label for="type" class="block text-xs font-medium text-gray-700 mb-1">
                          Type <span class="text-red-500">*</span>
                        </label>
                        <select
                          id="type"
                          v-model="form.type"
                          required
                          class="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-200 transition-all duration-200 text-sm bg-white"
                          :disabled="props.readOnlyFields && props.readOnlyFields.includes('type')"
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
                          :disabled="props.readOnlyFields && props.readOnlyFields.includes('role')"
                        >
                          <option value="Admin">Admin</option>
                          <option value="Dashboard Designer">Designer</option>
                          <option value="Dashboard Viewer">Viewer</option>
                        </select>
                      </div>
                    </div>

                   

                    <!-- Status -->
                    <div v-if="!props.hideActiveAccount">
                      <label class="flex items-center">
                        <input
                          v-model="form.isActive"
                          type="checkbox"
                          class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 h-4 w-4"
                          :disabled="props.readOnlyFields && props.readOnlyFields.includes('isActive')"
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
                    <div>
                      <label for="groups" class="block text-xs font-medium text-gray-700 mb-1">
                        Select Groups
                      </label>
                      <Multiselect
                        id="groups"
                        v-model="form.groupIds"
                        :options="groups"
                        mode="tags"
                        label="name"
                        valueProp="id"
                        placeholder="Select groups"
                        searchable
                        :append-to-body="false"
                        :dropdownClass="'z-[10001]'"
                        :classes="{
    tag: 'bg-blue-100 text-blue-800 border border-blue-300 rounded-md px-2 py-1 text-sm flex items-center space-x-1',
    tagRemove: 'hover:text-red-600 cursor-pointer ml-1',
    option: 'text-sm px-3 py-2',            // reduce font size of options
    search: 'text-xs placeholder-gray-400',
  }"
                        :disabled="props.readOnlyFields && props.readOnlyFields.includes('groupIds')"
                      />
                      <p class="mt-1 text-xs text-gray-500">Type to search and select multiple groups</p>
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
import { reactive, watch } from 'vue'
import Multiselect from '@vueform/multiselect'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { 
  XMarkIcon, 
  UserIcon, 
  CogIcon, 
  UserGroupIcon, 
  UserPlusIcon,
  PencilIcon
} from '@heroicons/vue/24/outline'
import type { User, UserGroup } from '@/types/user'

interface Props {
  show: boolean
  user?: User | null
  groups: UserGroup[]
  hideAccountType: boolean
  hideActiveAccount: boolean
  readOnlyFields: string[]
  title: string
}

interface Emits {
  close: []
  save: [userData: any]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

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
}, { immediate: true })

const handleSubmit = () => {
  const userData: any = {
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

<style scoped>
/* (No @import for multiselect theme here) */
</style>

<style src="@vueform/multiselect/themes/default.css"></style>