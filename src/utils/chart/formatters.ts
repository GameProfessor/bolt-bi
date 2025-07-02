/**
 * Chart Formatters
 * Utility functions để format dữ liệu cho charts
 */



/**
 * Format number với locale và options
 */
export const formatNumber = (
  value: number,
  options: Intl.NumberFormatOptions = {}
): string => {
  const defaultOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options
  }
  
  return new Intl.NumberFormat('vi-VN', defaultOptions).format(value)
}

/**
 * Format currency
 */
export const formatCurrency = (
  value: number,
  currency: string = 'VND'
): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

/**
 * Format percentage
 */
export const formatPercentage = (
  value: number,
  decimals: number = 1
): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100)
}

/**
 * Format large numbers với suffix (K, M, B)
 */
export const formatLargeNumber = (value: number): string => {
  const suffixes = ['', 'K', 'M', 'B', 'T']
  let suffixIndex = 0
  let formattedValue = value
  
  while (formattedValue >= 1000 && suffixIndex < suffixes.length - 1) {
    formattedValue /= 1000
    suffixIndex++
  }
  
  const decimals = formattedValue < 10 && suffixIndex > 0 ? 1 : 0
  return formatNumber(formattedValue, { 
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals 
  }) + suffixes[suffixIndex]
}

/**
 * Format date cho chart labels
 */
export const formatChartDate = (
  date: Date | string,
  format: 'short' | 'medium' | 'long' = 'short'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit'
      })
    case 'medium':
      return dateObj.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      })
    case 'long':
      return dateObj.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    default:
      return dateObj.toLocaleDateString('vi-VN')
  }
}

/**
 * Format tooltip content
 */
export const formatTooltip = (
  label: string,
  value: number,
  datasetLabel?: string,
  formatType: 'number' | 'currency' | 'percentage' = 'number'
): string => {
  let formattedValue: string
  
  switch (formatType) {
    case 'currency':
      formattedValue = formatCurrency(value)
      break
    case 'percentage':
      formattedValue = formatPercentage(value)
      break
    default:
      formattedValue = formatNumber(value)
  }
  
  const parts = []
  if (datasetLabel) parts.push(datasetLabel)
  parts.push(label)
  parts.push(formattedValue)
  
  return parts.join(': ')
}

/**
 * Truncate long labels
 */
export const truncateLabel = (
  label: string,
  maxLength: number = 20
): string => {
  if (label.length <= maxLength) return label
  return label.substring(0, maxLength - 3) + '...'
}

/**
 * Format axis labels
 */
export const formatAxisLabel = (
  value: any,
  type: 'category' | 'value' | 'time',
  options?: {
    maxLength?: number
    formatType?: 'number' | 'currency' | 'percentage'
    dateFormat?: 'short' | 'medium' | 'long'
  }
): string => {
  const { maxLength = 20, formatType = 'number', dateFormat = 'short' } = options || {}
  
  switch (type) {
    case 'time':
      return formatChartDate(value, dateFormat)
    case 'value':
      if (typeof value === 'number') {
        switch (formatType) {
          case 'currency':
            return formatCurrency(value)
          case 'percentage':
            return formatPercentage(value)
          default:
            return formatLargeNumber(value)
        }
      }
      return String(value)
    case 'category':
    default:
      return truncateLabel(String(value), maxLength)
  }
}

/**
 * Format legend labels
 */
export const formatLegendLabel = (
  label: string,
  maxLength: number = 30
): string => {
  return truncateLabel(label, maxLength)
}

/**
 * Generate color palette
 */
export const generateColorPalette = (
  count: number,
  baseColors?: string[]
): string[] => {
  const defaultColors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
  ]
  
  const colors = baseColors || defaultColors
  const palette: string[] = []
  
  for (let i = 0; i < count; i++) {
    palette.push(colors[i % colors.length])
  }
  
  return palette
}

/**
 * Apply transparency to color
 */
export const applyTransparency = (
  color: string,
  alpha: number = 0.5
): string => {
  // Convert hex to rgba
  if (color.startsWith('#')) {
    const hex = color.slice(1)
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  
  // If already rgba, replace alpha
  if (color.startsWith('rgba')) {
    return color.replace(/[\d.]+\)$/g, `${alpha})`)
  }
  
  // If rgb, convert to rgba
  if (color.startsWith('rgb')) {
    return color.replace('rgb', 'rgba').replace(')', `, ${alpha})`)
  }
  
  return color
}
