/**
 * Router Guards
 * Xử lý authentication, authorization và các logic điều hướng
 */

import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAppStore } from '@/stores'

/**
 * Interface cho user permissions
 */
export interface UserPermissions {
  canViewDashboard: boolean
  canEditDashboard: boolean
  canViewCharts: boolean
  canEditCharts: boolean
  canViewData: boolean
  canEditData: boolean
  canViewDesign: boolean
  canEditDesign: boolean
  canViewSettings: boolean
  canEditSettings: boolean
}

/**
 * Interface cho route meta
 */
export interface RouteMeta {
  requiresAuth?: boolean
  requiresPermission?: keyof UserPermissions
  title?: string
  description?: string
  layout?: string
  showInNavigation?: boolean
}

/**
 * Kiểm tra authentication status
 */
export function isAuthenticated(): boolean {
  // Tạm thời return true cho development
  // Trong production, kiểm tra token, session, etc.
  const token = localStorage.getItem('auth_token')
  return !!token || true // Development mode
}

/**
 * Lấy user permissions
 */
export function getUserPermissions(): UserPermissions {
  // Tạm thời return full permissions cho development
  // Trong production, lấy từ API hoặc store
  return {
    canViewDashboard: true,
    canEditDashboard: true,
    canViewCharts: true,
    canEditCharts: true,
    canViewData: true,
    canEditData: true,
    canViewDesign: true,
    canEditDesign: true,
    canViewSettings: true,
    canEditSettings: true
  }
}

/**
 * Kiểm tra permission
 */
export function hasPermission(permission: keyof UserPermissions): boolean {
  const permissions = getUserPermissions()
  return permissions[permission]
}

/**
 * Authentication Guard
 * Kiểm tra user đã đăng nhập chưa
 */
export function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  const meta = to.meta as RouteMeta

  if (meta.requiresAuth && !isAuthenticated()) {
    // Redirect to login page
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
    return
  }

  next()
}

/**
 * Permission Guard
 * Kiểm tra user có quyền truy cập route không
 */
export function permissionGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  const meta = to.meta as RouteMeta

  if (meta.requiresPermission && !hasPermission(meta.requiresPermission)) {
    // Redirect to unauthorized page
    next({
      name: 'Unauthorized',
      query: { from: to.fullPath }
    })
    return
  }

  next()
}

/**
 * Title Guard
 * Cập nhật document title
 */
export function titleGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  const meta = to.meta as RouteMeta
  const appStore = useAppStore()

  // Cập nhật title
  if (meta.title) {
    document.title = `${meta.title} - BI Dashboard`
    appStore.setPageTitle(meta.title)
  } else {
    document.title = 'BI Dashboard'
    appStore.setPageTitle('Dashboard')
  }

  // Cập nhật description
  if (meta.description) {
    appStore.setPageDescription(meta.description)
  }

  next()
}

/**
 * Loading Guard
 * Hiển thị loading state khi chuyển route
 */
export function loadingGuard(
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  const appStore = useAppStore()

  // Bắt đầu loading
  appStore.setLoading(true)

  // Simulate async operation (có thể là load data, check permissions, etc.)
  setTimeout(() => {
    appStore.setLoading(false)
    next()
  }, 100)
}

/**
 * Data Validation Guard
 * Kiểm tra dữ liệu cần thiết trước khi vào route
 */
export function dataValidationGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  // Kiểm tra các route cần data validation
  const routesRequireData = ['ChartDetail', 'DashboardDetail', 'DataSourceDetail']
  
  if (routesRequireData.includes(to.name as string)) {
    const id = to.params.id as string
    
    if (!id || id === 'undefined' || id === 'null') {
      // Redirect về list page nếu không có ID hợp lệ
      const listRoutes: Record<string, string> = {
        'ChartDetail': 'ChartList',
        'DashboardDetail': 'DashboardList',
        'DataSourceDetail': 'DataSources'
      }
      
      next({ name: listRoutes[to.name as string] || 'Home' })
      return
    }
  }

  next()
}

/**
 * Navigation History Guard
 * Lưu lại navigation history
 */
export function navigationHistoryGuard(
  _to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  const appStore = useAppStore()

  // Lưu route history
  appStore.addToNavigationHistory({
    name: from.name as string,
    path: from.fullPath,
    title: (from.meta as RouteMeta)?.title || from.name as string,
    timestamp: Date.now()
  })

  next()
}

/**
 * Error Handler Guard
 * Xử lý lỗi trong quá trình navigation
 */
export function errorHandlerGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  try {
    // Kiểm tra route có tồn tại không
    if (!to.matched.length) {
      next({ name: 'NotFound' })
      return
    }

    next()
  } catch (error) {
    console.error('Navigation error:', error)
    next({ name: 'Error' })
  }
}

/**
 * Development Guard
 * Chỉ cho phép truy cập một số route trong development mode
 */
export function developmentGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
): void {
  const isDevelopment = import.meta.env.DEV
  const devOnlyRoutes = ['Demo', 'Test', 'Playground']

  if (!isDevelopment && devOnlyRoutes.includes(to.name as string)) {
    next({ name: 'NotFound' })
    return
  }

  next()
}

/**
 * Combine tất cả guards thành một function
 */
export function setupRouterGuards(router: any): void {
  // Global before guards (chạy theo thứ tự)
  router.beforeEach(authGuard)
  router.beforeEach(permissionGuard)
  router.beforeEach(dataValidationGuard)
  router.beforeEach(developmentGuard)
  router.beforeEach(errorHandlerGuard)
  router.beforeEach(navigationHistoryGuard)
  router.beforeEach(loadingGuard)
  router.beforeEach(titleGuard)

  // Global after guards
  router.afterEach((to: RouteLocationNormalized) => {
    const appStore = useAppStore()
    appStore.setLoading(false)
    
    // Analytics tracking (nếu cần)
    if (import.meta.env.PROD) {
      // Track page view
      console.log('Page view:', to.fullPath)
    }
  })
}
