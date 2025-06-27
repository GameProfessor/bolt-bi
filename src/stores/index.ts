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
export { useChartStore } from './modules/chart'
export { useAppStore } from './modules/app'

// Re-export types from store modules
export type {
  Dashboard
} from './modules/dashboard'

export type {
  DataSource,
  DataSourceColumn
} from './modules/dataSource'

export type {
  Chart,
  ChartConfig
} from './modules/chart'