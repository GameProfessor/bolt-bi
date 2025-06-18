import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import DataSources from '../views/DataSources.vue'
import Charts from '../views/Charts.vue'
import Dashboards from '../views/Dashboards.vue'
import DashboardEditor from '../views/DashboardEditor.vue'
import QuickDashboard from '../views/QuickDashboard.vue'
import DashboardStore from '../views/DashboardStore.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/data-sources',
    name: 'DataSources',
    component: DataSources
  },
  {
    path: '/charts',
    name: 'Charts',
    component: Charts
  },
  {
    path: '/dashboards',
    name: 'Dashboards',
    component: Dashboards
  },
  {
    path: '/dashboard-store',
    name: 'DashboardStore',
    component: DashboardStore
  },
  {
    path: '/dashboard/:id',
    name: 'DashboardEditor',
    component: DashboardEditor,
    props: true
  },
  {
    path: '/quick-dashboard',
    name: 'QuickDashboard',
    component: QuickDashboard
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})