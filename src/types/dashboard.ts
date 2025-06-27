/**
 * Dashboard Type Definitions
 * Định nghĩa các type cho Dashboard
 */

export interface DashboardWidget {
  id: string
  chartId: string
  x: number
  y: number
  w: number
  h: number
  title?: string
  config?: WidgetConfig
}

export interface WidgetConfig {
  showTitle?: boolean
  showLegend?: boolean
  refreshInterval?: number
  filters?: Record<string, any>
  customStyles?: Record<string, any>
}

export interface Dashboard {
  id: string
  name: string
  description?: string
  widgets: DashboardWidget[]
  createdAt: Date
  updatedAt?: Date
  dataSourceIds: string[]
  isPublic?: boolean
  tags?: string[]
  layout?: DashboardLayout
  theme?: DashboardTheme
}

export interface DashboardLayout {
  columns: number
  rowHeight: number
  margin: [number, number]
  containerPadding: [number, number]
  isDraggable: boolean
  isResizable: boolean
}

export interface DashboardTheme {
  primaryColor: string
  backgroundColor: string
  textColor: string
  borderColor: string
  fontFamily: string
}

export interface DashboardFilter {
  id: string
  name: string
  type: 'date' | 'select' | 'multiselect' | 'range'
  field: string
  value: any
  options?: FilterOption[]
}

export interface FilterOption {
  label: string
  value: any
}

export interface DashboardTemplate {
  id: string
  name: string
  description?: string
  category: string
  widgets: Omit<DashboardWidget, 'id'>[]
  layout: DashboardLayout
  theme: DashboardTheme
  preview?: string
  isPublic: boolean
  createdAt: Date
  updatedAt?: Date
}

export interface DashboardExportOptions {
  format: 'pdf' | 'png' | 'jpg' | 'json'
  includeData: boolean
  dateRange?: {
    from: Date
    to: Date
  }
  filters?: Record<string, any>
}

export interface DashboardShareSettings {
  isPublic: boolean
  allowedUsers?: string[]
  permissions: {
    canView: boolean
    canEdit: boolean
    canShare: boolean
  }
  expiresAt?: Date
}

// Dashboard state management types
export interface DashboardState {
  dashboards: Dashboard[]
  currentDashboard: Dashboard | null
  isLoading: boolean
  error: string | null
  filters: DashboardFilter[]
  selectedWidgets: string[]
}

export interface DashboardActions {
  loadDashboards: () => Promise<void>
  createDashboard: (dashboard: Omit<Dashboard, 'id' | 'createdAt'>) => Promise<Dashboard>
  updateDashboard: (id: string, updates: Partial<Dashboard>) => Promise<void>
  deleteDashboard: (id: string) => Promise<void>
  addWidget: (dashboardId: string, widget: Omit<DashboardWidget, 'id'>) => Promise<void>
  removeWidget: (dashboardId: string, widgetId: string) => Promise<void>
  updateWidget: (dashboardId: string, widgetId: string, updates: Partial<DashboardWidget>) => Promise<void>
  applyFilter: (filter: DashboardFilter) => void
  clearFilters: () => void
  exportDashboard: (id: string, options: DashboardExportOptions) => Promise<Blob>
}
