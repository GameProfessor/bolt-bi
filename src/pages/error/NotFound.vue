<template>
  <div class="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center">
      <div>
        <div class="mx-auto h-32 w-32 text-gray-400">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.291-1.007-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2.306m6 0V7a2 2 0 012 2v6.414c0 .394-.106.766-.293 1.087l-4.414 7.586c-.226.389-.62.627-1.054.627H9.76c-.434 0-.828-.238-1.054-.627L4.293 16.5A1.5 1.5 0 014 15.414V9a2 2 0 012-2h1m0 0V4a2 2 0 012-2h4a2 2 0 012 2v3M9 7h6" />
          </svg>
        </div>
        <h1 class="mt-6 text-6xl font-bold text-gray-900">404</h1>
        <h2 class="mt-2 text-3xl font-bold text-gray-900">Page not found</h2>
        <p class="mt-2 text-sm text-gray-600">
          Sorry, we couldn't find the page you're looking for.
        </p>
      </div>
      
      <div class="mt-8 space-y-4">
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <router-link
            to="/"
            class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            <HomeIcon class="w-4 h-4 mr-2" />
            Go back home
          </router-link>
          
          <button
            @click="$router.go(-1)"
            class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            <ArrowLeftIcon class="w-4 h-4 mr-2" />
            Go back
          </button>
        </div>
        
        <div class="text-center">
          <p class="text-sm text-gray-500">
            Or try one of these helpful links:
          </p>
          <div class="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <router-link
              to="/data-sources"
              class="text-sm text-primary-600 hover:text-primary-500 hover:underline"
            >
              Data Sources
            </router-link>
            <router-link
              to="/charts"
              class="text-sm text-primary-600 hover:text-primary-500 hover:underline"
            >
              Charts
            </router-link>
            <router-link
              to="/dashboards"
              class="text-sm text-primary-600 hover:text-primary-500 hover:underline"
            >
              Dashboards
            </router-link>
            <router-link
              to="/settings"
              class="text-sm text-primary-600 hover:text-primary-500 hover:underline"
            >
              Settings
            </router-link>
          </div>
        </div>
      </div>
      
      <div class="mt-8 border-t border-gray-200 pt-8">
        <p class="text-xs text-gray-400">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HomeIcon, ArrowLeftIcon } from '@heroicons/vue/24/outline'
</script>
