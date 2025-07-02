export interface User {
  id: string
  username: string
  password?: string // Optional for SSO users
  phone?: string
  email?: string
  fullName?: string
  type: 'local' | 'sso'
  role: 'Admin' | 'Dashboard Designer' | 'Dashboard Viewer'
  groupIds: string[]
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt?: Date
  createdBy?: string
}

export interface UserGroup {
  id: string
  name: string
  description?: string
  userIds: string[]
  isActive: boolean
  createdAt: Date
  updatedAt?: Date
  createdBy?: string
}

export interface CreateUserRequest {
  username: string
  password?: string
  phone?: string
  email?: string
  fullName?: string
  type: 'local' | 'sso'
  role: 'Admin' | 'Dashboard Designer' | 'Dashboard Viewer'
  groupIds?: string[]
  isActive?: boolean
}

export interface UpdateUserRequest {
  username?: string
  password?: string
  phone?: string
  email?: string
  fullName?: string
  role?: 'Admin' | 'Dashboard Designer' | 'Dashboard Viewer'
  groupIds?: string[]
  isActive?: boolean
}

export interface CreateGroupRequest {
  name: string
  description?: string
  userIds?: string[]
  isActive?: boolean
}

export interface UpdateGroupRequest {
  name?: string
  description?: string
  userIds?: string[]
  isActive?: boolean
}