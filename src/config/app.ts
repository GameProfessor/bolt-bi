/**
 * App Configuration
 * Cấu hình chung cho ứng dụng
 */

export const appConfig = {
  // App info
  name: import.meta.env.VITE_APP_NAME || 'BI Dashboard',
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  description: 'Business Intelligence Dashboard Platform',
  
  // Environment
  env: import.meta.env.MODE || 'development',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  
  // API configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
    retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS || '3'),
    retryDelay: parseInt(import.meta.env.VITE_API_RETRY_DELAY || '1000')
  },
  
  // Authentication
  auth: {
    tokenKey: 'bi_auth_token',
    refreshTokenKey: 'bi_refresh_token',
    tokenExpiry: parseInt(import.meta.env.VITE_TOKEN_EXPIRY || '3600'), // 1 hour
    refreshThreshold: parseInt(import.meta.env.VITE_REFRESH_THRESHOLD || '300') // 5 minutes
  },
  
  // Storage
  storage: {
    prefix: 'bi_',
    version: '1.0'
  },
  
  // Features
  features: {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableExport: import.meta.env.VITE_ENABLE_EXPORT !== 'false',
    enableSharing: import.meta.env.VITE_ENABLE_SHARING !== 'false',
    enableRealtime: import.meta.env.VITE_ENABLE_REALTIME === 'true',
    enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== 'false'
  },
  
  // UI Configuration
  ui: {
    theme: {
      default: 'light',
      storageKey: 'bi_theme'
    },
    language: {
      default: 'vi',
      storageKey: 'bi_language',
      fallback: 'en'
    },
    pagination: {
      defaultPageSize: 10,
      pageSizeOptions: [10, 20, 50, 100]
    },
    notifications: {
      maxCount: 5,
      defaultDuration: 5000,
      position: 'top-right'
    }
  },
  
  // Dashboard configuration
  dashboard: {
    grid: {
      columns: 12,
      rowHeight: 60,
      margin: [10, 10],
      containerPadding: [10, 10]
    },
    widget: {
      minWidth: 2,
      minHeight: 2,
      maxWidth: 12,
      maxHeight: 20,
      defaultWidth: 6,
      defaultHeight: 4
    },
    autoSave: {
      enabled: true,
      interval: 30000 // 30 seconds
    }
  },
  
  // Chart configuration
  chart: {
    defaultColors: [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
      '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
    ],
    animation: {
      duration: 750,
      easing: 'easeInOutQuart'
    },
    responsive: true,
    maintainAspectRatio: false
  },
  
  // File upload configuration
  upload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: {
      csv: ['text/csv'],
      excel: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
      json: ['application/json'],
      image: ['image/png', 'image/jpeg', 'image/gif']
    },
    chunkSize: 1024 * 1024 // 1MB chunks
  },
  
  // Performance
  performance: {
    enableVirtualScrolling: true,
    maxDataPoints: 10000,
    debounceDelay: 300,
    throttleDelay: 100
  },
  
  // Security
  security: {
    enableCSP: import.meta.env.VITE_ENABLE_CSP === 'true',
    enableXSRF: import.meta.env.VITE_ENABLE_XSRF !== 'false',
    sessionTimeout: parseInt(import.meta.env.VITE_SESSION_TIMEOUT || '1800') // 30 minutes
  }
} as const

export type AppConfig = typeof appConfig
