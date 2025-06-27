/**
 * Validators
 * Utility functions để validate dữ liệu
 */

/**
 * Email validation
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Phone number validation (Vietnamese)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '')
  
  // Vietnamese mobile: 10 digits starting with 0
  // Vietnamese landline: 10 digits not starting with 0
  return cleaned.length === 10 && /^[0-9]{10}$/.test(cleaned)
}

/**
 * Vietnamese ID number validation
 */
export const isValidIdNumber = (id: string): boolean => {
  const cleaned = id.replace(/\D/g, '')
  
  // Old format: 9 digits
  // New format: 12 digits
  return cleaned.length === 9 || cleaned.length === 12
}

/**
 * URL validation
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Password strength validation
 */
export const validatePassword = (password: string): {
  isValid: boolean
  score: number
  feedback: string[]
} => {
  const feedback: string[] = []
  let score = 0

  if (password.length < 8) {
    feedback.push('Mật khẩu phải có ít nhất 8 ký tự')
  } else {
    score += 1
  }

  if (!/[a-z]/.test(password)) {
    feedback.push('Mật khẩu phải có ít nhất 1 chữ thường')
  } else {
    score += 1
  }

  if (!/[A-Z]/.test(password)) {
    feedback.push('Mật khẩu phải có ít nhất 1 chữ hoa')
  } else {
    score += 1
  }

  if (!/[0-9]/.test(password)) {
    feedback.push('Mật khẩu phải có ít nhất 1 số')
  } else {
    score += 1
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    feedback.push('Mật khẩu phải có ít nhất 1 ký tự đặc biệt')
  } else {
    score += 1
  }

  return {
    isValid: score >= 4,
    score,
    feedback
  }
}

/**
 * Required field validation
 */
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

/**
 * Minimum length validation
 */
export const minLength = (value: string, min: number): boolean => {
  return value && value.length >= min
}

/**
 * Maximum length validation
 */
export const maxLength = (value: string, max: number): boolean => {
  return !value || value.length <= max
}

/**
 * Number range validation
 */
export const isInRange = (
  value: number,
  min: number,
  max: number
): boolean => {
  return value >= min && value <= max
}

/**
 * Date validation
 */
export const isValidDate = (date: string | Date): boolean => {
  const d = new Date(date)
  return !isNaN(d.getTime())
}

/**
 * Future date validation
 */
export const isFutureDate = (date: string | Date): boolean => {
  const d = new Date(date)
  return d > new Date()
}

/**
 * Past date validation
 */
export const isPastDate = (date: string | Date): boolean => {
  const d = new Date(date)
  return d < new Date()
}

/**
 * Age validation (from birth date)
 */
export const isValidAge = (
  birthDate: string | Date,
  minAge: number = 0,
  maxAge: number = 150
): boolean => {
  const birth = new Date(birthDate)
  const today = new Date()
  const age = today.getFullYear() - birth.getFullYear()
  
  return age >= minAge && age <= maxAge
}

/**
 * Credit card validation (Luhn algorithm)
 */
export const isValidCreditCard = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\D/g, '')
  
  if (cleaned.length < 13 || cleaned.length > 19) {
    return false
  }

  let sum = 0
  let isEven = false

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i])

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

/**
 * JSON validation
 */
export const isValidJSON = (jsonString: string): boolean => {
  try {
    JSON.parse(jsonString)
    return true
  } catch {
    return false
  }
}

/**
 * SQL injection detection (basic)
 */
export const hasSQLInjection = (input: string): boolean => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
    /(--|\/\*|\*\/|;|'|")/,
    /(\bOR\b|\bAND\b).*[=<>]/i
  ]

  return sqlPatterns.some(pattern => pattern.test(input))
}

/**
 * XSS detection (basic)
 */
export const hasXSS = (input: string): boolean => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi
  ]

  return xssPatterns.some(pattern => pattern.test(input))
}

/**
 * File type validation
 */
export const isValidFileType = (
  file: File,
  allowedTypes: string[]
): boolean => {
  return allowedTypes.includes(file.type)
}

/**
 * File size validation
 */
export const isValidFileSize = (
  file: File,
  maxSizeInMB: number
): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024
  return file.size <= maxSizeInBytes
}

/**
 * Image dimensions validation
 */
export const validateImageDimensions = (
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img.width <= maxWidth && img.height <= maxHeight)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(false)
    }

    img.src = url
  })
}

/**
 * Form validation helper
 */
export const validateForm = (
  data: Record<string, any>,
  rules: Record<string, Array<{
    validator: (value: any) => boolean
    message: string
  }>>
): {
  isValid: boolean
  errors: Record<string, string[]>
} => {
  const errors: Record<string, string[]> = {}

  Object.entries(rules).forEach(([field, fieldRules]) => {
    const value = data[field]
    const fieldErrors: string[] = []

    fieldRules.forEach(rule => {
      if (!rule.validator(value)) {
        fieldErrors.push(rule.message)
      }
    })

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors
    }
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Common validation rules
 */
export const ValidationRules = {
  required: (message: string = 'Trường này là bắt buộc') => ({
    validator: isRequired,
    message
  }),

  email: (message: string = 'Email không hợp lệ') => ({
    validator: isValidEmail,
    message
  }),

  phone: (message: string = 'Số điện thoại không hợp lệ') => ({
    validator: isValidPhoneNumber,
    message
  }),

  minLength: (min: number, message?: string) => ({
    validator: (value: string) => minLength(value, min),
    message: message || `Tối thiểu ${min} ký tự`
  }),

  maxLength: (max: number, message?: string) => ({
    validator: (value: string) => maxLength(value, max),
    message: message || `Tối đa ${max} ký tự`
  }),

  url: (message: string = 'URL không hợp lệ') => ({
    validator: isValidUrl,
    message
  }),

  date: (message: string = 'Ngày không hợp lệ') => ({
    validator: isValidDate,
    message
  }),

  futureDate: (message: string = 'Ngày phải trong tương lai') => ({
    validator: isFutureDate,
    message
  }),

  pastDate: (message: string = 'Ngày phải trong quá khứ') => ({
    validator: isPastDate,
    message
  })
}
