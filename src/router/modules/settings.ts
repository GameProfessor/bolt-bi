import type { RouteRecordRaw } from 'vue-router'

// Settings Pages
import Settings from '@/pages/settings/Settings.vue'

const settingsRoutes: RouteRecordRaw[] = [
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      title: 'Settings',
      description: 'Application settings and preferences',
      module: 'settings',
      icon: 'CogIcon'
    }
  },
  // TODO: Tạo các pages này sau
  // {
  //   path: '/profile',
  //   name: 'Profile',
  //   component: () => import('@/pages/settings/Profile.vue'),
  //   meta: {
  //     title: 'Profile',
  //     description: 'User profile and account settings',
  //     module: 'settings',
  //     icon: 'UserIcon'
  //   }
  // },
  // {
  //   path: '/preferences',
  //   name: 'Preferences',
  //   component: () => import('@/pages/settings/Preferences.vue'),
  //   meta: {
  //     title: 'Preferences',
  //     description: 'Application preferences and customization',
  //     module: 'settings',
  //     hidden: true
  //   }
  // }
]

export default settingsRoutes
