/**
 * Data Source Store Module
 * Pinia store cho Data Source management
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Legacy interfaces for backward compatibility
export interface DataSourceColumn {
  name: string
  type: 'string' | 'number' | 'date'
  values: any[]
  isCustom?: boolean
  expression?: string
}

export interface DataSource {
  id: string
  name: string
  description?: string
  category?: string
  columns: DataSourceColumn[]
  rows: any[]
  createdAt: Date
}

export const useDataSourceStore = defineStore('dataSource', () => {
  // State
  const dataSources = ref<DataSource[]>([])
  const currentDataSource = ref<DataSource | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const getDataSourceById = computed(() => {
    return (id: string) => dataSources.value.find(ds => ds.id === id)
  })

  // Load from localStorage
  const loadFromStorage = () => {
    const stored = localStorage.getItem('bi-data-sources')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        dataSources.value = parsed.map((ds: any) => ({
          ...ds,
          createdAt: new Date(ds.createdAt)
        }))
      } catch (e) {
        console.error('Failed to load data sources from storage:', e)
      }
    }
  }

  const saveToStorage = () => {
    localStorage.setItem('bi-data-sources', JSON.stringify(dataSources.value))
  }

  // Actions
  const loadDataSources = async () => {
    isLoading.value = true
    error.value = null

    try {
      loadFromStorage()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load data sources'
      console.error('Error loading data sources:', err)
    } finally {
      isLoading.value = false
    }
  }

  const createDataSource = async (dataSource: Omit<DataSource, 'id' | 'createdAt'>) => {
    isLoading.value = true
    error.value = null

    try {
      const newDataSource: DataSource = {
        ...dataSource,
        id: Date.now().toString(),
        createdAt: new Date()
      }
      dataSources.value.push(newDataSource)
      saveToStorage()
      return newDataSource
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create data source'
      console.error('Error creating data source:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteDataSource = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      dataSources.value = dataSources.value.filter(ds => ds.id !== id)
      saveToStorage()

      if (currentDataSource.value?.id === id) {
        currentDataSource.value = null
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete data source'
      console.error('Error deleting data source:', err)
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
    dataSources,
    currentDataSource,
    isLoading,
    error,

    // Getters
    getDataSourceById,

    // Actions
    loadDataSources,
    createDataSource,
    deleteDataSource,
    clearError
  }
})
