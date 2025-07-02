import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AccessLog, AccessLogFilter, AccessLogStats, AccessLogAction } from '@/types/accessLog'
import { nanoid } from 'nanoid'

export const useAccessLogStore = defineStore('accessLog', () => {
  const logs = ref<AccessLog[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Generate mock data for demonstration
  const generateMockLogs = () => {
    const users = [
      { id: '1', username: 'admin', role: 'Admin' },
      { id: '2', username: 'john.doe', role: 'Dashboard Designer' },
      { id: '3', username: 'jane.smith', role: 'Dashboard Viewer' },
      { id: '4', username: 'mike.wilson', role: 'Dashboard Designer' },
      { id: '5', username: 'sarah.jones', role: 'Dashboard Viewer' }
    ]

    const actions: AccessLogAction[] = [
      'login', 'logout', 'view_dashboard', 'edit_dashboard', 'create_dashboard',
      'view_data_source', 'upload_data_source', 'create_chart', 'edit_chart',
      'export_data', 'share_dashboard', 'access_admin', 'manage_users', 'view_logs'
    ]

    const resources = [
      'Sales Dashboard', 'Marketing Analytics', 'Financial Report', 'Customer Insights',
      'Product Performance', 'HR Analytics', 'Operations Dashboard'
    ]

    const ipAddresses = [
      '192.168.1.100', '192.168.1.101', '192.168.1.102', '10.0.0.50', '10.0.0.51'
    ]

    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0'
    ]

    const mockLogs: AccessLog[] = []

    // Generate logs for the last 30 days
    for (let i = 0; i < 500; i++) {
      const user = users[Math.floor(Math.random() * users.length)]
      const action = actions[Math.floor(Math.random() * actions.length)]
      const timestamp = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      
      mockLogs.push({
        id: nanoid(),
        userId: user.id,
        username: user.username,
        userRole: user.role,
        action,
        resource: Math.random() > 0.3 ? resources[Math.floor(Math.random() * resources.length)] : undefined,
        resourceId: Math.random() > 0.5 ? nanoid() : undefined,
        ipAddress: ipAddresses[Math.floor(Math.random() * ipAddresses.length)],
        userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
        timestamp,
        duration: Math.random() > 0.7 ? Math.floor(Math.random() * 5000) + 100 : undefined,
        status: Math.random() > 0.1 ? 'success' : Math.random() > 0.5 ? 'failed' : 'warning',
        sessionId: nanoid(),
        details: action === 'login' ? { 
          loginMethod: Math.random() > 0.5 ? 'password' : 'sso',
          rememberMe: Math.random() > 0.5
        } : undefined
      })
    }

    // Sort by timestamp (newest first)
    mockLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    
    logs.value = mockLogs
  }

  // Initialize with mock data
  generateMockLogs()

  const filteredLogs = computed(() => {
    return logs.value
  })

  const stats = computed((): AccessLogStats => {
    const totalLogs = logs.value.length
    const uniqueUsers = new Set(logs.value.map(log => log.userId)).size
    const successLogs = logs.value.filter(log => log.status === 'success').length
    const successRate = totalLogs > 0 ? (successLogs / totalLogs) * 100 : 0

    // Most active user
    const userCounts = logs.value.reduce((acc, log) => {
      acc[log.username] = (acc[log.username] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const mostActiveUser = Object.entries(userCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'

    // Most common action
    const actionCounts = logs.value.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const mostCommonAction = Object.entries(actionCounts).sort(([,a], [,b]) => b - a)[0]?.[0] as AccessLogAction || 'login'

    // Peak hour
    const hourCounts = logs.value.reduce((acc, log) => {
      const hour = log.timestamp.getHours()
      acc[hour] = (acc[hour] || 0) + 1
      return acc
    }, {} as Record<number, number>)
    const peakHour = Object.entries(hourCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 0

    return {
      totalLogs,
      uniqueUsers,
      successRate,
      mostActiveUser,
      mostCommonAction,
      peakHour: Number(peakHour)
    }
  })

  const getFilteredLogs = (filter: AccessLogFilter, page: number = 1, limit: number = 50) => {
    let filtered = [...logs.value]

    if (filter.userId) {
      filtered = filtered.filter(log => log.userId === filter.userId)
    }

    if (filter.action) {
      filtered = filtered.filter(log => log.action === filter.action)
    }

    if (filter.status) {
      filtered = filtered.filter(log => log.status === filter.status)
    }

    if (filter.dateFrom) {
      filtered = filtered.filter(log => log.timestamp >= filter.dateFrom!)
    }

    if (filter.dateTo) {
      filtered = filtered.filter(log => log.timestamp <= filter.dateTo!)
    }

    if (filter.ipAddress) {
      filtered = filtered.filter(log => log.ipAddress.includes(filter.ipAddress!))
    }

    if (filter.resource) {
      filtered = filtered.filter(log => 
        log.resource?.toLowerCase().includes(filter.resource!.toLowerCase())
      )
    }

    const total = filtered.length
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedLogs = filtered.slice(start, end)

    return {
      logs: paginatedLogs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  const addLog = (logData: Omit<AccessLog, 'id' | 'timestamp'>) => {
    const newLog: AccessLog = {
      ...logData,
      id: nanoid(),
      timestamp: new Date()
    }
    logs.value.unshift(newLog)
  }

  const clearLogs = () => {
    logs.value = []
  }

  const exportLogs = (filter?: AccessLogFilter) => {
    const logsToExport = filter ? getFilteredLogs(filter, 1, logs.value.length).logs : logs.value
    
    const csv = [
      'Timestamp,User,Role,Action,Resource,IP Address,Status,Duration,Session ID',
      ...logsToExport.map(log => [
        log.timestamp.toISOString(),
        log.username,
        log.userRole,
        log.action,
        log.resource || '',
        log.ipAddress,
        log.status,
        log.duration || '',
        log.sessionId
      ].join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `access-logs-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return {
    logs: filteredLogs,
    isLoading,
    error,
    stats,
    getFilteredLogs,
    addLog,
    clearLogs,
    exportLogs,
    generateMockLogs
  }
})