/**
 * API Endpoints Constants
 * Định nghĩa các endpoint API
 */

export const API_ENDPOINTS = {
  // Dashboard endpoints
  DASHBOARDS: '/api/dashboards',
  DASHBOARD_BY_ID: (id: string) => `/api/dashboards/${id}`,
  DASHBOARD_WIDGETS: (id: string) => `/api/dashboards/${id}/widgets`,
  
  // Data Source endpoints
  DATA_SOURCES: '/api/data-sources',
  DATA_SOURCE_BY_ID: (id: string) => `/api/data-sources/${id}`,
  DATA_SOURCE_TEST: (id: string) => `/api/data-sources/${id}/test`,
  DATA_SOURCE_PREVIEW: (id: string) => `/api/data-sources/${id}/preview`,
  
  // Chart endpoints
  CHARTS: '/api/charts',
  CHART_BY_ID: (id: string) => `/api/charts/${id}`,
  CHART_DATA: (id: string) => `/api/charts/${id}/data`,
  
  // User endpoints
  USER_PROFILE: '/api/user/profile',
  USER_PREFERENCES: '/api/user/preferences',
  
  // Export endpoints
  EXPORT_DASHBOARD: (id: string) => `/api/dashboards/${id}/export`,
  EXPORT_CHART: (id: string) => `/api/charts/${id}/export`,
  
  // Template endpoints
  TEMPLATES: '/api/templates',
  TEMPLATE_BY_ID: (id: string) => `/api/templates/${id}`,
  
  // Analytics endpoints
  ANALYTICS_USAGE: '/api/analytics/usage',
  ANALYTICS_PERFORMANCE: '/api/analytics/performance',
} as const

export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS]
