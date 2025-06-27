import type { RouteRecordRaw } from 'vue-router'

// Chart Pages
import ChartList from '@/pages/charts/ChartList.vue'
import ChartCreate from '@/pages/charts/ChartCreate.vue'

const chartRoutes: RouteRecordRaw[] = [
  {
    path: '/charts',
    name: 'ChartList',
    component: ChartList,
    meta: {
      title: 'Charts',
      description: 'Manage your charts',
      module: 'charts',
      icon: 'PresentationChartLineIcon'
    }
  },
  {
    path: '/charts/create',
    name: 'ChartCreate',
    component: ChartCreate,
    meta: {
      title: 'Create Chart',
      description: 'Create a new chart',
      module: 'charts',
      icon: 'PlusIcon',
      breadcrumb: [
        { name: 'Charts', to: '/charts' },
        { name: 'Create Chart', to: '/charts/create' }
      ]
    }
  },
  // TODO: Tạo các pages này sau
  // {
  //   path: '/charts/:id',
  //   name: 'ChartDetail',
  //   component: () => import('@/pages/charts/ChartDetail.vue'),
  //   meta: {
  //     title: 'Chart Details',
  //     description: 'View chart details',
  //     module: 'charts',
  //     hidden: true,
  //     breadcrumb: [
  //       { name: 'Charts', to: '/charts' },
  //       { name: 'Chart Details', to: '' }
  //     ]
  //   }
  // },
  // {
  //   path: '/charts/:id/edit',
  //   name: 'ChartEdit',
  //   component: () => import('@/pages/charts/ChartEdit.vue'),
  //   meta: {
  //     title: 'Edit Chart',
  //     description: 'Edit chart configuration',
  //     module: 'charts',
  //     hidden: true,
  //     breadcrumb: [
  //       { name: 'Charts', to: '/charts' },
  //       { name: 'Edit Chart', to: '' }
  //     ]
  //   }
  // }
]

export default chartRoutes
