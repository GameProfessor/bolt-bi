/**
 * Dashboard Store Module
 * Pinia store cho Dashboard management
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Legacy interfaces for backward compatibility
export interface Dashboard {
  id: string
  name: string
  description?: string
  widgets: any[]
  layout: any[]
  createdAt: Date
  updatedAt?: Date
}

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const dashboards = ref<Dashboard[]>([])
  const currentDashboard = ref<Dashboard | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const getDashboardById = computed(() => {
    return (id: string) => dashboards.value.find(d => d.id === id)
  })

  // Load from localStorage
  const loadFromStorage = () => {
    const stored = localStorage.getItem('bi-dashboards')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        dashboards.value = parsed.map((d: any) => ({
          ...d,
          createdAt: new Date(d.createdAt),
          updatedAt: d.updatedAt ? new Date(d.updatedAt) : undefined
        }))
      } catch (e) {
        console.error('Failed to load dashboards from storage:', e)
      }
    }
  }

  const saveToStorage = () => {
    localStorage.setItem('bi-dashboards', JSON.stringify(dashboards.value))
  }

  // Actions
  const loadDashboards = async () => {
    isLoading.value = true
    error.value = null

    try {
      loadFromStorage()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load dashboards'
      console.error('Error loading dashboards:', err)
    } finally {
      isLoading.value = false
    }
  }

  const createDashboard = async (dashboard: Omit<Dashboard, 'id' | 'createdAt'>) => {
    isLoading.value = true
    error.value = null

    try {
      const newDashboard: Dashboard = {
        ...dashboard,
        id: Date.now().toString(),
        createdAt: new Date()
      }
      dashboards.value.push(newDashboard)
      saveToStorage()
      return newDashboard
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create dashboard'
      console.error('Error creating dashboard:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteDashboard = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      dashboards.value = dashboards.value.filter(d => d.id !== id)
      saveToStorage()

      if (currentDashboard.value?.id === id) {
        currentDashboard.value = null
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete dashboard'
      console.error('Error deleting dashboard:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Initialize store
  loadFromStorage()

  return {
    // State
    dashboards,
    currentDashboard,
    isLoading,
    error,

    // Getters
    getDashboardById,

    // Actions
    loadDashboards,
    createDashboard,
    deleteDashboard,
    clearError
  }
})
