/**
 * Data Source Service
 * Service layer cho Data Source operations
 */

import { apiClient } from '@/api/client'
import { API_ENDPOINTS } from '@/api/endpoints'
import type { 
  DataSource, 
  DataSourceConfig, 
  DataPreview,

  DataSourceTemplate
} from '@/types/dataSource'

export class DataSourceService {
  /**
   * Lấy danh sách tất cả data sources
   */
  async getDataSources(): Promise<DataSource[]> {
    try {
      const response = await apiClient.get<DataSource[]>(API_ENDPOINTS.DATA_SOURCES)
      return response.data
    } catch (error) {
      console.error('Error fetching data sources:', error)
      throw error
    }
  }

  /**
   * Lấy data source theo ID
   */
  async getDataSourceById(id: string): Promise<DataSource> {
    try {
      const response = await apiClient.get<DataSource>(API_ENDPOINTS.DATA_SOURCE_BY_ID(id))
      return response.data
    } catch (error) {
      console.error(`Error fetching data source ${id}:`, error)
      throw error
    }
  }

  /**
   * Tạo data source mới
   */
  async createDataSource(dataSource: Omit<DataSource, 'id' | 'createdAt'>): Promise<DataSource> {
    try {
      const response = await apiClient.post<DataSource>(API_ENDPOINTS.DATA_SOURCES, dataSource)
      return response.data
    } catch (error) {
      console.error('Error creating data source:', error)
      throw error
    }
  }

  /**
   * Cập nhật data source
   */
  async updateDataSource(id: string, updates: Partial<DataSource>): Promise<DataSource> {
    try {
      const response = await apiClient.put<DataSource>(API_ENDPOINTS.DATA_SOURCE_BY_ID(id), updates)
      return response.data
    } catch (error) {
      console.error(`Error updating data source ${id}:`, error)
      throw error
    }
  }

  /**
   * Xóa data source
   */
  async deleteDataSource(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.DATA_SOURCE_BY_ID(id))
    } catch (error) {
      console.error(`Error deleting data source ${id}:`, error)
      throw error
    }
  }

  /**
   * Test kết nối data source
   */
  async testConnection(config: DataSourceConfig): Promise<boolean> {
    try {
      const response = await apiClient.post<{ success: boolean }>(
        '/api/data-sources/test-connection',
        config
      )
      return response.data.success
    } catch (error) {
      console.error('Error testing connection:', error)
      return false
    }
  }

  /**
   * Test kết nối data source theo ID
   */
  async testConnectionById(id: string): Promise<boolean> {
    try {
      const response = await apiClient.post<{ success: boolean }>(
        API_ENDPOINTS.DATA_SOURCE_TEST(id)
      )
      return response.data.success
    } catch (error) {
      console.error(`Error testing connection for data source ${id}:`, error)
      return false
    }
  }

  /**
   * Preview dữ liệu từ data source
   */
  async previewData(id: string, limit: number = 100): Promise<DataPreview> {
    try {
      const response = await apiClient.get<DataPreview>(
        API_ENDPOINTS.DATA_SOURCE_PREVIEW(id),
        { limit }
      )
      return response.data
    } catch (error) {
      console.error(`Error previewing data for source ${id}:`, error)
      throw error
    }
  }

  /**
   * Sync dữ liệu từ data source
   */
  async syncData(id: string): Promise<void> {
    try {
      await apiClient.post(`${API_ENDPOINTS.DATA_SOURCE_BY_ID(id)}/sync`)
    } catch (error) {
      console.error(`Error syncing data source ${id}:`, error)
      throw error
    }
  }

  /**
   * Upload file cho data source
   */
  async uploadFile(file: File, _onProgress?: (progress: number) => void): Promise<string> {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/data-sources/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()
      return result.data.fileId
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }

  /**
   * Parse CSV data
   */
  async parseCSV(fileId: string, options: {
    delimiter?: string
    hasHeader?: boolean
    encoding?: string
  }): Promise<DataPreview> {
    try {
      const response = await apiClient.post<DataPreview>(
        '/api/data-sources/parse-csv',
        { fileId, ...options }
      )
      return response.data
    } catch (error) {
      console.error('Error parsing CSV:', error)
      throw error
    }
  }

  /**
   * Validate data source config
   */
  async validateConfig(config: DataSourceConfig): Promise<{
    isValid: boolean
    errors: string[]
  }> {
    try {
      const response = await apiClient.post<{
        isValid: boolean
        errors: string[]
      }>('/api/data-sources/validate', config)
      return response.data
    } catch (error) {
      console.error('Error validating config:', error)
      return {
        isValid: false,
        errors: ['Validation failed']
      }
    }
  }

  /**
   * Lấy danh sách templates
   */
  async getTemplates(): Promise<DataSourceTemplate[]> {
    try {
      const response = await apiClient.get<DataSourceTemplate[]>('/api/data-sources/templates')
      return response.data
    } catch (error) {
      console.error('Error fetching templates:', error)
      throw error
    }
  }
}

// Export singleton instance
export const dataSourceService = new DataSourceService()
export default dataSourceService
