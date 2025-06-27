/**
 * Export Service
 * Service layer cho Export operations
 */

import { apiClient } from '@/api/client'
import type { DashboardExportOptions } from '@/types/dashboard'

export interface ExportOptions {
  format: 'pdf' | 'png' | 'jpg' | 'svg' | 'excel' | 'csv' | 'json'
  quality?: number
  width?: number
  height?: number
  includeData?: boolean
  dateRange?: {
    from: Date
    to: Date
  }
  filters?: Record<string, any>
}

export class ExportService {
  /**
   * Export dashboard
   */
  async exportDashboard(id: string, options: DashboardExportOptions): Promise<Blob> {
    try {
      const response = await fetch(`/api/dashboards/${id}/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options)
      })

      if (!response.ok) {
        throw new Error('Export failed')
      }

      return await response.blob()
    } catch (error) {
      console.error(`Error exporting dashboard ${id}:`, error)
      throw error
    }
  }

  /**
   * Export chart
   */
  async exportChart(id: string, options: ExportOptions): Promise<Blob> {
    try {
      const response = await fetch(`/api/charts/${id}/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options)
      })

      if (!response.ok) {
        throw new Error('Export failed')
      }

      return await response.blob()
    } catch (error) {
      console.error(`Error exporting chart ${id}:`, error)
      throw error
    }
  }

  /**
   * Export data source data
   */
  async exportDataSource(id: string, options: ExportOptions): Promise<Blob> {
    try {
      const response = await fetch(`/api/data-sources/${id}/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options)
      })

      if (!response.ok) {
        throw new Error('Export failed')
      }

      return await response.blob()
    } catch (error) {
      console.error(`Error exporting data source ${id}:`, error)
      throw error
    }
  }

  /**
   * Download file từ blob
   */
  downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  /**
   * Get MIME type từ format
   */
  getMimeType(format: string): string {
    const mimeTypes: Record<string, string> = {
      pdf: 'application/pdf',
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      svg: 'image/svg+xml',
      excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      csv: 'text/csv',
      json: 'application/json'
    }
    return mimeTypes[format] || 'application/octet-stream'
  }

  /**
   * Get file extension từ format
   */
  getFileExtension(format: string): string {
    const extensions: Record<string, string> = {
      pdf: '.pdf',
      png: '.png',
      jpg: '.jpg',
      jpeg: '.jpg',
      svg: '.svg',
      excel: '.xlsx',
      csv: '.csv',
      json: '.json'
    }
    return extensions[format] || ''
  }

  /**
   * Generate filename
   */
  generateFilename(name: string, format: string, timestamp?: Date): string {
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '_')
    const dateStr = timestamp ? 
      timestamp.toISOString().split('T')[0] : 
      new Date().toISOString().split('T')[0]
    const extension = this.getFileExtension(format)
    
    return `${cleanName}_${dateStr}${extension}`
  }

  /**
   * Batch export multiple items
   */
  async batchExport(items: Array<{
    type: 'dashboard' | 'chart' | 'dataSource'
    id: string
    name: string
    options: ExportOptions
  }>): Promise<Blob[]> {
    const results: Blob[] = []
    
    for (const item of items) {
      try {
        let blob: Blob
        
        switch (item.type) {
          case 'dashboard':
            blob = await this.exportDashboard(item.id, item.options as DashboardExportOptions)
            break
          case 'chart':
            blob = await this.exportChart(item.id, item.options)
            break
          case 'dataSource':
            blob = await this.exportDataSource(item.id, item.options)
            break
          default:
            throw new Error(`Unknown export type: ${item.type}`)
        }
        
        results.push(blob)
      } catch (error) {
        console.error(`Error exporting ${item.type} ${item.id}:`, error)
        throw error
      }
    }
    
    return results
  }
}

// Export singleton instance
export const exportService = new ExportService()
export default exportService
