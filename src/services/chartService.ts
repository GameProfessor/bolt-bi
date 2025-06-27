/**
 * Chart Service
 * Service layer cho Chart operations
 */

import { apiClient } from '@/api/client'
import { API_ENDPOINTS } from '@/api/endpoints'
import type { 
  Chart, 
  ChartData, 
  ChartConfig,
  ChartTemplate 
} from '@/types/chart'

export class ChartService {
  /**
   * Lấy danh sách tất cả charts
   */
  async getCharts(): Promise<Chart[]> {
    try {
      const response = await apiClient.get<Chart[]>(API_ENDPOINTS.CHARTS)
      return response.data
    } catch (error) {
      console.error('Error fetching charts:', error)
      throw error
    }
  }

  /**
   * Lấy chart theo ID
   */
  async getChartById(id: string): Promise<Chart> {
    try {
      const response = await apiClient.get<Chart>(API_ENDPOINTS.CHART_BY_ID(id))
      return response.data
    } catch (error) {
      console.error(`Error fetching chart ${id}:`, error)
      throw error
    }
  }

  /**
   * Tạo chart mới
   */
  async createChart(chart: Omit<Chart, 'id' | 'createdAt'>): Promise<Chart> {
    try {
      const response = await apiClient.post<Chart>(API_ENDPOINTS.CHARTS, chart)
      return response.data
    } catch (error) {
      console.error('Error creating chart:', error)
      throw error
    }
  }

  /**
   * Cập nhật chart
   */
  async updateChart(id: string, updates: Partial<Chart>): Promise<Chart> {
    try {
      const response = await apiClient.put<Chart>(API_ENDPOINTS.CHART_BY_ID(id), updates)
      return response.data
    } catch (error) {
      console.error(`Error updating chart ${id}:`, error)
      throw error
    }
  }

  /**
   * Xóa chart
   */
  async deleteChart(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.CHART_BY_ID(id))
    } catch (error) {
      console.error(`Error deleting chart ${id}:`, error)
      throw error
    }
  }

  /**
   * Lấy dữ liệu cho chart
   */
  async getChartData(id: string, filters?: Record<string, any>): Promise<ChartData> {
    try {
      const response = await apiClient.get<ChartData>(
        API_ENDPOINTS.CHART_DATA(id),
        filters
      )
      return response.data
    } catch (error) {
      console.error(`Error fetching chart data ${id}:`, error)
      throw error
    }
  }

  /**
   * Refresh dữ liệu chart
   */
  async refreshChartData(id: string): Promise<ChartData> {
    try {
      const response = await apiClient.post<ChartData>(
        `${API_ENDPOINTS.CHART_DATA(id)}/refresh`
      )
      return response.data
    } catch (error) {
      console.error(`Error refreshing chart data ${id}:`, error)
      throw error
    }
  }

  /**
   * Export chart với axios
   */
  async exportChart(
    id: string,
    format: 'png' | 'jpg' | 'svg' | 'pdf',
    options?: {
      width?: number
      height?: number
      quality?: number
      onProgress?: (progress: number) => void
    }
  ): Promise<Blob> {
    try {
      const { onProgress, ...exportOptions } = options || {}

      const config = {
        responseType: 'blob' as const,
        ...(onProgress && {
          onDownloadProgress: (progressEvent: any) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
              onProgress(progress)
            }
          }
        })
      }

      const response = await apiClient.getAxiosInstance().post(
        API_ENDPOINTS.EXPORT_CHART(id),
        { format, ...exportOptions },
        config
      )

      return response.data
    } catch (error) {
      console.error(`Error exporting chart ${id}:`, error)
      throw error
    }
  }

  /**
   * Download chart trực tiếp
   */
  async downloadChart(
    id: string,
    format: 'png' | 'jpg' | 'svg' | 'pdf',
    filename?: string
  ): Promise<void> {
    try {
      const endpoint = API_ENDPOINTS.EXPORT_CHART(id)
      const downloadFilename = filename || `chart-${id}.${format}`

      await apiClient.download(endpoint, downloadFilename)
    } catch (error) {
      console.error(`Error downloading chart ${id}:`, error)
      throw error
    }
  }

  /**
   * Duplicate chart
   */
  async duplicateChart(id: string, name?: string): Promise<Chart> {
    try {
      const response = await apiClient.post<Chart>(
        `${API_ENDPOINTS.CHART_BY_ID(id)}/duplicate`,
        { name }
      )
      return response.data
    } catch (error) {
      console.error(`Error duplicating chart ${id}:`, error)
      throw error
    }
  }

  /**
   * Validate chart config
   */
  async validateConfig(config: ChartConfig): Promise<{
    isValid: boolean
    errors: string[]
  }> {
    try {
      const response = await apiClient.post<{
        isValid: boolean
        errors: string[]
      }>('/api/charts/validate', config)
      return response.data
    } catch (error) {
      console.error('Error validating chart config:', error)
      return {
        isValid: false,
        errors: ['Validation failed']
      }
    }
  }

  /**
   * Lấy danh sách templates
   */
  async getTemplates(): Promise<ChartTemplate[]> {
    try {
      const response = await apiClient.get<ChartTemplate[]>(API_ENDPOINTS.TEMPLATES)
      return response.data
    } catch (error) {
      console.error('Error fetching chart templates:', error)
      throw error
    }
  }

  /**
   * Tạo chart từ template
   */
  async createFromTemplate(templateId: string, config: Partial<ChartConfig>): Promise<Chart> {
    try {
      const response = await apiClient.post<Chart>(
        `/api/charts/from-template/${templateId}`,
        config
      )
      return response.data
    } catch (error) {
      console.error(`Error creating chart from template ${templateId}:`, error)
      throw error
    }
  }

  /**
   * Preview chart với config
   */
  async previewChart(config: ChartConfig, dataSourceId: string): Promise<ChartData> {
    try {
      const response = await apiClient.post<ChartData>(
        '/api/charts/preview',
        { config, dataSourceId }
      )
      return response.data
    } catch (error) {
      console.error('Error previewing chart:', error)
      throw error
    }
  }
}

// Export singleton instance
export const chartService = new ChartService()
export default chartService
