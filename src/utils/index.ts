/**
 * Utils Index
 * Export tất cả utility functions
 */

// Chart utilities
export * from './chart/formatters'
export * from './chart/calculations'

// Data utilities
export * from './data/parsers'

// General utilities
export * from './date'
export * from './format'
export * from './storage'
export * from './validators'

// Re-export commonly used functions with aliases
export {
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatDate,
  truncate,
  capitalize,
  titleCase
} from './format'

export {
  LocalStorage,
  SessionStorage,
  CacheStorage,
  AppStorage
} from './storage'

export {
  isValidEmail,
  isValidPhoneNumber,
  isRequired,
  validateForm,
  ValidationRules
} from './validators'

export {
  calculateAggregation,
  groupBy,
  calculatePercentages
} from './chart/calculations'

export {
  parseCSV,
  parseJSON,
  inferFields,
  transformData
} from './data/parsers'
