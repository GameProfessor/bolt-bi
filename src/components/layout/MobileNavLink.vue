<template>
  <router-link
    :to="to"
    class="flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200"
    :class="linkClasses"
    @click="$emit('click')"
  >
    <component :is="icon" v-if="icon" class="w-5 h-5 mr-3" />
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

defineEmits<{
  click: []
}>()

const linkClasses = computed(() => {
  return props.active
    ? 'bg-primary-50 border-primary-500 text-primary-700'
    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
})
</script>
