// /**
//  * Dashboard Store Module
//  * Pinia store cho Dashboard management
//  */

// import { defineStore } from 'pinia'
// import { ref, computed } from 'vue'
// import type { DashboardWidget } from '@/types/dashboard'

// // Legacy interfaces for backward compatibility
// export interface Dashboard {
//   id: string
//   name: string
//   description?: string
//   widgets: DashboardWidget[]
//   dataSourceIds: string[]
//   createdAt: Date
//   updatedAt?: Date
// }

// export const useDashboardStore = defineStore('dashboard', () => {
//   // State
//   const dashboards = ref<Dashboard[]>([])
//   const currentDashboard = ref<Dashboard | null>(null)
//   const isLoading = ref(false)
//   const error = ref<string | null>(null)

//   // Getters
//   const getDashboardById = computed(() => {
//     return (id: string) => dashboards.value.find(d => d.id === id)
//   })

//   // Load from localStorage
//   const loadFromStorage = () => {
//     const stored = localStorage.getItem('bi-dashboards')
//     if (stored) {
//       try {
//         const parsed = JSON.parse(stored)
//         dashboards.value = parsed.map((d: any) => ({
//           ...d,
//           createdAt: new Date(d.createdAt),
//           updatedAt: d.updatedAt ? new Date(d.updatedAt) : undefined
//         }))
//       } catch (e) {
//         console.error('Failed to load dashboards from storage:', e)
//       }
//     }
//   }

//   const saveToStorage = () => {
//     localStorage.setItem('bi-dashboards', JSON.stringify(dashboards.value))
//   }

//   // Actions
//   const loadDashboards = async () => {
//     isLoading.value = true
//     error.value = null

//     try {
//       loadFromStorage()
//     } catch (err) {
//       error.value = err instanceof Error ? err.message : 'Failed to load dashboards'
//       console.error('Error loading dashboards:', err)
//     } finally {
//       isLoading.value = false
//     }
//   }

//   const createDashboard = (name: string, description?: string, dataSourceIds: string[] = []) => {
//     isLoading.value = true
//     error.value = null

//     try {
//       const newDashboard: Dashboard = {
//         id: Date.now().toString(),
//         name,
//         description,
//         widgets: [],
//         dataSourceIds,
//         createdAt: new Date()
//       }
//       dashboards.value.push(newDashboard)
//       saveToStorage()
//       return newDashboard
//     } catch (err) {
//       error.value = err instanceof Error ? err.message : 'Failed to create dashboard'
//       console.error('Error creating dashboard:', err)
//       throw err
//     } finally {
//       isLoading.value = false
//     }
//   }

//   const deleteDashboard = async (id: string) => {
//     isLoading.value = true
//     error.value = null

//     try {
//       dashboards.value = dashboards.value.filter(d => d.id !== id)
//       saveToStorage()

//       if (currentDashboard.value?.id === id) {
//         currentDashboard.value = null
//       }
//     } catch (err) {
//       error.value = err instanceof Error ? err.message : 'Failed to delete dashboard'
//       console.error('Error deleting dashboard:', err)
//       throw err
//     } finally {
//       isLoading.value = false
//     }
//   }

//   const addWidget = (dashboardId: string, chartId: string) => {
//     const dashboard = dashboards.value.find(d => d.id === dashboardId)
//     if (!dashboard) {
//       throw new Error(`Dashboard with id ${dashboardId} not found`)
//     }

//     const newWidget: DashboardWidget = {
//       id: Date.now().toString(),
//       chartId,
//       x: 0,
//       y: 0,
//       w: 6,
//       h: 4
//     }

//     dashboard.widgets.push(newWidget)
//     dashboard.updatedAt = new Date()
//     saveToStorage()

//     return newWidget
//   }

//   const updateWidgetLayout = (dashboardId: string, widgetId: string, layout: { x: number, y: number, w: number, h: number }) => {
//     const dashboard = dashboards.value.find(d => d.id === dashboardId)
//     if (!dashboard) {
//       throw new Error(`Dashboard with id ${dashboardId} not found`)
//     }

//     const widget = dashboard.widgets.find(w => w.id === widgetId)
//     if (!widget) {
//       throw new Error(`Widget with id ${widgetId} not found`)
//     }

//     widget.x = layout.x
//     widget.y = layout.y
//     widget.w = layout.w
//     widget.h = layout.h

//     dashboard.updatedAt = new Date()
//     saveToStorage()
//   }

//   const removeWidget = (dashboardId: string, widgetId: string) => {
//     const dashboard = dashboards.value.find(d => d.id === dashboardId)
//     if (!dashboard) {
//       throw new Error(`Dashboard with id ${dashboardId} not found`)
//     }

//     dashboard.widgets = dashboard.widgets.filter(w => w.id !== widgetId)
//     dashboard.updatedAt = new Date()
//     saveToStorage()
//   }

//   const clearError = () => {
//     error.value = null
//   }

//   // Initialize store
//   loadFromStorage()

//   return {
//     // State
//     dashboards,
//     currentDashboard,
//     loading: isLoading,
//     error,

//     // Getters
//     getDashboardById,

//     // Actions
//     loadDashboards,
//     createDashboard,
//     deleteDashboard,
//     addWidget,
//     updateWidgetLayout,
//     removeWidget,
//     clearError
//   }
// })
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
  widgets: DashboardWidget[]
  createdAt: Date
  dataSourceIds?: string[]
  category?: string
}

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
      id: Date.now().toString(),
      name,
      description,
      widgets: [],
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
    createDashboard,
    updateDashboard,
    deleteDashboard,
    addWidget,
    removeWidget,
    updateWidgetLayout
  }
})