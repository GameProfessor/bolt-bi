/**
 * Mock Data for Tests
 * Test fixtures và mock data
 */

import type { Dashboard, DashboardWidget } from '@/types/dashboard'
import type { DataSource } from '@/types/dataSource'
import type { Chart } from '@/types/chart'
import type { User } from '@/types'

/**
 * Mock User
 */
export const mockUser: User = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  avatar: 'https://example.com/avatar.jpg',
  role: 'admin',
  preferences: {
    theme: 'light',
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'vi-VN'
  },
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-12-01')
}

/**
 * Mock Dashboard Widget
 */
export const mockWidget: DashboardWidget = {
  id: 'widget-1',
  title: 'Test Widget',
  type: 'chart',
  chartId: 'chart-1',
  position: { x: 0, y: 0, w: 6, h: 4 },
  config: {
    showTitle: true,
    showLegend: true,
    refreshInterval: 300
  }
}

/**
 * Mock Dashboard
 */
export const mockDashboard: Dashboard = {
  id: 'dashboard-1',
  name: 'Test Dashboard',
  description: 'A test dashboard',
  widgets: [mockWidget],
  layout: 'grid',
  isPublic: false,
  tags: ['test', 'sample'],
  createdBy: 'user-1',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-12-01')
}

/**
 * Mock Data Source
 */
export const mockDataSource: DataSource = {
  id: 'datasource-1',
  name: 'Test Data Source',
  type: 'csv',
  config: {
    file: {
      name: 'test.csv',
      size: 1024,
      type: 'text/csv'
    },
    hasHeader: true,
    delimiter: ','
  },
  status: 'active',
  fields: [
    {
      name: 'id',
      type: 'integer',
      nullable: false,
      examples: [1, 2, 3]
    },
    {
      name: 'name',
      type: 'string',
      nullable: false,
      examples: ['John', 'Jane', 'Bob']
    },
    {
      name: 'value',
      type: 'number',
      nullable: true,
      examples: [100.5, 200.0, 150.75]
    }
  ],
  createdBy: 'user-1',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-12-01')
}

/**
 * Mock Chart
 */
export const mockChart: Chart = {
  id: 'chart-1',
  name: 'Test Chart',
  type: 'bar',
  dataSourceId: 'datasource-1',
  config: {
    xAxis: 'name',
    yAxis: 'value',
    aggregation: 'sum',
    colors: ['#3B82F6', '#EF4444', '#10B981'],
    showLegend: true,
    showGrid: true
  },
  createdBy: 'user-1',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-12-01')
}

/**
 * Mock Chart Data
 */
export const mockChartData = {
  labels: ['January', 'February', 'March', 'April', 'May'],
  datasets: [
    {
      label: 'Sales',
      data: [12, 19, 3, 5, 2],
      backgroundColor: '#3B82F6',
      borderColor: '#1D4ED8',
      borderWidth: 1
    }
  ]
}

/**
 * Mock CSV Data
 */
export const mockCSVData = `id,name,value,date
1,Product A,100.5,2023-01-01
2,Product B,200.0,2023-01-02
3,Product C,150.75,2023-01-03
4,Product D,300.25,2023-01-04
5,Product E,75.0,2023-01-05`

/**
 * Mock JSON Data
 */
export const mockJSONData = [
  { id: 1, name: 'Product A', value: 100.5, date: '2023-01-01' },
  { id: 2, name: 'Product B', value: 200.0, date: '2023-01-02' },
  { id: 3, name: 'Product C', value: 150.75, date: '2023-01-03' },
  { id: 4, name: 'Product D', value: 300.25, date: '2023-01-04' },
  { id: 5, name: 'Product E', value: 75.0, date: '2023-01-05' }
]

/**
 * Mock API Responses
 */
export const mockApiResponses = {
  dashboards: {
    success: true,
    data: [mockDashboard],
    message: 'Dashboards retrieved successfully'
  },
  
  dashboard: {
    success: true,
    data: mockDashboard,
    message: 'Dashboard retrieved successfully'
  },
  
  dataSources: {
    success: true,
    data: [mockDataSource],
    message: 'Data sources retrieved successfully'
  },
  
  dataSource: {
    success: true,
    data: mockDataSource,
    message: 'Data source retrieved successfully'
  },
  
  charts: {
    success: true,
    data: [mockChart],
    message: 'Charts retrieved successfully'
  },
  
  chart: {
    success: true,
    data: mockChart,
    message: 'Chart retrieved successfully'
  },
  
  chartData: {
    success: true,
    data: mockChartData,
    message: 'Chart data retrieved successfully'
  },
  
  error: {
    success: false,
    data: null,
    message: 'An error occurred',
    errors: ['Test error message']
  }
}

/**
 * Mock Form Data
 */
export const mockFormData = {
  dashboard: {
    name: 'New Dashboard',
    description: 'A new dashboard for testing',
    isPublic: false,
    tags: ['test']
  },
  
  dataSource: {
    name: 'New Data Source',
    type: 'csv',
    config: {
      hasHeader: true,
      delimiter: ','
    }
  },
  
  chart: {
    name: 'New Chart',
    type: 'bar',
    dataSourceId: 'datasource-1',
    config: {
      xAxis: 'name',
      yAxis: 'value',
      aggregation: 'sum'
    }
  }
}

/**
 * Mock File
 */
export const mockFile = new File(['test content'], 'test.csv', {
  type: 'text/csv'
})

/**
 * Mock Local Storage Data
 */
export const mockLocalStorageData = {
  theme: 'light',
  language: 'vi',
  userPreferences: {
    theme: 'light',
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh'
  },
  authToken: 'mock-jwt-token',
  recentItems: [
    { id: 'dashboard-1', type: 'dashboard', name: 'Test Dashboard' },
    { id: 'chart-1', type: 'chart', name: 'Test Chart' }
  ]
}

/**
 * Helper function to create mock data
 */
export const createMockData = {
  user: (overrides: Partial<User> = {}): User => ({
    ...mockUser,
    ...overrides
  }),
  
  dashboard: (overrides: Partial<Dashboard> = {}): Dashboard => ({
    ...mockDashboard,
    ...overrides
  }),
  
  widget: (overrides: Partial<DashboardWidget> = {}): DashboardWidget => ({
    ...mockWidget,
    ...overrides
  }),
  
  dataSource: (overrides: Partial<DataSource> = {}): DataSource => ({
    ...mockDataSource,
    ...overrides
  }),
  
  chart: (overrides: Partial<Chart> = {}): Chart => ({
    ...mockChart,
    ...overrides
  })
}
