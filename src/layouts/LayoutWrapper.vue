<template>
  <component :is="currentLayout">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from './DefaultLayout.vue'
import AuthLayout from './AuthLayout.vue'
import ErrorLayout from './ErrorLayout.vue'

const route = useRoute()

// Mapping layout names to components
const layouts = {
  default: DefaultLayout,
  auth: AuthLayout,
  error: ErrorLayout
}

// Get layout from route meta or default to 'default'
const currentLayout = computed(() => {
  const layoutName = route.meta?.layout as keyof typeof layouts || 'default'
  return layouts[layoutName] || layouts.default
})
</script>
