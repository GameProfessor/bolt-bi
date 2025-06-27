# BI Dashboard - Architecture Documentation

## 🏗️ Tổng quan kiến trúc

BI Dashboard được thiết kế theo kiến trúc **Component-based Architecture** với **Modular Design Pattern**, đảm bảo tính mở rộng, bảo trì và tái sử dụng cao.

## 📐 Nguyên tắc thiết kế

### 1. **Separation of Concerns**
- **Presentation Layer**: Vue Components (UI/UX)
- **Business Logic Layer**: Pinia Stores (State Management)
- **Data Access Layer**: Services (API Integration)
- **Routing Layer**: Vue Router (Navigation Control)

### 2. **Modular Architecture**
- **Feature Modules**: Mỗi tính năng được tổ chức thành module riêng
- **Shared Modules**: Components và utilities dùng chung
- **Core Modules**: Cấu hình và setup cơ bản

### 3. **Dependency Injection**
- **Service Injection**: Services được inject vào components
- **Store Injection**: Stores được inject thông qua Pinia
- **Router Injection**: Router được inject để navigation

## 🔄 Data Flow Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Components    │◄──►│     Stores      │◄──►│    Services     │
│   (Vue SFC)     │    │   (Pinia)       │    │   (API Layer)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                       ▲                       ▲
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Router      │    │     Guards      │    │   HTTP Client   │
│  (Navigation)   │    │ (Authorization) │    │    (Axios)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Component Architecture

### 1. **Layout Components**
```
LayoutWrapper (Root)
├── AuthLayout (Authentication pages)
├── DefaultLayout (Main application)
└── ErrorLayout (Error pages)
```

### 2. **Feature Components**
```
src/components/
├── charts/          # Chart-related components
│   ├── ChartPanel.vue
│   ├── ChartPreview.vue
│   └── KPICard.vue
├── dashboard/       # Dashboard components
│   └── DashboardChart.vue
├── data/           # Data management components
│   └── DataPanel.vue
└── common/         # Shared components
    ├── NotificationBell.vue
    ├── NotificationContainer.vue
    ├── SearchInput.vue
    └── UserMenu.vue
```

### 3. **UI Components**
```
src/components/ui/
├── Toast.vue       # Toast notifications
├── Modal.vue       # Modal dialogs
├── Button.vue      # Reusable buttons
└── Input.vue       # Form inputs
```

## 🗂️ Store Architecture

### 1. **Modular Store Pattern**
```typescript
// src/stores/index.ts
export { useAppStore } from './modules/app'
export { useDashboardStore } from './modules/dashboard'
export { useChartStore } from './modules/chart'
export { useDataSourceStore } from './modules/dataSource'

// Export types
export type * from './modules/app'
export type * from './modules/dashboard'
export type * from './modules/chart'
export type * from './modules/dataSource'
```

### 2. **Store Structure**
```typescript
// Example: Dashboard Store
export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const dashboards = ref<Dashboard[]>([])
  const currentDashboard = ref<Dashboard | null>(null)
  const isLoading = ref(false)

  // Getters
  const activeDashboards = computed(() => 
    dashboards.value.filter(d => d.isActive)
  )

  // Actions
  const fetchDashboards = async () => {
    isLoading.value = true
    try {
      const data = await dashboardService.getAll()
      dashboards.value = data
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    dashboards,
    currentDashboard,
    isLoading,
    // Getters
    activeDashboards,
    // Actions
    fetchDashboards
  }
})
```

## 🛣️ Router Architecture

### 1. **Modular Routes**
```
src/router/
├── modules/
│   ├── dashboard.ts    # Dashboard routes
│   ├── chart.ts        # Chart routes
│   ├── data.ts         # Data routes
│   ├── design.ts       # Design routes
│   └── error.ts        # Error routes
├── guards.ts           # Navigation guards
└── index.ts           # Main router configuration
```

### 2. **Route Meta Properties**
```typescript
interface RouteMeta {
  title?: string           // Page title
  description?: string     // Page description
  layout?: 'default' | 'auth' | 'error'  // Layout type
  requiresAuth?: boolean   // Authentication required
  requiresPermission?: string  // Permission required
  showInNavigation?: boolean   // Show in navigation menu
  module?: string         // Feature module
  hidden?: boolean        // Hide from navigation
}
```

### 3. **Guard Chain**
```typescript
// Sequential execution of guards
router.beforeEach(authGuard)           // 1. Check authentication
router.beforeEach(permissionGuard)     // 2. Check permissions
router.beforeEach(titleGuard)          // 3. Set page title
router.beforeEach(loadingGuard)        // 4. Manage loading state
router.beforeEach(dataValidationGuard) // 5. Validate route data
router.beforeEach(navigationHistoryGuard) // 6. Track navigation
router.beforeEach(errorHandlerGuard)   // 7. Handle errors
router.beforeEach(developmentGuard)    // 8. Development restrictions
```

## 🔌 Service Architecture

### 1. **API Service Layer**
```
src/services/
├── api/
│   ├── client.ts       # Axios configuration
│   ├── interceptors.ts # Request/Response interceptors
│   └── types.ts        # API types
├── auth/
│   ├── authService.ts  # Authentication service
│   └── tokenService.ts # Token management
├── dashboard/
│   └── dashboardService.ts
├── chart/
│   └── chartService.ts
└── data/
    └── dataService.ts
```

### 2. **Service Pattern**
```typescript
// Example: Dashboard Service
class DashboardService {
  private client = apiClient

  async getAll(): Promise<Dashboard[]> {
    const response = await this.client.get('/dashboards')
    return response.data
  }

  async getById(id: string): Promise<Dashboard> {
    const response = await this.client.get(`/dashboards/${id}`)
    return response.data
  }

  async create(dashboard: CreateDashboardRequest): Promise<Dashboard> {
    const response = await this.client.post('/dashboards', dashboard)
    return response.data
  }

  async update(id: string, dashboard: UpdateDashboardRequest): Promise<Dashboard> {
    const response = await this.client.put(`/dashboards/${id}`, dashboard)
    return response.data
  }

  async delete(id: string): Promise<void> {
    await this.client.delete(`/dashboards/${id}`)
  }
}

export const dashboardService = new DashboardService()
```

## 🎨 Styling Architecture

### 1. **TailwindCSS Configuration**
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    }
  }
}
```

### 2. **Component Styling Strategy**
- **Utility Classes**: Sử dụng TailwindCSS utilities
- **Component Classes**: Custom classes cho complex components
- **CSS Variables**: Cho theme customization
- **Scoped Styles**: Vue scoped styles khi cần thiết

## 🔒 Security Architecture

### 1. **Authentication Flow**
```
User Login → JWT Token → Store in Memory → API Requests → Token Refresh
```

### 2. **Authorization Levels**
- **Route Level**: Router guards kiểm tra permissions
- **Component Level**: v-if directives dựa trên permissions
- **API Level**: Backend validation

### 3. **Security Measures**
- **XSS Protection**: Content sanitization
- **CSRF Protection**: Token-based protection
- **Input Validation**: Client và server-side validation
- **Secure Storage**: Sensitive data không lưu trong localStorage

## 📊 Performance Architecture

### 1. **Code Splitting**
- **Route-based**: Lazy loading cho routes
- **Component-based**: Dynamic imports cho large components
- **Vendor Splitting**: Separate vendor bundles

### 2. **Caching Strategy**
- **HTTP Caching**: Browser caching cho static assets
- **API Caching**: Response caching với appropriate headers
- **State Caching**: Pinia state persistence

### 3. **Optimization Techniques**
- **Tree Shaking**: Unused code elimination
- **Bundle Analysis**: Webpack bundle analyzer
- **Image Optimization**: Lazy loading và compression
- **Virtual Scrolling**: Cho large datasets

## 🧪 Testing Architecture

### 1. **Testing Pyramid**
```
E2E Tests (Cypress)
├── Integration Tests (Vue Test Utils)
└── Unit Tests (Vitest)
```

### 2. **Testing Strategy**
- **Components**: Render testing, user interactions
- **Stores**: State mutations, actions
- **Services**: API calls, error handling
- **Utils**: Pure functions, helpers

## 🚀 Build & Deployment Architecture

### 1. **Build Process**
```
Source Code → TypeScript Compilation → Vite Bundling → Static Assets
```

### 2. **Environment Configuration**
- **Development**: Hot reload, source maps, debug tools
- **Staging**: Production-like với debug info
- **Production**: Optimized, minified, compressed

### 3. **Deployment Options**
- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **CDN**: CloudFront, CloudFlare
- **Container**: Docker với Nginx
- **Server**: Node.js với Express

---

**Architecture được thiết kế để đảm bảo scalability, maintainability và performance cao cho BI Dashboard platform.**
