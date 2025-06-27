/**
 * Storage Utilities
 * Utility functions để xử lý localStorage và sessionStorage
 */

import { STORAGE_KEYS } from '@/constants'

/**
 * Safe localStorage wrapper
 */
export class LocalStorage {
  /**
   * Check if localStorage is available
   */
  static isAvailable(): boolean {
    try {
      const test = '__localStorage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }

  /**
   * Get item from localStorage
   */
  static getItem<T>(key: string, defaultValue?: T): T | null {
    if (!this.isAvailable()) return defaultValue || null

    try {
      const item = localStorage.getItem(key)
      if (item === null) return defaultValue || null
      
      return JSON.parse(item)
    } catch (error) {
      console.error(`Error getting localStorage item "${key}":`, error)
      return defaultValue || null
    }
  }

  /**
   * Set item to localStorage
   */
  static setItem<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) return false

    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error setting localStorage item "${key}":`, error)
      return false
    }
  }

  /**
   * Remove item from localStorage
   */
  static removeItem(key: string): boolean {
    if (!this.isAvailable()) return false

    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing localStorage item "${key}":`, error)
      return false
    }
  }

  /**
   * Clear all localStorage
   */
  static clear(): boolean {
    if (!this.isAvailable()) return false

    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }

  /**
   * Get all keys
   */
  static getAllKeys(): string[] {
    if (!this.isAvailable()) return []

    try {
      return Object.keys(localStorage)
    } catch (error) {
      console.error('Error getting localStorage keys:', error)
      return []
    }
  }

  /**
   * Get storage size in bytes
   */
  static getSize(): number {
    if (!this.isAvailable()) return 0

    try {
      let total = 0
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          total += localStorage[key].length + key.length
        }
      }
      return total
    } catch (error) {
      console.error('Error calculating localStorage size:', error)
      return 0
    }
  }
}

/**
 * Safe sessionStorage wrapper
 */
export class SessionStorage {
  /**
   * Check if sessionStorage is available
   */
  static isAvailable(): boolean {
    try {
      const test = '__sessionStorage_test__'
      sessionStorage.setItem(test, test)
      sessionStorage.removeItem(test)
      return true
    } catch {
      return false
    }
  }

  /**
   * Get item from sessionStorage
   */
  static getItem<T>(key: string, defaultValue?: T): T | null {
    if (!this.isAvailable()) return defaultValue || null

    try {
      const item = sessionStorage.getItem(key)
      if (item === null) return defaultValue || null
      
      return JSON.parse(item)
    } catch (error) {
      console.error(`Error getting sessionStorage item "${key}":`, error)
      return defaultValue || null
    }
  }

  /**
   * Set item to sessionStorage
   */
  static setItem<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) return false

    try {
      sessionStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error(`Error setting sessionStorage item "${key}":`, error)
      return false
    }
  }

  /**
   * Remove item from sessionStorage
   */
  static removeItem(key: string): boolean {
    if (!this.isAvailable()) return false

    try {
      sessionStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Error removing sessionStorage item "${key}":`, error)
      return false
    }
  }

  /**
   * Clear all sessionStorage
   */
  static clear(): boolean {
    if (!this.isAvailable()) return false

    try {
      sessionStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing sessionStorage:', error)
      return false
    }
  }
}

/**
 * Cache with expiration
 */
export class CacheStorage {
  private static prefix = 'cache_'

  /**
   * Set item with expiration
   */
  static setItem<T>(
    key: string,
    value: T,
    expirationMinutes: number = 60
  ): boolean {
    const expirationTime = Date.now() + expirationMinutes * 60 * 1000
    const cacheItem = {
      value,
      expiration: expirationTime
    }

    return LocalStorage.setItem(this.prefix + key, cacheItem)
  }

  /**
   * Get item if not expired
   */
  static getItem<T>(key: string, defaultValue?: T): T | null {
    const cacheItem = LocalStorage.getItem<{
      value: T
      expiration: number
    }>(this.prefix + key)

    if (!cacheItem) return defaultValue || null

    // Check if expired
    if (Date.now() > cacheItem.expiration) {
      this.removeItem(key)
      return defaultValue || null
    }

    return cacheItem.value
  }

  /**
   * Remove cached item
   */
  static removeItem(key: string): boolean {
    return LocalStorage.removeItem(this.prefix + key)
  }

  /**
   * Clear all expired items
   */
  static clearExpired(): number {
    let clearedCount = 0
    const keys = LocalStorage.getAllKeys()

    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        const cacheItem = LocalStorage.getItem<{
          value: any
          expiration: number
        }>(key)

        if (cacheItem && Date.now() > cacheItem.expiration) {
          LocalStorage.removeItem(key)
          clearedCount++
        }
      }
    })

    return clearedCount
  }

  /**
   * Clear all cached items
   */
  static clearAll(): number {
    let clearedCount = 0
    const keys = LocalStorage.getAllKeys()

    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        LocalStorage.removeItem(key)
        clearedCount++
      }
    })

    return clearedCount
  }
}

/**
 * App-specific storage helpers
 */
export const AppStorage = {
  // User preferences
  getUserPreferences: () => LocalStorage.getItem(STORAGE_KEYS.USER_PREFERENCES),
  setUserPreferences: (preferences: any) => 
    LocalStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, preferences),

  // Theme
  getTheme: () => LocalStorage.getItem(STORAGE_KEYS.THEME, 'light'),
  setTheme: (theme: string) => LocalStorage.setItem(STORAGE_KEYS.THEME, theme),

  // Language
  getLanguage: () => LocalStorage.getItem(STORAGE_KEYS.LANGUAGE, 'vi'),
  setLanguage: (language: string) => LocalStorage.setItem(STORAGE_KEYS.LANGUAGE, language),

  // Auth token
  getAuthToken: () => LocalStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
  setAuthToken: (token: string) => LocalStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token),
  removeAuthToken: () => LocalStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),

  // Dashboard layout
  getDashboardLayout: (dashboardId: string) => 
    LocalStorage.getItem(`${STORAGE_KEYS.DASHBOARD_LAYOUT}_${dashboardId}`),
  setDashboardLayout: (dashboardId: string, layout: any) => 
    LocalStorage.setItem(`${STORAGE_KEYS.DASHBOARD_LAYOUT}_${dashboardId}`, layout),

  // Recent items
  getRecentItems: () => LocalStorage.getItem(STORAGE_KEYS.RECENT_ITEMS, []),
  addRecentItem: (item: any) => {
    const recent = AppStorage.getRecentItems() as any[]
    const filtered = recent.filter(r => r.id !== item.id)
    const updated = [item, ...filtered].slice(0, 10) // Keep only 10 recent items
    LocalStorage.setItem(STORAGE_KEYS.RECENT_ITEMS, updated)
  },

  // Clear all app data
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      LocalStorage.removeItem(key)
    })
  }
}

/**
 * Storage event listener
 */
export const onStorageChange = (
  callback: (key: string, newValue: any, oldValue: any) => void
) => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key && event.storageArea === localStorage) {
      let newValue = null
      let oldValue = null

      try {
        newValue = event.newValue ? JSON.parse(event.newValue) : null
        oldValue = event.oldValue ? JSON.parse(event.oldValue) : null
      } catch (error) {
        console.error('Error parsing storage event values:', error)
      }

      callback(event.key, newValue, oldValue)
    }
  }

  window.addEventListener('storage', handleStorageChange)

  // Return cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageChange)
  }
}
