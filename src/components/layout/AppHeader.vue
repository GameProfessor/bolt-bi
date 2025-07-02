<template>
  <nav class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo và Brand -->
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="flex items-center space-x-2">
              <ChartBarIcon class="w-8 h-8 text-primary-600" />
              <h1 class="text-xl font-bold text-gray-900">BI Dashboard</h1>
            </router-link>
          </div>
          
          <!-- Desktop Navigation -->
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link
              v-for="item in navigationItems"
              :key="item.name"
              :to="item.to"
              :class="[
                'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors',
                $route.name === item.routeName
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              ]"
            >
              <component :is="item.icon" class="w-4 h-4 mr-2" />
              {{ item.name }}
            </router-link>
          </div>
        </div>

        <!-- Right side actions -->
        <div class="flex items-center space-x-4">

          <!-- Notifications (tạm thời ẩn) -->
          <NotificationBell />

          <!-- User Menu (tạm thời ẩn) -->
          <UserMenu />
          
          <!-- Mobile menu button -->
          <div class="sm:hidden">
            <button
              @click="toggleMobileMenu"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <Bars3Icon v-if="!showMobileMenu" class="block h-6 w-6" />
              <XMarkIcon v-else class="block h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <div v-show="showMobileMenu" class="sm:hidden">
      <div class="pt-2 pb-3 space-y-1 px-3">
        <router-link
          v-for="item in navigationItems"
          :key="item.name"
          :to="item.to"
          :class="[
            'flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors',
            $route.name === item.routeName
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          ]"
          @click="closeMobileMenu"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3" />
          {{ item.name }}
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ChartBarIcon,
  TableCellsIcon,
  BuildingStorefrontIcon,
  BoltIcon,

  Bars3Icon,
  XMarkIcon
} from '@heroicons/vue/24/outline'


import NotificationBell from '@/components/common/NotificationBell.vue'
import UserMenu from '@/components/common/UserMenu.vue'


const showMobileMenu = ref(false)

// Tạm thời sử dụng navigation items cũ
const navigationItems = [
  {
    name: 'Home',
    to: '/',
    routeName: 'Home',
    icon: ChartBarIcon
  },
  {
    name: 'Datasets',
    to: '/data-sources',
    routeName: 'DataSources',
    icon: TableCellsIcon
  },
  // {
  //   name: 'Charts',
  //   to: '/charts',
  //   routeName: 'ChartList',
  //   icon: PresentationChartLineIcon
  // },
  {
    name: 'Dashboards',
    to: '/dashboards',
    routeName: 'DashboardStore',
    icon: BuildingStorefrontIcon
  },
  {
    name: 'Quick Dashboard',
    to: '/quick-dashboard',
    routeName: 'QuickDashboard',
    icon: BoltIcon
  },
  // {
  //   name: 'Template Designer',
  //   to: '/template-designer',
  //   routeName: 'TemplateDesigner',
  //   icon: PaintBrushIcon
  // },
]

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}
</script>
