export interface User {
  id: string
  username: string
  fullName?: string
  email?: string
  phone?: string
  type: 'local' | 'sso'
  password?: string // Only for local users
  role: 'Admin' | 'Dashboard Designer' | 'Dashboard Viewer'
  groupIds: string[]
  isActive: boolean
  createdAt: Date
  updatedAt?: Date
  lastLogin?: Date
}

export interface UserGroup {
  id: string
  name: string
  description?: string
  permissions: string[]
  userIds: string[]
  isActive: boolean
  createdAt: Date
  updatedAt?: Date
}

export interface CreateUserRequest {
  username: string
  fullName?: string
  email?: string
  phone?: string
  type: 'local' | 'sso'
  password?: string
  role: 'Admin' | 'Dashboard Designer' | 'Dashboard Viewer'
  groupIds?: string[]
  isActive?: boolean
}

export interface UpdateUserRequest {
  username?: string
  fullName?: string
  email?: string
  phone?: string
  password?: string
  role?: 'Admin' | 'Dashboard Designer' | 'Dashboard Viewer'
  groupIds?: string[]
  isActive?: boolean
}

export interface CreateGroupRequest {
  name: string
  description?: string
  permissions: string[]
  userIds?: string[]
  isActive?: boolean
}

export interface UpdateGroupRequest {
  name?: string
  description?: string
  permissions?: string[]
  userIds?: string[]
  isActive?: boolean
}