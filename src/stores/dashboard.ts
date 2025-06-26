import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface DashboardWidget {
  id: string
  chartId: string
  x: number
  y: number
  w: number
  h: number
}

export interface Dashboard {
  id: string
  name: string
  description?: string
  category?: string
  widgets: DashboardWidget[]
  createdAt: Date
  dataSourceIds?: string[]
}

export const useDashboardStore = defineStore('dashboard', () => {
  const dashboards = ref<Dashboard[]>([])
  const currentDashboard = ref<Dashboard | null>(null)

  const getDashboardById = computed(() => {
    return (id: string) => dashboards.value.find(d => d.id === id)
  })

  const getDashboardsByCategory = computed(() => {
    return (category: string) => dashboards.value.filter(d => d.category === category)
  })

  const getUniqueCategories = computed(() => {
    const categories = new Set(dashboards.value.map(d => d.category).filter(Boolean))
    return Array.from(categories).sort()
  })

  const loadFromStorage = () => {
    const stored = localStorage.getItem('bi-dashboards')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        dashboards.value = parsed.map((dashboard: any) => ({
          ...dashboard,
          createdAt: new Date(dashboard.createdAt),
          dataSourceIds: dashboard.dataSourceIds || [],
          category: dashboard.category || 'General'
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
      id: Date.now().toString(),
      name,
      description,
      category: category || 'General',
      widgets: [],
      createdAt: new Date(),
      dataSourceIds: dataSourceIds || []
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

  const addWidget = (dashboardId: string, chartId: string) => {
    const dashboard = dashboards.value.find(d => d.id === dashboardId)
    if (dashboard) {
      const widget: DashboardWidget = {
        id: Date.now().toString(),
        chartId,
        x: 0,
        y: 0,
        w: 6,
        h: 4
      }
      dashboard.widgets.push(widget)
      saveToStorage()
    }
  }

  const removeWidget = (dashboardId: string, widgetId: string) => {
    const dashboard = dashboards.value.find(d => d.id === dashboardId)
    if (dashboard) {
      dashboard.widgets = dashboard.widgets.filter(w => w.id !== widgetId)
      saveToStorage()
    }
  }

  const updateWidgetLayout = (dashboardId: string, widgetId: string, layout: Partial<DashboardWidget>) => {
    const dashboard = dashboards.value.find(d => d.id === dashboardId)
    if (dashboard) {
      const widget = dashboard.widgets.find(w => w.id === widgetId)
      if (widget) {
        Object.assign(widget, layout)
        saveToStorage()
      }
    }
  }

  // Initialize from storage
  loadFromStorage()

  return {
    dashboards,
    currentDashboard,
    getDashboardById,
    getDashboardsByCategory,
    getUniqueCategories,
    createDashboard,
    updateDashboard,
    deleteDashboard,
    addWidget,
    removeWidget,
    updateWidgetLayout
  }
})