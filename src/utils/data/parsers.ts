/**
 * Data Parsers
 * Utility functions để parse và transform dữ liệu
 */

import Papa from 'papaparse'
import type { DataField, DataFieldType } from '@/types/dataSource'

/**
 * Parse CSV data
 */
export const parseCSV = (
  csvText: string,
  options: {
    delimiter?: string
    hasHeader?: boolean
    skipEmptyLines?: boolean
  } = {}
): Promise<{
  data: any[]
  fields: DataField[]
  errors: any[]
}> => {
  return new Promise((resolve) => {
    Papa.parse(csvText, {
      delimiter: options.delimiter || ',',
      header: options.hasHeader !== false,
      skipEmptyLines: options.skipEmptyLines !== false,
      dynamicTyping: true,
      complete: (results) => {
        const data = results.data as any[]
        const fields = inferFields(data, options.hasHeader !== false)
        
        resolve({
          data,
          fields,
          errors: results.errors
        })
      }
    })
  })
}

/**
 * Parse JSON data
 */
export const parseJSON = (jsonText: string): {
  data: any[]
  fields: DataField[]
  errors: string[]
} => {
  try {
    const parsed = JSON.parse(jsonText)
    let data: any[]
    
    // Handle different JSON structures
    if (Array.isArray(parsed)) {
      data = parsed
    } else if (parsed.data && Array.isArray(parsed.data)) {
      data = parsed.data
    } else if (typeof parsed === 'object') {
      data = [parsed]
    } else {
      throw new Error('Invalid JSON structure')
    }
    
    const fields = inferFields(data, true)
    
    return { data, fields, errors: [] }
  } catch (error) {
    return {
      data: [],
      fields: [],
      errors: [error instanceof Error ? error.message : 'JSON parse error']
    }
  }
}

/**
 * Infer field types from data
 */
export const inferFields = (
  data: any[],
  hasHeader: boolean = true
): DataField[] => {
  if (data.length === 0) return []
  
  const sample = data[0]
  const fields: DataField[] = []
  
  if (typeof sample === 'object' && sample !== null) {
    // Object data
    Object.keys(sample).forEach(key => {
      const field = inferFieldType(key, data.map(row => row[key]))
      fields.push(field)
    })
  } else if (Array.isArray(sample)) {
    // Array data
    sample.forEach((_, index) => {
      const values = data.map(row => Array.isArray(row) ? row[index] : null)
      const field = inferFieldType(`column_${index + 1}`, values)
      fields.push(field)
    })
  }
  
  return fields
}

/**
 * Infer field type from values
 */
export const inferFieldType = (
  name: string,
  values: any[]
): DataField => {
  const nonNullValues = values.filter(val => val !== null && val !== undefined && val !== '')
  
  if (nonNullValues.length === 0) {
    return {
      name,
      type: 'string',
      nullable: true,
      examples: []
    }
  }
  
  // Check for boolean
  if (nonNullValues.every(val => typeof val === 'boolean')) {
    return {
      name,
      type: 'boolean',
      nullable: values.length !== nonNullValues.length,
      examples: [...new Set(nonNullValues)].slice(0, 3)
    }
  }
  
  // Check for number
  if (nonNullValues.every(val => typeof val === 'number' && !isNaN(val))) {
    const hasDecimals = nonNullValues.some(val => val % 1 !== 0)
    return {
      name,
      type: hasDecimals ? 'number' : 'integer',
      nullable: values.length !== nonNullValues.length,
      examples: [...new Set(nonNullValues)].slice(0, 3)
    }
  }
  
  // Check for date
  const dateValues = nonNullValues.filter(val => {
    if (typeof val === 'string') {
      const date = new Date(val)
      return !isNaN(date.getTime()) && val.match(/\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|\d{2}-\d{2}-\d{4}/)
    }
    return false
  })
  
  if (dateValues.length > nonNullValues.length * 0.8) {
    return {
      name,
      type: 'date',
      nullable: values.length !== nonNullValues.length,
      examples: dateValues.slice(0, 3)
    }
  }
  
  // Check for datetime
  const datetimeValues = nonNullValues.filter(val => {
    if (typeof val === 'string') {
      const date = new Date(val)
      return !isNaN(date.getTime()) && val.includes('T') || val.includes(' ')
    }
    return false
  })
  
  if (datetimeValues.length > nonNullValues.length * 0.8) {
    return {
      name,
      type: 'datetime',
      nullable: values.length !== nonNullValues.length,
      examples: datetimeValues.slice(0, 3)
    }
  }
  
  // Default to string
  return {
    name,
    type: 'string',
    nullable: values.length !== nonNullValues.length,
    examples: [...new Set(nonNullValues.map(String))].slice(0, 3)
  }
}

/**
 * Convert value to specified type
 */
export const convertValue = (
  value: any,
  targetType: DataFieldType
): any => {
  if (value === null || value === undefined || value === '') {
    return null
  }
  
  switch (targetType) {
    case 'string':
      return String(value)
    
    case 'number':
      const num = Number(value)
      return isNaN(num) ? null : num
    
    case 'integer':
      const int = parseInt(String(value), 10)
      return isNaN(int) ? null : int
    
    case 'boolean':
      if (typeof value === 'boolean') return value
      const str = String(value).toLowerCase()
      return str === 'true' || str === '1' || str === 'yes'
    
    case 'date':
      const date = new Date(value)
      return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0]
    
    case 'datetime':
      const datetime = new Date(value)
      return isNaN(datetime.getTime()) ? null : datetime.toISOString()
    
    case 'time':
      // Handle time format HH:MM:SS
      if (typeof value === 'string' && value.match(/^\d{2}:\d{2}(:\d{2})?$/)) {
        return value
      }
      return null
    
    case 'json':
      try {
        return typeof value === 'string' ? JSON.parse(value) : value
      } catch {
        return null
      }
    
    case 'array':
      if (Array.isArray(value)) return value
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value)
          return Array.isArray(parsed) ? parsed : [value]
        } catch {
          return value.split(',').map(s => s.trim())
        }
      }
      return [value]
    
    default:
      return value
  }
}

/**
 * Transform data with field mappings
 */
export const transformData = (
  data: any[],
  fieldMappings: Record<string, { name: string; type: DataFieldType }>
): any[] => {
  return data.map(row => {
    const transformedRow: any = {}
    
    Object.entries(fieldMappings).forEach(([originalField, mapping]) => {
      const value = row[originalField]
      transformedRow[mapping.name] = convertValue(value, mapping.type)
    })
    
    return transformedRow
  })
}

/**
 * Validate data against schema
 */
export const validateData = (
  data: any[],
  fields: DataField[]
): {
  isValid: boolean
  errors: Array<{
    row: number
    field: string
    value: any
    error: string
  }>
} => {
  const errors: Array<{
    row: number
    field: string
    value: any
    error: string
  }> = []
  
  data.forEach((row, rowIndex) => {
    fields.forEach(field => {
      const value = row[field.name]
      
      // Check nullable
      if (!field.nullable && (value === null || value === undefined || value === '')) {
        errors.push({
          row: rowIndex,
          field: field.name,
          value,
          error: 'Field is required'
        })
        return
      }
      
      // Skip validation for null values if field is nullable
      if (field.nullable && (value === null || value === undefined || value === '')) {
        return
      }
      
      // Type validation
      const convertedValue = convertValue(value, field.type)
      if (convertedValue === null && value !== null) {
        errors.push({
          row: rowIndex,
          field: field.name,
          value,
          error: `Invalid ${field.type} value`
        })
      }
    })
  })
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Clean data by removing invalid rows
 */
export const cleanData = (
  data: any[],
  fields: DataField[],
  options: {
    removeEmptyRows?: boolean
    removeInvalidValues?: boolean
    fillMissingValues?: boolean
    defaultValues?: Record<string, any>
  } = {}
): any[] => {
  const {
    removeEmptyRows = true,
    removeInvalidValues = false,
    fillMissingValues = false,
    defaultValues = {}
  } = options
  
  let cleanedData = [...data]
  
  // Remove empty rows
  if (removeEmptyRows) {
    cleanedData = cleanedData.filter(row => {
      return Object.values(row).some(value => 
        value !== null && value !== undefined && value !== ''
      )
    })
  }
  
  // Process each row
  cleanedData = cleanedData.map(row => {
    const cleanedRow = { ...row }
    
    fields.forEach(field => {
      const value = cleanedRow[field.name]
      
      // Fill missing values
      if (fillMissingValues && (value === null || value === undefined || value === '')) {
        if (defaultValues[field.name] !== undefined) {
          cleanedRow[field.name] = defaultValues[field.name]
        } else {
          // Use type-specific defaults
          switch (field.type) {
            case 'string':
              cleanedRow[field.name] = ''
              break
            case 'number':
            case 'integer':
              cleanedRow[field.name] = 0
              break
            case 'boolean':
              cleanedRow[field.name] = false
              break
            default:
              cleanedRow[field.name] = null
          }
        }
      }
      
      // Convert and validate values
      if (value !== null && value !== undefined && value !== '') {
        const convertedValue = convertValue(value, field.type)
        if (convertedValue !== null || !removeInvalidValues) {
          cleanedRow[field.name] = convertedValue
        }
      }
    })
    
    return cleanedRow
  })
  
  return cleanedData
}
