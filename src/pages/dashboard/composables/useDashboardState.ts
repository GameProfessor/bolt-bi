import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { nanoid } from 'nanoid'
import { useDataSourceStore, useDashboardStore } from '@/stores'
import type { DataSourceColumn } from '@/stores/modules/dataSource'
import type { DashboardTab, DashboardChart } from '@/types/dashboard'

export function useDashboardState() {
  const router = useRouter()

  const dataSourceStore = useDataSourceStore()
  const dashboardStore = useDashboardStore()

  // Core dashboard state
  const dashboardName = ref('')
  const dashboardDescription = ref('')
  const dashboardCategory = ref('')
  const currentDashboardId = ref<string | null>(null)
  const previewMode = ref(false)

  // Data source state
  const selectedDataSources = ref<Array<{ id: string; name: string; columns: DataSourceColumn[] }>>([])
  const expandedDataSources = ref<string[]>([])

  // Toast notification state
  const showToast = ref(false)
  const toastType = ref<'success' | 'warning' | 'error' | 'info'>('success')
  const toastTitle = ref('')
  const toastMessage = ref('')

  // Dashboard tabs state
  const dashboardTabs = ref<DashboardTab[]>([
    { id: nanoid(), name: 'Tab 1', chartIds: [] }
  ])
  const activeTabId = ref(dashboardTabs.value[0].id)
  const showDashboardTabs = ref(true)

  // Computed properties
  const hasUnsavedChanges = ref(false)

  // Methods
  const saveDashboard = () => {
    if (!dashboardName.value) return

    try {
      // Save selected data source IDs
      const dataSourceIds = selectedDataSources.value.map(ds => ds.id)

      if (currentDashboardId.value) {
        // Update existing dashboard in store
        dashboardStore.updateDashboard(currentDashboardId.value, {
          name: dashboardName.value,
          description: dashboardDescription.value,
          category: dashboardCategory.value,
          dataSourceIds,
          showDashboardTabs: showDashboardTabs.value,
          tabs: dashboardTabs.value
        })

        showToastNotification('success', 'Dashboard Saved', 'Your dashboard has been successfully saved.')
      } else {
        // This shouldn't happen, but create a new dashboard as fallback
        const dashboard = dashboardStore.createDashboard(
          dashboardName.value, 
          dashboardDescription.value, 
          dataSourceIds, 
          dashboardCategory.value
        )
        currentDashboardId.value = dashboard.id
        
        dashboardStore.updateDashboard(dashboard.id, {
          tabs: dashboardTabs.value,
          showDashboardTabs: showDashboardTabs.value
        })
        
        showToastNotification('success', 'Dashboard Created', 'Your dashboard has been successfully created.')
      }
      
      hasUnsavedChanges.value = false
    } catch (error) {
      console.error('Error saving dashboard:', error)
      showToastNotification('error', 'Save Failed', 'There was an error saving your dashboard. Please try again.')
    }
  }

  const loadDashboard = async (dashboardId: string) => {
    const dashboard = dashboardStore.getDashboardById(dashboardId)
    if (dashboard) {
      currentDashboardId.value = dashboardId
      dashboardName.value = dashboard.name
      dashboardDescription.value = dashboard.description || ''
      dashboardCategory.value = dashboard.category || ''
      
      // Restore selected data sources
      if (dashboard.dataSourceIds && dashboard.dataSourceIds.length > 0) {
        selectedDataSources.value = dataSourceStore.dataSources.filter(ds => dashboard.dataSourceIds!.includes(ds.id))
      }
      
      // Load tabs
      if (dashboard.tabs && dashboard.tabs.length > 0) {
        dashboardTabs.value = dashboard.tabs
        activeTabId.value = dashboardTabs.value[0].id
      }

      // Restore showDashboardTabs
      if (typeof dashboard.showDashboardTabs === 'boolean') {
        showDashboardTabs.value = dashboard.showDashboardTabs
      } else {
        showDashboardTabs.value = true
      }
    }
  }

  const createTemporaryDashboard = () => {
    if (!currentDashboardId.value) {
      // Create a dashboard in the store but don't save to storage
      const dashboardNameToUse = dashboardName.value || 'Untitled Dashboard'
      const tempDashboard = dashboardStore.createDashboard(
        dashboardNameToUse, 
        dashboardDescription.value, 
        selectedDataSources.value.map(ds => ds.id), 
        dashboardCategory.value,
        false // Don't save to storage immediately
      )
      currentDashboardId.value = tempDashboard.id
      
      // Only set dashboardName if it's empty (preserve user's input)
      if (!dashboardName.value) {
        dashboardName.value = tempDashboard.name
      }
      
      // Set up tabs
      tempDashboard.tabs = dashboardTabs.value
      tempDashboard.showDashboardTabs = showDashboardTabs.value
    }
  }

  // Toast notification functions
  const showToastNotification = (type: 'success' | 'warning' | 'error' | 'info', title: string, message?: string) => {
    toastType.value = type
    toastTitle.value = title
    toastMessage.value = message || ''
    showToast.value = true
    
    setTimeout(() => {
      hideToast()
    }, 3000)
  }

  const hideToast = () => {
    showToast.value = false
  }

  const goBack = () => {
    // Check if there are any charts or if a dashboard has been created
    if (hasUnsavedChanges.value) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        router.push('/dashboard-store')
      }
    } else {
      router.push('/dashboard-store')
    }
  }

  // Data source management
  const toggleDataSource = (id: string) => {
    const index = expandedDataSources.value.indexOf(id)
    if (index === -1) {
      expandedDataSources.value.push(id)
    } else {
      expandedDataSources.value.splice(index, 1)
    }
  }

  const updateSelectedDataSources = (dataSources: Array<{ id: string; name: string; columns: DataSourceColumn[] }>) => {
    selectedDataSources.value = dataSources
  }

  const handleToggleDashboardTabs = (show: boolean) => {
    showDashboardTabs.value = show
  }

  const onUpdateDashboardInfo = ({ category, description }: { category: string; description: string }) => {
    dashboardCategory.value = category
    dashboardDescription.value = description
  }



  // Mark unsaved changes for chart and tab mutations
  function markUnsaved() {
    hasUnsavedChanges.value = true
  }

  return {
    // State
    dashboardName,
    dashboardDescription,
    dashboardCategory,
    currentDashboardId,
    previewMode,
    selectedDataSources,
    expandedDataSources,
    showToast,
    toastType,
    toastTitle,
    toastMessage,
    dashboardTabs,
    activeTabId,
    showDashboardTabs,
    
    // Computed
    hasUnsavedChanges,
    
    // Methods
    saveDashboard,
    loadDashboard,
    createTemporaryDashboard,
    showToastNotification,
    hideToast,
    goBack,
    toggleDataSource,
    updateSelectedDataSources,
    handleToggleDashboardTabs,
    onUpdateDashboardInfo,
    markUnsaved
  }
} 