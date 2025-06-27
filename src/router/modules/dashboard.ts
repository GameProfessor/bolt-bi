import type { RouteRecordRaw } from 'vue-router'

// Dashboard Pages
import Home from '@/pages/dashboard/Home.vue'
import DashboardStore from '@/pages/dashboard/DashboardStore.vue'
import QuickDashboard from '@/pages/dashboard/QuickDashboard.vue'

const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Dashboard Home',
      description: 'Main dashboard overview',
      module: 'dashboard',
      icon: 'ChartBarIcon',
      requiresAuth: false,
      requiresPermission: 'canViewDashboard',
      showInNavigation: true
    }
  },
  {
    path: '/dashboards',
    name: 'DashboardStore',
    component: DashboardStore,
    meta: {
      title: 'Dashboard Store',
      description: 'Browse and manage dashboards',
      module: 'dashboard',
      icon: 'BuildingStorefrontIcon',
      requiresAuth: false,
      requiresPermission: 'canViewDashboard',
      showInNavigation: true
    }
  },
  {
    path: '/dashboard-store',
    name: 'DashboardStoreAlias',
    redirect: '/dashboards',
    meta: {
      hidden: true // Ẩn khỏi navigation
    }
  },
  {
    path: '/quick-dashboard',
    name: 'QuickDashboard',
    component: QuickDashboard,
    meta: {
      title: 'Quick Dashboard',
      description: 'Create dashboards quickly',
      module: 'dashboard',
      icon: 'BoltIcon',
      requiresAuth: false,
      requiresPermission: 'canEditDashboard',
      showInNavigation: true
    }
  }
]

export default dashboardRoutes
