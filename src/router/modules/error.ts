import type { RouteRecordRaw } from 'vue-router'

const errorRoutes: RouteRecordRaw[] = [
  {
    path: '/404',
    name: 'NotFoundPage',
    component: () => import('@/pages/error/NotFound.vue'),
    meta: {
      title: 'Page Not Found',
      description: 'The requested page could not be found',
      module: 'error',
      layout: 'error',
      hidden: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/auth/Login.vue'),
    meta: {
      title: 'Login',
      description: 'Login to access the dashboard',
      module: 'auth',
      layout: 'auth',
      requiresAuth: false,
      showInNavigation: false
    }
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('@/pages/error/Unauthorized.vue'),
    meta: {
      title: '403 - Unauthorized',
      description: 'You do not have permission to access this page',
      module: 'error',
      layout: 'error',
      requiresAuth: false,
      showInNavigation: false
    }
  },
  {
    path: '/error',
    name: 'Error',
    component: () => import('@/pages/error/Error.vue'),
    meta: {
      title: 'Error',
      description: 'An error occurred',
      module: 'error',
      layout: 'error',
      requiresAuth: false,
      showInNavigation: false
    }
  },
  // Catch-all route for 404 - phải đặt cuối cùng
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/404'
  }
]

export default errorRoutes
