/**
 * Routes Constants
 * Định nghĩa các hằng số cho routes
 */

export const ROUTE_NAMES = {
  HOME: 'Home',
  DASHBOARD_LIST: 'DashboardList',
  DASHBOARD_VIEW: 'DashboardView', 
  DASHBOARD_EDIT: 'DashboardEdit',
  DASHBOARD_CREATE: 'DashboardCreate',
  DATA_SOURCES: 'DataSources',
  DATA_SOURCE_CREATE: 'DataSourceCreate',
  DATA_SOURCE_EDIT: 'DataSourceEdit',
  QUICK_DASHBOARD: 'QuickDashboard',
  TEMPLATE_DESIGNER: 'TemplateDesigner',
  ANALYTICS: 'Analytics',
  SETTINGS: 'Settings',
  PROFILE: 'Profile',
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword'
} as const

export const ROUTE_PATHS = {
  HOME: '/',
  DASHBOARD_LIST: '/dashboards',
  DASHBOARD_VIEW: '/dashboards/:id',
  DASHBOARD_EDIT: '/dashboards/:id/edit',
  DASHBOARD_CREATE: '/dashboards/create',
  DATA_SOURCES: '/data-sources',
  DATA_SOURCE_CREATE: '/data-sources/create',
  DATA_SOURCE_EDIT: '/data-sources/:id/edit',
  QUICK_DASHBOARD: '/quick-dashboard',
  TEMPLATE_DESIGNER: '/template-designer',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password'
} as const

export const NAVIGATION_ITEMS = [
  {
    name: ROUTE_NAMES.HOME,
    path: ROUTE_PATHS.HOME,
    label: 'Trang chủ',
    icon: 'HomeIcon',
    requiresAuth: false
  },
  {
    name: ROUTE_NAMES.DASHBOARD_LIST,
    path: ROUTE_PATHS.DASHBOARD_LIST,
    label: 'Dashboards',
    icon: 'ChartBarIcon',
    requiresAuth: true
  },
  {
    name: ROUTE_NAMES.DATA_SOURCES,
    path: ROUTE_PATHS.DATA_SOURCES,
    label: 'Nguồn dữ liệu',
    icon: 'TableCellsIcon',
    requiresAuth: true
  },
  {
    name: ROUTE_NAMES.QUICK_DASHBOARD,
    path: ROUTE_PATHS.QUICK_DASHBOARD,
    label: 'Dashboard nhanh',
    icon: 'BoltIcon',
    requiresAuth: true
  },
  // {
  //   name: ROUTE_NAMES.TEMPLATE_DESIGNER,
  //   path: ROUTE_PATHS.TEMPLATE_DESIGNER,
  //   label: 'Thiết kế mẫu',
  //   icon: 'PaintBrushIcon',
  //   requiresAuth: true
  // },
  {
    name: ROUTE_NAMES.ANALYTICS,
    path: ROUTE_PATHS.ANALYTICS,
    label: 'Phân tích',
    icon: 'ChartPieIcon',
    requiresAuth: true,
    roles: ['admin']
  },
  {
    name: ROUTE_NAMES.SETTINGS,
    path: ROUTE_PATHS.SETTINGS,
    label: 'Cài đặt',
    icon: 'CogIcon',
    requiresAuth: true
  }
]

export const BREADCRUMB_LABELS = {
  [ROUTE_NAMES.HOME]: 'Trang chủ',
  [ROUTE_NAMES.DASHBOARD_LIST]: 'Dashboards',
  [ROUTE_NAMES.DASHBOARD_VIEW]: 'Xem Dashboard',
  [ROUTE_NAMES.DASHBOARD_EDIT]: 'Chỉnh sửa Dashboard',
  [ROUTE_NAMES.DASHBOARD_CREATE]: 'Tạo Dashboard mới',
  [ROUTE_NAMES.DATA_SOURCES]: 'Nguồn dữ liệu',
  [ROUTE_NAMES.DATA_SOURCE_CREATE]: 'Tạo nguồn dữ liệu mới',
  [ROUTE_NAMES.DATA_SOURCE_EDIT]: 'Chỉnh sửa nguồn dữ liệu',
  [ROUTE_NAMES.QUICK_DASHBOARD]: 'Dashboard nhanh',
  [ROUTE_NAMES.TEMPLATE_DESIGNER]: 'Thiết kế mẫu',
  [ROUTE_NAMES.ANALYTICS]: 'Phân tích',
  [ROUTE_NAMES.SETTINGS]: 'Cài đặt',
  [ROUTE_NAMES.PROFILE]: 'Hồ sơ cá nhân'
} as const
