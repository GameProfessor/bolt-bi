<template>
  <footer class="bg-white border-t border-gray-200 mt-auto">
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <!-- Left side - Company info -->
        <div class="flex items-center space-x-4">
          <ChartBarIcon class="w-6 h-6 text-primary-600" />
          <div>
            <p class="text-sm text-gray-600">
              © {{ currentYear }} BI Dashboard. All rights reserved.
            </p>
            <p class="text-xs text-gray-500">
              Powered by Vue 3 & TypeScript
            </p>
          </div>
        </div>

        <!-- Right side - Links -->
        <div class="mt-4 md:mt-0">
          <div class="flex space-x-6">
            <a
              v-for="link in footerLinks"
              :key="link.name"
              :href="link.href"
              class="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
              :target="link.external ? '_blank' : undefined"
              :rel="link.external ? 'noopener noreferrer' : undefined"
            >
              {{ link.name }}
            </a>
          </div>
        </div>
      </div>

      <!-- Version info (development only) -->
      <div v-if="isDevelopment" class="mt-4 pt-4 border-t border-gray-100">
        <div class="flex items-center justify-between text-xs text-gray-400">
          <span>Version: {{ version }}</span>
          <span>Build: {{ buildTime }}</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChartBarIcon } from '@heroicons/vue/24/outline'

const currentYear = new Date().getFullYear()
const isDevelopment = import.meta.env.DEV
const version = import.meta.env.VITE_APP_VERSION || '1.0.0'
const buildTime = import.meta.env.VITE_BUILD_TIME || new Date().toISOString()

const footerLinks = [
  {
    name: 'Documentation',
    href: '/docs',
    external: false
  },
  {
    name: 'API Reference',
    href: '/api-docs',
    external: false
  },
  {
    name: 'Support',
    href: 'mailto:support@example.com',
    external: true
  },
  {
    name: 'GitHub',
    href: 'https://github.com/your-repo',
    external: true
  }
]
</script>
