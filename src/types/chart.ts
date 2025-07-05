/**
 * Chart Type Definitions
 * Định nghĩa các type cho Chart
 */

export type ChartType = 
  | 'bar' 
  | 'line' 
  | 'pie' 
  | 'doughnut' 
  | 'area' 
  | 'scatter' 
  | 'bubble'
  | 'radar'
  | 'polarArea'
  | 'gauge'
  | 'funnel'
  | 'heatmap'
  | 'treemap'
  | 'card'

// Base configuration that all chart types share
export interface BaseChartConfig {
  title: string
  dataSourceId: string
  backgroundColor: string
  borderColor: string
  colorScheme: string
}

// Bar chart specific configuration
export interface BarChartConfig extends BaseChartConfig {
  type: 'bar'
  xAxis: string[]
  yAxis: string[]
  horizontal: boolean
  stackedDimension: string[]
  stacked?: boolean
  sortXAxisBy?: string
  sortDescending?: boolean
  filter?: string
  showLegend?: boolean
}

// Pie chart specific configuration
export interface PieChartConfig extends BaseChartConfig {
  type: 'pie'
  category: string
  value: string
  donut?: boolean
}

// Line chart specific configuration
export interface LineChartConfig extends BaseChartConfig {
  type: 'line'
  xAxis: string[]
  yAxis: string[]
  smooth: boolean
  fillArea: boolean
}

// Scatter chart specific configuration
export interface ScatterChartConfig extends BaseChartConfig {
  type: 'scatter'
  xAxis: string[]
  yAxis: string[]
  size?: string
}

// Card/KPI chart specific configuration
export interface CardChartConfig extends BaseChartConfig {
  type: 'card'
  keyMetric: string
  previousMetric: string
  differenceType: 'absolute' | 'percentage'
  aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max'
}

// Union type for all chart configurations
export type ChartConfig = 
  | BarChartConfig 
  | PieChartConfig 
  | LineChartConfig 
  | ScatterChartConfig 
  | CardChartConfig

// Helper function to create default config for a chart type
export function createDefaultChartConfig(type: ChartType): ChartConfig {
  const baseConfig = {
    title: '',
    dataSourceId: '',
    backgroundColor: '#3b82f6',
    borderColor: '#1d4ed8',
    colorScheme: 'DEFAULT'
  }

  switch (type) {
    case 'bar':
      return {
        ...baseConfig,
        type: 'bar',
        xAxis: [],
        yAxis: [],
        horizontal: false,
        stackedDimension: [],
        stacked: false,
        sortXAxisBy: '',
        sortDescending: false,
        filter: '',
        showLegend: true
      }
    
    case 'pie':
      return {
        ...baseConfig,
        type: 'pie',
        category: '',
        value: '',
        donut: false
      }
    
    case 'line':
      return {
        ...baseConfig,
        type: 'line',
        xAxis: [],
        yAxis: [],
        smooth: false,
        fillArea: false
      }
    
    case 'scatter':
      return {
        ...baseConfig,
        type: 'scatter',
        xAxis: [],
        yAxis: [],
        size: ''
      }
    
    case 'card':
      return {
        ...baseConfig,
        type: 'card',
        keyMetric: '',
        previousMetric: '',
        differenceType: 'percentage',
        aggregation: 'sum'
      }
    
    default:
      throw new Error(`Unsupported chart type: ${type}`)
  }
}

// Type guard functions to check chart config types
export function isBarChartConfig(config: ChartConfig): config is BarChartConfig {
  return config.type === 'bar'
}

export function isPieChartConfig(config: ChartConfig): config is PieChartConfig {
  return config.type === 'pie'
}

export function isLineChartConfig(config: ChartConfig): config is LineChartConfig {
  return config.type === 'line'
}

export function isScatterChartConfig(config: ChartConfig): config is ScatterChartConfig {
  return config.type === 'scatter'
}

export function isCardChartConfig(config: ChartConfig): config is CardChartConfig {
  return config.type === 'card'
}

// Helper function to reset a chart config to defaults
export function resetChartConfig(config: ChartConfig): void {
  const defaultConfig = createDefaultChartConfig(config.type)
  Object.assign(config, defaultConfig)
}

// Helper function to validate chart config
export function isChartConfigValid(config: ChartConfig): boolean {
  if (!config.title || !config.dataSourceId) return false
  
  switch (config.type) {
    case 'bar':
      return config.xAxis.length > 0 && config.yAxis.length > 0
    
    case 'pie':
      return !!config.category && !!config.value
    
    case 'line':
      return config.xAxis.length > 0 && config.yAxis.length > 0
    
    case 'scatter':
      return config.xAxis.length > 0 && config.yAxis.length > 0
    
    case 'card':
      return !!config.keyMetric
    
    default:
      return false
  }
}

export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  borderWidth?: number
  fill?: boolean
  tension?: number
  pointRadius?: number
  pointHoverRadius?: number
}

export interface ChartOptions {
  responsive: boolean
  maintainAspectRatio: boolean
  plugins: {
    legend: {
      display: boolean
      position: 'top' | 'bottom' | 'left' | 'right'
    }
    title: {
      display: boolean
      text: string
    }
    tooltip: {
      enabled: boolean
      mode: 'index' | 'point' | 'nearest'
    }
  }
  scales?: {
    x?: ChartScale
    y?: ChartScale
  }
  animation?: {
    duration: number
    easing: string
  }
}

export interface ChartScale {
  display: boolean
  title: {
    display: boolean
    text: string
  }
  min?: number
  max?: number
  beginAtZero?: boolean
  grid?: {
    display: boolean
    color: string
  }
}

export interface Chart {
  id: string
  name: string
  type: ChartType
  dataSourceId: string
  config: ChartConfig
  data?: ChartData
  createdAt: Date
  updatedAt?: Date
}

export interface AxisConfig {
  field: string
  label: string
  type: 'category' | 'value' | 'time'
  format?: string
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max'
}

export interface SeriesConfig {
  field: string
  label: string
  type: ChartType
  aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max'
  color?: string
}

export interface ChartFilter {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'contains'
  value: any
}

export interface ChartTemplate {
  id: string
  name: string
  type: ChartType
  config: Partial<ChartConfig>
  preview?: string
  category: string
  isPublic: boolean
}

// Chart state management types
export interface ChartState {
  charts: Chart[]
  currentChart: Chart | null
  isLoading: boolean
  error: string | null
  templates: ChartTemplate[]
}

export interface ChartActions {
  loadCharts: () => Promise<void>
  createChart: (chart: Omit<Chart, 'id' | 'createdAt'>) => Promise<Chart>
  updateChart: (id: string, updates: Partial<Chart>) => Promise<void>
  deleteChart: (id: string) => Promise<void>
  loadChartData: (id: string) => Promise<ChartData>
  exportChart: (id: string, format: 'png' | 'jpg' | 'svg' | 'pdf') => Promise<Blob>
  loadTemplates: () => Promise<void>
}
