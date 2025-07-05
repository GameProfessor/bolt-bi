import type { RouteRecordRaw } from 'vue-router'

const demoRoutes: RouteRecordRaw[] = [
  {
    path: '/demo/strategy-pattern',
    name: 'StrategyPatternDemo',
    component: () => import('@/pages/demo/StrategyPattern.vue'),
    meta: {
      title: 'Strategy Pattern Demo',
      requiresAuth: false
    }
  }
]

export default demoRoutes 