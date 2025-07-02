/**
 * Stores Index
 * Export tất cả các Pinia stores
 */

import { createPinia } from 'pinia'

// Create pinia instance
export const pinia = createPinia()

// Export stores
export { useDashboardStore } from './modules/dashboard'
export { useDataSourceStore } from './modules/dataSource'
export { useAppStore } from './modules/app'
export { useUserStore } from './modules/user'

// Re-export types from types directory
export type {
  Dashboard,
  DashboardChart,
  DashboardTab
} from '@/types/dashboard'

export type {
  DataSource,
  DataSourceColumn
} from './modules/dataSource'