import type { RouteRecordRaw } from 'vue-router'

// Import all route modules
import dashboardRoutes from './dashboard'
import chartRoutes from './charts'
import dataRoutes from './data'
import designRoutes from './design'
import settingsRoutes from './settings'
import errorRoutes from './error'

// Combine all routes
export const allRoutes: RouteRecordRaw[] = [
  ...dashboardRoutes,
  ...chartRoutes,
  ...dataRoutes,
  ...designRoutes,
  ...settingsRoutes,
  ...errorRoutes // Error routes phải đặt cuối cùng
]

// Export individual modules for specific use cases
export {
  dashboardRoutes,
  chartRoutes,
  dataRoutes,
  designRoutes,
  settingsRoutes,
  errorRoutes
}

// Helper function to get routes by module
export const getRoutesByModule = (moduleName: string): RouteRecordRaw[] => {
  return allRoutes.filter(route => route.meta?.module === moduleName)
}

// Helper function to get navigation routes (excluding hidden ones)
export const getNavigationRoutes = (): RouteRecordRaw[] => {
  return allRoutes.filter(route => !route.meta?.hidden && route.meta?.module)
}

// Helper function to get routes by module for navigation
export const getNavigationRoutesByModule = (moduleName: string): RouteRecordRaw[] => {
  return allRoutes.filter(
    route => route.meta?.module === moduleName && !route.meta?.hidden
  )
}

// Route modules metadata
export const routeModules = [
  {
    name: 'dashboard',
    title: 'Dashboard',
    description: 'Dashboard management and overview',
    icon: 'ChartBarIcon',
    color: 'primary'
  },
  {
    name: 'charts',
    title: 'Charts',
    description: 'Chart creation and management',
    icon: 'PresentationChartLineIcon',
    color: 'secondary'
  },
  {
    name: 'data',
    title: 'Data',
    description: 'Data source management',
    icon: 'TableCellsIcon',
    color: 'emerald'
  },
  {
    name: 'design',
    title: 'Design',
    description: 'Template design and customization',
    icon: 'PaintBrushIcon',
    color: 'purple'
  },
  {
    name: 'settings',
    title: 'Settings',
    description: 'Application settings and preferences',
    icon: 'CogIcon',
    color: 'gray'
  }
]
