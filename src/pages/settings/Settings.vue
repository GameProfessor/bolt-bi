<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
        <p class="mt-2 text-sm text-gray-700">
          Manage your application preferences and configuration
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Settings Navigation -->
        <div class="lg:col-span-1">
          <nav class="space-y-1">
            <button
              v-for="section in settingSections"
              :key="section.id"
              @click="activeSection = section.id"
              class="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200"
              :class="activeSection === section.id
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
            >
              <component :is="section.icon" class="h-5 w-5 mr-3" />
              {{ section.name }}
            </button>
          </nav>
        </div>

        <!-- Settings Content -->
        <div class="lg:col-span-3">
          <div class="bg-white shadow rounded-lg">
            <!-- General Settings -->
            <div v-if="activeSection === 'general'" class="p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
              
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Application Theme
                  </label>
                  <select
                    v-model="settings.theme"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    v-model="settings.language"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="en">English</option>
                    <option value="vi">Tiếng Việt</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    v-model="settings.timezone"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="UTC">UTC</option>
                    <option value="Asia/Ho_Chi_Minh">Asia/Ho Chi Minh</option>
                    <option value="America/New_York">America/New York</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Dashboard Settings -->
            <div v-if="activeSection === 'dashboard'" class="p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Dashboard Settings</h3>
              
              <div class="space-y-6">
                <div>
                  <label class="flex items-center">
                    <input
                      v-model="settings.autoRefresh"
                      type="checkbox"
                      class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                    />
                    <span class="ml-2 text-sm text-gray-700">Auto-refresh dashboards</span>
                  </label>
                </div>

                <div v-if="settings.autoRefresh">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Refresh Interval (minutes)
                  </label>
                  <input
                    v-model.number="settings.refreshInterval"
                    type="number"
                    min="1"
                    max="60"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label class="flex items-center">
                    <input
                      v-model="settings.showGridLines"
                      type="checkbox"
                      class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                    />
                    <span class="ml-2 text-sm text-gray-700">Show grid lines in dashboard editor</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Data Settings -->
            <div v-if="activeSection === 'data'" class="p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Data Settings</h3>
              
              <div class="space-y-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Default Date Format
                  </label>
                  <select
                    v-model="settings.dateFormat"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Number Format
                  </label>
                  <select
                    v-model="settings.numberFormat"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  >
                    <option value="1,234.56">1,234.56</option>
                    <option value="1.234,56">1.234,56</option>
                    <option value="1 234.56">1 234.56</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    CSV Upload Limit (MB)
                  </label>
                  <input
                    v-model.number="settings.csvUploadLimit"
                    type="number"
                    min="1"
                    max="100"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <!-- Notifications Settings -->
            <div v-if="activeSection === 'notifications'" class="p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Notification Settings</h3>
              
              <div class="space-y-6">
                <div>
                  <label class="flex items-center">
                    <input
                      v-model="settings.emailNotifications"
                      type="checkbox"
                      class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                    />
                    <span class="ml-2 text-sm text-gray-700">Email notifications</span>
                  </label>
                </div>

                <div>
                  <label class="flex items-center">
                    <input
                      v-model="settings.browserNotifications"
                      type="checkbox"
                      class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                    />
                    <span class="ml-2 text-sm text-gray-700">Browser notifications</span>
                  </label>
                </div>

                <div>
                  <label class="flex items-center">
                    <input
                      v-model="settings.dataUpdateNotifications"
                      type="checkbox"
                      class="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                    />
                    <span class="ml-2 text-sm text-gray-700">Data update notifications</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Save Button -->
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
              <div class="flex justify-end space-x-3">
                <button
                  @click="resetSettings"
                  class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  Reset to Defaults
                </button>
                <button
                  @click="saveSettings"
                  class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors duration-200"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  CogIcon,
  ChartBarIcon,
  TableCellsIcon,
  BellIcon
} from '@heroicons/vue/24/outline'

const activeSection = ref('general')

const settingSections = [
  { id: 'general', name: 'General', icon: CogIcon },
  { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
  { id: 'data', name: 'Data', icon: TableCellsIcon },
  { id: 'notifications', name: 'Notifications', icon: BellIcon }
]

const settings = reactive({
  // General
  theme: 'light',
  language: 'vi',
  timezone: 'Asia/Ho_Chi_Minh',
  
  // Dashboard
  autoRefresh: true,
  refreshInterval: 5,
  showGridLines: true,
  
  // Data
  dateFormat: 'DD/MM/YYYY',
  numberFormat: '1,234.56',
  csvUploadLimit: 50,
  
  // Notifications
  emailNotifications: true,
  browserNotifications: true,
  dataUpdateNotifications: true
})

const saveSettings = () => {
  // Save settings to localStorage or API
  localStorage.setItem('bi-dashboard-settings', JSON.stringify(settings))
  console.log('Settings saved:', settings)
}

const resetSettings = () => {
  // Reset to default values
  Object.assign(settings, {
    theme: 'light',
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    autoRefresh: true,
    refreshInterval: 5,
    showGridLines: true,
    dateFormat: 'DD/MM/YYYY',
    numberFormat: '1,234.56',
    csvUploadLimit: 50,
    emailNotifications: true,
    browserNotifications: true,
    dataUpdateNotifications: true
  })
}

// Load settings on component mount
const loadSettings = () => {
  const saved = localStorage.getItem('bi-dashboard-settings')
  if (saved) {
    Object.assign(settings, JSON.parse(saved))
  }
}

loadSettings()
</script>
