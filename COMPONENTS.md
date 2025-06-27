# BI Dashboard - Components Documentation

## 📋 Tổng quan Components

BI Dashboard sử dụng kiến trúc component-based với Vue 3 Composition API, được tổ chức theo tính năng và mức độ tái sử dụng.

## 🏗️ Cấu trúc Components

### 1. **Layout Components** (`src/layouts/`)

#### `LayoutWrapper.vue`
**Mục đích**: Component wrapper quản lý việc chọn layout dựa trên route meta
```vue
<template>
  <component :is="currentLayout">
    <slot />
  </component>
</template>
```
**Props**: Không có
**Features**:
- Tự động chọn layout dựa trên `route.meta.layout`
- Hỗ trợ 3 loại layout: `default`, `auth`, `error`
- Fallback về `default` layout nếu không xác định

#### `AuthLayout.vue`
**Mục đích**: Layout đặc biệt cho trang authentication
**Features**:
- Header đơn giản với logo và language selector
- Background gradient với pattern
- Footer với thông tin công ty và links
- Loading overlay
- Responsive design

#### `DefaultLayout.vue`
**Mục đích**: Layout chính của ứng dụng
**Features**:
- AppHeader với navigation
- Main content area
- AppFooter (optional)
- NotificationContainer
- Responsive sidebar (future)

#### `ErrorLayout.vue`
**Mục đích**: Layout đơn giản cho error pages
**Features**:
- Minimal header với logo
- Centered content area
- Simple footer
- "Go home" button

### 2. **Layout Support Components** (`src/components/layout/`)

#### `AppHeader.vue`
**Mục đích**: Header navigation chính
**Features**:
- Logo và brand name
- Desktop navigation menu
- Mobile hamburger menu
- User menu và notifications
- Search functionality
- Layout test buttons (development)

**Props**:
```typescript
interface Props {
  showSearch?: boolean
  showNotifications?: boolean
}
```

#### `AppFooter.vue`
**Mục đích**: Footer của ứng dụng
**Features**:
- Company information
- Quick links
- Social media links
- Copyright notice

#### `NavLink.vue`
**Mục đích**: Navigation link component
**Props**:
```typescript
interface Props {
  to: string
  icon?: Component
  active?: boolean
}
```

#### `MobileNavLink.vue`
**Mục đích**: Mobile navigation link
**Features**:
- Touch-friendly design
- Icon support
- Active state styling

### 3. **Chart Components** (`src/components/charts/`)

#### `ChartPanel.vue`
**Mục đích**: Container cho chart với controls
**Features**:
- Chart type selector
- Data source selector
- Configuration panel
- Export functionality

**Props**:
```typescript
interface Props {
  chartId?: string
  editable?: boolean
  showControls?: boolean
}
```

#### `ChartPreview.vue`
**Mục đích**: Preview chart với sample data
**Features**:
- Multiple chart types (Line, Bar, Pie)
- Sample data generation
- Responsive design
- Loading states
- Error handling

**Props**:
```typescript
interface Props {
  type: 'line' | 'bar' | 'pie' | 'doughnut'
  data?: ChartData
  options?: ChartOptions
  height?: number
}
```

#### `KPICard.vue`
**Mục đích**: KPI metric display card
**Features**:
- Metric value với formatting
- Trend indicators (up/down/neutral)
- Color coding
- Icon support
- Comparison với previous period

**Props**:
```typescript
interface Props {
  title: string
  value: number | string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: number
  icon?: Component
  color?: 'primary' | 'success' | 'warning' | 'danger'
}
```

### 4. **Dashboard Components** (`src/components/dashboard/`)

#### `DashboardChart.vue`
**Mục đích**: Chart component trong dashboard
**Features**:
- Drag & drop support
- Resize functionality
- Chart configuration
- Real-time data updates

**Props**:
```typescript
interface Props {
  chartConfig: ChartConfig
  position: { x: number, y: number }
  size: { width: number, height: number }
  editable?: boolean
}
```

### 5. **Data Components** (`src/components/data/`)

#### `DataPanel.vue`
**Mục đích**: Data source management panel
**Features**:
- Data source list
- Connection testing
- Data preview
- Schema exploration

**Props**:
```typescript
interface Props {
  dataSourceId?: string
  showPreview?: boolean
  maxRows?: number
}
```

### 6. **Common Components** (`src/components/common/`)

#### `NotificationBell.vue`
**Mục đích**: Notification icon với badge
**Features**:
- Unread count badge
- Dropdown notification list
- Mark as read functionality
- Real-time updates

**Props**:
```typescript
interface Props {
  showBadge?: boolean
  maxNotifications?: number
}
```

#### `NotificationContainer.vue`
**Mục đích**: Toast notification container
**Features**:
- Multiple notification types
- Auto-dismiss
- Manual dismiss
- Position configuration
- Animation effects

#### `SearchInput.vue`
**Mục đích**: Search input với suggestions
**Features**:
- Debounced input
- Autocomplete suggestions
- Search history
- Keyboard navigation

**Props**:
```typescript
interface Props {
  placeholder?: string
  suggestions?: string[]
  debounceMs?: number
  showHistory?: boolean
}
```

#### `UserMenu.vue`
**Mục đích**: User dropdown menu
**Features**:
- User avatar
- Profile information
- Settings link
- Logout functionality

### 7. **UI Components** (`src/components/ui/`)

#### `Toast.vue`
**Mục đích**: Individual toast notification
**Features**:
- Multiple types (success, error, warning, info)
- Auto-dismiss timer
- Progress bar
- Close button
- Icon support

**Props**:
```typescript
interface Props {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  showProgress?: boolean
  closable?: boolean
}
```

### 8. **Demo Components** (`src/components/demo/`)

#### `HelloWorld.vue`
**Mục đích**: Demo component từ Vue template
**Features**:
- Counter example
- Reactive data
- Event handling

## 🎨 Component Design Patterns

### 1. **Composition API Pattern**
```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Props
interface Props {
  title: string
  count?: number
}
const props = withDefaults(defineProps<Props>(), {
  count: 0
})

// Emits
interface Emits {
  update: [value: number]
  close: []
}
const emit = defineEmits<Emits>()

// State
const isVisible = ref(true)
const currentCount = ref(props.count)

// Computed
const displayTitle = computed(() => 
  `${props.title} (${currentCount.value})`
)

// Methods
const increment = () => {
  currentCount.value++
  emit('update', currentCount.value)
}

// Lifecycle
onMounted(() => {
  console.log('Component mounted')
})
</script>
```

### 2. **Props Validation Pattern**
```typescript
interface Props {
  // Required props
  id: string
  title: string
  
  // Optional props với default values
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  
  // Complex props
  data?: ChartData
  options?: ChartOptions
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'primary',
  disabled: false
})
```

### 3. **Event Handling Pattern**
```typescript
// Define emits với TypeScript
interface Emits {
  // Event với payload
  'update:modelValue': [value: string]
  'change': [event: Event]
  
  // Event không payload
  'close': []
  'submit': []
}

const emit = defineEmits<Emits>()

// Emit events
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
  emit('change', event)
}
```

### 4. **Store Integration Pattern**
```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/stores'

const dashboardStore = useDashboardStore()

// Reactive refs từ store
const { dashboards, isLoading } = storeToRefs(dashboardStore)

// Actions từ store
const { fetchDashboards, createDashboard } = dashboardStore

// Sử dụng trong component
onMounted(() => {
  fetchDashboards()
})
</script>
```

## 🔧 Component Best Practices

### 1. **Naming Conventions**
- **PascalCase** cho component names
- **kebab-case** cho file names
- **camelCase** cho props và methods
- **SCREAMING_SNAKE_CASE** cho constants

### 2. **Props Design**
- Luôn define TypeScript interfaces cho props
- Sử dụng `withDefaults` cho default values
- Validate props khi cần thiết
- Tránh mutate props trực tiếp

### 3. **Event Handling**
- Define emits với TypeScript
- Sử dụng descriptive event names
- Pass relevant data trong event payload
- Handle errors trong event handlers

### 4. **Performance Optimization**
- Sử dụng `computed` cho derived data
- Implement `v-memo` cho expensive renders
- Lazy load large components
- Debounce user inputs

### 5. **Accessibility**
- Sử dụng semantic HTML
- Add ARIA attributes khi cần
- Ensure keyboard navigation
- Provide alt text cho images

### 6. **Testing**
- Write unit tests cho complex logic
- Test user interactions
- Mock external dependencies
- Test error states

---

**Components được thiết kế để tái sử dụng, dễ bảo trì và có performance cao.**
