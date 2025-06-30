import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowLeftIcon,
  PlusIcon,
  XMarkIcon,
  Squares2X2Icon,
  DocumentCheckIcon,
  ChartBarIcon,
  PresentationChartLineIcon,
  ChartPieIcon,
  CircleStackIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  CheckIcon,
  PencilIcon,
  TrashIcon,
  ShareIcon,
  TableCellsIcon
} from '@heroicons/vue/24/outline'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useDataSourceStore } from '@/stores'
import type { DataSourceColumn } from '@/stores/modules/dataSource'
import type { DashboardChart } from '@/types/dashboard'
import ChartPreview from '@/components/charts/ChartPreview.vue'
import DataPanel from '@/components/data/DataPanel.vue'
import ChartPanel from '@/components/charts/ChartPanel.vue'
import Toast from '@/components/ui/Toast.vue'

// Import composables
import {
  useDashboardState,
  useTabManagement,
  useChartManagement,
  useDragAndDrop,
  useGridStack
} from './composables'

export default {
  name: 'QuickDashboard',
  components: {
    ArrowLeftIcon,
    PlusIcon,
    XMarkIcon,
    Squares2X2Icon,
    DocumentCheckIcon,
    ChartBarIcon,
    PresentationChartLineIcon,
    ChartPieIcon,
    CircleStackIcon,
    Cog6ToothIcon,
    ChevronDownIcon,
    CheckIcon,
    PencilIcon,
    TrashIcon,
    ShareIcon,
    TableCellsIcon,
    ChartPreview,
    DataPanel,
    ChartPanel,
    Toast
  },
  setup() {
    const route = useRoute()
    const dataSourceStore = useDataSourceStore()

    // Initialize composables
    const {
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
      
      // Computed
      hasUnsavedChanges,
      
      // Methods
      saveDashboard,
      loadDashboard,
      createTemporaryDashboard,
      toggleDataSource,
      updateSelectedDataSources,
      onUpdateDashboardInfo,
      showToastNotification,
      hideToast,
      goBack
    } = useDashboardState()

    const {
      // State
      dashboardTabs,
      activeTabId,
      editingTabId,
      editingTabName,
      tabHoverId,
      showDashboardTabs,
      
      // Computed
      charts,
      
      // Methods
      addTab,
      removeTab,
      startRenameTab,
      finishRenameTab,
      cancelRenameTab,
      handleTabEditKey,
      handleToggleDashboardTabs,
      loadTabs,
      addChartToActiveTab,
      removeChartFromAllTabs,
      injectDependencies: injectTabDependencies
    } = useTabManagement()

    const {
      // State
      chartConfig,
      selectedChartType,
      editingChartId,
      openChartMenuId,
      chartTypes,
      colorSchemes,
      colorPalettes,
      
      // Computed
      isChartConfigValid,
      
      // Methods
      resetChartConfig,
      addOrUpdateChart,
      addChart,
      editChart,
      removeChart,
      cancelEdit,
      exportChart,
      toggleChartMenu,
      createEmptyChart,
      injectDependencies: injectChartDependencies
    } = useChartManagement()

    const {
      // State
      isDragging,
      draggedChartType,
      dragStartX,
      dragStartY,
      currentDragX,
      currentDragY,
      
      // Methods
      handleDragStart,
      handleDragEnd,
      handleDragOver,
      handleDrop,
      handleDragEnter,
      handleDragLeave
    } = useDragAndDrop()

    const {
      // State
      gridStackRef,
      gridStackInstance,
      isGridInitialized,
      gridOptions,
      
      // Methods
      initializeGridStack,
      destroyGridStack,
      addChartToGrid,
      removeChartFromGrid,
      updateChartInGrid,
      refreshGrid,
      clearGrid,
      loadChartsToGrid,
      injectDependencies: injectGridDependencies
    } = useGridStack()

    // Additional refs for the component
    const dataPanelRef = ref<InstanceType<typeof DataPanel>>()

    // Resizable sidebar logic
    const leftSidebarWidth = ref(240)
    const chartTypeColWidth = ref(260)
    const resizing = ref<'left' | 'chartType' | null>(null)
    const startX = ref(0)
    const startWidth = ref(0)

    // Drag preview state
    const showDragPreview = ref(false)
    const dragPreviewStyle = ref({
      left: 0,
      top: 0,
      width: 0,
      height: 0
    })

    // Add table chart type to chartTypes
    const updatedChartTypes = [
      ...chartTypes,
      { value: 'table', label: 'Table', icon: TableCellsIcon }
    ]

    // Methods
    const startResizing = (which: 'left' | 'chartType') => {
      resizing.value = which
      startX.value = window.event instanceof MouseEvent ? window.event.clientX : 0
      startWidth.value = which === 'left' ? leftSidebarWidth.value : chartTypeColWidth.value
      document.addEventListener('mousemove', onResizing)
      document.addEventListener('mouseup', stopResizing)
    }

    const onResizing = (e: MouseEvent) => {
      if (!resizing.value) return
      const dx = e.clientX - startX.value
      if (resizing.value === 'left') {
        let newWidth = startWidth.value + dx
        newWidth = Math.max(180, Math.min(400, newWidth))
        leftSidebarWidth.value = newWidth
      } else if (resizing.value === 'chartType') {
        let newWidth = startWidth.value + dx
        newWidth = Math.max(200, Math.min(400, newWidth))
        chartTypeColWidth.value = newWidth
      }
    }

    const stopResizing = () => {
      resizing.value = null
      document.removeEventListener('mousemove', onResizing)
      document.removeEventListener('mouseup', stopResizing)
    }

    // Add function to check if a field is in use
    const isFieldInUse = (fieldName: string, dataSourceId: string) => {
      if (!selectedChartType.value || !chartConfig.dataSourceId) return false
      
      // Check if the field is from the same data source as the current chart
      if (chartConfig.dataSourceId !== dataSourceId) return false

      // Check if the field is used in any of the chart properties
      if (selectedChartType.value === 'pie') {
        return chartConfig.category === fieldName || chartConfig.value === fieldName
      } else if (selectedChartType.value === 'bar') {
        return (
          chartConfig.xAxis.includes(fieldName) ||
          chartConfig.yAxis === fieldName
        )
      } else if (selectedChartType.value === 'line' || selectedChartType.value === 'scatter') {
        return chartConfig.xAxis.includes(fieldName) || chartConfig.yAxis === fieldName
      } else if (selectedChartType.value === 'card') {
        return chartConfig.keyMetric === fieldName || chartConfig.previousMetric === fieldName
      } else if (selectedChartType.value === 'table') {
        return chartConfig.columns && chartConfig.columns.includes(fieldName)
      }
      return false
    }

    // Data source manager methods
    const openDataSourceManager = () => {
      if (dataPanelRef.value) {
        dataPanelRef.value.openDataSourceManager()
      }
    }

    // Field drag and drop
    const onFieldDragStart = (event: DragEvent, column: DataSourceColumn, dataSourceId: string) => {
      if (event.dataTransfer) {
        event.dataTransfer.setData('text/plain', JSON.stringify({
          name: column.name,
          type: column.type,
          dataSourceId
        }))
      }
    }

    const onFieldDrop = (event: DragEvent, target: 'xAxis' | 'yAxis' | 'category' | 'value' | 'keyMetric' | 'columns') => {
      event.preventDefault()
      if (!event.dataTransfer) return
      try {
        const fieldData = JSON.parse(event.dataTransfer.getData('text/plain'))
        
        // Validate field type for Y-axis (should be numeric)
        if (target === 'yAxis' && fieldData.type !== 'number') {
          alert('Y-axis requires a numeric field')
          return
        }

        // Check if we already have fields from a different data source
        if (chartConfig.dataSourceId && chartConfig.dataSourceId !== fieldData.dataSourceId) {
          if (selectedChartType.value === 'bar' && chartConfig.xAxis.length > 0) {
            alert('Cannot mix fields from different data sources in the same chart')
            return
          }
        }

        if (target === 'xAxis' && selectedChartType.value === 'bar') {
          // Add to array, no duplicates
          if (!chartConfig.xAxis.includes(fieldData.name)) {
            chartConfig.xAxis.push(fieldData.name)
          }
        } else if (target === 'xAxis') {
          chartConfig.xAxis = [fieldData.name]
        } else if (target === 'yAxis') {
          chartConfig.yAxis = fieldData.name
        } else if (target === 'category') {
          chartConfig.category = fieldData.name
        } else if (target === 'value') {
          chartConfig.value = fieldData.name
        } else if (target === 'keyMetric') {
          chartConfig.keyMetric = fieldData.name
        } else if (target === 'columns') {
          // Handle columns for table chart
          if (!Array.isArray(chartConfig.columns)) {
            chartConfig.columns = []
          }
          if (!chartConfig.columns.includes(fieldData.name)) {
            chartConfig.columns.push(fieldData.name)
          }
        }
        
        // Store the data source ID for the chart
        chartConfig.dataSourceId = fieldData.dataSourceId
      } catch (error) {
        console.error('Failed to parse dropped field data:', error)
      }
    }

    // Remove column from table chart
    const removeColumn = (index: number) => {
      if (Array.isArray(chartConfig.columns)) {
        chartConfig.columns.splice(index, 1)
      }
    }

    // Click outside handler for chart menu
    const handleClickOutside = (event: Event) => {
      if (openChartMenuId.value) {
        const target = event.target as HTMLElement
        // Check if the click target is within any chart menu container
        const isWithinChartMenu = target.closest('.chart-menu-container')
        if (!isWithinChartMenu) {
          openChartMenuId.value = null
        }
      }
    }

    // Drag and drop handlers for chart types
    const onDragEnter = (event: DragEvent) => {
      event.preventDefault()
      if (!event.dataTransfer) return
      
      try {
        const data = JSON.parse(event.dataTransfer.getData('application/json'))
        if (data.chartType) {
          showDragPreview.value = true
          updateDragPreviewPosition(event)
        }
      } catch (error) {
        // If we can't parse the data, it might not be a chart type drag
        // We'll still show the preview for any drag operation
        showDragPreview.value = true
        updateDragPreviewPosition(event)
      }
    }

    const onDragLeave = (event: DragEvent) => {
      // Only hide preview if we're leaving the dashboard area completely
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
      const x = event.clientX
      const y = event.clientY
      
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        showDragPreview.value = false
      }
    }

    const updateDragPreviewPosition = (event: DragEvent) => {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      
      // Calculate preview dimensions
      const cellWidth = (window.innerWidth - 240 - 260 - 48) / 12
      const cellHeight = 70 + 10
      const previewWidth = 4 * cellWidth - 24
      const previewHeight = 3 * cellHeight - 24
      
      // Calculate preview position (smooth, centered on mouse)
      let previewLeft = x - (previewWidth / 2)
      let previewTop = y - (previewHeight / 2)
      
      // Check if the preview would go outside the dashboard area
      const dashboardWidth = rect.width - 24
      const dashboardHeight = rect.height - 24
      
      // Constrain preview within dashboard boundaries
      previewLeft = Math.max(12, Math.min(previewLeft, dashboardWidth - previewWidth - 12))
      previewTop = Math.max(12, Math.min(previewTop, dashboardHeight - previewHeight - 12))
      
      // Check if preview is within boundaries
      const isWithinBoundaries = 
        previewLeft >= 12 && 
        previewTop >= 12 && 
        previewLeft + previewWidth <= dashboardWidth - 12 && 
        previewTop + previewHeight <= dashboardHeight - 12
      
      // Hide preview if outside boundaries
      if (!isWithinBoundaries) {
        showDragPreview.value = false
        return
      }
      
      // Update preview position
      dragPreviewStyle.value = {
        left: previewLeft,
        top: previewTop,
        width: previewWidth,
        height: previewHeight
      }
      
      // Show preview if it was hidden and now is within boundaries
      if (!showDragPreview.value) {
        showDragPreview.value = true
      }
    }

    const onChartTypeDrop = (event: DragEvent) => {
      event.preventDefault()
      showDragPreview.value = false // Hide preview when dropping
      
      if (!event.dataTransfer) return
      
      try {
        const data = JSON.parse(event.dataTransfer.getData('application/json'))
        if (data.chartType) {
          // Get mouse position relative to the dashboard area
          const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
          const x = event.clientX - rect.left
          const y = event.clientY - rect.top
          createEmptyChart(data.chartType, x, y)
        }
      } catch (error) {
        console.error('Failed to parse dropped chart type data:', error)
      }
    }

    const onDragOver = (event: DragEvent) => {
      event.preventDefault()
      if (showDragPreview.value) {
        updateDragPreviewPosition(event)
      }
    }

    // Load dashboard on mount
    onMounted(async () => {
      // Inject dependencies into composables
      injectTabDependencies(currentDashboardId, initializeGridStack)
      injectChartDependencies(currentDashboardId, initializeGridStack)
      injectGridDependencies(currentDashboardId)
      
      const dashboardId = route.query.id as string | undefined
      if (dashboardId) {
        // Load dashboard for editing
        await loadDashboard(dashboardId)
        
        // Load tabs
        const dashboard = dataSourceStore.getDashboardById?.(dashboardId)
        if (dashboard?.tabs && dashboard.tabs.length > 0) {
          loadTabs(dashboard.tabs)
        }
        
        await nextTick()
        initializeGridStack()
      }
      
      // Add click outside listener for chart menu
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      destroyGridStack()
      document.removeEventListener('mousemove', onResizing)
      document.removeEventListener('mouseup', stopResizing)
      document.removeEventListener('click', handleClickOutside)
    })

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
      editingTabId,
      editingTabName,
      tabHoverId,
      showDashboardTabs,
      chartConfig,
      selectedChartType,
      editingChartId,
      openChartMenuId,
      // Use updated chart types with table
      chartTypes: updatedChartTypes,
      colorSchemes,
      colorPalettes,
      gridStackRef,
      dataPanelRef,
      leftSidebarWidth,
      chartTypeColWidth,
      resizing,
      startX,
      startWidth,
      showDragPreview,
      dragPreviewStyle,
      
      // Computed
      hasUnsavedChanges,
      charts,
      isChartConfigValid,
      
      // Methods
      saveDashboard,
      loadDashboard,
      createTemporaryDashboard,
      toggleDataSource,
      updateSelectedDataSources,
      onUpdateDashboardInfo,
      showToastNotification,
      hideToast,
      goBack,
      addTab,
      removeTab,
      startRenameTab,
      finishRenameTab,
      cancelRenameTab,
      handleTabEditKey,
      handleToggleDashboardTabs,
      resetChartConfig,
      addOrUpdateChart,
      addChart,
      editChart,
      removeChart,
      cancelEdit,
      exportChart,
      toggleChartMenu,
      createEmptyChart,
      initializeGridStack,
      isFieldInUse,
      openDataSourceManager,
      onFieldDragStart,
      onFieldDrop,
      removeColumn,
      handleClickOutside,
      onDragEnter,
      onDragLeave,
      updateDragPreviewPosition,
      onChartTypeDrop,
      onDragOver,
      startResizing,
      onResizing,
      stopResizing
    }
  }
}