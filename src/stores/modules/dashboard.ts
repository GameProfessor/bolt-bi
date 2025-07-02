// /**
//  * Dashboard Store Module
//  * Pinia store cho Dashboard management
//  */


import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { nanoid } from 'nanoid'
import type { Dashboard, DashboardChart, DashboardTab } from '@/types/dashboard'


export const useDashboardStore = defineStore('dashboard', () => {
  const dashboards = ref<Dashboard[]>([])
  const currentDashboard = ref<Dashboard | null>(null)

  const getDashboardById = computed(() => {
    return (id: string) => dashboards.value.find(d => d.id === id)
  })

  const loadFromStorage = () => {
    const stored = localStorage.getItem('bi-dashboards')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        dashboards.value = parsed.map((dashboard: any) => ({
          ...dashboard,
          createdAt: new Date(dashboard.createdAt),
          charts: dashboard.charts?.map((chart: any) => ({
            ...chart,
            createdAt: new Date(chart.createdAt),
            updatedAt: chart.updatedAt ? new Date(chart.updatedAt) : undefined
          })) || [],
          dataSourceIds: dashboard.dataSourceIds || []
        }))
      } catch (e) {
        console.error('Failed to load dashboards from storage:', e)
      }
    }
  }

  const saveToStorage = () => {
    localStorage.setItem('bi-dashboards', JSON.stringify(dashboards.value))
  }

  const createDashboard = (name: string, description?: string, dataSourceIds?: string[], category?: string) => {
    const dashboard: Dashboard = {
      id: nanoid(),
      name,
      description,
      charts: [],
      tabs: [{ id: nanoid(), name: 'Tab 1', chartIds: [] }],
      createdAt: new Date(),
      dataSourceIds: dataSourceIds || [],
      category
    }
    dashboards.value.push(dashboard)
    saveToStorage()
    return dashboard
  }

  const updateDashboard = (id: string, updates: Partial<Dashboard>) => {
    const dashboard = dashboards.value.find(d => d.id === id)
    if (dashboard) {
      Object.assign(dashboard, updates)
      saveToStorage()
    }
  }

  const deleteDashboard = (id: string) => {
    const index = dashboards.value.findIndex(d => d.id === id)
    if (index > -1) {
      dashboards.value.splice(index, 1)
      saveToStorage()
    }
  }

  // Chart management methods
  const addChart = (dashboardId: string, chart: Omit<DashboardChart, 'id' | 'dashboardId' | 'createdAt'>) => {
    const dashboard = dashboards.value.find(d => d.id === dashboardId)
    if (dashboard) {
      const newChart: DashboardChart = {
        ...chart,
        id: nanoid(),
        dashboardId,
        createdAt: new Date()
      }
      dashboard.charts.push(newChart)
      return newChart
    }
    throw new Error(`Dashboard with id ${dashboardId} not found`)
  }

  const updateChart = (dashboardId: string, chartId: string, updates: Partial<DashboardChart>) => {
    const dashboard = dashboards.value.find(d => d.id === dashboardId)
    if (dashboard) {
      const chartIndex = dashboard.charts.findIndex(c => c.id === chartId)
      if (chartIndex !== -1) {
        // Create a new chart object to ensure Vue reactivity
        const updatedChart = {
          ...dashboard.charts[chartIndex],
          ...updates,
          updatedAt: new Date()
        }
        // Replace the chart in the array to trigger reactivity
        dashboard.charts[chartIndex] = updatedChart
        return updatedChart
      }
    }
    throw new Error(`Chart with id ${chartId} not found`)
  }

  const removeChart = (dashboardId: string, chartId: string) => {
    const dashboard = dashboards.value.find(d => d.id === dashboardId)
    if (dashboard) {
      dashboard.charts = dashboard.charts.filter(c => c.id !== chartId)
      
      // Remove chart from all tabs
      dashboard.tabs.forEach(tab => {
        tab.chartIds = tab.chartIds.filter(id => id !== chartId)
      })
    }
  }

  const updateChartLayout = (dashboardId: string, chartId: string, layout: { x: number, y: number, w: number, h: number }) => {
    const dashboard = dashboards.value.find(d => d.id === dashboardId)
    if (dashboard) {
      const chart = dashboard.charts.find(c => c.id === chartId)
      if (chart) {
        chart.layout = layout
        chart.updatedAt = new Date()
      }
    }
  }

  // Tab management methods
  const addTab = (dashboardId: string, name: string) => {
    const dashboard = dashboards.value.find(d => d.id === dashboardId)
    if (dashboard) {
      const newTab: DashboardTab = {
        id: nanoid(),
        name,
        chartIds: []
      }
      dashboard.tabs.push(newTab)
      return newTab
    }
  }

  const updateTab = (dashboardId: string, tabId: string, updates: Partial<DashboardTab>) => {
    const dashboard = dashboards.value.find(d => d.id === dashboardId)
    if (dashboard) {
      const tab = dashboard.tabs.find(t => t.id === tabId)
      if (tab) {
        Object.assign(tab, updates)
      }
    }
  }

  const removeTab = (dashboardId: string, tabId: string) => {
    const dashboard = dashboards.value.find(d => d.id === dashboardId)
    if (dashboard && dashboard.tabs.length > 1) {
      const tab = dashboard.tabs.find(t => t.id === tabId)
      if (tab) {
        // Remove all charts in this tab
        tab.chartIds.forEach(chartId => {
          removeChart(dashboardId, chartId)
        })
        
        // Remove the tab
        dashboard.tabs = dashboard.tabs.filter(t => t.id !== tabId)
      }
    }
  }

  const addChartToTab = (dashboardId: string, tabId: string, chartId: string) => {
    const dashboard = dashboards.value.find(d => d.id === dashboardId)
    if (dashboard) {
      const tab = dashboard.tabs.find(t => t.id === tabId)
      if (tab && !tab.chartIds.includes(chartId)) {
        tab.chartIds.push(chartId)
      }
    }
  }

  const removeChartFromTab = (dashboardId: string, tabId: string, chartId: string) => {
    const dashboard = dashboards.value.find(d => d.id === dashboardId)
    if (dashboard) {
      const tab = dashboard.tabs.find(t => t.id === tabId)
      if (tab) {
        tab.chartIds = tab.chartIds.filter(id => id !== chartId)
      }
    }
  }

  // Initialize from storage
  loadFromStorage()

  return {
    dashboards,
    currentDashboard,
    getDashboardById,
    createDashboard,
    updateDashboard,
    deleteDashboard,
    addChart,
    updateChart,
    removeChart,
    updateChartLayout,
    addTab,
    updateTab,
    removeTab,
    addChartToTab,
    removeChartFromTab,
    loadFromStorage
  }
})