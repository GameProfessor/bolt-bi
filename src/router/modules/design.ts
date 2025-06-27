import type { RouteRecordRaw } from 'vue-router'

// Design Pages
import TemplateDesigner from '@/pages/design/TemplateDesigner.vue'

const designRoutes: RouteRecordRaw[] = [
  {
    path: '/template-designer',
    name: 'TemplateDesigner',
    component: TemplateDesigner,
    meta: {
      title: 'Template Designer',
      description: 'Design dashboard templates',
      module: 'design',
      icon: 'PaintBrushIcon'
    }
  },
  // TODO: Tạo các pages này sau
  // {
  //   path: '/templates',
  //   name: 'TemplateList',
  //   component: () => import('@/pages/design/TemplateList.vue'),
  //   meta: {
  //     title: 'Templates',
  //     description: 'Browse and manage dashboard templates',
  //     module: 'design',
  //     icon: 'RectangleStackIcon'
  //   }
  // },
  // {
  //   path: '/templates/create',
  //   name: 'TemplateCreate',
  //   component: () => import('@/pages/design/TemplateCreate.vue'),
  //   meta: {
  //     title: 'Create Template',
  //     description: 'Create a new dashboard template',
  //     module: 'design',
  //     hidden: true,
  //     breadcrumb: [
  //       { name: 'Templates', to: '/templates' },
  //       { name: 'Create Template', to: '/templates/create' }
  //     ]
  //   }
  // },
  // {
  //   path: '/templates/:id',
  //   name: 'TemplateDetail',
  //   component: () => import('@/pages/design/TemplateDetail.vue'),
  //   meta: {
  //     title: 'Template Details',
  //     description: 'View template details and preview',
  //     module: 'design',
  //     hidden: true,
  //     breadcrumb: [
  //       { name: 'Templates', to: '/templates' },
  //       { name: 'Template Details', to: '' }
  //     ]
  //   }
  // },
  // {
  //   path: '/templates/:id/edit',
  //   name: 'TemplateEdit',
  //   component: () => import('@/pages/design/TemplateEdit.vue'),
  //   meta: {
  //     title: 'Edit Template',
  //     description: 'Edit template configuration',
  //     module: 'design',
  //     hidden: true,
  //     breadcrumb: [
  //       { name: 'Templates', to: '/templates' },
  //       { name: 'Edit Template', to: '' }
  //     ]
  //   }
  // }
]

export default designRoutes
