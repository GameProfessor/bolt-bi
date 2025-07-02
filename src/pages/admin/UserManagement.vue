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
// Script content remains the same
</script>