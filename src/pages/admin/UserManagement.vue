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

      <!-- Rest of template content -->

    </div>

    <!-- Modals -->
    <UserModal
      :show="showCreateUserModal || showEditUserModal"
      :user="editingUser"
      :groups="userStore.groups"
      @close="closeUserModal"
      @save="saveUser"
    />

    <GroupModal
      :show="showCreateGroupModal || showEditGroupModal"
      :group="editingGroup"
      :users="userStore.users"
      @close="closeGroupModal"
      @save="saveGroup"
    />

    <GroupMemberModal
      :show="showGroupMemberModal"
      :group="managingGroup"
      :users="userStore.users"
      @close="closeGroupMemberModal"
      @save="saveGroupMembers"
    />

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
import { ref, onMounted } from 'vue'
import { 
  PlusIcon,
  UserGroupIcon,
  PencilIcon,
  TrashIcon,
  UsersIcon
} from '@heroicons/vue/24/outline'
import { useUserStore } from '@/stores/modules/user'
import type { User, UserGroup } from '@/types/user'
import UserModal from './components/UserModal.vue'
import GroupModal from './components/GroupModal.vue'
import GroupMemberModal from './components/GroupMemberModal.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'

// Initialize the user store
const userStore = useUserStore()

// Modal states
const showCreateUserModal = ref(false)
const showEditUserModal = ref(false)
const showCreateGroupModal = ref(false)
const showEditGroupModal = ref(false)
const showGroupMemberModal = ref(false)
const showDeleteDialog = ref(false)

// Editing states
const editingUser = ref<User | null>(null)
const editingGroup = ref<UserGroup | null>(null)
const managingGroup = ref<UserGroup | null>(null)
const deleteTarget = ref<{ type: 'user' | 'group', id: string } | null>(null)

// Delete dialog computed properties
const deleteDialogTitle = ref('')
const deleteDialogMessage = ref('')

// Modal handlers
const closeUserModal = () => {
  showCreateUserModal.value = false
  showEditUserModal.value = false
  editingUser.value = null
}

const closeGroupModal = () => {
  showCreateGroupModal.value = false
  showEditGroupModal.value = false
  editingGroup.value = null
}

const closeGroupMemberModal = () => {
  showGroupMemberModal.value = false
  managingGroup.value = null
}

const saveUser = async (userData: Partial<User>) => {
  try {
    if (editingUser.value) {
      await userStore.updateUser(editingUser.value.id, userData)
    } else {
      await userStore.createUser(userData as Omit<User, 'id' | 'createdAt' | 'updatedAt'>)
    }
    closeUserModal()
  } catch (error) {
    console.error('Error saving user:', error)
  }
}

const saveGroup = async (groupData: Partial<UserGroup>) => {
  try {
    if (editingGroup.value) {
      await userStore.updateGroup(editingGroup.value.id, groupData)
    } else {
      await userStore.createGroup(groupData as Omit<UserGroup, 'id' | 'createdAt' | 'updatedAt'>)
    }
    closeGroupModal()
  } catch (error) {
    console.error('Error saving group:', error)
  }
}

const saveGroupMembers = async (memberIds: string[]) => {
  try {
    if (managingGroup.value) {
      await userStore.updateGroupMembers(managingGroup.value.id, memberIds)
    }
    closeGroupMemberModal()
  } catch (error) {
    console.error('Error updating group members:', error)
  }
}

const confirmDelete = async () => {
  try {
    if (deleteTarget.value) {
      if (deleteTarget.value.type === 'user') {
        await userStore.deleteUser(deleteTarget.value.id)
      } else {
        await userStore.deleteGroup(deleteTarget.value.id)
      }
    }
    showDeleteDialog.value = false
    deleteTarget.value = null
  } catch (error) {
    console.error('Error deleting:', error)
  }
}

// Load data on mount
onMounted(async () => {
  try {
    await userStore.loadUsers()
    await userStore.loadGroups()
  } catch (error) {
    console.error('Error loading user data:', error)
  }
})
</script>