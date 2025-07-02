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
      requiresPermission: 'user.manage',
      showInNavigation: true,
      module: 'admin'
    }
  }
]

export default adminRoutes