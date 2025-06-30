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
  | 'table'

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

export interface ChartConfig {
  title: string
  description?: string
  xAxis: AxisConfig
  yAxis: AxisConfig
  series: SeriesConfig[]
  colors: string[]
  options: ChartOptions
  filters?: ChartFilter[]
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