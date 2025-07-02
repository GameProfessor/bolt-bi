import type { RouteLocationNormalized } from 'vue-router'
import { getNavigationRoutes, getNavigationRoutesByModule, routeModules } from './modules'

/**
 * Get breadcrumb items for current route
 */
export const getBreadcrumbs = (route: RouteLocationNormalized) => {
  const breadcrumbs = []
  
  // Add custom breadcrumb from route meta
  if (route.meta?.breadcrumb) {
    return route.meta.breadcrumb
  }
  
  // Generate breadcrumb from route path
  const pathSegments = route.path.split('/').filter(segment => segment)
  let currentPath = ''
  
  for (const segment of pathSegments) {
    currentPath += `/${segment}`
    const matchedRoute = getNavigationRoutes().find(r => r.path === currentPath)
    
    if (matchedRoute) {
      breadcrumbs.push({
        name: matchedRoute.meta?.title || matchedRoute.name,
        to: currentPath
      })
    }
  }
  
  return breadcrumbs
}

/**
 * Get navigation items grouped by module
 */
export const getGroupedNavigation = () => {
  const grouped: Record<string, any> = {}
  
  routeModules.forEach(module => {
    const routes = getNavigationRoutesByModule(module.name)
    if (routes.length > 0) {
      grouped[module.name] = {
        ...module,
        routes
      }
    }
  })
  
  return grouped
}

/**
 * Get flat navigation items for simple navigation
 */
export const getFlatNavigation = () => {
  return getNavigationRoutes().map(route => ({
    name: route.meta?.title || route.name,
    to: route.path,
    icon: route.meta?.icon,
    module: route.meta?.module,
    description: route.meta?.description
  }))
}

/**
 * Check if route is active (including child routes)
 */
export const isRouteActive = (routePath: string, currentPath: string): boolean => {
  if (routePath === '/') {
    return currentPath === '/'
  }
  return currentPath.startsWith(routePath)
}

/**
 * Get module info by route
 */
export const getModuleByRoute = (route: RouteLocationNormalized) => {
  const moduleName = route.meta?.module
  if (!moduleName) return null
  
  return routeModules.find(module => module.name === moduleName)
}

/**
 * Get route permissions (for future use with authentication)
 */
export const getRoutePermissions = (route: RouteLocationNormalized): string[] => {
  const permissions = route.meta?.permissions
  return Array.isArray(permissions) ? permissions : []
}

/**
 * Check if user has permission to access route
 */
export const canAccessRoute = (route: RouteLocationNormalized, userPermissions: string[] = []): boolean => {
  const requiredPermissions = getRoutePermissions(route)

  if (requiredPermissions.length === 0) {
    return true // No permissions required
  }

  return requiredPermissions.some((permission: string) => userPermissions.includes(permission))
}

/**
 * Get sidebar navigation structure
 */
export const getSidebarNavigation = () => {
  const navigation = []
  
  // Dashboard section
  const dashboardRoutes = getNavigationRoutesByModule('dashboard')
  if (dashboardRoutes.length > 0) {
    navigation.push({
      title: 'Dashboard',
      items: dashboardRoutes.map(route => ({
        name: route.meta?.title || route.name,
        to: route.path,
        icon: route.meta?.icon,
        active: false // Will be set by component
      }))
    })
  }
  
  // Data section
  const dataRoutes = getNavigationRoutesByModule('data')
  if (dataRoutes.length > 0) {
    navigation.push({
      title: 'Data Management',
      items: dataRoutes.map(route => ({
        name: route.meta?.title || route.name,
        to: route.path,
        icon: route.meta?.icon,
        active: false
      }))
    })
  }
  
  // Charts section
  const chartRoutes = getNavigationRoutesByModule('charts')
  if (chartRoutes.length > 0) {
    navigation.push({
      title: 'Visualization',
      items: chartRoutes.map(route => ({
        name: route.meta?.title || route.name,
        to: route.path,
        icon: route.meta?.icon,
        active: false
      }))
    })
  }
  
  // Design section
  const designRoutes = getNavigationRoutesByModule('design')
  if (designRoutes.length > 0) {
    navigation.push({
      title: 'Design & Templates',
      items: designRoutes.map(route => ({
        name: route.meta?.title || route.name,
        to: route.path,
        icon: route.meta?.icon,
        active: false
      }))
    })
  }
  
  return navigation
}

/**
 * Get quick actions for header
 */
export const getQuickActions = () => {
  return [
    {
      name: 'Upload Data',
      to: '/data-sources/create',
      icon: 'PlusIcon',
      description: 'Upload a new CSV file'
    },
    {
      name: 'Create Chart',
      to: '/charts/create',
      icon: 'PresentationChartLineIcon',
      description: 'Create a new chart'
    },
    {
      name: 'Quick Dashboard',
      to: '/quick-dashboard',
      icon: 'BoltIcon',
      description: 'Build dashboard quickly'
    }
  ]
}
