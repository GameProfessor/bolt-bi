import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Papa from 'papaparse'

export interface DataSourceColumn {
  name: string
  type: 'string' | 'number' | 'date'
  values: any[]
  isCustom?: boolean
  expression?: string
}

export interface DataSource {
  id: string
  name: string
  columns: DataSourceColumn[]
  rows: any[]
  createdAt: Date
}

export const useDataSourceStore = defineStore('dataSource', () => {
  const dataSources = ref<DataSource[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const getDataSourceById = computed(() => {
    return (id: string) => dataSources.value.find(ds => ds.id === id)
  })

  const loadFromStorage = () => {
    const stored = localStorage.getItem('bi-data-sources')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        dataSources.value = parsed.map((ds: any) => ({
          ...ds,
          createdAt: new Date(ds.createdAt)
        }))
      } catch (e) {
        console.error('Failed to load data sources from storage:', e)
      }
    }
  }

  const saveToStorage = () => {
    localStorage.setItem('bi-data-sources', JSON.stringify(dataSources.value))
  }

  const detectColumnType = (values: any[]): 'string' | 'number' | 'date' => {
    const nonEmptyValues = values.filter(v => v !== null && v !== undefined && v !== '')
    if (nonEmptyValues.length === 0) return 'string'
    
    const numericCount = nonEmptyValues.filter(v => !isNaN(Number(v))).length
    const dateCount = nonEmptyValues.filter(v => !isNaN(Date.parse(v))).length
    
    if (numericCount / nonEmptyValues.length > 0.8) return 'number'
    if (dateCount / nonEmptyValues.length > 0.8) return 'date'
    return 'string'
  }

  const evaluateExpression = (expression: string, row: any, columns: DataSourceColumn[]): any => {
    try {
      // Create a safe evaluation context with only the row data and basic math functions
      const context = { ...row }
      
      // Add basic math functions
      const mathFunctions = {
        abs: Math.abs,
        ceil: Math.ceil,
        floor: Math.floor,
        round: Math.round,
        max: Math.max,
        min: Math.min,
        sqrt: Math.sqrt,
        pow: Math.pow,
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        log: Math.log,
        exp: Math.exp
      }
      
      // Replace field names with their values and add math functions
      let processedExpression = expression
      
      // Replace column names with context values
      columns.forEach(col => {
        if (!col.isCustom) {
          const regex = new RegExp(`\\b${col.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g')
          processedExpression = processedExpression.replace(regex, `context["${col.name}"]`)
        }
      })
      
      // Add math functions to context
      Object.assign(context, mathFunctions)
      
      // Create a function that evaluates the expression
      const func = new Function('context', `
        with(context) {
          return ${processedExpression}
        }
      `)
      
      const result = func(context)
      return result
    } catch (error) {
      console.error('Error evaluating expression:', error)
      return null
    }
  }

  const addCustomField = (dataSourceId: string, fieldName: string, expression: string) => {
    const dataSource = dataSources.value.find(ds => ds.id === dataSourceId)
    if (!dataSource) return false

    // Check if field name already exists
    if (dataSource.columns.some(col => col.name === fieldName)) {
      throw new Error('Field name already exists')
    }

    try {
      // Calculate values for all rows
      const values = dataSource.rows.map(row => 
        evaluateExpression(expression, row, dataSource.columns)
      )

      // Detect the type of the calculated values
      const type = detectColumnType(values)

      // Add the custom column
      const customColumn: DataSourceColumn = {
        name: fieldName,
        type,
        values,
        isCustom: true,
        expression
      }

      dataSource.columns.push(customColumn)

      // Update rows with the new calculated values
      dataSource.rows.forEach((row, index) => {
        row[fieldName] = values[index]
      })

      saveToStorage()
      return true
    } catch (error) {
      console.error('Failed to add custom field:', error)
      throw error
    }
  }

  const updateCustomField = (dataSourceId: string, oldFieldName: string, newFieldName: string, expression: string) => {
    const dataSource = dataSources.value.find(ds => ds.id === dataSourceId)
    if (!dataSource) return false

    const columnIndex = dataSource.columns.findIndex(col => col.name === oldFieldName && col.isCustom)
    if (columnIndex === -1) return false

    // Check if new field name already exists (and it's not the same field)
    if (newFieldName !== oldFieldName && dataSource.columns.some(col => col.name === newFieldName)) {
      throw new Error('Field name already exists')
    }

    try {
      // Calculate new values
      const values = dataSource.rows.map(row => 
        evaluateExpression(expression, row, dataSource.columns.filter(col => !col.isCustom || col.name !== oldFieldName))
      )

      const type = detectColumnType(values)

      // Update the column
      dataSource.columns[columnIndex] = {
        name: newFieldName,
        type,
        values,
        isCustom: true,
        expression
      }

      // Update rows - remove old field and add new one
      dataSource.rows.forEach((row, index) => {
        if (oldFieldName !== newFieldName) {
          delete row[oldFieldName]
        }
        row[newFieldName] = values[index]
      })

      saveToStorage()
      return true
    } catch (error) {
      console.error('Failed to update custom field:', error)
      throw error
    }
  }

  const removeCustomField = (dataSourceId: string, fieldName: string) => {
    const dataSource = dataSources.value.find(ds => ds.id === dataSourceId)
    if (!dataSource) return false

    const columnIndex = dataSource.columns.findIndex(col => col.name === fieldName && col.isCustom)
    if (columnIndex === -1) return false

    // Remove the column
    dataSource.columns.splice(columnIndex, 1)

    // Remove the field from all rows
    dataSource.rows.forEach(row => {
      delete row[fieldName]
    })

    saveToStorage()
    return true
  }

  const parseCSV = async (file: File, name: string): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const text = await file.text()
      
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            error.value = `CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`
            loading.value = false
            return
          }

          const rows = results.data as any[]
          if (rows.length === 0) {
            error.value = 'CSV file is empty or has no valid data rows'
            loading.value = false
            return
          }

          const columnNames = Object.keys(rows[0])
          const columns: DataSourceColumn[] = columnNames.map(name => {
            const values = rows.map(row => row[name])
            return {
              name,
              type: detectColumnType(values),
              values,
              isCustom: false
            }
          })

          const dataSource: DataSource = {
            id: Date.now().toString(),
            name,
            columns,
            rows,
            createdAt: new Date()
          }

          dataSources.value.push(dataSource)
          saveToStorage()
          loading.value = false
        },
        error: (error) => {
          error.value = `Failed to parse CSV: ${error.message}`
          loading.value = false
        }
      })
    } catch (e) {
      error.value = `Failed to read file: ${e instanceof Error ? e.message : 'Unknown error'}`
      loading.value = false
    }
  }

  const deleteDataSource = (id: string) => {
    const index = dataSources.value.findIndex(ds => ds.id === id)
    if (index > -1) {
      dataSources.value.splice(index, 1)
      saveToStorage()
    }
  }

  const updateDataSourceName = (id: string, newName: string) => {
    const dataSource = dataSources.value.find(ds => ds.id === id)
    if (dataSource) {
      dataSource.name = newName
      saveToStorage()
    }
  }

  // Initialize from storage
  loadFromStorage()

  return {
    dataSources,
    loading,
    error,
    getDataSourceById,
    parseCSV,
    deleteDataSource,
    updateDataSourceName,
    addCustomField,
    updateCustomField,
    removeCustomField
  }
})