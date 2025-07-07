/**
 * Dashboard Type Definitions
 * Định nghĩa các type cho Dashboard
 */

import type { ChartType } from './chart'

export interface Dashboard {
  id: string
  name: string
  description?: string
  charts: DashboardChart[]
  tabs: DashboardTab[]
  createdAt: Date
  updatedAt?: Date
  dataSourceIds?: string[]
  isPublic?: boolean
  tags?: string[]
  layout?: DashboardLayout
  theme?: DashboardTheme
  category?: string
  showDashboardTabs?: boolean // Whether to show dashboard tabs UI
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
  charts: Omit<DashboardChart, 'id' | 'dashboardId' | 'createdAt'>[]
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
  selectedCharts: string[]
}

export interface DashboardActions {
  loadDashboards: () => Promise<void>
  createDashboard: (dashboard: Omit<Dashboard, 'id' | 'createdAt'>) => Promise<Dashboard>
  updateDashboard: (id: string, updates: Partial<Dashboard>) => Promise<void>
  deleteDashboard: (id: string) => Promise<void>
  addChart: (dashboardId: string, chart: Omit<DashboardChart, 'id' | 'dashboardId' | 'createdAt'>) => Promise<void>
  removeChart: (dashboardId: string, chartId: string) => Promise<void>
  updateChart: (dashboardId: string, chartId: string, updates: Partial<DashboardChart>) => Promise<void>
  applyFilter: (filter: DashboardFilter) => void
  clearFilters: () => void
  exportDashboard: (id: string, options: DashboardExportOptions) => Promise<Blob>
}

export interface DashboardTab {
  id: string
  name: string
  chartIds: string[]  // Direct chart IDs
}

// Base chart properties that all charts share
export interface BaseChartProperties {
  title: string
  dataSourceId: string
  colorScheme?: string
}

// Type-specific chart properties (extensible)
export interface ChartTypeProperties {
  // Bar chart specific
  bar?: {
    xAxis: string[]
    yAxis: string[]
    horizontal?: boolean
    stacked?: boolean
  }
  
  // Line chart specific
  line?: {
    xAxis: string
    yAxis: string
    smooth?: boolean
    fillArea?: boolean
  }
  
  // Pie chart specific
  pie?: {
    category: string
    value: string
    donut?: boolean
  }
  
  // Scatter chart specific
  scatter?: {
    xAxis: string
    yAxis: string
    size?: string
  }
  
  // Gauge chart specific
  gauge?: {
    value: string
    min?: number
    max?: number
    thresholds?: Array<{value: number, color: string}>
  }
  
  // Heatmap specific
  heatmap?: {
    xAxis: string
    yAxis: string
    value: string
    colorScale?: 'sequential' | 'diverging'
  }
  
  // Card/KPI specific
  card?: {
    field: string
    aggregation?: 'sum' | 'avg' | 'min' | 'max'
    decimalPlaces?: number
    colorScheme?: string
    filter?: string
    subHeader?: string
  }
}

// Generic DashboardChart interface. Đại diện cho 1 instance của chart trong mỗi dashboard.
export interface DashboardChart {
  id: string
  dashboardId: string
  type: ChartType
  
  // Base properties
  base: BaseChartProperties
  
  // Type-specific properties (only one will be populated based on type)
  properties: ChartTypeProperties
  
  // Layout properties
  layout: {
    x: number
    y: number
    w: number
    h: number
  }
  
  // Metadata
  createdAt: Date
  updatedAt?: Date
}

// Type guards for safe access
export function isBarChart(chart: DashboardChart): chart is DashboardChart & { properties: { bar: NonNullable<ChartTypeProperties['bar']> } } {
  return chart.type === 'bar' && !!chart.properties.bar
}

export function isPieChart(chart: DashboardChart): chart is DashboardChart & { properties: { pie: NonNullable<ChartTypeProperties['pie']> } } {
  return chart.type === 'pie' && !!chart.properties.pie
}

export function isLineChart(chart: DashboardChart): chart is DashboardChart & { properties: { line: NonNullable<ChartTypeProperties['line']> } } {
  return chart.type === 'line' && !!chart.properties.line
}

export function isScatterChart(chart: DashboardChart): chart is DashboardChart & { properties: { scatter: NonNullable<ChartTypeProperties['scatter']> } } {
  return chart.type === 'scatter' && !!chart.properties.scatter
}

export function isGaugeChart(chart: DashboardChart): chart is DashboardChart & { properties: { gauge: NonNullable<ChartTypeProperties['gauge']> } } {
  return chart.type === 'gauge' && !!chart.properties.gauge
}

export function isHeatmapChart(chart: DashboardChart): chart is DashboardChart & { properties: { heatmap: NonNullable<ChartTypeProperties['heatmap']> } } {
  return chart.type === 'heatmap' && !!chart.properties.heatmap
}

export function isCardChart(chart: DashboardChart): chart is DashboardChart & { properties: { card: NonNullable<ChartTypeProperties['card']> } } {
  return chart.type === 'card' && !!chart.properties.card
}

// Note: Chart creation functions have been moved to the Strategy Pattern
// Use ChartUtils.createDefaultConfig() and ChartUtils.getChartTypeInfo() instead
