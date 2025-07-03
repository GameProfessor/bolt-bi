<template>
  <TransitionRoot :show="show" as="template">
    <Dialog @close="$emit('close')" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-25" />
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
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                {{ editMode ? 'Edit Custom Field' : 'Add Custom Field' }}
              </DialogTitle>
              <div class="mt-4 space-y-3">
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Field Name</label>
                  <input v-model="form.name" type="text" class="w-full rounded border border-gray-300 text-base px-4 py-1" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Expression</label>
                  <input v-model="form.expression" type="text" class="w-full rounded border border-gray-300 text-base px-4 py-1" placeholder="e.g. revenue - cost" />
                  <p class="text-xs text-gray-500 mt-1">Use existing field names as variables. Example: <span class="font-mono">revenue - cost</span></p>
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-700 mb-1">Type</label>
                  <select v-model="form.type" class="w-full rounded border border-gray-300 text-base px-4 py-1">
                    <option value="number">Number</option>
                    <option value="string">String</option>
                    <option value="date">Date</option>
                  </select>
                </div>
              </div>
              <div class="mt-6 flex justify-end gap-2">
                <button @click="$emit('close')" class="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200">Cancel</button>
                <button @click="onSave" class="px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700">Save</button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

const props = defineProps<{
  show: boolean
  editMode: boolean
  form: { name: string; expression: string; type: string }
}>()
const emit = defineEmits(['close', 'save'])

const form = ref({ ...props.form })

watch(() => props.form, (val) => {
  form.value = { ...val }
})

function onSave() {
  if (!form.value.name || !form.value.expression) return
  emit('save', { ...form.value })
}
</script> 