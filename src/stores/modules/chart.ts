/**
 * Chart Store Module
 * Pinia store cho Chart management
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Legacy interfaces for backward compatibility
export interface Chart {
  id: string
  name: string
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'card'
  data: any
  config: any
  createdAt: Date
  updatedAt?: Date
}

export interface ChartConfig {
  id?: string
  name: string
  title?: string
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'card'
  dataSourceId: string
  xAxis?: string | string[]
  yAxis?: string
  category?: string
  keyMetric?: string
  previousMetric?: string
  differenceType?: 'absolute' | 'percentage'
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max'
  backgroundColor?: string
  borderColor?: string
  filters?: Record<string, any>
}

export const useChartStore = defineStore('chart', () => {
  // State
  const charts = ref<Chart[]>([])
  const currentChart = ref<Chart | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const getChartById = computed(() => {
    return (id: string) => charts.value.find(c => c.id === id)
  })

  // Load from localStorage
  const loadFromStorage = () => {
    const stored = localStorage.getItem('bi-charts')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        charts.value = parsed.map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: c.updatedAt ? new Date(c.updatedAt) : undefined
        }))
      } catch (e) {
        console.error('Failed to load charts from storage:', e)
      }
    }
  }

  const saveToStorage = () => {
    localStorage.setItem('bi-charts', JSON.stringify(charts.value))
  }

  // Actions
  const loadCharts = async () => {
    isLoading.value = true
    error.value = null

    try {
      loadFromStorage()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load charts'
      console.error('Error loading charts:', err)
    } finally {
      isLoading.value = false
    }
  }

  const createChart = async (chart: Omit<Chart, 'id' | 'createdAt'>) => {
    isLoading.value = true
    error.value = null

    try {
      const newChart: Chart = {
        ...chart,
        id: Date.now().toString(),
        createdAt: new Date()
      }
      charts.value.push(newChart)
      saveToStorage()
      return newChart
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create chart'
      console.error('Error creating chart:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteChart = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      charts.value = charts.value.filter(c => c.id !== id)
      saveToStorage()

      if (currentChart.value?.id === id) {
        currentChart.value = null
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete chart'
      console.error('Error deleting chart:', err)
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
    charts,
    currentChart,
    isLoading,
    error,

    // Getters
    getChartById,

    // Actions
    loadCharts,
    createChart,
    deleteChart,
    clearError
  }
})
