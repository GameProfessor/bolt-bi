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
            <template v-for="item in navigationItems" :key="item.name">
              <div v-if="item.children" class="relative"
                @mouseenter="openAdminMenu"
                @mouseleave="closeAdminMenu"
              >
                <button
                  class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors h-16 align-middle bg-transparent border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  style="background: none; height: 100%;"
                >
                  <component :is="item.icon" class="w-4 h-4 mr-2" />
                  {{ item.name }}
                  <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div
                  v-show="isAdminMenuOpen"
                  class="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-[2000] transition-opacity duration-150"
                  @mouseenter="openAdminMenu"
                  @mouseleave="closeAdminMenu"
                >
                  <router-link
                    v-for="child in item.children"
                    :key="child.name"
                    :to="child.to"
                    class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  >
                    <component :is="child.icon" class="h-4 w-4 mr-3 text-gray-400" />
                    {{ child.name }}
                  </router-link>
                </div>
              </div>
              <router-link
                v-else
                :to="item.to"
                :class="[
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors h-16 align-middle',
                  $route.name === item.routeName
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                ]"
                style="background: none; height: 100%;"
              >
                <component :is="item.icon" class="w-4 h-4 mr-2" />
                {{ item.name }}
              </router-link>
            </template>
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
        <template v-for="item in navigationItems" :key="item.name">
          <div v-if="item.children" class="mb-2">
            <div class="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 bg-gray-100">
              <component :is="item.icon" class="w-5 h-5 mr-3" />
              {{ item.name }}
            </div>
            <div class="ml-6">
              <router-link
                v-for="child in item.children"
                :key="child.name"
                :to="child.to"
                class="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                @click="closeMobileMenu"
              >
                <component :is="child.icon" class="w-5 h-5 mr-3" />
                {{ child.name }}
              </router-link>
            </div>
          </div>
          <router-link
            v-else
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
        </template>
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
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  DocumentTextIcon,
  CogIcon
} from '@heroicons/vue/24/outline'

import NotificationBell from '@/components/common/NotificationBell.vue'
import UserMenu from '@/components/common/UserMenu.vue'


const showMobileMenu = ref(false)
const isAdminMenuOpen = ref(false)
let adminMenuCloseTimeout: ReturnType<typeof setTimeout> | null = null

function openAdminMenu() {
  if (adminMenuCloseTimeout) clearTimeout(adminMenuCloseTimeout)
  isAdminMenuOpen.value = true
}
function closeAdminMenu() {
  adminMenuCloseTimeout = setTimeout(() => {
    isAdminMenuOpen.value = false
  }, 200)
}

// Tạm thời sử dụng navigation items cũ
const navigationItems = [
  {
    name: 'Home',
    to: '/',
    routeName: 'Home',
    icon: ChartBarIcon
  },
  {
    name: 'Kho dữ liệu',
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
    name: 'Kho Dashboard',
    to: '/dashboards',
    routeName: 'DashboardStore',
    icon: BuildingStorefrontIcon
  },
  // {
  //   name: 'Quick Dashboard',
  //   to: '/quick-dashboard',
  //   routeName: 'QuickDashboard',
  //   icon: BoltIcon
  // },
  {
    name: 'Quản trị hệ thống',
    icon: CogIcon,
    children: [
      {
        name: 'User Management',
        to: '/admin/users',
        routeName: 'UserManagement',
        icon: UserIcon
      },
      {
        name: 'Access Logs',
        to: '/admin/access-logs',
        routeName: 'AccessLogs',
        icon: DocumentTextIcon
      }
    ]
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
