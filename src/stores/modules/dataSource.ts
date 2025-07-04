// /**
//  * Data Source Store Module
//  * Pinia store cho Data Source management
//  */

// import { defineStore } from 'pinia'
// import { ref, computed } from 'vue'
// import { parseCSV as parseCSVUtil } from '@/utils/data/parsers'

// // Legacy interfaces for backward compatibility
// export interface DataSourceColumn {
//   name: string
//   type: 'string' | 'number' | 'date'
//   values: any[]
//   isCustom?: boolean
//   expression?: string
// }

// export interface DataSource {
//   id: string
//   name: string
//   description?: string
//   category?: string
//   columns: DataSourceColumn[]
//   rows: any[]
//   createdAt: Date
// }

// export const useDataSourceStore = defineStore('dataSource', () => {
//   // State
//   const dataSources = ref<DataSource[]>([])
//   const currentDataSource = ref<DataSource | null>(null)
//   const isLoading = ref(false)
//   const error = ref<string | null>(null)

//   // Getters
//   const getDataSourceById = computed(() => {
//     return (id: string) => dataSources.value.find(ds => ds.id === id)
//   })

//   // Load from localStorage
//   const loadFromStorage = () => {
//     const stored = localStorage.getItem('bi-data-sources')
//     if (stored) {
//       try {
//         const parsed = JSON.parse(stored)
//         dataSources.value = parsed.map((ds: any) => ({
//           ...ds,
//           createdAt: new Date(ds.createdAt)
//         }))
//       } catch (e) {
//         console.error('Failed to load data sources from storage:', e)
//       }
//     }
//   }

//   const saveToStorage = () => {
//     localStorage.setItem('bi-data-sources', JSON.stringify(dataSources.value))
//   }

//   // Actions
//   const loadDataSources = async () => {
//     isLoading.value = true
//     error.value = null

//     try {
//       loadFromStorage()
//     } catch (err) {
//       error.value = err instanceof Error ? err.message : 'Failed to load data sources'
//       console.error('Error loading data sources:', err)
//     } finally {
//       isLoading.value = false
//     }
//   }

//   const createDataSource = async (dataSource: Omit<DataSource, 'id' | 'createdAt'>) => {
//     isLoading.value = true
//     error.value = null

//     try {
//       const newDataSource: DataSource = {
//         ...dataSource,
//         id: Date.now().toString(),
//         createdAt: new Date()
//       }
//       dataSources.value.push(newDataSource)
//       saveToStorage()
//       return newDataSource
//     } catch (err) {
//       error.value = err instanceof Error ? err.message : 'Failed to create data source'
//       console.error('Error creating data source:', err)
//       throw err
//     } finally {
//       isLoading.value = false
//     }
//   }

//   const deleteDataSource = async (id: string) => {
//     isLoading.value = true
//     error.value = null

//     try {
//       dataSources.value = dataSources.value.filter(ds => ds.id !== id)
//       saveToStorage()

//       if (currentDataSource.value?.id === id) {
//         currentDataSource.value = null
//       }
//     } catch (err) {
//       error.value = err instanceof Error ? err.message : 'Failed to delete data source'
//       console.error('Error deleting data source:', err)
//       throw err
//     } finally {
//       isLoading.value = false
//     }
//   }

//   const parseCSV = async (file: File, name: string, description?: string, category?: string) => {
//     isLoading.value = true
//     error.value = null

//     try {
//       // Read file content
//       const fileContent = await new Promise<string>((resolve, reject) => {
//         const reader = new FileReader()
//         reader.onload = (e) => resolve(e.target?.result as string)
//         reader.onerror = () => reject(new Error('Failed to read file'))
//         reader.readAsText(file)
//       })

//       // Parse CSV using utility function
//       const result = await parseCSVUtil(fileContent, {
//         hasHeader: true,
//         skipEmptyLines: true
//       })

//       if (result.errors.length > 0) {
//         console.warn('CSV parsing warnings:', result.errors)
//       }

//       // Convert parsed data to DataSource format
//       const columns: DataSourceColumn[] = result.fields.map(field => ({
//         name: field.name,
//         type: field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'string',
//         values: result.data.map(row => row[field.name])
//       }))

//       // Create new data source
//       const newDataSource: DataSource = {
//         id: Date.now().toString(),
//         name,
//         description,
//         category: category || 'General',
//         columns,
//         rows: result.data,
//         createdAt: new Date()
//       }

//       dataSources.value.push(newDataSource)
//       saveToStorage()

//       return newDataSource
//     } catch (err) {
//       error.value = err instanceof Error ? err.message : 'Failed to parse CSV file'
//       console.error('Error parsing CSV:', err)
//       throw err
//     } finally {
//       isLoading.value = false
//     }
//   }

//   const clearError = () => {
//     error.value = null
//   }

//   // Initialize store
//   loadFromStorage()

//   return {
//     // State
//     dataSources,
//     currentDataSource,
//     loading: isLoading,
//     error,

//     // Getters
//     getDataSourceById,

//     // Actions
//     loadDataSources,
//     createDataSource,
//     deleteDataSource,
//     parseCSV,
//     clearError
//   }
// })
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
  description?: string
  category?: string
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
          createdAt: new Date(ds.createdAt),
          category: ds.category || 'General' // Default category for existing data
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

  const parseCSV = async (file: File, name: string, description?: string, category?: string): Promise<void> => {
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
              values
            }
          })

          const dataSource: DataSource = {
            id: Date.now().toString(),
            name,
            description,
            category: category || 'General',
            columns,
            rows,
            createdAt: new Date()
          }

          dataSources.value.push(dataSource)
          saveToStorage()
          loading.value = false
        },
        error: (error: any) => {
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

  const updateDataSourceDescription = (id: string, newDescription: string) => {
    const dataSource = dataSources.value.find(ds => ds.id === id)
    if (dataSource) {
      dataSource.description = newDescription
      saveToStorage()
    }
  }

  const updateDataSourceCategory = (id: string, newCategory: string) => {
    const dataSource = dataSources.value.find(ds => ds.id === id)
    if (dataSource) {
      dataSource.category = newCategory
      saveToStorage()
    }
  }

  // Add helpers for custom fields
  function evaluateCustomFieldExpression(expression: string, row: any): any {
    // Use Function constructor for safe evaluation (fields as variables)
    try {
      const fieldNames = Object.keys(row)
      const fieldValues = fieldNames.map(k => row[k])
      // eslint-disable-next-line no-new-func
      const fn = new Function(...fieldNames, `return (${expression})`)
      return fn(...fieldValues)
    } catch (e) {
      return null
    }
  }

  function addCustomField(dataSource: DataSource, name: string, expression: string, type: 'string' | 'number' | 'date' = 'number') {
    // Evaluate values for each row
    const values = dataSource.rows.map(row => evaluateCustomFieldExpression(expression, row))
    const column: DataSourceColumn = {
      name,
      type,
      values,
      isCustom: true,
      expression
    }
    dataSource.columns.push(column)
  }

  function editCustomField(dataSource: DataSource, oldName: string, newName: string, newExpression: string, type: 'string' | 'number' | 'date' = 'number') {
    const col = dataSource.columns.find(c => c.name === oldName && c.isCustom)
    if (col) {
      col.name = newName
      col.expression = newExpression
      col.type = type
      col.values = dataSource.rows.map(row => evaluateCustomFieldExpression(newExpression, row))
    }
  }

  function removeCustomField(dataSource: DataSource, name: string) {
    dataSource.columns = dataSource.columns.filter(c => !(c.name === name && c.isCustom))
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
    updateDataSourceDescription,
    updateDataSourceCategory,
    addCustomField,
    editCustomField,
    removeCustomField
  }
})