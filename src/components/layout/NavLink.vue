<template>
  <router-link
    :to="to"
    class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
    :class="linkClasses"
  >
    <component :is="icon" v-if="icon" class="w-4 h-4 mr-2" />
    <slot />
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'

interface Props {
  to: string
  active?: boolean
  icon?: Component
}

const props = withDefaults(defineProps<Props>(), {
  active: false
})

const linkClasses = computed(() => {
  return props.active
    ? 'border-primary-500 text-primary-600'
    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
})
</script>
