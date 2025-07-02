export interface AccessLog {
  id: string
  userId: string
  username: string
  userRole: string
  action: AccessLogAction
  resource?: string
  resourceId?: string
  ipAddress: string
  userAgent: string
  timestamp: Date
  duration?: number // in milliseconds
  status: 'success' | 'failed' | 'warning'
  details?: Record<string, any>
  sessionId: string
}

export type AccessLogAction = 
  | 'login'
  | 'logout'
  | 'view_dashboard'
  | 'edit_dashboard'
  | 'create_dashboard'
  | 'delete_dashboard'
  | 'view_data_source'
  | 'upload_data_source'
  | 'delete_data_source'
  | 'create_chart'
  | 'edit_chart'
  | 'delete_chart'
  | 'export_data'
  | 'share_dashboard'
  | 'access_admin'
  | 'manage_users'
  | 'view_logs'
  | 'change_settings'
  | 'api_call'
  | 'error'

export interface AccessLogFilter {
  userId?: string
  action?: AccessLogAction
  status?: 'success' | 'failed' | 'warning'
  dateFrom?: Date
  dateTo?: Date
  ipAddress?: string
  resource?: string
}

export interface AccessLogStats {
  totalLogs: number
  uniqueUsers: number
  successRate: number
  mostActiveUser: string
  mostCommonAction: AccessLogAction
  peakHour: number
}