# BI Dashboard - API Integration Documentation

## 🌐 API Architecture Overview

BI Dashboard sử dụng **Axios-based HTTP client** với **Service Layer Pattern** để quản lý tất cả API communications. Hệ thống được thiết kế để dễ dàng integrate với các backend APIs khác nhau.

## 🔧 HTTP Client Configuration

### Base Configuration (`src/services/api/client.ts`)
```typescript
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// Create axios instance với base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add request ID for tracking
    config.headers['X-Request-ID'] = generateRequestId()
    
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      await handleTokenRefresh()
      return apiClient.request(error.config)
    }
    
    // Handle network errors
    if (!error.response) {
      throw new NetworkError('Network connection failed')
    }
    
    return Promise.reject(error)
  }
)
```

## 🏗️ Service Layer Architecture

### 1. **Base Service Class**
```typescript
// src/services/api/BaseService.ts
export abstract class BaseService {
  protected client = apiClient
  protected baseEndpoint: string

  constructor(baseEndpoint: string) {
    this.baseEndpoint = baseEndpoint
  }

  protected async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get(`${this.baseEndpoint}${endpoint}`, config)
    return response.data
  }

  protected async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post(`${this.baseEndpoint}${endpoint}`, data, config)
    return response.data
  }

  protected async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put(`${this.baseEndpoint}${endpoint}`, data, config)
    return response.data
  }

  protected async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete(`${this.baseEndpoint}${endpoint}`, config)
    return response.data
  }
}
```

### 2. **Dashboard Service** (`src/services/dashboard/dashboardService.ts`)
```typescript
import { BaseService } from '../api/BaseService'
import type { Dashboard, CreateDashboardRequest, UpdateDashboardRequest } from '@/types'

class DashboardService extends BaseService {
  constructor() {
    super('/dashboards')
  }

  // Get all dashboards
  async getAll(params?: {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }): Promise<{
    data: Dashboard[]
    total: number
    page: number
    limit: number
  }> {
    return this.get('', { params })
  }

  // Get dashboard by ID
  async getById(id: string): Promise<Dashboard> {
    return this.get(`/${id}`)
  }

  // Create new dashboard
  async create(dashboard: CreateDashboardRequest): Promise<Dashboard> {
    return this.post('', dashboard)
  }

  // Update dashboard
  async update(id: string, dashboard: UpdateDashboardRequest): Promise<Dashboard> {
    return this.put(`/${id}`, dashboard)
  }

  // Delete dashboard
  async delete(id: string): Promise<void> {
    return this.delete(`/${id}`)
  }

  // Duplicate dashboard
  async duplicate(id: string, name?: string): Promise<Dashboard> {
    return this.post(`/${id}/duplicate`, { name })
  }

  // Share dashboard
  async share(id: string, shareConfig: {
    isPublic: boolean
    allowedUsers?: string[]
    expiresAt?: Date
  }): Promise<{ shareUrl: string }> {
    return this.post(`/${id}/share`, shareConfig)
  }
}

export const dashboardService = new DashboardService()
```

### 3. **Chart Service** (`src/services/chart/chartService.ts`)
```typescript
class ChartService extends BaseService {
  constructor() {
    super('/charts')
  }

  // Get charts for dashboard
  async getByDashboard(dashboardId: string): Promise<Chart[]> {
    return this.get(`?dashboardId=${dashboardId}`)
  }

  // Create chart
  async create(chart: CreateChartRequest): Promise<Chart> {
    return this.post('', chart)
  }

  // Update chart
  async update(id: string, chart: UpdateChartRequest): Promise<Chart> {
    return this.put(`/${id}`, chart)
  }

  // Get chart data
  async getData(id: string, params?: {
    startDate?: string
    endDate?: string
    filters?: Record<string, any>
  }): Promise<ChartData> {
    return this.get(`/${id}/data`, { params })
  }

  // Export chart
  async export(id: string, format: 'png' | 'pdf' | 'csv'): Promise<Blob> {
    const response = await this.client.get(`${this.baseEndpoint}/${id}/export`, {
      params: { format },
      responseType: 'blob'
    })
    return response.data
  }
}

export const chartService = new ChartService()
```

### 4. **Data Source Service** (`src/services/data/dataSourceService.ts`)
```typescript
class DataSourceService extends BaseService {
  constructor() {
    super('/data-sources')
  }

  // Test connection
  async testConnection(config: DataSourceConfig): Promise<{
    success: boolean
    message: string
    latency?: number
  }> {
    return this.post('/test-connection', config)
  }

  // Get schema
  async getSchema(id: string): Promise<{
    tables: Array<{
      name: string
      columns: Array<{
        name: string
        type: string
        nullable: boolean
      }>
    }>
  }> {
    return this.get(`/${id}/schema`)
  }

  // Execute query
  async executeQuery(id: string, query: {
    sql: string
    limit?: number
    offset?: number
  }): Promise<{
    data: any[]
    columns: string[]
    total: number
    executionTime: number
  }> {
    return this.post(`/${id}/query`, query)
  }

  // Get sample data
  async getSampleData(id: string, tableName: string, limit = 100): Promise<{
    data: any[]
    columns: string[]
  }> {
    return this.get(`/${id}/sample/${tableName}`, {
      params: { limit }
    })
  }
}

export const dataSourceService = new DataSourceService()
```

### 5. **Authentication Service** (`src/services/auth/authService.ts`)
```typescript
class AuthService extends BaseService {
  constructor() {
    super('/auth')
  }

  // Login
  async login(credentials: {
    email: string
    password: string
    rememberMe?: boolean
  }): Promise<{
    user: User
    accessToken: string
    refreshToken: string
    expiresIn: number
  }> {
    return this.post('/login', credentials)
  }

  // Register
  async register(userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    company?: string
  }): Promise<{
    user: User
    accessToken: string
    refreshToken: string
  }> {
    return this.post('/register', userData)
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<{
    accessToken: string
    refreshToken: string
    expiresIn: number
  }> {
    return this.post('/refresh', { refreshToken })
  }

  // Logout
  async logout(): Promise<void> {
    return this.post('/logout')
  }

  // Get current user
  async getCurrentUser(): Promise<User> {
    return this.get('/me')
  }

  // Update profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    return this.put('/profile', userData)
  }

  // Change password
  async changePassword(passwords: {
    currentPassword: string
    newPassword: string
  }): Promise<void> {
    return this.put('/change-password', passwords)
  }

  // Forgot password
  async forgotPassword(email: string): Promise<{
    message: string
  }> {
    return this.post('/forgot-password', { email })
  }

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<{
    message: string
  }> {
    return this.post('/reset-password', { token, newPassword })
  }
}

export const authService = new AuthService()
```

## 🔒 Authentication & Token Management

### Token Service (`src/services/auth/tokenService.ts`)
```typescript
class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'access_token'
  private readonly REFRESH_TOKEN_KEY = 'refresh_token'
  private readonly TOKEN_EXPIRY_KEY = 'token_expiry'

  // Get access token
  getAccessToken(): string | null {
    return sessionStorage.getItem(this.ACCESS_TOKEN_KEY)
  }

  // Set tokens
  setTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    const expiryTime = Date.now() + (expiresIn * 1000)
    
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
    sessionStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString())
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    const expiryTime = sessionStorage.getItem(this.TOKEN_EXPIRY_KEY)
    if (!expiryTime) return true
    
    return Date.now() > parseInt(expiryTime)
  }

  // Clear tokens
  clearTokens(): void {
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
    sessionStorage.removeItem(this.TOKEN_EXPIRY_KEY)
  }

  // Auto refresh token
  async refreshTokenIfNeeded(): Promise<boolean> {
    if (!this.isTokenExpired()) return true

    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY)
    if (!refreshToken) return false

    try {
      const response = await authService.refreshToken(refreshToken)
      this.setTokens(
        response.accessToken,
        response.refreshToken,
        response.expiresIn
      )
      return true
    } catch (error) {
      this.clearTokens()
      return false
    }
  }
}

export const tokenService = new TokenService()
```

## 🚨 Error Handling

### API Error Types
```typescript
// src/services/api/errors.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NetworkError'
  }
}

export class ValidationError extends Error {
  constructor(
    message: string,
    public errors: Record<string, string[]>
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}
```

### Global Error Handler
```typescript
// src/services/api/errorHandler.ts
export const handleApiError = (error: any): never => {
  if (error.response) {
    const { status, data } = error.response
    
    switch (status) {
      case 400:
        throw new ValidationError(data.message, data.errors)
      case 401:
        throw new ApiError('Unauthorized', 401, 'UNAUTHORIZED')
      case 403:
        throw new ApiError('Forbidden', 403, 'FORBIDDEN')
      case 404:
        throw new ApiError('Not Found', 404, 'NOT_FOUND')
      case 422:
        throw new ValidationError(data.message, data.errors)
      case 500:
        throw new ApiError('Internal Server Error', 500, 'INTERNAL_ERROR')
      default:
        throw new ApiError(data.message || 'Unknown error', status)
    }
  }
  
  if (error.request) {
    throw new NetworkError('Network connection failed')
  }
  
  throw error
}
```

## 📊 API Response Types

### Common Response Interfaces
```typescript
// src/types/api.ts
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ErrorResponse {
  message: string
  code?: string
  errors?: Record<string, string[]>
  details?: any
}
```

## 🔧 Environment Configuration

### API Configuration
```typescript
// .env files
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
VITE_ENABLE_API_LOGGING=true
VITE_ENABLE_MOCK_API=false
```

---

**API layer được thiết kế để dễ dàng integrate với các backend systems khác nhau và provide consistent interface cho frontend components.**
