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
                    Manage Members for {{ group?.name }}
                  </DialogTitle>
                  <p class="text-sm text-gray-500 mt-1">
                    Add or remove users from this group.
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
                    v-model="userSearchQuery"
                    type="text"
                    placeholder="Search users..."
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div class="mb-2 text-sm text-gray-700 font-medium">{{ selectedUserIds.length }} selected</div>
                <!-- User List -->
                <div class="max-h-64 overflow-y-auto border border-gray-200 rounded-md bg-white">
                  <div v-if="filteredUsers.length === 0" class="p-3 text-center text-gray-500 text-sm">
                    {{ userSearchQuery ? 'No users found' : 'No users available' }}
                  </div>
                  <label
                    v-for="user in filteredUsers"
                    :key="user.id"
                    class="flex items-center p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <input
                      type="checkbox"
                      :value="user.id"
                      v-model="selectedUserIds"
                      class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 h-4 w-4"
                    />
                    <div class="ml-2 flex-1 min-w-0">
                      <div class="text-sm font-medium text-gray-900 truncate">{{ user.fullName || user.username }}</div>
                      <div class="text-xs text-gray-500 truncate">{{ user.role }} • {{ user.email || user.username }}</div>
                    </div>
                    <span
                      class="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ml-2"
                      :class="user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ user.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </label>
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
                  @click="saveMembers"
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
import { ref, watch, computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import type { User, UserGroup } from '@/types/user'

interface Props {
  show: boolean
  group: UserGroup | null
  users: User[]
}
const props = defineProps<Props>()
const emit = defineEmits(['close', 'save'])

const userSearchQuery = ref('')
const selectedUserIds = ref<string[]>([])

watch(() => props.group, (group) => {
  if (group) {
    selectedUserIds.value = [...group.userIds]
  } else {
    selectedUserIds.value = []
  }
  userSearchQuery.value = ''
}, { immediate: true })

const filteredUsers = computed(() => {
  if (!userSearchQuery.value) return props.users
  const query = userSearchQuery.value.toLowerCase()
  return props.users.filter(user =>
    user.username.toLowerCase().includes(query) ||
    (user.fullName && user.fullName.toLowerCase().includes(query)) ||
    (user.email && user.email.toLowerCase().includes(query)) ||
    user.role.toLowerCase().includes(query)
  )
})

const saveMembers = () => {
  emit('save', selectedUserIds.value)
}
</script> 