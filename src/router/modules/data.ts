import type { RouteRecordRaw } from 'vue-router'

// Data Pages
import DataSources from '@/pages/data/DataSources.vue'

const dataRoutes: RouteRecordRaw[] = [
  {
    path: '/data-sources',
    name: 'DataSources',
    component: DataSources,
    meta: {
      title: 'Data Sources',
      description: 'Manage your data sources',
      module: 'data',
      icon: 'TableCellsIcon'
    }
  },
  // TODO: Tạo các pages này sau
  // {
  //   path: '/data-sources/create',
  //   name: 'DataSourceCreate',
  //   component: () => import('@/pages/data/DataSourceCreate.vue'),
  //   meta: {
  //     title: 'Upload Data Source',
  //     description: 'Upload a new CSV data source',
  //     module: 'data',
  //     hidden: true,
  //     breadcrumb: [
  //       { name: 'Data Sources', to: '/data-sources' },
  //       { name: 'Upload Data Source', to: '/data-sources/create' }
  //     ]
  //   }
  // },
  // {
  //   path: '/data-sources/:id',
  //   name: 'DataSourceDetail',
  //   component: () => import('@/pages/data/DataSourceDetail.vue'),
  //   meta: {
  //     title: 'Data Source Details',
  //     description: 'View data source details and preview data',
  //     module: 'data',
  //     hidden: true,
  //     breadcrumb: [
  //       { name: 'Data Sources', to: '/data-sources' },
  //       { name: 'Data Source Details', to: '' }
  //     ]
  //   }
  // },
  // {
  //   path: '/data-sources/:id/edit',
  //   name: 'DataSourceEdit',
  //   component: () => import('@/pages/data/DataSourceEdit.vue'),
  //   meta: {
  //     title: 'Edit Data Source',
  //     description: 'Edit data source configuration',
  //     module: 'data',
  //     hidden: true,
  //     breadcrumb: [
  //       { name: 'Data Sources', to: '/data-sources' },
  //       { name: 'Edit Data Source', to: '' }
  //     ]
  //   }
  // }
]

export default dataRoutes
