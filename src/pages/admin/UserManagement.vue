<template>
  <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <!-- Header -->
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-2xl font-bold text-gray-900">User & Group Management</h1>
          <p class="mt-2 text-sm text-gray-700">
            Manage users and user groups for the BI Dashboard system.
          </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
          <button
            type="button"
            @click="showCreateGroupModal = true"
            class="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <UserGroupIcon class="w-4 h-4 mr-2" />
            Create Group
          </button>
          <button
            type="button"
            @click="showCreateUserModal = true"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <PlusIcon class="w-4 h-4 mr-2" />
            Create User
          </button>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="mt-8">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              <component :is="tab.icon" class="h-5 w-5 mr-2 inline" />
              {{ tab.name }}
              <span
                v-if="tab.count !== undefined"
                :class="[
                  activeTab === tab.id ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-900',
                  'ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium'
                ]"
              >
                {{ tab.count }}
              </span>
            </button>
          </nav>
        </div>
      </div>

      <!-- Users Tab -->
      <div v-if="activeTab === 'users'" class="mt-6">
        <!-- Search and Filter Controls -->
        <div class="bg-white shadow rounded-lg mb-6">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div class="flex-1 max-w-lg">
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    v-model="userSearchQuery"
                    type="text"
                    placeholder="Search users by username, email, or full name..."
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <select
                  v-model="selectedUserRole"
                  class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                  <option value="">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="Dashboard Designer">Dashboard Designer</option>
                  <option value="Dashboard Viewer">Dashboard Viewer</option>
                </select>
                <select
                  v-model="selectedUserType"
                  class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                >
                  <option value="">All Types</option>
                  <option value="local">Local</option>
                  <option value="sso">SSO</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Users Table -->
        <div class="bg-white shadow rounded-lg overflow-hidden">
          <div v-if="filteredUsers.length === 0" class="text-center py-12">
            <UserIcon class="mx-auto h-12 w-12 text-gray-400" />
            <h3 class="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p class="mt-1 text-sm text-gray-500">
              {{ userSearchQuery ? 'Try adjusting your search terms.' : 'Get started by creating your first user.' }}
            </p>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th scope="col" class="relative px-6 py-3">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="user in paginatedUsers"
                  :key="user.id"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <UserIcon class="h-6 w-6 text-primary-600" />
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">{{ user.username }}</div>
                        <div class="text-sm text-gray-500">{{ user.fullName || user.username }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="getRoleColor(user.role)"
                    >
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="user.type === 'local' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'"
                    >
                      {{ user.type.toUpperCase() }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      :class="user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ user.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ user.lastLogin ? formatDate(user.lastLogin) : 'Never' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex items-center justify-end space-x-2">
                      <button
                        @click="editUser(user)"
                        class="text-primary-600 hover:text-primary-900"
                        title="Edit User"
                      >
                        <PencilIcon class="h-5 w-5" />
                      </button>
                      <button
                        @click="deleteUserConfirm(user)"
                        class="text-red-600 hover:text-red-900"
                        title="Delete User"
                      >
                        <TrashIcon class="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="totalUserPages > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div class="flex-1 flex justify-between sm:hidden">
              <button
                @click="prevUserPage"
                :disabled="currentUserPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                @click="nextUserPage"
                :disabled="currentUserPage === totalUserPages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing
                  <span class="font-medium">{{ (currentUserPage - 1) * itemsPerPage + 1 }}</span>
                  to
                  <span class="font-medium">{{ Math.min(currentUserPage * itemsPerPage, filteredUsers.length) }}</span>
                  of
                  <span class="font-medium">{{ filteredUsers.length }}</span>
                  results
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    @click="prevUserPage"
                    :disabled="currentUserPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeftIcon class="h-5 w-5" />
                  </button>
                  
                  <button
                    v-for="page in visibleUserPages"
                    :key="page"
                    @click="goToUserPage(page)"
                    :class="[
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                      page === currentUserPage
                        ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    ]"
                  >
                    {{ page }}
                  </button>
                  
                  <button
                    @click="nextUserPage"
                    :disabled="currentUserPage === totalUserPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRightIcon class="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Groups Tab -->
      <div v-if="activeTab === 'groups'" class="mt-6">
        <!-- Search Controls -->
        <div class="bg-white shadow rounded-lg mb-6">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div class="flex-1 max-w-lg">
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    v-model="groupSearchQuery"
                    type="text"
                    placeholder="Search groups by name or description..."
                    class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Groups Grid -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="group in filteredGroups"
            :key="group.id"
            class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
          >
            <div class="p-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <UserGroupIcon class="h-8 w-8 text-primary-600" />
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-gray-900">{{ group.name }}</h3>
                    <p class="text-sm text-gray-500">{{ group.userIds.length }} members</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="editGroup(group)"
                    class="text-primary-600 hover:text-primary-900"
                    title="Edit Group"
                  >
                    <PencilIcon class="h-5 w-5" />
                  </button>
                  <button
                    @click="deleteGroupConfirm(group)"
                    class="text-red-600 hover:text-red-900"
                    title="Delete Group"
                  >
                    <TrashIcon class="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div class="mt-4">
                <p class="text-sm font-medium text-gray-700">Members</p>
                <p class="text-sm text-gray-500">{{ group.userIds.length }} members</p>
              </div>
              <div class="mt-4">
                <p class="text-sm font-medium text-gray-700">Description</p>
                <p class="text-sm text-gray-600">{{ group.description || 'No description' }}</p>
              </div>
              <div class="mt-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700">Status</span>
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="group.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  >
                    {{ group.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit User Modal -->
    <UserModal
      :show="showCreateUserModal || showEditUserModal"
      :user="editingUser"
      :groups="userStore.groups"
      @close="closeUserModal"
      @save="saveUser"
    />

    <!-- Create/Edit Group Modal -->
    <GroupModal
      :show="showCreateGroupModal || showEditGroupModal"
      :group="editingGroup"
      :users="userStore.users"
      @close="closeGroupModal"
      @save="saveGroup"
    />

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      :show="showDeleteDialog"
      :title="deleteDialogTitle"
      :message="deleteDialogMessage"
      type="danger"
      confirm-text="Delete"
      @close="showDeleteDialog = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  PlusIcon,
  UserIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'
import { useUserStore } from '@/stores/modules/user'
import type { User, UserGroup } from '@/types/user'
import UserModal from './components/UserModal.vue'
import GroupModal from './components/GroupModal.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

const userStore = useUserStore()

// Tab management
const activeTab = ref('users')
const tabs = computed(() => [
  {
    id: 'users',
    name: 'Users',
    icon: UserIcon,
    count: userStore.activeUsers.length
  },
  {
    id: 'groups',
    name: 'Groups',
    icon: UserGroupIcon,
    count: userStore.activeGroups.length
  }
])

// User management
const userSearchQuery = ref('')
const selectedUserRole = ref('')
const selectedUserType = ref('')
const currentUserPage = ref(1)
const itemsPerPage = ref(10)

const showCreateUserModal = ref(false)
const showEditUserModal = ref(false)
const editingUser = ref<User | null>(null)

// Group management
const groupSearchQuery = ref('')
const showCreateGroupModal = ref(false)
const showEditGroupModal = ref(false)
const editingGroup = ref<UserGroup | null>(null)

// Delete confirmation
const showDeleteDialog = ref(false)
const deleteDialogTitle = ref('')
const deleteDialogMessage = ref('')
const deleteAction = ref<(() => void) | null>(null)

// Computed properties for users
const filteredUsers = computed(() => {
  let filtered = userStore.users

  // Apply search filter
  if (userSearchQuery.value) {
    const query = userSearchQuery.value.toLowerCase()
    filtered = filtered.filter(user =>
      user.username.toLowerCase().includes(query) ||
      (user.email && user.email.toLowerCase().includes(query)) ||
      (user.fullName && user.fullName.toLowerCase().includes(query))
    )
  }

  // Apply role filter
  if (selectedUserRole.value) {
    filtered = filtered.filter(user => user.role === selectedUserRole.value)
  }

  // Apply type filter
  if (selectedUserType.value) {
    filtered = filtered.filter(user => user.type === selectedUserType.value)
  }

  return filtered
})

const totalUserPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage.value)
})

const paginatedUsers = computed(() => {
  const start = (currentUserPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredUsers.value.slice(start, end)
})

const visibleUserPages = computed(() => {
  const pages = []
  const total = totalUserPages.value
  const current = currentUserPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
})

// Computed properties for groups
const filteredGroups = computed(() => {
  let filtered = userStore.groups

  if (groupSearchQuery.value) {
    const query = groupSearchQuery.value.toLowerCase()
    filtered = filtered.filter(group =>
      group.name.toLowerCase().includes(query) ||
      (group.description && group.description.toLowerCase().includes(query))
    )
  }

  return filtered
})

// Helper functions
const getRoleColor = (role: string) => {
  const colors = {
    'Admin': 'bg-red-100 text-red-800',
    'Dashboard Designer': 'bg-blue-100 text-blue-800',
    'Dashboard Viewer': 'bg-green-100 text-green-800'
  }
  return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

const getUserGroups = (userId: string) => {
  return userStore.getGroupsByUser(userId)
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

// User pagination
const goToUserPage = (page: number | string) => {
  if (typeof page === 'number' && page >= 1 && page <= totalUserPages.value) {
    currentUserPage.value = page
  }
}

const nextUserPage = () => {
  if (currentUserPage.value < totalUserPages.value) {
    currentUserPage.value++
  }
}

const prevUserPage = () => {
  if (currentUserPage.value > 1) {
    currentUserPage.value--
  }
}

// User actions
const editUser = (user: User) => {
  editingUser.value = user
  showEditUserModal.value = true
}

const deleteUserConfirm = (user: User) => {
  deleteDialogTitle.value = 'Delete User'
  deleteDialogMessage.value = `Are you sure you want to delete user "${user.username}"? This action cannot be undone.`
  deleteAction.value = () => userStore.deleteUser(user.id)
  showDeleteDialog.value = true
}

const closeUserModal = () => {
  showCreateUserModal.value = false
  showEditUserModal.value = false
  editingUser.value = null
}

const saveUser = async (userData: any) => {
  try {
    if (editingUser.value) {
      await userStore.updateUser(editingUser.value.id, userData)
    } else {
      await userStore.createUser(userData)
    }
    closeUserModal()
  } catch (error) {
    console.error('Failed to save user:', error)
  }
}

// Group actions
const editGroup = (group: UserGroup) => {
  editingGroup.value = group
  showEditGroupModal.value = true
}

const deleteGroupConfirm = (group: UserGroup) => {
  deleteDialogTitle.value = 'Delete Group'
  deleteDialogMessage.value = `Are you sure you want to delete group "${group.name}"? This action cannot be undone.`
  deleteAction.value = () => userStore.deleteGroup(group.id)
  showDeleteDialog.value = true
}

const closeGroupModal = () => {
  showCreateGroupModal.value = false
  showEditGroupModal.value = false
  editingGroup.value = null
}

const saveGroup = async (groupData: any) => {
  try {
    if (editingGroup.value) {
      await userStore.updateGroup(editingGroup.value.id, groupData)
    } else {
      await userStore.createGroup(groupData)
    }
    closeGroupModal()
  } catch (error) {
    console.error('Failed to save group:', error)
  }
}

const confirmDelete = () => {
  if (deleteAction.value) {
    deleteAction.value()
    showDeleteDialog.value = false
    deleteAction.value = null
  }
}

onMounted(() => {
  // Load data if needed
})
</script>