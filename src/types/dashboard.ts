/**
 * Dashboard Type Definitions
 * Định nghĩa các type cho Dashboard
 */

import { nanoid } from 'nanoid'
import type { ChartType } from './chart'

export const CHART_TYPE_DEFAULT_LAYOUT: Record<string, { w: number; h: number }> = {
  bar:     { w: 4, h: 3 },
  line:    { w: 4, h: 3 },
  pie:     { w: 3, h: 3 },
  scatter: { w: 4, h: 3 },
  card:    { w: 2, h: 3 },
  // Add more types as needed
}

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
  backgroundColor?: string
  borderColor?: string
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
    keyMetric: string
    previousMetric?: string
    differenceType?: 'absolute' | 'percentage'
    aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max'
  }
}

// Generic DashboardChart interface
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

// Type-safe chart creation helpers
export function createBarChart(config: {
  title: string
  dataSourceId: string
  xAxis: string[]
  yAxis: string[]
  horizontal?: boolean
  backgroundColor?: string
  borderColor?: string
  colorScheme?: string
}): DashboardChart {
  return {
    id: nanoid(),
    dashboardId: '', // Will be set when added to dashboard
    type: 'bar',
    base: {
      title: config.title,
      dataSourceId: config.dataSourceId,
      backgroundColor: config.backgroundColor || '#3B82F6',
      borderColor: config.borderColor || '#1E40AF',
      colorScheme: config.colorScheme || 'default'
    },
    properties: {
      bar: {
        xAxis: config.xAxis,
        yAxis: config.yAxis,
        horizontal: config.horizontal || false
      }
    },
    layout: { x: 0, y: 0, ...CHART_TYPE_DEFAULT_LAYOUT.bar },
    createdAt: new Date()
  }
}

export function createPieChart(config: {
  title: string
  dataSourceId: string
  category: string
  value: string
  donut?: boolean
  backgroundColor?: string
  borderColor?: string
  colorScheme?: string
}): DashboardChart {
  return {
    id: nanoid(),
    dashboardId: '',
    type: 'pie',
    base: {
      title: config.title,
      dataSourceId: config.dataSourceId,
      backgroundColor: config.backgroundColor || '#3B82F6',
      borderColor: config.borderColor || '#1E40AF',
      colorScheme: config.colorScheme || 'default'
    },
    properties: {
      pie: {
        category: config.category,
        value: config.value,
        donut: config.donut || false
      }
    },
    layout: { x: 0, y: 0, ...CHART_TYPE_DEFAULT_LAYOUT.pie },
    createdAt: new Date()
  }
}

export function createLineChart(config: {
  title: string
  dataSourceId: string
  xAxis: string
  yAxis: string
  smooth?: boolean
  fillArea?: boolean
  backgroundColor?: string
  borderColor?: string
  colorScheme?: string
}): DashboardChart {
  return {
    id: nanoid(),
    dashboardId: '',
    type: 'line',
    base: {
      title: config.title,
      dataSourceId: config.dataSourceId,
      backgroundColor: config.backgroundColor || '#3B82F6',
      borderColor: config.borderColor || '#1E40AF',
      colorScheme: config.colorScheme || 'default'
    },
    properties: {
      line: {
        xAxis: config.xAxis,
        yAxis: config.yAxis,
        smooth: config.smooth || false,
        fillArea: config.fillArea || false
      }
    },
    layout: { x: 0, y: 0, ...CHART_TYPE_DEFAULT_LAYOUT.line },
    createdAt: new Date()
  }
}

export function createScatterChart(config: {
  title: string
  dataSourceId: string
  xAxis: string
  yAxis: string
  size?: string
  backgroundColor?: string
  borderColor?: string
  colorScheme?: string
}): DashboardChart {
  return {
    id: nanoid(),
    dashboardId: '',
    type: 'scatter',
    base: {
      title: config.title,
      dataSourceId: config.dataSourceId,
      backgroundColor: config.backgroundColor || '#3B82F6',
      borderColor: config.borderColor || '#1E40AF',
      colorScheme: config.colorScheme || 'default'
    },
    properties: {
      scatter: {
        xAxis: config.xAxis,
        yAxis: config.yAxis,
        size: config.size
      }
    },
    layout: { x: 0, y: 0, ...CHART_TYPE_DEFAULT_LAYOUT.scatter },
    createdAt: new Date()
  }
}

export function createCardChart(config: {
  title: string
  dataSourceId: string
  keyMetric: string
  previousMetric?: string
  differenceType?: 'absolute' | 'percentage'
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max'
  backgroundColor?: string
  borderColor?: string
  colorScheme?: string
}): DashboardChart {
  return {
    id: nanoid(),
    dashboardId: '',
    type: 'card',
    base: {
      title: config.title,
      dataSourceId: config.dataSourceId,
      backgroundColor: config.backgroundColor || '#3B82F6',
      borderColor: config.borderColor || '#1E40AF',
      colorScheme: config.colorScheme || 'default'
    },
    properties: {
      card: {
        keyMetric: config.keyMetric,
        previousMetric: config.previousMetric,
        differenceType: config.differenceType || 'percentage',
        aggregation: config.aggregation || 'sum'
      }
    },
    layout: { x: 0, y: 0, ...CHART_TYPE_DEFAULT_LAYOUT.card },
    createdAt: new Date()
  }
}

// Generic chart creation function
export function createChart(type: ChartType, config: any): DashboardChart {
  switch (type) {
    case 'bar':
      return createBarChart(config)
    case 'pie':
      return createPieChart(config)
    case 'line':
      return createLineChart(config)
    case 'scatter':
      return createScatterChart(config)
    case 'card':
      return createCardChart(config)
    default:
      throw new Error(`Unsupported chart type: ${type}`)
  }
}
