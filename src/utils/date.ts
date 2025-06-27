/**
 * Date Utilities
 * Utility functions để xử lý date/time
 */

import { DATE_FORMATS } from '@/constants'

/**
 * Format date theo format được chỉ định
 */
export const formatDate = (
  date: Date | string | number,
  format: string = DATE_FORMATS.DISPLAY
): string => {
  const dateObj = new Date(date)
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date'
  }
  
  // Simple format replacements
  const formatMap: Record<string, string> = {
    'YYYY': dateObj.getFullYear().toString(),
    'YY': dateObj.getFullYear().toString().slice(-2),
    'MM': (dateObj.getMonth() + 1).toString().padStart(2, '0'),
    'M': (dateObj.getMonth() + 1).toString(),
    'DD': dateObj.getDate().toString().padStart(2, '0'),
    'D': dateObj.getDate().toString(),
    'HH': dateObj.getHours().toString().padStart(2, '0'),
    'H': dateObj.getHours().toString(),
    'mm': dateObj.getMinutes().toString().padStart(2, '0'),
    'm': dateObj.getMinutes().toString(),
    'ss': dateObj.getSeconds().toString().padStart(2, '0'),
    's': dateObj.getSeconds().toString()
  }
  
  let formattedDate = format
  Object.entries(formatMap).forEach(([key, value]) => {
    formattedDate = formattedDate.replace(new RegExp(key, 'g'), value)
  })
  
  return formattedDate
}

/**
 * Parse date string với multiple formats
 */
export const parseDate = (dateString: string): Date | null => {
  if (!dateString) return null
  
  // Try ISO format first
  let date = new Date(dateString)
  if (!isNaN(date.getTime())) {
    return date
  }
  
  // Try common Vietnamese formats
  const formats = [
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // DD/MM/YYYY
    /^(\d{1,2})-(\d{1,2})-(\d{4})$/, // DD-MM-YYYY
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // YYYY-MM-DD
    /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/, // DD/MM/YY
  ]
  
  for (const format of formats) {
    const match = dateString.match(format)
    if (match) {
      let day: number, month: number, year: number
      
      if (format.source.startsWith('^(\\d{4})')) {
        // YYYY-MM-DD format
        year = parseInt(match[1])
        month = parseInt(match[2]) - 1 // Month is 0-indexed
        day = parseInt(match[3])
      } else {
        // DD/MM/YYYY or DD-MM-YYYY format
        day = parseInt(match[1])
        month = parseInt(match[2]) - 1 // Month is 0-indexed
        year = parseInt(match[3])
        
        // Handle 2-digit years
        if (year < 100) {
          year += year < 50 ? 2000 : 1900
        }
      }
      
      date = new Date(year, month, day)
      if (!isNaN(date.getTime())) {
        return date
      }
    }
  }
  
  return null
}

/**
 * Get relative time string
 */
export const getRelativeTime = (date: Date | string | number): string => {
  const now = new Date()
  const targetDate = new Date(date)
  const diffMs = now.getTime() - targetDate.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)
  
  if (diffSeconds < 60) {
    return 'vừa xong'
  } else if (diffMinutes < 60) {
    return `${diffMinutes} phút trước`
  } else if (diffHours < 24) {
    return `${diffHours} giờ trước`
  } else if (diffDays < 7) {
    return `${diffDays} ngày trước`
  } else if (diffWeeks < 4) {
    return `${diffWeeks} tuần trước`
  } else if (diffMonths < 12) {
    return `${diffMonths} tháng trước`
  } else {
    return `${diffYears} năm trước`
  }
}

/**
 * Check if date is today
 */
export const isToday = (date: Date | string | number): boolean => {
  const today = new Date()
  const targetDate = new Date(date)
  
  return (
    today.getDate() === targetDate.getDate() &&
    today.getMonth() === targetDate.getMonth() &&
    today.getFullYear() === targetDate.getFullYear()
  )
}

/**
 * Check if date is yesterday
 */
export const isYesterday = (date: Date | string | number): boolean => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const targetDate = new Date(date)
  
  return (
    yesterday.getDate() === targetDate.getDate() &&
    yesterday.getMonth() === targetDate.getMonth() &&
    yesterday.getFullYear() === targetDate.getFullYear()
  )
}

/**
 * Get start of day
 */
export const startOfDay = (date: Date | string | number): Date => {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

/**
 * Get end of day
 */
export const endOfDay = (date: Date | string | number): Date => {
  const result = new Date(date)
  result.setHours(23, 59, 59, 999)
  return result
}

/**
 * Get start of week (Monday)
 */
export const startOfWeek = (date: Date | string | number): Date => {
  const result = new Date(date)
  const day = result.getDay()
  const diff = result.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  result.setDate(diff)
  return startOfDay(result)
}

/**
 * Get end of week (Sunday)
 */
export const endOfWeek = (date: Date | string | number): Date => {
  const result = startOfWeek(date)
  result.setDate(result.getDate() + 6)
  return endOfDay(result)
}

/**
 * Get start of month
 */
export const startOfMonth = (date: Date | string | number): Date => {
  const result = new Date(date)
  result.setDate(1)
  return startOfDay(result)
}

/**
 * Get end of month
 */
export const endOfMonth = (date: Date | string | number): Date => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + 1, 0)
  return endOfDay(result)
}

/**
 * Add days to date
 */
export const addDays = (date: Date | string | number, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * Add months to date
 */
export const addMonths = (date: Date | string | number, months: number): Date => {
  const result = new Date(date)
  result.setMonth(result.getMonth() + months)
  return result
}

/**
 * Add years to date
 */
export const addYears = (date: Date | string | number, years: number): Date => {
  const result = new Date(date)
  result.setFullYear(result.getFullYear() + years)
  return result
}

/**
 * Get difference between dates in days
 */
export const diffInDays = (
  date1: Date | string | number,
  date2: Date | string | number
): number => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Check if date is in range
 */
export const isInRange = (
  date: Date | string | number,
  startDate: Date | string | number,
  endDate: Date | string | number
): boolean => {
  const targetDate = new Date(date)
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  return targetDate >= start && targetDate <= end
}

/**
 * Generate date range
 */
export const generateDateRange = (
  startDate: Date | string | number,
  endDate: Date | string | number,
  step: 'day' | 'week' | 'month' = 'day'
): Date[] => {
  const dates: Date[] = []
  const start = new Date(startDate)
  const end = new Date(endDate)
  const current = new Date(start)
  
  while (current <= end) {
    dates.push(new Date(current))
    
    switch (step) {
      case 'day':
        current.setDate(current.getDate() + 1)
        break
      case 'week':
        current.setDate(current.getDate() + 7)
        break
      case 'month':
        current.setMonth(current.getMonth() + 1)
        break
    }
  }
  
  return dates
}

/**
 * Get timezone offset in hours
 */
export const getTimezoneOffset = (): number => {
  return -new Date().getTimezoneOffset() / 60
}

/**
 * Convert to UTC
 */
export const toUTC = (date: Date | string | number): Date => {
  const d = new Date(date)
  return new Date(d.getTime() + d.getTimezoneOffset() * 60000)
}

/**
 * Convert from UTC
 */
export const fromUTC = (date: Date | string | number): Date => {
  const d = new Date(date)
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
}
