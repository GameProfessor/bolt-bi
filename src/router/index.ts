import { createRouter, createWebHistory } from 'vue-router'
import { allRoutes } from './modules'
import { setupRouterGuards } from './guards'

// Export router utilities and modules for use in components
export * from './modules'
export * from './utils'
export * from './guards'

export const router = createRouter({
  history: createWebHistory(),
  routes: allRoutes,
  scrollBehavior(to, _from, savedPosition) {
    // Nếu có saved position (back/forward), sử dụng nó
    if (savedPosition) {
      return savedPosition
    }
    // Nếu có hash, scroll đến element đó
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }
    // Mặc định scroll lên top
    return { top: 0 }
  }
})

// Setup router guards
setupRouterGuards(router)