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
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <!-- Header -->
              <div class="flex items-center justify-between mb-6">
                <div>
                  <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                    {{ user ? 'Edit User' : 'Create User' }}
                  </DialogTitle>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ user ? 'Update user information' : 'Add a new user to the system' }}
                  </p>
                </div>
                <button
                  @click="$emit('close')"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon class="h-6 w-6" />
                </button>
              </div>

              <!-- Form -->
              <form @submit.prevent="handleSubmit" class="space-y-4">
                <!-- Username -->
                <div>
                  <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
                    Username <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="username"
                    v-model="form.username"
                    type="text"
                    required
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Enter username"
                  />
                </div>

                <!-- Full Name -->
                <div>
                  <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    v-model="form.fullName"
                    type="text"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Enter full name"
                  />
                </div>

                <!-- Email -->
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Enter email address"
                  />
                </div>

                <!-- Phone -->
                <div>
                  <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    id="phone"
                    v-model="form.phone"
                    type="tel"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Enter phone number"
                  />
                </div>

                <!-- User Type -->
                <div>
                  <label for="type" class="block text-sm font-medium text-gray-700 mb-1">
                    User Type <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="type"
                    v-model="form.type"
                    required
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="local">Local</option>
                    <option value="sso">SSO</option>
                  </select>
                </div>

                <!-- Password (only for local users) -->
                <div v-if="form.type === 'local'">
                  <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                    Password <span v-if="!user" class="text-red-500">*</span>
                  </label>
                  <input
                    id="password"
                    v-model="form.password"
                    type="password"
                    :required="!user && form.type === 'local'"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    :placeholder="user ? 'Leave blank to keep current password' : 'Enter password'"
                  />
                </div>

                <!-- Role -->
                <div>
                  <label for="role" class="block text-sm font-medium text-gray-700 mb-1">
                    Role <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="role"
                    v-model="form.role"
                    required
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Dashboard Designer">Dashboard Designer</option>
                    <option value="Dashboard Viewer">Dashboard Viewer</option>
                  </select>
                </div>

                <!-- Groups -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Groups
                  </label>
                  <div class="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
                    <label
                      v-for="group in groups"
                      :key="group.id"
                      class="flex items-center"
                    >
                      <input
                        type="checkbox"
                        :value="group.id"
                        v-model="form.groupIds"
                        class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                      />
                      <span class="ml-2 text-sm text-gray-700">{{ group.name }}</span>
                    </label>
                  </div>
                </div>

                <!-- Status -->
                <div>
                  <label class="flex items-center">
                    <input
                      v-model="form.isActive"
                      type="checkbox"
                      class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                    />
                    <span class="ml-2 text-sm text-gray-700">Active user</span>
                  </label>
                </div>

                <!-- Action Buttons -->
                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    @click="$emit('close')"
                    class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="inline-flex justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    {{ user ? 'Update User' : 'Create User' }}
                  </button>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
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