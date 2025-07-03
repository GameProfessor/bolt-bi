<template>
  <TransitionRoot appear :show="show" as="template">
    <Dialog as="div" @close="$emit('close')" class="relative z-50">
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
            <DialogPanel class="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
              <!-- Modal Header -->
              <div class="px-6 py-4 border-b border-gray-200">
                <div class="flex items-center justify-between">
                  <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                    Choose datasets
                  </DialogTitle>
                  <button
                    @click="$emit('close')"
                    class="text-gray-400 hover:text-gray-600"
                  >
                    <XMarkIcon class="h-6 w-6" />
                  </button>
                </div>
              </div>

              <!-- Search and Filter Controls -->
              <div class="px-6 py-4 border-b border-gray-200">
                <div class="flex items-center gap-4">
                  <!-- Search Input -->
                  <div class="flex-1 relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      v-model="searchQueryLocal"
                      type="text"
                      placeholder="Search datasets"
                      class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                  </div>
                  <!-- Category Filter -->
                  <div class="min-w-0 flex-shrink-0">
                    <select
                      v-model="selectedCategoryLocal"
                      class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                    >
                      <option value="">All Categories</option>
                      <option v-for="category in availableCategories" :key="category" :value="category">
                        {{ category }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- Datasets Table -->
              <div class="px-6 py-4">
                <div class="overflow-hidden border border-gray-200 rounded-lg">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th scope="col" class="w-12 px-6 py-3 text-left">
                          <input
                            type="checkbox"
                            :checked="isAllSelected"
                            @change="toggleSelectAll"
                            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr
                        v-for="(ds, index) in paginatedDataSources"
                        :key="ds.id"
                        class="hover:bg-gray-50"
                      >
                        <td class="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            :checked="isDataSourceSelected(ds)"
                            @change="toggleDataSource(ds)"
                            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {{ (currentPageLocal - 1) * itemsPerPage + index + 1 }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {{ ds.name }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {{ ds.category || 'General' }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Pagination Info -->
                <div class="mt-4 flex items-center justify-between text-sm text-gray-700">
                  <div>
                    {{ paginationInfo }}
                  </div>
                  <div class="flex items-center space-x-2">
                    <!-- Pagination Controls -->
                    <button
                      @click="goToPreviousPage"
                      :disabled="currentPageLocal === 1"
                      class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      v-for="page in visiblePages"
                      :key="page"
                      @click="goToPage(page)"
                      :class="[
                        'px-3 py-1 border text-sm rounded',
                        page === currentPageLocal
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'border-gray-300 hover:bg-gray-50'
                      ]"
                    >
                      {{ page }}
                    </button>
                    <button
                      @click="goToNextPage"
                      :disabled="currentPageLocal === totalPages"
                      class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="px-6 py-4 border-t border-gray-200 flex justify-between">
                <button
                  @click="$emit('close')"
                  class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Back
                </button>
                <button
                  @click="saveSelectedDataSources"
                  class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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

const props = defineProps<{
  show: boolean
  dataSources: any[]
  selectedDataSources: any[]
  searchQuery: string
  selectedCategory: string
  currentPage: number
  itemsPerPage: number
}>()
const emit = defineEmits(['close', 'save', 'update:selectedDataSources', 'update:searchQuery', 'update:selectedCategory', 'update:currentPage'])

const searchQueryLocal = ref(props.searchQuery)
const selectedCategoryLocal = ref(props.selectedCategory)
const currentPageLocal = ref(props.currentPage)
const tempSelectedDataSources = ref([...props.selectedDataSources])

watch(() => props.searchQuery, (val) => { searchQueryLocal.value = val })
watch(() => props.selectedCategory, (val) => { selectedCategoryLocal.value = val })
watch(() => props.currentPage, (val) => { currentPageLocal.value = val })
watch(() => props.selectedDataSources, (val) => { tempSelectedDataSources.value = [...val] })

watch(searchQueryLocal, (val) => { emit('update:searchQuery', val) })
watch(selectedCategoryLocal, (val) => { emit('update:selectedCategory', val) })
watch(currentPageLocal, (val) => { emit('update:currentPage', val) })

const availableCategories = computed(() => {
  const categories = new Set<string>()
  props.dataSources.forEach(ds => {
    categories.add(ds.category || 'General')
  })
  return Array.from(categories).sort()
})

const filteredDataSources = computed(() => {
  let filtered = props.dataSources
  if (searchQueryLocal.value) {
    const query = searchQueryLocal.value.toLowerCase()
    filtered = filtered.filter(ds =>
      ds.name.toLowerCase().includes(query) ||
      ds.id.toLowerCase().includes(query)
    )
  }
  if (selectedCategoryLocal.value) {
    filtered = filtered.filter(ds => (ds.category || 'General') === selectedCategoryLocal.value)
  }
  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredDataSources.value.length / props.itemsPerPage)
})

const paginatedDataSources = computed(() => {
  const start = (currentPageLocal.value - 1) * props.itemsPerPage
  const end = start + props.itemsPerPage
  return filteredDataSources.value.slice(start, end)
})

const paginationInfo = computed(() => {
  const start = (currentPageLocal.value - 1) * props.itemsPerPage + 1
  const end = Math.min(currentPageLocal.value * props.itemsPerPage, filteredDataSources.value.length)
  const total = filteredDataSources.value.length
  return `${start} - ${end} of ${total} items`
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPageLocal.value
  const start = Math.max(1, current - 2)
  const end = Math.min(total, current + 2)
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const isAllSelected = computed(() => {
  return paginatedDataSources.value.length > 0 && paginatedDataSources.value.every(ds => isDataSourceSelected(ds))
})

function isDataSourceSelected(dataSource: any) {
  return tempSelectedDataSources.value.some(ds => ds.id === dataSource.id)
}

function toggleDataSource(dataSource: any) {
  const index = tempSelectedDataSources.value.findIndex(ds => ds.id === dataSource.id)
  if (index === -1) {
    tempSelectedDataSources.value.push(dataSource)
  } else {
    tempSelectedDataSources.value.splice(index, 1)
  }
  emit('update:selectedDataSources', tempSelectedDataSources.value)
}

function toggleSelectAll() {
  if (isAllSelected.value) {
    paginatedDataSources.value.forEach(ds => {
      const index = tempSelectedDataSources.value.findIndex(selected => selected.id === ds.id)
      if (index !== -1) {
        tempSelectedDataSources.value.splice(index, 1)
      }
    })
  } else {
    paginatedDataSources.value.forEach(ds => {
      if (!isDataSourceSelected(ds)) {
        tempSelectedDataSources.value.push(ds)
      }
    })
  }
  emit('update:selectedDataSources', tempSelectedDataSources.value)
}

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPageLocal.value = page
  }
}

function goToPreviousPage() {
  if (currentPageLocal.value > 1) {
    currentPageLocal.value--
  }
}

function goToNextPage() {
  if (currentPageLocal.value < totalPages.value) {
    currentPageLocal.value++
  }
}

function saveSelectedDataSources() {
  emit('save', tempSelectedDataSources.value)
}
</script> 