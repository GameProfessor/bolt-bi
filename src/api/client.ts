/**
 * HTTP Client với Axios
 * Cấu hình client HTTP cho các API calls
 */

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig
} from 'axios'

export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
  errors?: string[]
}

export interface ApiError {
  message: string
  status: number
  errors?: string[]
  code?: string
}

/**
 * Base API configuration
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
const API_TIMEOUT = 30000 // 30 seconds

class ApiClient {
  private client: AxiosInstance

  constructor(baseURL: string = API_BASE_URL) {
    this.client = axios.create({
      baseURL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    this.setupInterceptors()
  }

  /**
   * Setup request và response interceptors
   */
  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Thêm auth token nếu có
        const token = localStorage.getItem('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Log request trong development
        if (import.meta.env.DEV) {
          console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, {
            params: config.params,
            data: config.data
          })
        }

        return config
      },
      (error) => {
        console.error('Request Error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log response trong development
        if (import.meta.env.DEV) {
          console.log(`${response.status} ${response.config.url}`, response.data)
        }

        return response
      },
      (error: AxiosError) => {
        // Log error trong development
        if (import.meta.env.DEV) {
          console.error(`${error.response?.status} ${error.config?.url}`, error.response?.data)
        }

        return Promise.reject(this.handleError(error))
      }
    )
  }

  /**
   * Handle axios errors
   */
  private handleError(error: AxiosError): ApiError {
    if (error.code === 'ECONNABORTED') {
      return {
        status: 408,
        message: 'Request timeout',
        errors: ['Yêu cầu đã hết thời gian chờ'],
        code: 'TIMEOUT'
      }
    }

    if (!error.response) {
      return {
        status: 0,
        message: 'Network error',
        errors: ['Không thể kết nối đến server'],
        code: 'NETWORK_ERROR'
      }
    }

    const { status, data } = error.response
    const errorData = data as any // Type assertion để tránh lỗi TypeScript

    return {
      status,
      message: errorData?.message || error.message || 'An error occurred',
      errors: errorData?.errors || [],
      code: errorData?.code || 'UNKNOWN_ERROR'
    }
  }

  /**
   * Transform response to ApiResponse format
   */
  private transformResponse<T>(response: AxiosResponse): ApiResponse<T> {
    return {
      success: true,
      data: response.data,
      message: response.data?.message || 'Success'
    }
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<T>(endpoint, {
        params,
        ...config
      })
      return this.transformResponse<T>(response)
    } catch (error) {
      throw error
    }
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post<T>(endpoint, data, config)
      return this.transformResponse<T>(response)
    } catch (error) {
      throw error
    }
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put<T>(endpoint, data, config)
      return this.transformResponse<T>(response)
    } catch (error) {
      throw error
    }
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.patch<T>(endpoint, data, config)
      return this.transformResponse<T>(response)
    } catch (error) {
      throw error
    }
  }

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete<T>(endpoint, config)
      return this.transformResponse<T>(response)
    } catch (error) {
      throw error
    }
  }

  /**
   * Upload file với progress tracking
   */
  async upload<T>(
    endpoint: string,
    file: File,
    options?: {
      fieldName?: string
      additionalData?: Record<string, any>
      onProgress?: (progress: number) => void
      config?: AxiosRequestConfig
    }
  ): Promise<ApiResponse<T>> {
    const {
      fieldName = 'file',
      additionalData = {},
      onProgress,
      config = {}
    } = options || {}

    const formData = new FormData()
    formData.append(fieldName, file)

    // Add additional data to form
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, String(value))
    })

    try {
      const response = await this.client.post<T>(endpoint, formData, {
        ...config,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...config.headers
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress(progress)
          }
        }
      })
      return this.transformResponse<T>(response)
    } catch (error) {
      throw error
    }
  }

  /**
   * Download file
   */
  async download(
    endpoint: string,
    filename?: string,
    config?: AxiosRequestConfig
  ): Promise<void> {
    try {
      const response = await this.client.get(endpoint, {
        ...config,
        responseType: 'blob'
      })

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename || 'download')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      throw error
    }
  }

  /**
   * Set authorization token
   */
  setAuthToken(token: string) {
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`
    localStorage.setItem('auth_token', token)
  }

  /**
   * Remove authorization token
   */
  removeAuthToken() {
    delete this.client.defaults.headers.common['Authorization']
    localStorage.removeItem('auth_token')
  }

  /**
   * Get raw axios instance for advanced usage
   */
  getAxiosInstance(): AxiosInstance {
    return this.client
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
export default apiClient
