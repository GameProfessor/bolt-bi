<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Header Navigation -->
    <AppHeader />

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer (optional) -->
    <AppFooter v-if="showFooter" />

    <!-- Global Notifications -->
    <NotificationContainer />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import NotificationContainer from '@/components/common/NotificationContainer.vue'

interface Props {
  showFooter?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showFooter: false,
  fullWidth: false
})

const route = useRoute()

// Có thể ẩn footer trên một số trang
const showFooter = computed(() => {
  const hideFooterRoutes = ['QuickDashboard', 'TemplateDesigner']
  return props.showFooter && !hideFooterRoutes.includes(route.name as string)
})
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}
</style>
