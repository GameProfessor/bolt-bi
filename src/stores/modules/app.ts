/**
 * App Store Module
 * Pinia store cho App state management
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { 
  User, 
  AppState, 
  Notification,
  UserPreferences 
} from '@/types'
import { STORAGE_KEYS } from '@/constants'

export interface NavigationHistoryItem {
  name: string
  path: string
  title: string
  timestamp: number
}

export const useAppStore = defineStore('app', () => {
  // State
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const theme = ref<'light' | 'dark'>('light')
  const language = ref<'en' | 'vi'>('vi')
  const isLoading = ref(false)
  const notifications = ref<Notification[]>([])
  const sidebarCollapsed = ref(false)
  const isOnline = ref(navigator.onLine)
  const pageTitle = ref('Dashboard')
  const pageDescription = ref('')
  const navigationHistory = ref<NavigationHistoryItem[]>([])

  // Getters
  const currentUser = computed(() => user.value)
  
  const unreadNotifications = computed(() => 
    notifications.value.filter(n => !n.read)
  )
  
  const unreadNotificationCount = computed(() => 
    unreadNotifications.value.length
  )

  const isDarkMode = computed(() => theme.value === 'dark')

  const userPreferences = computed(() => user.value?.preferences)

  // Actions
  const setUser = (userData: User) => {
    user.value = userData
    isAuthenticated.value = true
    
    // Apply user preferences
    if (userData.preferences) {
      setTheme(userData.preferences.theme === 'auto' ? 'light' : userData.preferences.theme)
      setLanguage(userData.preferences.language)
    }
  }

  const clearUser = () => {
    user.value = null
    isAuthenticated.value = false
    
    // Clear stored auth data
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES)
  }

  const updateUserPreferences = (preferences: Partial<UserPreferences>) => {
    if (user.value) {
      user.value.preferences = {
        ...user.value.preferences,
        ...preferences
      }
      
      // Save to localStorage
      localStorage.setItem(
        STORAGE_KEYS.USER_PREFERENCES, 
        JSON.stringify(user.value.preferences)
      )
      
      // Apply preferences
      if (preferences.theme) {
        setTheme(preferences.theme === 'auto' ? 'light' : preferences.theme)
      }
      if (preferences.language) {
        setLanguage(preferences.language)
      }
    }
  }

  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme)
    
    // Apply theme to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  const setLanguage = (newLanguage: 'en' | 'vi') => {
    language.value = newLanguage
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, newLanguage)
    
    // Update document lang attribute
    document.documentElement.lang = newLanguage
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    }
    
    notifications.value.unshift(newNotification)
    
    // Limit notifications count
    if (notifications.value.length > 10) {
      notifications.value = notifications.value.slice(0, 10)
    }
    
    // Auto remove success notifications after 5 seconds
    if (notification.type === 'success') {
      setTimeout(() => {
        removeNotification(newNotification.id)
      }, 5000)
    }
    
    return newNotification.id
  }

  const removeNotification = (id: string) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  const markNotificationAsRead = (id: string) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  const markAllNotificationsAsRead = () => {
    notifications.value.forEach(n => n.read = true)
  }

  const clearNotifications = () => {
    notifications.value = []
  }

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  const setSidebarCollapsed = (collapsed: boolean) => {
    sidebarCollapsed.value = collapsed
  }

  const setOnlineStatus = (online: boolean) => {
    isOnline.value = online
  }

  const setPageTitle = (title: string) => {
    pageTitle.value = title
  }

  const setPageDescription = (description: string) => {
    pageDescription.value = description
  }

  const addToNavigationHistory = (item: NavigationHistoryItem) => {
    // Chỉ lưu 10 item gần nhất
    navigationHistory.value.unshift(item)
    if (navigationHistory.value.length > 10) {
      navigationHistory.value = navigationHistory.value.slice(0, 10)
    }
  }

  const clearNavigationHistory = () => {
    navigationHistory.value = []
  }

  // Initialize from localStorage
  const initializeFromStorage = () => {
    // Load theme
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark'
    if (savedTheme) {
      setTheme(savedTheme)
    }
    
    // Load language
    const savedLanguage = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as 'en' | 'vi'
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
    
    // Load user preferences
    const savedPreferences = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES)
    if (savedPreferences && user.value) {
      try {
        const preferences = JSON.parse(savedPreferences)
        user.value.preferences = preferences
      } catch (error) {
        console.error('Error parsing user preferences:', error)
      }
    }
  }

  // Utility functions
  const showSuccess = (message: string, title?: string) => {
    addNotification({
      type: 'success',
      title: title || 'Thành công',
      message
    })
  }

  const showError = (message: string, title?: string) => {
    addNotification({
      type: 'error',
      title: title || 'Lỗi',
      message
    })
  }

  const showWarning = (message: string, title?: string) => {
    addNotification({
      type: 'warning',
      title: title || 'Cảnh báo',
      message
    })
  }

  const showInfo = (message: string, title?: string) => {
    addNotification({
      type: 'info',
      title: title || 'Thông tin',
      message
    })
  }

  // Listen to online/offline events
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => setOnlineStatus(true))
    window.addEventListener('offline', () => setOnlineStatus(false))
  }

  return {
    // State
    user,
    isAuthenticated,
    theme,
    language,
    isLoading,
    notifications,
    sidebarCollapsed,
    isOnline,
    pageTitle,
    pageDescription,
    navigationHistory,
    
    // Getters
    currentUser,
    unreadNotifications,
    unreadNotificationCount,
    isDarkMode,
    userPreferences,
    
    // Actions
    setUser,
    clearUser,
    updateUserPreferences,
    setTheme,
    toggleTheme,
    setLanguage,
    setLoading,
    addNotification,
    removeNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    toggleSidebar,
    setSidebarCollapsed,
    setOnlineStatus,
    setPageTitle,
    setPageDescription,
    addToNavigationHistory,
    clearNavigationHistory,
    initializeFromStorage,
    
    // Utility functions
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
})
