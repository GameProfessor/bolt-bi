<template>
  <div class="notification-container fixed top-4 right-4 z-50 space-y-2 max-w-md w-full sm:w-auto px-4 sm:px-0">
    <TransitionGroup
      name="notification"
      tag="div"
      class="space-y-2"
    >
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="w-full sm:min-w-80 sm:max-w-md bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden"
      >
        <div class="p-4">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0">
              <component
                :is="getIcon(notification.type)"
                class="h-6 w-6"
                :class="getIconColor(notification.type)"
              />
            </div>
            <div class="flex-1 pt-0.5 min-w-0">
              <p class="text-sm font-medium text-gray-900 break-words">
                {{ notification.title }}
              </p>
              <p class="mt-1 text-sm text-gray-500 break-words leading-relaxed">
                {{ notification.message }}
              </p>
              <div v-if="notification.actions" class="mt-3 flex flex-wrap gap-2">
                <button
                  v-for="action in notification.actions"
                  :key="action.label"
                  @click="handleAction(notification, action)"
                  class="text-sm font-medium px-2 py-1 rounded transition-colors"
                  :class="action.primary
                    ? 'text-primary-600 hover:text-primary-500 hover:bg-primary-50'
                    : 'text-gray-600 hover:text-gray-500 hover:bg-gray-50'"
                >
                  {{ action.label }}
                </button>
              </div>
            </div>
            <div class="flex-shrink-0 flex">
              <button
                @click="removeNotification(notification.id)"
                class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 p-1"
                title="Đóng thông báo"
              >
                <XMarkIcon class="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
        
        <!-- Progress bar for auto-dismiss -->
        <div
          v-if="notification.autoDismiss"
          class="h-1 bg-gray-200"
        >
          <div
            class="h-full transition-all duration-100 ease-linear"
            :class="getProgressBarColor(notification.type)"
            :style="{ width: `${getProgress(notification)}%` }"
          ></div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

interface NotificationAction {
  label: string
  handler: () => void
  primary?: boolean
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  autoDismiss?: boolean
  duration?: number
  actions?: NotificationAction[]
  createdAt: number
}

const notifications = ref<Notification[]>([])
const timers = new Map<string, NodeJS.Timeout>()

// Mock notifications for demo
onMounted(() => {
  // Add some demo notifications
  setTimeout(() => {
    addNotification({
      type: 'success',
      title: 'Lưu dashboard thành công!',
      message: 'Dashboard "Báo cáo doanh thu tháng 12/2024" đã được lưu và đồng bộ với cơ sở dữ liệu thành công.',
      autoDismiss: true,
      duration: 5000
    })
  }, 1000)

  setTimeout(() => {
    addNotification({
      type: 'warning',
      title: 'Cảnh báo kết nối dữ liệu',
      message: 'Kết nối đến nguồn dữ liệu "Database Production" đang không ổn định. Một số biểu đồ có thể hiển thị dữ liệu không chính xác.',
      autoDismiss: true,
      duration: 5000,
      actions: [
        {
          label: 'Thử lại',
          handler: () => console.log('Retry clicked'),
          primary: true
        },
        {
          label: 'Bỏ qua',
          handler: () => console.log('Dismiss clicked')
        }
      ]
    })
  }, 2000)

  setTimeout(() => {
    addNotification({
      type: 'error',
      title: 'Lỗi tải dữ liệu',
      message: 'Không thể tải dữ liệu từ API endpoint "/api/v1/analytics/revenue-report". Vui lòng kiểm tra kết nối mạng và thử lại.',
      autoDismiss: true,
      actions: [
        {
          label: 'Tải lại',
          handler: () => console.log('Reload clicked'),
          primary: true
        },
        {
          label: 'Xem chi tiết',
          handler: () => console.log('Details clicked')
        }
      ]
    })
  }, 3000)
})

const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
  const id = Date.now().toString()
  const newNotification: Notification = {
    ...notification,
    id,
    createdAt: Date.now()
  }
  
  notifications.value.push(newNotification)
  
  if (notification.autoDismiss) {
    const duration = notification.duration || 5000
    const timer = setTimeout(() => {
      removeNotification(id)
    }, duration)
    timers.set(id, timer)
  }
}

const removeNotification = (id: string) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
  
  const timer = timers.get(id)
  if (timer) {
    clearTimeout(timer)
    timers.delete(id)
  }
}

const handleAction = (notification: Notification, action: NotificationAction) => {
  action.handler()
  removeNotification(notification.id)
}

const getIcon = (type: string) => {
  const icons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon
  }
  return icons[type as keyof typeof icons]
}

const getIconColor = (type: string) => {
  const colors = {
    success: 'text-green-400',
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  }
  return colors[type as keyof typeof colors]
}

const getProgressBarColor = (type: string) => {
  const colors = {
    success: 'bg-green-400',
    error: 'bg-red-400',
    warning: 'bg-yellow-400',
    info: 'bg-blue-400'
  }
  return colors[type as keyof typeof colors]
}

const getProgress = (notification: Notification) => {
  if (!notification.autoDismiss) return 0
  
  const elapsed = Date.now() - notification.createdAt
  const duration = notification.duration || 5000
  const progress = Math.max(0, 100 - (elapsed / duration) * 100)
  
  return progress
}

onUnmounted(() => {
  timers.forEach(timer => clearTimeout(timer))
  timers.clear()
})

// Export function để các component khác có thể sử dụng
defineExpose({
  addNotification
})
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}

/* Đảm bảo text không bị overflow */
.break-words {
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
}

/* Mobile responsive */
@media (max-width: 640px) {
  .notification-container {
    left: 1rem;
    right: 1rem;
    top: 1rem;
  }
}
</style>
