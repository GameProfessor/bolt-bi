<template>
  <div class="relative">
    <button
      @click="toggleNotifications"
      class="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-full"
    >
      <BellIcon class="h-6 w-6" />
      
      <!-- Notification badge -->
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Notifications dropdown -->
    <div
      v-if="showNotifications"
      class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
    >
      <div class="py-1">
        <!-- Header -->
        <div class="px-4 py-2 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-medium text-gray-900">Notifications</h3>
            <button
              v-if="unreadCount > 0"
              @click="markAllAsRead"
              class="text-xs text-primary-600 hover:text-primary-500"
            >
              Mark all as read
            </button>
          </div>
        </div>

        <!-- Notifications list -->
        <div class="max-h-64 overflow-y-auto">
          <div
            v-if="notifications.length === 0"
            class="px-4 py-8 text-center text-gray-500 text-sm"
          >
            No notifications
          </div>
          
          <div
            v-for="notification in notifications"
            :key="notification.id"
            class="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
            :class="{ 'bg-blue-50': !notification.read }"
            @click="handleNotificationClick(notification)"
          >
            <div class="flex items-start space-x-3">
              <div class="flex-shrink-0">
                <component
                  :is="getNotificationIcon(notification.type)"
                  class="h-5 w-5"
                  :class="getNotificationIconColor(notification.type)"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">
                  {{ notification.title }}
                </p>
                <p class="text-sm text-gray-500 mt-1">
                  {{ notification.message }}
                </p>
                <p class="text-xs text-gray-400 mt-1">
                  {{ formatTime(notification.createdAt) }}
                </p>
              </div>
              <div v-if="!notification.read" class="flex-shrink-0">
                <div class="h-2 w-2 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-4 py-2 border-t border-gray-100">
          <router-link
            to="/notifications"
            class="text-sm text-primary-600 hover:text-primary-500"
            @click="showNotifications = false"
          >
            View all notifications
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  BellIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  read: boolean
  createdAt: Date
  actionUrl?: string
}

const showNotifications = ref(false)

// Mock notifications - trong thực tế sẽ lấy từ store
const notifications = ref<Notification[]>([
  {
    id: '1',
    title: 'Dashboard Updated',
    message: 'Sales dashboard has been updated with new data',
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
  },
  {
    id: '2',
    title: 'Data Source Error',
    message: 'Connection to MySQL database failed',
    type: 'error',
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
  },
  {
    id: '3',
    title: 'Export Complete',
    message: 'Your dashboard export is ready for download',
    type: 'success',
    read: true,
    createdAt: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
  }
])

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
}

const handleNotificationClick = (notification: Notification) => {
  notification.read = true
  if (notification.actionUrl) {
    // Navigate to action URL
  }
}

const getNotificationIcon = (type: string) => {
  const icons = {
    info: InformationCircleIcon,
    warning: ExclamationTriangleIcon,
    success: CheckCircleIcon,
    error: XCircleIcon
  }
  return icons[type as keyof typeof icons] || InformationCircleIcon
}

const getNotificationIconColor = (type: string) => {
  const colors = {
    info: 'text-blue-500',
    warning: 'text-yellow-500',
    success: 'text-green-500',
    error: 'text-red-500'
  }
  return colors[type as keyof typeof colors] || 'text-gray-500'
}

const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

// Close notifications when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.relative')) {
    showNotifications.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
