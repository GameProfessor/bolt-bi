/**
 * Constants Index
 * Export tất cả các constants
 */

export * from './chartTypes'
export * from './routes'

// App constants
export const APP_NAME = 'BI Dashboard'
export const APP_VERSION = '1.0.0'
export const APP_DESCRIPTION = 'Business Intelligence Dashboard Platform'

// Storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'bi_auth_token',
  USER_PREFERENCES: 'bi_user_preferences',
  DASHBOARDS: 'bi_dashboards',
  DATA_SOURCES: 'bi_data_sources',
  CHARTS: 'bi_charts',
  THEME: 'bi_theme',
  LANGUAGE: 'bi_language'
} as const

// API constants
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000 // 1 second
} as const

// Pagination constants
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 1000
} as const

// File upload constants
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    CSV: ['text/csv', '.csv'],
    EXCEL: [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      '.xls',
      '.xlsx'
    ],
    JSON: ['application/json', '.json'],
    IMAGE: ['image/png', 'image/jpeg', 'image/gif', '.png', '.jpg', '.jpeg', '.gif']
  }
} as const

// Date format constants
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DD HH:mm:ss',
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ'
} as const

// Validation constants
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9]{10,11}$/
} as const

// Dashboard constants
export const DASHBOARD = {
  DEFAULT_GRID_COLUMNS: 12,
  DEFAULT_ROW_HEIGHT: 60,
  DEFAULT_MARGIN: [10, 10] as [number, number],
  DEFAULT_CONTAINER_PADDING: [10, 10] as [number, number],
  MIN_CHART_WIDTH: 2,
  MIN_CHART_HEIGHT: 2,
  MAX_CHART_WIDTH: 12,
  MAX_CHART_HEIGHT: 20
} as const

// Chart constants
export const CHART = {
  DEFAULT_WIDTH: 400,
  DEFAULT_HEIGHT: 300,
  MIN_WIDTH: 200,
  MIN_HEIGHT: 150,
  MAX_DATA_POINTS: 1000,
  ANIMATION_DURATION: 750
} as const

// Notification constants
export const NOTIFICATION = {
  DEFAULT_DURATION: 5000, // 5 seconds
  SUCCESS_DURATION: 3000, // 3 seconds
  ERROR_DURATION: 10000, // 10 seconds
  MAX_NOTIFICATIONS: 5
} as const

// Theme constants
export const THEME = {
  COLORS: {
    PRIMARY: '#3B82F6',
    SECONDARY: '#6B7280',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    INFO: '#06B6D4'
  },
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536
  }
} as const
