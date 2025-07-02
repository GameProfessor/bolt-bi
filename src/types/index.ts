/**
 * Type Definitions Index
 * Export tất cả các type definitions
 */

// Dashboard types
export * from './dashboard'

// Chart types  
export * from './chart'

// Data Source types
export * from './dataSource'

// Access Log types
export * from './accessLog'

// Common types
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'viewer'
  preferences: UserPreferences
  createdAt: Date
  lastLogin?: Date
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: 'en' | 'vi'
  timezone: string
  dateFormat: string
  numberFormat: string
  defaultDashboard?: string
  notifications: NotificationSettings
}

export interface NotificationSettings {
  email: boolean
  browser: boolean
  dashboard: boolean
  dataSource: boolean
  system: boolean
}

// App state types
export interface AppState {
  user: User | null
  isAuthenticated: boolean
  theme: 'light' | 'dark'
  language: 'en' | 'vi'
  isLoading: boolean
  notifications: Notification[]
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actions?: NotificationAction[]
}

export interface NotificationAction {
  label: string
  action: () => void
  type: 'primary' | 'secondary'
}

// UI Component types
export interface SelectOption {
  label: string
  value: any
  disabled?: boolean
  icon?: string
}

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: any) => string | any
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Form types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'multiselect' | 'textarea' | 'checkbox' | 'radio' | 'date' | 'file'
  required?: boolean
  placeholder?: string
  options?: SelectOption[]
  validation?: ValidationRule[]
  disabled?: boolean
  description?: string
}

export interface ValidationRule {
  type: 'required' | 'email' | 'min' | 'max' | 'pattern' | 'custom'
  value?: any
  message: string
  validator?: (value: any) => boolean
}

// Error types
export interface AppError {
  code: string
  message: string
  details?: any
  timestamp: Date
}

// Route types
export interface RouteConfig {
  path: string
  name: string
  component: any
  meta?: {
    requiresAuth?: boolean
    roles?: string[]
    title?: string
    icon?: string
  }
  children?: RouteConfig[]
}