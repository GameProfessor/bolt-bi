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

  // Getters
  const activeUsers = computed(() => users.value.filter(user => user.isActive))
  const activeGroups = computed(() => groups.value.filter(group => group.isActive))

  const getUserById = (id: string) => users.value.find(user => user.id === id)
  const getGroupById = (id: string) => groups.value.find(group => group.id === id)
  
  const getGroupsByUser = (userId: string) => {
    const user = getUserById(userId)
    if (!user) return []
    return groups.value.filter(group => user.groupIds.includes(group.id))
  }

  const getUsersByGroup = (groupId: string) => {
    const group = getGroupById(groupId)
    if (!group) return []
    return users.value.filter(user => group.userIds.includes(user.id))
  }

  // Actions
  const createUser = async (userData: CreateUserRequest): Promise<User> => {
    loading.value = true
    error.value = null

    try {
      const newUser: User = {
        id: nanoid(),
        username: userData.username,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        type: userData.type,
        password: userData.password,
        role: userData.role,
        groupIds: userData.groupIds || [],
        isActive: userData.isActive ?? true,
        createdAt: new Date()
      }

      users.value.push(newUser)
      
      // Update groups if user is assigned to any
      if (newUser.groupIds.length > 0) {
        newUser.groupIds.forEach(groupId => {
          const group = getGroupById(groupId)
          if (group && !group.userIds.includes(newUser.id)) {
            group.userIds.push(newUser.id)
            group.updatedAt = new Date()
          }
        })
      }

      saveToStorage()
      return newUser
    } catch (err) {
      error.value = 'Failed to create user'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id: string, userData: UpdateUserRequest): Promise<User> => {
    loading.value = true
    error.value = null

    try {
      const userIndex = users.value.findIndex(user => user.id === id)
      if (userIndex === -1) {
        throw new Error('User not found')
      }

      const existingUser = users.value[userIndex]
      const oldGroupIds = [...existingUser.groupIds]

      // Update user
      users.value[userIndex] = {
        ...existingUser,
        ...userData,
        id, // Ensure ID doesn't change
        updatedAt: new Date()
      }

      const updatedUser = users.value[userIndex]

      // Update group memberships
      const newGroupIds = updatedUser.groupIds || []
      
      // Remove user from old groups
      oldGroupIds.forEach(groupId => {
        if (!newGroupIds.includes(groupId)) {
          const group = getGroupById(groupId)
          if (group) {
            group.userIds = group.userIds.filter(userId => userId !== id)
            group.updatedAt = new Date()
          }
        }
      })

      // Add user to new groups
      newGroupIds.forEach(groupId => {
        if (!oldGroupIds.includes(groupId)) {
          const group = getGroupById(groupId)
          if (group && !group.userIds.includes(id)) {
            group.userIds.push(id)
            group.updatedAt = new Date()
          }
        }
      })

      saveToStorage()
      return updatedUser
    } catch (err) {
      error.value = 'Failed to update user'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id: string): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const userIndex = users.value.findIndex(user => user.id === id)
      if (userIndex === -1) {
        throw new Error('User not found')
      }

      const user = users.value[userIndex]

      // Remove user from all groups
      user.groupIds.forEach(groupId => {
        const group = getGroupById(groupId)
        if (group) {
          group.userIds = group.userIds.filter(userId => userId !== id)
          group.updatedAt = new Date()
        }
      })

      // Remove user
      users.value.splice(userIndex, 1)
      saveToStorage()
    } catch (err) {
      error.value = 'Failed to delete user'
      throw err
    } finally {
      loading.value = false
    }
  }

  const createGroup = async (groupData: CreateGroupRequest): Promise<UserGroup> => {
    loading.value = true
    error.value = null

    try {
      const newGroup: UserGroup = {
        id: nanoid(),
        name: groupData.name,
        description: groupData.description,
        permissions: groupData.permissions,
        userIds: groupData.userIds || [],
        isActive: groupData.isActive ?? true,
        createdAt: new Date()
      }

      groups.value.push(newGroup)

      // Update users if they are assigned to this group
      if (newGroup.userIds.length > 0) {
        newGroup.userIds.forEach(userId => {
          const user = getUserById(userId)
          if (user && !user.groupIds.includes(newGroup.id)) {
            user.groupIds.push(newGroup.id)
            user.updatedAt = new Date()
          }
        })
      }

      saveToStorage()
      return newGroup
    } catch (err) {
      error.value = 'Failed to create group'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateGroup = async (id: string, groupData: UpdateGroupRequest): Promise<UserGroup> => {
    loading.value = true
    error.value = null

    try {
      const groupIndex = groups.value.findIndex(group => group.id === id)
      if (groupIndex === -1) {
        throw new Error('Group not found')
      }

      const existingGroup = groups.value[groupIndex]
      const oldUserIds = [...existingGroup.userIds]

      // Update group
      groups.value[groupIndex] = {
        ...existingGroup,
        ...groupData,
        id, // Ensure ID doesn't change
        updatedAt: new Date()
      }

      const updatedGroup = groups.value[groupIndex]

      // Update user memberships
      const newUserIds = updatedGroup.userIds || []

      // Remove group from old users
      oldUserIds.forEach(userId => {
        if (!newUserIds.includes(userId)) {
          const user = getUserById(userId)
          if (user) {
            user.groupIds = user.groupIds.filter(groupId => groupId !== id)
            user.updatedAt = new Date()
          }
        }
      })

      // Add group to new users
      newUserIds.forEach(userId => {
        if (!oldUserIds.includes(userId)) {
          const user = getUserById(userId)
          if (user && !user.groupIds.includes(id)) {
            user.groupIds.push(id)
            user.updatedAt = new Date()
          }
        }
      })

      saveToStorage()
      return updatedGroup
    } catch (err) {
      error.value = 'Failed to update group'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteGroup = async (id: string): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      const groupIndex = groups.value.findIndex(group => group.id === id)
      if (groupIndex === -1) {
        throw new Error('Group not found')
      }

      const group = groups.value[groupIndex]

      // Remove group from all users
      group.userIds.forEach(userId => {
        const user = getUserById(userId)
        if (user) {
          user.groupIds = user.groupIds.filter(groupId => groupId !== id)
          user.updatedAt = new Date()
        }
      })

      // Remove group
      groups.value.splice(groupIndex, 1)
      saveToStorage()
    } catch (err) {
      error.value = 'Failed to delete group'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Storage functions
  const saveToStorage = () => {
    const data = {
      users: users.value,
      groups: groups.value
    }
    localStorage.setItem('bi-user-management', JSON.stringify(data))
  }

  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem('bi-user-management')
      if (stored) {
        const data = JSON.parse(stored)
        
        users.value = (data.users || []).map((user: any) => ({
          ...user,
          createdAt: new Date(user.createdAt),
          updatedAt: user.updatedAt ? new Date(user.updatedAt) : undefined,
          lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined
        }))

        groups.value = (data.groups || []).map((group: any) => ({
          ...group,
          createdAt: new Date(group.createdAt),
          updatedAt: group.updatedAt ? new Date(group.updatedAt) : undefined
        }))
      } else {
        // Initialize with default data
        initializeDefaultData()
      }
    } catch (err) {
      console.error('Failed to load user data from storage:', err)
      initializeDefaultData()
    }
  }

  const initializeDefaultData = () => {
    // Create default admin user
    const adminUser: User = {
      id: 'admin-1',
      username: 'admin',
      fullName: 'System Administrator',
      email: 'admin@example.com',
      type: 'local',
      password: 'admin123',
      role: 'Admin',
      groupIds: [],
      isActive: true,
      createdAt: new Date(),
      lastLogin: new Date()
    }

    // Create default groups
    const adminGroup: UserGroup = {
      id: 'group-admin',
      name: 'Administrators',
      description: 'System administrators with full access',
      permissions: ['all'],
      userIds: [adminUser.id],
      isActive: true,
      createdAt: new Date()
    }

    const designerGroup: UserGroup = {
      id: 'group-designer',
      name: 'Dashboard Designers',
      description: 'Users who can create and edit dashboards',
      permissions: ['dashboard.view', 'dashboard.create', 'dashboard.edit', 'data.view', 'data.create'],
      userIds: [],
      isActive: true,
      createdAt: new Date()
    }

    const viewerGroup: UserGroup = {
      id: 'group-viewer',
      name: 'Dashboard Viewers',
      description: 'Users who can only view dashboards',
      permissions: ['dashboard.view', 'data.view'],
      userIds: [],
      isActive: true,
      createdAt: new Date()
    }

    // Add admin to admin group
    adminUser.groupIds = [adminGroup.id]

    users.value = [adminUser]
    groups.value = [adminGroup, designerGroup, viewerGroup]
    
    saveToStorage()
  }

  // Initialize data on store creation
  loadFromStorage()

  return {
    // State
    users,
    groups,
    loading,
    error,
    
    // Getters
    activeUsers,
    activeGroups,
    getUserById,
    getGroupById,
    getGroupsByUser,
    getUsersByGroup,
    
    // Actions
    createUser,
    updateUser,
    deleteUser,
    createGroup,
    updateGroup,
    deleteGroup,
    loadFromStorage,
    saveToStorage
  }
})

export type UserStore = ReturnType<typeof useUserStore>