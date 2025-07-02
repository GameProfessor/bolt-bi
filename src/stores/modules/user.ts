import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { nanoid } from 'nanoid'
import type { User, UserGroup, CreateUserRequest, UpdateUserRequest, CreateGroupRequest, UpdateGroupRequest } from '@/types/user'

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<User[]>([])
  const groups = ref<UserGroup[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Mock data for development
  const initializeMockData = () => {
    if (users.value.length === 0) {
      users.value = [
        {
          id: '1',
          username: 'admin',
          password: 'admin123',
          email: 'admin@company.com',
          fullName: 'System Administrator',
          phone: '+84123456789',
          type: 'local',
          role: 'Admin',
          groupIds: ['1'],
          isActive: true,
          lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          createdBy: 'system'
        },
        {
          id: '2',
          username: 'designer1',
          password: 'designer123',
          email: 'designer@company.com',
          fullName: 'John Designer',
          phone: '+84987654321',
          type: 'local',
          role: 'Dashboard Designer',
          groupIds: ['2'],
          isActive: true,
          lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          createdBy: 'admin'
        },
        {
          id: '3',
          username: 'viewer1',
          email: 'viewer@company.com',
          fullName: 'Jane Viewer',
          type: 'sso',
          role: 'Dashboard Viewer',
          groupIds: ['3'],
          isActive: true,
          lastLogin: new Date(Date.now() - 30 * 60 * 1000),
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          createdBy: 'admin'
        }
      ]
    }

    if (groups.value.length === 0) {
      groups.value = [
        {
          id: '1',
          name: 'Administrators',
          description: 'Full system access',
          permissions: ['all'],
          userIds: ['1'],
          isActive: true,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          createdBy: 'system'
        },
        {
          id: '2',
          name: 'Dashboard Designers',
          description: 'Can create and edit dashboards',
          permissions: ['dashboard.create', 'dashboard.edit', 'dashboard.view', 'data.view'],
          userIds: ['2'],
          isActive: true,
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          createdBy: 'admin'
        },
        {
          id: '3',
          name: 'Dashboard Viewers',
          description: 'Can only view dashboards',
          permissions: ['dashboard.view'],
          userIds: ['3'],
          isActive: true,
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          createdBy: 'admin'
        }
      ]
    }
  }

  // Getters
  const activeUsers = computed(() => users.value.filter(user => user.isActive))
  const activeGroups = computed(() => groups.value.filter(group => group.isActive))
  
  const getUsersByRole = computed(() => (role: string) => 
    users.value.filter(user => user.role === role)
  )

  const getUsersByGroup = computed(() => (groupId: string) => 
    users.value.filter(user => user.groupIds.includes(groupId))
  )

  const getGroupsByUser = computed(() => (userId: string) => {
    const user = users.value.find(u => u.id === userId)
    if (!user) return []
    return groups.value.filter(group => user.groupIds.includes(group.id))
  })

  // Actions
  const createUser = async (userData: CreateUserRequest): Promise<User> => {
    loading.value = true
    error.value = null

    try {
      // Validate username uniqueness
      if (users.value.some(user => user.username === userData.username)) {
        throw new Error('Username already exists')
      }

      // Validate email uniqueness if provided
      if (userData.email && users.value.some(user => user.email === userData.email)) {
        throw new Error('Email already exists')
      }

      const newUser: User = {
        id: nanoid(),
        username: userData.username,
        password: userData.password,
        phone: userData.phone,
        email: userData.email,
        fullName: userData.fullName,
        type: userData.type,
        role: userData.role,
        groupIds: userData.groupIds || [],
        isActive: userData.isActive ?? true,
        createdAt: new Date(),
        createdBy: 'current-user' // Should be replaced with actual current user
      }

      users.value.push(newUser)
      saveToStorage()
      return newUser
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create user'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (userId: string, userData: UpdateUserRequest): Promise<User> => {
    loading.value = true
    error.value = null

    try {
      const userIndex = users.value.findIndex(user => user.id === userId)
      if (userIndex === -1) {
        throw new Error('User not found')
      }

      // Validate username uniqueness if changed
      if (userData.username && userData.username !== users.value[userIndex].username) {
        if (users.value.some(user => user.username === userData.username)) {
          throw new Error('Username already exists')
        }
      }

      // Validate email uniqueness if changed
      if (userData.email && userData.email !== users.value[userIndex].email) {
        if (users.value.some(user => user.email === userData.email)) {
          throw new Error('Email already exists')
        }
      }

      const updatedUser = {
        ...users.value[userIndex],
        ...userData,
        updatedAt: new Date()
      }

      users.value[userIndex] = updatedUser
      saveToStorage()
      return updatedUser
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update user'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (userId: string): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const userIndex = users.value.findIndex(user => user.id === userId)
      if (userIndex === -1) {
        throw new Error('User not found')
      }

      users.value.splice(userIndex, 1)
      
      // Remove user from all groups
      groups.value.forEach(group => {
        group.userIds = group.userIds.filter(id => id !== userId)
      })

      saveToStorage()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete user'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createGroup = async (groupData: CreateGroupRequest): Promise<UserGroup> => {
    loading.value = true
    error.value = null

    try {
      // Validate group name uniqueness
      if (groups.value.some(group => group.name === groupData.name)) {
        throw new Error('Group name already exists')
      }

      const newGroup: UserGroup = {
        id: nanoid(),
        name: groupData.name,
        description: groupData.description,
        permissions: groupData.permissions || [],
        userIds: groupData.userIds || [],
        isActive: groupData.isActive ?? true,
        createdAt: new Date(),
        createdBy: 'current-user'
      }

      groups.value.push(newGroup)
      saveToStorage()
      return newGroup
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create group'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateGroup = async (groupId: string, groupData: UpdateGroupRequest): Promise<UserGroup> => {
    loading.value = true
    error.value = null

    try {
      const groupIndex = groups.value.findIndex(group => group.id === groupId)
      if (groupIndex === -1) {
        throw new Error('Group not found')
      }

      // Validate group name uniqueness if changed
      if (groupData.name && groupData.name !== groups.value[groupIndex].name) {
        if (groups.value.some(group => group.name === groupData.name)) {
          throw new Error('Group name already exists')
        }
      }

      const updatedGroup = {
        ...groups.value[groupIndex],
        ...groupData,
        updatedAt: new Date()
      }

      groups.value[groupIndex] = updatedGroup
      saveToStorage()
      return updatedGroup
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update group'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteGroup = async (groupId: string): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const groupIndex = groups.value.findIndex(group => group.id === groupId)
      if (groupIndex === -1) {
        throw new Error('Group not found')
      }

      groups.value.splice(groupIndex, 1)
      
      // Remove group from all users
      users.value.forEach(user => {
        user.groupIds = user.groupIds.filter(id => id !== groupId)
      })

      saveToStorage()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete group'
      throw err
    } finally {
      loading.value = false
    }
  }

  const addUserToGroup = async (userId: string, groupId: string): Promise<void> => {
    const user = users.value.find(u => u.id === userId)
    const group = groups.value.find(g => g.id === groupId)
    
    if (!user || !group) {
      throw new Error('User or group not found')
    }

    if (!user.groupIds.includes(groupId)) {
      user.groupIds.push(groupId)
    }
    
    if (!group.userIds.includes(userId)) {
      group.userIds.push(userId)
    }

    saveToStorage()
  }

  const removeUserFromGroup = async (userId: string, groupId: string): Promise<void> => {
    const user = users.value.find(u => u.id === userId)
    const group = groups.value.find(g => g.id === groupId)
    
    if (!user || !group) {
      throw new Error('User or group not found')
    }

    user.groupIds = user.groupIds.filter(id => id !== groupId)
    group.userIds = group.userIds.filter(id => id !== userId)

    saveToStorage()
  }

  const saveToStorage = () => {
    localStorage.setItem('bi-users', JSON.stringify(users.value))
    localStorage.setItem('bi-groups', JSON.stringify(groups.value))
  }

  const loadFromStorage = () => {
    try {
      const storedUsers = localStorage.getItem('bi-users')
      const storedGroups = localStorage.getItem('bi-groups')
      
      if (storedUsers) {
        users.value = JSON.parse(storedUsers).map((user: any) => ({
          ...user,
          createdAt: new Date(user.createdAt),
          updatedAt: user.updatedAt ? new Date(user.updatedAt) : undefined,
          lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined
        }))
      }
      
      if (storedGroups) {
        groups.value = JSON.parse(storedGroups).map((group: any) => ({
          ...group,
          createdAt: new Date(group.createdAt),
          updatedAt: group.updatedAt ? new Date(group.updatedAt) : undefined
        }))
      }
    } catch (e) {
      console.error('Failed to load user data from storage:', e)
    }
  }

  // Initialize
  loadFromStorage()
  initializeMockData()

  return {
    // State
    users,
    groups,
    loading,
    error,
    
    // Getters
    activeUsers,
    activeGroups,
    getUsersByRole,
    getUsersByGroup,
    getGroupsByUser,
    
    // Actions
    createUser,
    updateUser,
    deleteUser,
    createGroup,
    updateGroup,
    deleteGroup,
    addUserToGroup,
    removeUserFromGroup,
    saveToStorage,
    loadFromStorage
  }
})