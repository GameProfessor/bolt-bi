/**
 * Dashboard Store Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDashboardStore } from '@/stores/modules/dashboard'
import { dashboardService } from '@/services/dashboardService'
import { mockDashboard, mockWidget, createMockData } from '../fixtures/mockData'

// Mock the dashboard service
vi.mock('@/services/dashboardService', () => ({
  dashboardService: {
    getDashboards: vi.fn(),
    getDashboardById: vi.fn(),
    createDashboard: vi.fn(),
    updateDashboard: vi.fn(),
    deleteDashboard: vi.fn(),
    addWidget: vi.fn(),
    updateWidget: vi.fn(),
    removeWidget: vi.fn(),
    exportDashboard: vi.fn(),
    shareDashboard: vi.fn(),
    duplicateDashboard: vi.fn()
  }
}))

describe('Dashboard Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const store = useDashboardStore()
      
      expect(store.dashboards).toEqual([])
      expect(store.currentDashboard).toBeNull()
      expect(store.isLoading).toBe(false)
      expect(store.error).toBeNull()
      expect(store.filters).toEqual([])
      expect(store.selectedWidgets).toEqual([])
    })
  })

  describe('Getters', () => {
    it('should get dashboard by id', () => {
      const store = useDashboardStore()
      store.dashboards = [mockDashboard]
      
      const dashboard = store.getDashboardById('dashboard-1')
      expect(dashboard).toEqual(mockDashboard)
    })

    it('should return undefined for non-existent dashboard', () => {
      const store = useDashboardStore()
      store.dashboards = [mockDashboard]
      
      const dashboard = store.getDashboardById('non-existent')
      expect(dashboard).toBeUndefined()
    })

    it('should get current dashboard widgets', () => {
      const store = useDashboardStore()
      store.currentDashboard = mockDashboard
      
      expect(store.currentDashboardWidgets).toEqual(mockDashboard.widgets)
    })
  })

  describe('Actions', () => {
    describe('loadDashboards', () => {
      it('should load dashboards successfully', async () => {
        const store = useDashboardStore()
        const mockDashboards = [mockDashboard]
        
        vi.mocked(dashboardService.getDashboards).mockResolvedValue(mockDashboards)
        
        await store.loadDashboards()
        
        expect(store.dashboards).toEqual(mockDashboards)
        expect(store.isLoading).toBe(false)
        expect(store.error).toBeNull()
      })

      it('should handle load dashboards error', async () => {
        const store = useDashboardStore()
        const errorMessage = 'Failed to load dashboards'
        
        vi.mocked(dashboardService.getDashboards).mockRejectedValue(new Error(errorMessage))
        
        await store.loadDashboards()
        
        expect(store.dashboards).toEqual([])
        expect(store.isLoading).toBe(false)
        expect(store.error).toBe(errorMessage)
      })
    })

    describe('loadDashboard', () => {
      it('should load single dashboard successfully', async () => {
        const store = useDashboardStore()
        
        vi.mocked(dashboardService.getDashboardById).mockResolvedValue(mockDashboard)
        
        await store.loadDashboard('dashboard-1')
        
        expect(store.currentDashboard).toEqual(mockDashboard)
        expect(store.isLoading).toBe(false)
        expect(store.error).toBeNull()
      })

      it('should handle load dashboard error', async () => {
        const store = useDashboardStore()
        const errorMessage = 'Failed to load dashboard'
        
        vi.mocked(dashboardService.getDashboardById).mockRejectedValue(new Error(errorMessage))
        
        await store.loadDashboard('dashboard-1')
        
        expect(store.currentDashboard).toBeNull()
        expect(store.isLoading).toBe(false)
        expect(store.error).toBe(errorMessage)
      })
    })

    describe('createDashboard', () => {
      it('should create dashboard successfully', async () => {
        const store = useDashboardStore()
        const newDashboard = createMockData.dashboard({ id: 'new-dashboard' })
        const dashboardData = { name: 'New Dashboard', description: 'Test' }
        
        vi.mocked(dashboardService.createDashboard).mockResolvedValue(newDashboard)
        
        const result = await store.createDashboard(dashboardData)
        
        expect(result).toEqual(newDashboard)
        expect(store.dashboards).toContain(newDashboard)
        expect(store.isLoading).toBe(false)
        expect(store.error).toBeNull()
      })

      it('should handle create dashboard error', async () => {
        const store = useDashboardStore()
        const errorMessage = 'Failed to create dashboard'
        const dashboardData = { name: 'New Dashboard', description: 'Test' }
        
        vi.mocked(dashboardService.createDashboard).mockRejectedValue(new Error(errorMessage))
        
        await expect(store.createDashboard(dashboardData)).rejects.toThrow(errorMessage)
        expect(store.isLoading).toBe(false)
        expect(store.error).toBe(errorMessage)
      })
    })

    describe('updateDashboard', () => {
      it('should update dashboard successfully', async () => {
        const store = useDashboardStore()
        const updatedDashboard = { ...mockDashboard, name: 'Updated Dashboard' }
        
        store.dashboards = [mockDashboard]
        store.currentDashboard = mockDashboard
        
        vi.mocked(dashboardService.updateDashboard).mockResolvedValue(updatedDashboard)
        
        await store.updateDashboard('dashboard-1', { name: 'Updated Dashboard' })
        
        expect(store.dashboards[0]).toEqual(updatedDashboard)
        expect(store.currentDashboard).toEqual(updatedDashboard)
        expect(store.isLoading).toBe(false)
        expect(store.error).toBeNull()
      })
    })

    describe('deleteDashboard', () => {
      it('should delete dashboard successfully', async () => {
        const store = useDashboardStore()
        
        store.dashboards = [mockDashboard]
        store.currentDashboard = mockDashboard
        
        vi.mocked(dashboardService.deleteDashboard).mockResolvedValue(undefined)
        
        await store.deleteDashboard('dashboard-1')
        
        expect(store.dashboards).toEqual([])
        expect(store.currentDashboard).toBeNull()
        expect(store.isLoading).toBe(false)
        expect(store.error).toBeNull()
      })
    })

    describe('addWidget', () => {
      it('should add widget successfully', async () => {
        const store = useDashboardStore()
        const newWidget = createMockData.widget({ id: 'new-widget' })
        const widgetData = { title: 'New Widget', type: 'chart' as const }
        
        store.dashboards = [mockDashboard]
        store.currentDashboard = mockDashboard
        
        vi.mocked(dashboardService.addWidget).mockResolvedValue(newWidget)
        
        const result = await store.addWidget('dashboard-1', widgetData)
        
        expect(result).toEqual(newWidget)
        expect(store.dashboards[0].widgets).toContain(newWidget)
        expect(store.currentDashboard?.widgets).toContain(newWidget)
      })
    })

    describe('removeWidget', () => {
      it('should remove widget successfully', async () => {
        const store = useDashboardStore()
        
        store.dashboards = [mockDashboard]
        store.currentDashboard = mockDashboard
        store.selectedWidgets = ['widget-1']
        
        vi.mocked(dashboardService.removeWidget).mockResolvedValue(undefined)
        
        await store.removeWidget('dashboard-1', 'widget-1')
        
        expect(store.dashboards[0].widgets).not.toContain(mockWidget)
        expect(store.currentDashboard?.widgets).not.toContain(mockWidget)
        expect(store.selectedWidgets).not.toContain('widget-1')
      })
    })

    describe('Widget Selection', () => {
      it('should select widget', () => {
        const store = useDashboardStore()
        
        store.selectWidget('widget-1')
        
        expect(store.selectedWidgets).toContain('widget-1')
      })

      it('should not duplicate selected widget', () => {
        const store = useDashboardStore()
        
        store.selectWidget('widget-1')
        store.selectWidget('widget-1')
        
        expect(store.selectedWidgets).toEqual(['widget-1'])
      })

      it('should deselect widget', () => {
        const store = useDashboardStore()
        store.selectedWidgets = ['widget-1', 'widget-2']
        
        store.deselectWidget('widget-1')
        
        expect(store.selectedWidgets).toEqual(['widget-2'])
      })

      it('should clear selection', () => {
        const store = useDashboardStore()
        store.selectedWidgets = ['widget-1', 'widget-2']
        
        store.clearSelection()
        
        expect(store.selectedWidgets).toEqual([])
      })
    })

    describe('Error Handling', () => {
      it('should clear error', () => {
        const store = useDashboardStore()
        store.error = 'Some error'
        
        store.clearError()
        
        expect(store.error).toBeNull()
      })
    })
  })
})
