<template>
  <div class="quick-dashboard">
    <div class="dashboard-header">
      <h1 class="dashboard-title">Quick Dashboard</h1>
      <p class="dashboard-subtitle">Get insights at a glance</p>
    </div>
    
    <div class="dashboard-content">
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-value">1,234</div>
          <div class="metric-label">Total Users</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-value">$12,345</div>
          <div class="metric-label">Revenue</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-value">89%</div>
          <div class="metric-label">Conversion Rate</div>
        </div>
        
        <div class="metric-card">
          <div class="metric-value">456</div>
          <div class="metric-label">Active Sessions</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Reactive data
const isLoading = ref(false)

// Lifecycle
onMounted(() => {
  // Initialize dashboard data
  console.log('Quick Dashboard mounted')
})
</script>

<style scoped>
.quick-dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 2rem;
  text-align: center;
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.dashboard-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
}

.dashboard-content {
  width: 100%;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.metric-card {
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.metric-value {
  font-size: 2.25rem;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.metric-label {
  font-size: 0.875rem;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@media (max-width: 768px) {
  .quick-dashboard {
    padding: 1rem;
  }
  
  .dashboard-title {
    font-size: 2rem;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .metric-card {
    padding: 1.5rem;
  }
  
  .metric-value {
    font-size: 1.875rem;
  }
}
</style>