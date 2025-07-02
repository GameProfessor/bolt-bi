<template>
  <div class="relative">
    <button
      @click="toggleMenu"
      class="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
    >
      <img
        :src="user.avatar || defaultAvatar"
        :alt="user.name"
        class="h-8 w-8 rounded-full object-cover"
      />
      <ChevronDownIcon class="h-4 w-4 text-gray-500" />
    </button>

    <!-- User menu dropdown -->
    <div
      v-if="showMenu"
      class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
    >
      <div class="py-1">
        <!-- User info -->
        <div class="px-4 py-3 border-b border-gray-100">
          <div class="flex items-center space-x-3">
            <img
              :src="user.avatar || defaultAvatar"
              :alt="user.name"
              class="h-10 w-10 rounded-full object-cover"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ user.name }}
              </p>
              <p class="text-sm text-gray-500 truncate">
                {{ user.email }}
              </p>
            </div>
          </div>
        </div>

        <!-- Menu items -->
        <div class="py-1">
          <router-link
            v-for="item in menuItems"
            :key="item.name"
            :to="item.to"
            class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            @click="showMenu = false"
          >
            <component :is="item.icon" class="h-4 w-4 mr-3 text-gray-400" />
            {{ item.name }}
          </router-link>
        </div>

        <!-- Divider -->
        <div class="border-t border-gray-100"></div>

        <!-- Settings & Logout -->
        <div class="py-1">
          <router-link
            to="/settings"
            class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            @click="showMenu = false"
          >
            <CogIcon class="h-4 w-4 mr-3 text-gray-400" />
            Settings
          </router-link>
          
          <button
            @click="handleLogout"
            class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            <ArrowRightOnRectangleIcon class="h-4 w-4 mr-3 text-gray-400" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ChevronDownIcon,
  UserIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  HeartIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const showMenu = ref(false)

// Mock user data - trong thực tế sẽ lấy từ auth store
const user = ref({
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: null,
  role: 'Admin'
})

const defaultAvatar = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.value.name) + '&background=6366f1&color=fff'

const menuItems = [
  {
    name: 'Profile',
    to: '/profile',
    icon: UserIcon
  },
  {
    name: 'My Dashboards',
    to: '/my-dashboards',
    icon: ChartBarIcon
  },
  {
    name: 'My Reports',
    to: '/my-reports',
    icon: DocumentTextIcon
  },
  {
    name: 'Favorites',
    to: '/favorites',
    icon: HeartIcon
  }
]

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const handleLogout = async () => {
  try {
    // Call logout API
    // await authService.logout()
    
    // Clear user data
    // authStore.clearUser()
    
    // Redirect to login
    router.push('/login')
    showMenu.value = false
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// Close menu when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.relative')) {
    showMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
