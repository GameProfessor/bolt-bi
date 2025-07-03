import type { RouteRecordRaw } from 'vue-router'

const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    name: 'Admin',
    redirect: '/admin/users'
  },
  {
    path: '/admin/users',
    name: 'UserManagement',
    component: () => import('@/pages/admin/UserManagement.vue'),
    meta: {
      title: 'User Management',
      description: 'Manage users and user groups',
      layout: 'default',
      requiresAuth: true,
      requiresPermission: 'canManageUsers',
      showInNavigation: true,
      module: 'admin'
    }
  },
  {
    path: '/admin/access-logs',
    name: 'AccessLogs',
    component: () => import('@/pages/admin/AccessLogs.vue'),
    meta: {
      title: 'Access Logs',
      requiresAuth: true,
      requiresPermission: 'canManageUsers',
      showInNavigation: true,
      module: 'admin',
      icon: 'DocumentTextIcon'
    }
  }
]

export default adminRoutes