/**
 * Data Source Type Definitions
 * Định nghĩa các type cho Data Source
 */

export type DataSourceType = 'csv' | 'json' | 'api' | 'database' | 'excel' | 'google_sheets'

export type DatabaseType = 'mysql' | 'postgresql' | 'sqlite' | 'mongodb' | 'mssql' | 'oracle'

export interface DataSource {
  id: string
  name: string
  type: DataSourceType
  config: DataSourceConfig
  status: DataSourceStatus
  lastSync?: Date
  createdAt: Date
  updatedAt?: Date
  schema?: DataSchema
  sampleData?: any[]
}

export type DataSourceStatus = 'active' | 'inactive' | 'error' | 'syncing'

export interface DataSourceConfig {
  // CSV/Excel config
  file?: File | string
  delimiter?: string
  hasHeader?: boolean
  encoding?: string
  
  // API config
  url?: string
  method?: 'GET' | 'POST'
  headers?: Record<string, string>
  params?: Record<string, any>
  body?: any
  authType?: 'none' | 'bearer' | 'basic' | 'api_key'
  authConfig?: AuthConfig
  
  // Database config
  host?: string
  port?: number
  database?: string
  username?: string
  password?: string
  ssl?: boolean
  query?: string
  
  // Google Sheets config
  spreadsheetId?: string
  range?: string
  apiKey?: string
  
  // Common config
  refreshInterval?: number // minutes
  timeout?: number // seconds
}

export interface AuthConfig {
  token?: string
  username?: string
  password?: string
  apiKey?: string
  apiKeyHeader?: string
}

export interface DataSchema {
  fields: DataField[]
  totalRows?: number
  estimatedSize?: number
}

export interface DataField {
  name: string
  type: DataFieldType
  nullable: boolean
  unique?: boolean
  description?: string
  format?: string
  examples?: any[]
}

export type DataFieldType = 
  | 'string' 
  | 'number' 
  | 'integer'
  | 'boolean' 
  | 'date' 
  | 'datetime' 
  | 'time'
  | 'json'
  | 'array'

export interface DataPreview {
  data: any[]
  schema: DataSchema
  totalRows: number
  hasMore: boolean
}

export interface DataSourceConnection {
  id: string
  name: string
  type: DataSourceType
  isConnected: boolean
  lastTested?: Date
  error?: string
}

export interface DataSourceTemplate {
  id: string
  name: string
  type: DataSourceType
  config: Partial<DataSourceConfig>
  description?: string
  category: string
  isPublic: boolean
}

// Data transformation types
export interface DataTransformation {
  id: string
  name: string
  type: TransformationType
  config: TransformationConfig
  order: number
}

export type TransformationType = 
  | 'filter'
  | 'sort'
  | 'group'
  | 'aggregate'
  | 'join'
  | 'pivot'
  | 'unpivot'
  | 'calculate'
  | 'rename'
  | 'cast'

export interface TransformationConfig {
  field?: string
  fields?: string[]
  condition?: string
  value?: any
  operation?: string
  groupBy?: string[]
  aggregations?: Record<string, string>
  joinType?: 'inner' | 'left' | 'right' | 'full'
  joinOn?: string
  expression?: string
  newName?: string
  dataType?: DataFieldType
}

// Data Source state management types
export interface DataSourceState {
  dataSources: DataSource[]
  currentDataSource: DataSource | null
  isLoading: boolean
  error: string | null
  connections: DataSourceConnection[]
  templates: DataSourceTemplate[]
}

export interface DataSourceActions {
  loadDataSources: () => Promise<void>
  createDataSource: (dataSource: Omit<DataSource, 'id' | 'createdAt'>) => Promise<DataSource>
  updateDataSource: (id: string, updates: Partial<DataSource>) => Promise<void>
  deleteDataSource: (id: string) => Promise<void>
  testConnection: (config: DataSourceConfig) => Promise<boolean>
  previewData: (id: string, limit?: number) => Promise<DataPreview>
  syncData: (id: string) => Promise<void>
  loadTemplates: () => Promise<void>
}
