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
                    {{ group ? 'Edit Group' : 'Create Group' }}
                  </DialogTitle>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ group ? 'Update group information' : 'Add a new user group to the system' }}
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
                <!-- Group Name -->
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
                    Group Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    v-model="form.name"
                    type="text"
                    required
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Enter group name"
                  />
                </div>

                <!-- Description -->
                <div>
                  <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    v-model="form.description"
                    rows="3"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Enter group description"
                  />
                </div>

                <!-- Users -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Group Members
                  </label>
                  <div class="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
                    <label
                      v-for="user in users"
                      :key="user.id"
                      class="flex items-center"
                    >
                      <input
                        type="checkbox"
                        :value="user.id"
                        v-model="form.userIds"
                        class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                      />
                      <span class="ml-2 text-sm text-gray-700">
                        {{ user.fullName || user.username }}
                        <span class="text-gray-500">({{ user.role }})</span>
                      </span>
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
                    <span class="ml-2 text-sm text-gray-700">Active group</span>
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
                    {{ group ? 'Update Group' : 'Create Group' }}
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
import { reactive, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import type { User, UserGroup } from '@/types/user'

interface Props {
  show: boolean
  group?: UserGroup | null
  users: User[]
}

interface Emits {
  close: []
  save: [groupData: any]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = reactive({
  name: '',
  description: '',
  userIds: [] as string[],
  isActive: true
})

// Watch for group prop changes to populate form
watch(() => props.group, (group) => {
  if (group) {
    form.name = group.name
    form.description = group.description || ''
    form.userIds = [...group.userIds]
    form.isActive = group.isActive
  } else {
    // Reset form for new group
    form.name = ''
    form.description = ''
    form.userIds = []
    form.isActive = true
  }
}, { immediate: true })

const handleSubmit = () => {
  const groupData = {
    name: form.name,
    description: form.description || undefined,
    userIds: form.userIds,
    isActive: form.isActive
  }

  emit('save', groupData)
}
</script>