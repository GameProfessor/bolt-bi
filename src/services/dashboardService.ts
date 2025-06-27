/**
 * Dashboard Service
 * Service layer cho Dashboard operations
 */

import { apiClient } from '@/api/client'
import { API_ENDPOINTS } from '@/api/endpoints'
import type { 
  Dashboard, 
  DashboardWidget, 
  DashboardExportOptions,
  DashboardShareSettings 
} from '@/types/dashboard'
import type { ApiResponse } from '@/api/types'

export class DashboardService {
  /**
   * Lấy danh sách tất cả dashboards
   */
  async getDashboards(): Promise<Dashboard[]> {
    try {
      const response = await apiClient.get<Dashboard[]>(API_ENDPOINTS.DASHBOARDS)
      return response.data
    } catch (error) {
      console.error('Error fetching dashboards:', error)
      throw error
    }
  }

  /**
   * Lấy dashboard theo ID
   */
  async getDashboardById(id: string): Promise<Dashboard> {
    try {
      const response = await apiClient.get<Dashboard>(API_ENDPOINTS.DASHBOARD_BY_ID(id))
      return response.data
    } catch (error) {
      console.error(`Error fetching dashboard ${id}:`, error)
      throw error
    }
  }

  /**
   * Tạo dashboard mới
   */
  async createDashboard(dashboard: Omit<Dashboard, 'id' | 'createdAt'>): Promise<Dashboard> {
    try {
      const response = await apiClient.post<Dashboard>(API_ENDPOINTS.DASHBOARDS, dashboard)
      return response.data
    } catch (error) {
      console.error('Error creating dashboard:', error)
      throw error
    }
  }

  /**
   * Cập nhật dashboard
   */
  async updateDashboard(id: string, updates: Partial<Dashboard>): Promise<Dashboard> {
    try {
      const response = await apiClient.put<Dashboard>(API_ENDPOINTS.DASHBOARD_BY_ID(id), updates)
      return response.data
    } catch (error) {
      console.error(`Error updating dashboard ${id}:`, error)
      throw error
    }
  }

  /**
   * Xóa dashboard
   */
  async deleteDashboard(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.DASHBOARD_BY_ID(id))
    } catch (error) {
      console.error(`Error deleting dashboard ${id}:`, error)
      throw error
    }
  }

  /**
   * Thêm widget vào dashboard
   */
  async addWidget(dashboardId: string, widget: Omit<DashboardWidget, 'id'>): Promise<DashboardWidget> {
    try {
      const response = await apiClient.post<DashboardWidget>(
        API_ENDPOINTS.DASHBOARD_WIDGETS(dashboardId), 
        widget
      )
      return response.data
    } catch (error) {
      console.error(`Error adding widget to dashboard ${dashboardId}:`, error)
      throw error
    }
  }

  /**
   * Cập nhật widget
   */
  async updateWidget(
    dashboardId: string, 
    widgetId: string, 
    updates: Partial<DashboardWidget>
  ): Promise<DashboardWidget> {
    try {
      const response = await apiClient.put<DashboardWidget>(
        `${API_ENDPOINTS.DASHBOARD_WIDGETS(dashboardId)}/${widgetId}`,
        updates
      )
      return response.data
    } catch (error) {
      console.error(`Error updating widget ${widgetId}:`, error)
      throw error
    }
  }

  /**
   * Xóa widget khỏi dashboard
   */
  async removeWidget(dashboardId: string, widgetId: string): Promise<void> {
    try {
      await apiClient.delete(`${API_ENDPOINTS.DASHBOARD_WIDGETS(dashboardId)}/${widgetId}`)
    } catch (error) {
      console.error(`Error removing widget ${widgetId}:`, error)
      throw error
    }
  }

  /**
   * Export dashboard
   */
  async exportDashboard(id: string, options: DashboardExportOptions): Promise<Blob> {
    try {
      const response = await fetch(API_ENDPOINTS.EXPORT_DASHBOARD(id), {
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
   * Chia sẻ dashboard
   */
  async shareDashboard(id: string, settings: DashboardShareSettings): Promise<string> {
    try {
      const response = await apiClient.post<{ shareUrl: string }>(
        `${API_ENDPOINTS.DASHBOARD_BY_ID(id)}/share`,
        settings
      )
      return response.data.shareUrl
    } catch (error) {
      console.error(`Error sharing dashboard ${id}:`, error)
      throw error
    }
  }

  /**
   * Duplicate dashboard
   */
  async duplicateDashboard(id: string, name?: string): Promise<Dashboard> {
    try {
      const response = await apiClient.post<Dashboard>(
        `${API_ENDPOINTS.DASHBOARD_BY_ID(id)}/duplicate`,
        { name }
      )
      return response.data
    } catch (error) {
      console.error(`Error duplicating dashboard ${id}:`, error)
      throw error
    }
  }
}

// Export singleton instance
export const dashboardService = new DashboardService()
export default dashboardService
