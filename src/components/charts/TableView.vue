<template>
  <div class="table-container h-full overflow-auto">
    <table 
      class="min-w-full divide-y divide-gray-200"
      :class="{
        'table-striped': chart.properties.table?.striped,
        'table-bordered': chart.properties.table?.bordered,
        'table-hover': chart.properties.table?.hover
      }"
    >
      <thead class="bg-gray-50">
        <tr>
          <th 
            v-for="column in columns" 
            :key="column"
            scope="col" 
            class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ column }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr 
          v-for="(row, rowIndex) in paginatedData" 
          :key="rowIndex"
          class="hover:bg-gray-50"
        >
          <td 
            v-for="column in columns" 
            :key="`${rowIndex}-${column}`"
            class="px-3 py-2 whitespace-nowrap text-sm text-gray-500"
          >
            {{ row[column] }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div v-if="chart.properties.table?.pagination && totalPages > 1" class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
      <div class="flex flex-1 justify-between sm:hidden">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">{{ startIndex + 1 }}</span>
            to
            <span class="font-medium">{{ Math.min(endIndex, data.length) }}</span>
            of
            <span class="font-medium">{{ data.length }}</span>
            results
          </p>
        </div>
        <div>
          <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="sr-only">Previous</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
              </svg>
            </button>
            <button
              v-for="page in displayedPages"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
                page === currentPage
                  ? 'z-10 bg-primary-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
              ]"
            >
              {{ page }}
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="sr-only">Next</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="data.length === 0" class="flex items-center justify-center h-full text-gray-500 text-sm">
      No data available
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDataSourceStore } from '@/stores'
import type { DashboardChart } from '@/types/dashboard'

interface Props {
  chart: DashboardChart
}

const props = defineProps<Props>()
const dataSourceStore = useDataSourceStore()

// Pagination state
const currentPage = ref(1)
const pageSize = computed(() => Number(props.chart.properties.table?.pageSize) || 10)

// Get data from the data source
const data = computed(() => {
  if (!props.chart.base.dataSourceId) return []
  
  const dataSource = dataSourceStore.getDataSourceById(props.chart.base.dataSourceId)
  if (!dataSource) return []
  
  return dataSource.rows
})

// Get columns from chart properties
const columns = computed(() => {
  return props.chart.properties.table?.columns || []
})

// Pagination logic
const totalPages = computed(() => {
  return Math.ceil(data.value.length / pageSize.value)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * pageSize.value
})

const endIndex = computed(() => {
  return startIndex.value + pageSize.value
})

const paginatedData = computed(() => {
  return data.value.slice(startIndex.value, endIndex.value)
})

// Calculate which page numbers to display
const displayedPages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []
  
  if (total <= 7) {
    // Show all pages if there are 7 or fewer
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always include first and last page
    pages.push(1)
    
    // Calculate middle pages
    if (current <= 3) {
      // Near the start
      pages.push(2, 3, 4, '...', total)
    } else if (current >= total - 2) {
      // Near the end
      pages.push('...', total - 3, total - 2, total - 1, total)
    } else {
      // Middle
      pages.push('...', current - 1, current, current + 1, '...', total)
    }
  }
  
  return pages
})

// Pagination methods
const goToPage = (page: number | string) => {
  if (typeof page === 'number') {
    currentPage.value = page
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Reset pagination when chart changes
watch(() => props.chart.id, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.table-container {
  max-height: 100%;
  overflow: auto;
}

.table-striped tbody tr:nth-child(odd) {
  background-color: rgba(249, 250, 251, 1);
}

.table-bordered th,
.table-bordered td {
  border: 1px solid rgba(229, 231, 235, 1);
}

.table-hover tbody tr:hover {
  background-color: rgba(243, 244, 246, 1);
}
</style>