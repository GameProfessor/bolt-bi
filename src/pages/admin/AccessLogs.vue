<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <!-- Header -->
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-bold text-gray-900">Access Logs</h1>
          <p class="mt-2 text-sm text-gray-700">
            Monitor user activities and system access across the platform.
          </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
          <button
            @click="exportLogs"
            class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <DocumentArrowDownIcon class="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button
            @click="refreshLogs"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <ArrowPathIcon class="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      <!-- Rest of the template content -->

    </div>
  </div>
</template>

<script setup lang="ts">
// Script content remains the same
</script>