<template>
  <div class="relative">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <MagnifyingGlassIcon class="h-4 w-4 text-gray-400" />
    </div>
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search..."
      class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
      @keyup.enter="handleSearch"
      @input="handleInput"
    />
    
    <!-- Search results dropdown -->
    <div
      v-if="showResults && searchResults.length > 0"
      class="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
    >
      <div
        v-for="result in searchResults"
        :key="result.id"
        class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50"
        @click="selectResult(result)"
      >
        <div class="flex items-center">
          <component :is="result.icon" class="h-4 w-4 text-gray-400 mr-2" />
          <span class="font-normal block truncate">{{ result.title }}</span>
        </div>
        <span class="text-gray-500 text-xs">{{ result.type }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import {
  ChartBarIcon,
  TableCellsIcon,
  PresentationChartLineIcon
} from '@heroicons/vue/24/outline'

interface SearchResult {
  id: string
  title: string
  type: string
  route: string
  icon: any
}

const router = useRouter()
const searchQuery = ref('')
const showResults = ref(false)

// Mock search results - trong thực tế sẽ call API
const mockResults: SearchResult[] = [
  {
    id: '1',
    title: 'Sales Dashboard',
    type: 'Dashboard',
    route: '/dashboards/1',
    icon: ChartBarIcon
  },
  {
    id: '2',
    title: 'Customer Data',
    type: 'Data Source',
    route: '/data-sources/2',
    icon: TableCellsIcon
  },
  {
    id: '3',
    title: 'Revenue Chart',
    type: 'Chart',
    route: '/charts/3',
    icon: PresentationChartLineIcon
  }
]

const searchResults = computed(() => {
  if (!searchQuery.value.trim()) return []
  
  return mockResults.filter(result =>
    result.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    result.type.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const handleInput = () => {
  showResults.value = searchQuery.value.length > 0
}

const handleSearch = () => {
  if (searchResults.value.length > 0) {
    selectResult(searchResults.value[0])
  }
}

const selectResult = (result: SearchResult) => {
  router.push(result.route)
  searchQuery.value = ''
  showResults.value = false
}

// Hide results when clicking outside
watch(searchQuery, (newValue) => {
  if (!newValue) {
    showResults.value = false
  }
})
</script>
