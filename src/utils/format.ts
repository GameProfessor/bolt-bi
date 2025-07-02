/**
 * Format Utilities
 * Utility functions để format dữ liệu display
 */

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Format duration (seconds to human readable)
 */
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`
  }
  
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.round(seconds % 60)
  
  if (minutes < 60) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (hours < 24) {
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }
  
  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24
  
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`
}

/**
 * Format phone number (Vietnamese format)
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '')
  
  // Vietnamese mobile numbers
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
  }
  
  // Vietnamese landline numbers
  if (cleaned.length === 10 && !cleaned.startsWith('0')) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  
  return phone
}

/**
 * Format Vietnamese ID number
 */
export const formatIdNumber = (id: string): string => {
  const cleaned = id.replace(/\D/g, '')
  
  if (cleaned.length === 9) {
    // Old format: 123456789
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
  }
  
  if (cleaned.length === 12) {
    // New format: 123456789012
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4')
  }
  
  return id
}

/**
 * Capitalize first letter
 */
export const capitalize = (str: string): string => {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Title case
 */
export const titleCase = (str: string): string => {
  if (!str) return str
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ')
}

/**
 * Camel case to title case
 */
export const camelToTitle = (str: string): string => {
  if (!str) return str
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim()
}

/**
 * Snake case to title case
 */
export const snakeToTitle = (str: string): string => {
  if (!str) return str
  return str
    .split('_')
    .map(word => capitalize(word))
    .join(' ')
}

/**
 * Kebab case to title case
 */
export const kebabToTitle = (str: string): string => {
  if (!str) return str
  return str
    .split('-')
    .map(word => capitalize(word))
    .join(' ')
}

/**
 * Truncate text with ellipsis
 */
export const truncate = (
  text: string,
  maxLength: number,
  suffix: string = '...'
): string => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength - suffix.length) + suffix
}

/**
 * Truncate text by words
 */
export const truncateWords = (
  text: string,
  maxWords: number,
  suffix: string = '...'
): string => {
  if (!text) return text
  
  const words = text.split(' ')
  if (words.length <= maxWords) return text
  
  return words.slice(0, maxWords).join(' ') + suffix
}

/**
 * Format address (Vietnamese style)
 */
export const formatAddress = (address: {
  street?: string
  ward?: string
  district?: string
  city?: string
}): string => {
  const parts = []
  
  if (address.street) parts.push(address.street)
  if (address.ward) parts.push(address.ward)
  if (address.district) parts.push(address.district)
  if (address.city) parts.push(address.city)
  
  return parts.join(', ')
}

/**
 * Format name (Vietnamese style)
 */
export const formatName = (name: {
  firstName?: string
  middleName?: string
  lastName?: string
}): string => {
  const parts = []
  
  if (name.lastName) parts.push(name.lastName)
  if (name.middleName) parts.push(name.middleName)
  if (name.firstName) parts.push(name.firstName)
  
  return parts.join(' ')
}

/**
 * Format list with proper conjunctions
 */
export const formatList = (
  items: string[],
  conjunction: string = 'và'
): string => {
  if (items.length === 0) return ''
  if (items.length === 1) return items[0]
  if (items.length === 2) return items.join(` ${conjunction} `)
  
  const lastItem = items.pop()
  return items.join(', ') + ` ${conjunction} ${lastItem}`
}

/**
 * Format URL to display format
 */
export const formatUrl = (url: string): string => {
  if (!url) return url
  
  try {
    const urlObj = new URL(url)
    return urlObj.hostname + urlObj.pathname
  } catch {
    return url
  }
}

/**
 * Format email to display format
 */
export const formatEmail = (email: string): string => {
  if (!email) return email
  
  const [local, domain] = email.split('@')
  if (!domain) return email
  
  // Mask local part if it's long
  if (local.length > 6) {
    const masked = local.substring(0, 3) + '***' + local.substring(local.length - 2)
    return `${masked}@${domain}`
  }
  
  return email
}

/**
 * Format credit card number
 */
export const formatCreditCard = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\D/g, '')
  const groups = cleaned.match(/.{1,4}/g) || []
  return groups.join(' ')
}

/**
 * Mask sensitive data
 */
export const maskSensitive = (
  text: string,
  visibleStart: number = 3,
  visibleEnd: number = 3,
  maskChar: string = '*'
): string => {
  if (!text || text.length <= visibleStart + visibleEnd) {
    return text
  }
  
  const start = text.substring(0, visibleStart)
  const end = text.substring(text.length - visibleEnd)
  const maskLength = text.length - visibleStart - visibleEnd
  const mask = maskChar.repeat(maskLength)
  
  return start + mask + end
}

/**
 * Format JSON for display
 */
export const formatJSON = (obj: any, indent: number = 2): string => {
  try {
    return JSON.stringify(obj, null, indent)
  } catch {
    return String(obj)
  }
}

/**
 * Format SQL query
 */
export const formatSQL = (sql: string): string => {
  if (!sql) return sql
  
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN',
    'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT', 'UPDATE',
    'DELETE', 'CREATE', 'ALTER', 'DROP', 'INDEX', 'TABLE', 'DATABASE'
  ]
  
  let formatted = sql
  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi')
    formatted = formatted.replace(regex, keyword.toUpperCase())
  })
  
  return formatted
}

/**
 * Format code with syntax highlighting (basic)
 */
export const formatCode = (
  code: string,
  _language: string = 'javascript'
): string => {
  // This is a basic formatter - in a real app you'd use a proper syntax highlighter
  return code
    .split('\n')
    .map((line, index) => `${(index + 1).toString().padStart(3, ' ')} | ${line}`)
    .join('\n')
}
