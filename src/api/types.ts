/**
 * API Response Types
 * Định nghĩa các type cho API responses
 */

// Base API response structure
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
  errors?: string[]
  meta?: {
    total?: number
    page?: number
    limit?: number
    hasNext?: boolean
    hasPrev?: boolean
  }
}

// Pagination parameters
export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Filter parameters
export interface FilterParams {
  search?: string
  dateFrom?: string
  dateTo?: string
  status?: string
  type?: string
}

// Dashboard API types
export interface DashboardApiResponse {
  id: string
  name: string
  description?: string
  widgets: WidgetApiResponse[]
  createdAt: string
  updatedAt: string
  dataSourceIds: string[]
  isPublic: boolean
  tags: string[]
}

export interface WidgetApiResponse {
  id: string
  chartId: string
  x: number
  y: number
  w: number
  h: number
  title?: string
  config?: Record<string, any>
}

// Data Source API types
export interface DataSourceApiResponse {
  id: string
  name: string
  type: 'csv' | 'json' | 'api' | 'database'
  config: Record<string, any>
  status: 'active' | 'inactive' | 'error'
  lastSync?: string
  createdAt: string
  updatedAt: string
}

// Chart API types
export interface ChartApiResponse {
  id: string
  name: string
  type: string
  dataSourceId: string
  config: Record<string, any>
  data?: any[]
  createdAt: string
  updatedAt: string
}

// User API types
export interface UserApiResponse {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'viewer'
  preferences: Record<string, any>
  createdAt: string
  lastLogin?: string
}

// Template API types
export interface TemplateApiResponse {
  id: string
  name: string
  description?: string
  category: string
  config: Record<string, any>
  preview?: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

// Analytics API types
export interface AnalyticsUsageResponse {
  dashboardViews: number
  chartInteractions: number
  dataSourceUsage: Record<string, number>
  userActivity: {
    date: string
    activeUsers: number
  }[]
}

export interface AnalyticsPerformanceResponse {
  averageLoadTime: number
  errorRate: number
  uptime: number
  slowQueries: {
    query: string
    duration: number
    timestamp: string
  }[]
}
