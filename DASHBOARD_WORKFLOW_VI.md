# Tài liệu Luồng Xử Lý Dashboard

## Tổng quan
Tài liệu này mô tả chi tiết các luồng xử lý chính trong hệ thống Business Intelligence Dashboard, bao gồm việc tạo dashboard mới, tạo và cấu hình chart, cũng như mở dashboard đã lưu trước đó.

## 1. Luồng Tạo Dashboard Mới

### 1.1 Khởi tạo Dashboard
- **Bước 1**: Người dùng truy cập vào trang QuickDashboard
- **Bước 2**: Hệ thống khởi tạo với trạng thái mặc định:
  - `currentDashboardId = null` (chưa có dashboard)
  - `dashboardName = ''` (tên dashboard trống)
  - `charts = []` (danh sách chart rỗng)
  - `dashboardTabs = [{ id: nanoid(), name: 'Tab 1', chartIds: [] }]` (tab mặc định)

### 1.2 Tạo Dashboard Tạm Thời
- **Bước 3**: Khi người dùng thực hiện hành động đầu tiên (thêm chart hoặc lưu):
  ```typescript
  if (!currentDashboardId.value) {
    const tempDashboard = dashboardStore.createDashboard('Untitled Dashboard')
    currentDashboardId.value = tempDashboard.id
    dashboardName.value = tempDashboard.name
  }
  ```

### 1.3 Lưu Dashboard Chính Thức
- **Bước 4**: Khi người dùng nhấn "Save Dashboard":
  ```typescript
  const saveDashboard = () => {
    if (!dashboardName.value) return
    
    const dataSourceIds = selectedDataSources.value.map(ds => ds.id)
    
    if (currentDashboardId.value) {
      // Cập nhật dashboard hiện tại
      dashboardStore.updateDashboard(currentDashboardId.value, {
        name: dashboardName.value,
        description: dashboardDescription.value,
        category: dashboardCategory.value,
        dataSourceIds
      })
      dashboard.tabs = dashboardTabs.value
    } else {
      // Tạo dashboard mới
      const dashboard = dashboardStore.createDashboard(
        dashboardName.value, 
        dashboardDescription.value, 
        dataSourceIds, 
        dashboardCategory.value
      )
      currentDashboardId.value = dashboard.id
      dashboard.tabs = dashboardTabs.value
    }
  }
  ```

## 2. Luồng Tạo và Cấu Hình Chart

### 2.1 Tạo Chart Mới

#### 2.1.1 Tạo Chart bằng Drag & Drop
- **Bước 1**: Người dùng kéo chart type từ ChartPanel vào dashboard area
- **Bước 2**: Hệ thống xử lý sự kiện `onChartTypeDrop`:
  ```typescript
  const onChartTypeDrop = (event: DragEvent) => {
    const data = JSON.parse(event.dataTransfer.getData('application/json'))
    if (data.chartType) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      createEmptyChart(data.chartType, x, y)
    }
  }
  ```

- **Bước 3**: Tạo chart với cấu hình mặc định:
  ```typescript
  const createEmptyChart = (chartType: string, mouseX?: number, mouseY?: number) => {
    // Tạo dashboard tạm thời nếu chưa có
    if (!currentDashboardId.value) {
      const tempDashboard = dashboardStore.createDashboard('Untitled Dashboard')
      currentDashboardId.value = tempDashboard.id
      dashboardName.value = tempDashboard.name
    }
    
    // Tạo chart theo loại
    let newChart: DashboardChart
    switch (chartType) {
      case 'bar':
        newChart = createBarChart({
          title: 'Bar Chart',
          dataSourceId: '',
          xAxis: [],
          yAxis: '',
          colorScheme: 'default'
        })
        break
      // ... các loại chart khác
    }
    
    // Cập nhật layout dựa trên vị trí chuột
    newChart.layout = { x: gridX, y: gridY, w: 4, h: 3 }
    
    // Thêm chart vào dashboard
    const savedChart = dashboardStore.addChart(currentDashboardId.value, newChart)
    
    // Thêm chart vào tab hiện tại
    const activeTab = dashboardTabs.value.find(t => t.id === activeTabId.value)
    if (activeTab) {
      activeTab.chartIds.push(savedChart.id)
    }
  }
  ```

#### 2.1.2 Tạo Chart bằng "Add Chart" Button
- **Bước 1**: Người dùng chọn chart type trong ChartPanel
- **Bước 2**: Cấu hình chart properties
- **Bước 3**: Nhấn "Add Chart" để tạo:
  ```typescript
  function addChart() {
    if (!isChartConfigValid.value) return
    
    // Tạo dashboard tạm thời nếu chưa có
    if (!currentDashboardId.value) {
      const tempDashboard = dashboardStore.createDashboard('Untitled Dashboard')
      currentDashboardId.value = tempDashboard.id
      dashboardName.value = tempDashboard.name
    }
    
    // Tạo chart theo cấu hình
    let newChart: DashboardChart
    switch (selectedChartType.value) {
      case 'bar':
        newChart = createBarChart({
          title: chartConfig.title,
          dataSourceId: chartConfig.dataSourceId,
          xAxis: chartConfig.xAxis,
          yAxis: chartConfig.yAxis,
          horizontal: chartConfig.horizontal,
          colorScheme: chartConfig.colorScheme
        })
        break
      // ... các loại chart khác
    }
    
    // Thêm chart vào dashboard
    const savedChart = dashboardStore.addChart(currentDashboardId.value, newChart)
    
    // Thêm chart vào tab hiện tại
    const activeTab = dashboardTabs.value.find(t => t.id === activeTabId.value)
    if (activeTab) {
      activeTab.chartIds.push(savedChart.id)
    }
  }
  ```

### 2.2 Cấu Hình Chart

#### 2.2.1 Cấu Hình Cơ Bản
- **Title**: Tên hiển thị của chart (tùy chọn)
- **Data Source**: Nguồn dữ liệu cho chart
- **Color Scheme**: Bảng màu (default, pastel, vivid, earth)
- **Background Color**: Màu nền
- **Border Color**: Màu viền

#### 2.2.2 Cấu Hình Theo Loại Chart

**Bar Chart:**
- X-Axis: Trục ngang (có thể chọn nhiều field)
- Y-Axis: Trục dọc (phải là field số)
- Horizontal: Hiển thị ngang hay dọc

**Line Chart:**
- X-Axis: Trục ngang (một field)
- Y-Axis: Trục dọc (field số)
- Smooth: Đường cong mượt
- Fill Area: Tô màu vùng dưới đường

**Pie Chart:**
- Category: Field phân loại
- Value: Field giá trị (số)

**Scatter Chart:**
- X-Axis: Trục ngang (field số)
- Y-Axis: Trục dọc (field số)

**Card Chart:**
- Key Metric: Chỉ số chính
- Previous Metric: Chỉ số so sánh
- Difference Type: Loại so sánh (percentage/absolute)
- Aggregation: Phép tính (sum/avg/count/min/max)

### 2.3 Cập Nhật Chart
```typescript
function addOrUpdateChart() {
  if (editingChartId.value) {
    // Cập nhật chart hiện tại
    const dashboard = dashboardStore.getDashboardById(currentDashboardId.value)
    if (dashboard) {
      const chart = dashboard.charts.find(c => c.id === editingChartId.value)
      if (chart) {
        const updates: Partial<DashboardChart> = {
          base: {
            title: chartConfig.title,
            dataSourceId: chartConfig.dataSourceId,
            backgroundColor: chartConfig.backgroundColor,
            borderColor: chartConfig.borderColor,
            colorScheme: chartConfig.colorScheme
          }
        }
        
        // Cập nhật properties theo loại chart
        switch (selectedChartType.value) {
          case 'bar':
            updates.properties = { 
              bar: { 
                xAxis: chartConfig.xAxis, 
                yAxis: chartConfig.yAxis, 
                horizontal: chartConfig.horizontal 
              } 
            }
            break
          // ... các loại khác
        }
        
        dashboardStore.updateChart(currentDashboardId.value, editingChartId.value, updates)
      }
    }
  } else {
    // Thêm chart mới
    addChart()
  }
}
```

## 3. Luồng Mở Dashboard Đã Lưu

### 3.1 Khởi Tạo Trang
```typescript
onMounted(async () => {
  const dashboardId = route.query.id as string | undefined
  if (dashboardId) {
    // Load dashboard để chỉnh sửa
    const dashboard = dashboardStore.getDashboardById(dashboardId)
    if (dashboard) {
      currentDashboardId.value = dashboardId
      dashboardName.value = dashboard.name
      dashboardDescription.value = dashboard.description || ''
      dashboardCategory.value = dashboard.category || ''
      
      // Khôi phục data sources đã chọn
      if (dashboard.dataSourceIds && dashboard.dataSourceIds.length > 0) {
        selectedDataSources.value = dataSourceStore.dataSources.filter(
          ds => dashboard.dataSourceIds!.includes(ds.id)
        )
      }
      
      // Load tabs
      if (dashboard.tabs && dashboard.tabs.length > 0) {
        dashboardTabs.value = dashboard.tabs
        activeTabId.value = dashboardTabs.value[0].id
      }
      
      await nextTick()
      initializeGridStack()
    }
  }
})
```

### 3.2 Khôi Phục Trạng Thái
- **Dashboard Info**: Tên, mô tả, danh mục
- **Data Sources**: Các nguồn dữ liệu đã liên kết
- **Tabs**: Các tab và chart trong mỗi tab
- **Charts**: Tất cả chart với cấu hình và layout
- **GridStack**: Vị trí và kích thước của các chart

### 3.3 Hiển Thị Charts
```typescript
const charts = computed(() => {
  const dashboard = currentDashboardId.value ? 
    dashboardStore.getDashboardById(currentDashboardId.value) : null
  if (!dashboard) return []
  
  const activeTab = dashboardTabs.value.find(t => t.id === activeTabId.value)
  if (!activeTab) return []
  
  return dashboard.charts.filter(chart => activeTab.chartIds.includes(chart.id))
})
```

## 4. Lưu Trữ Dữ Liệu

### 4.1 Local Storage
```typescript
const saveToStorage = () => {
  localStorage.setItem('bi-dashboards', JSON.stringify(dashboards.value))
}

const loadFromStorage = () => {
  const stored = localStorage.getItem('bi-dashboards')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      dashboards.value = parsed.map((dashboard: any) => ({
        ...dashboard,
        createdAt: new Date(dashboard.createdAt),
        charts: dashboard.charts?.map((chart: any) => ({
          ...chart,
          createdAt: new Date(chart.createdAt),
          updatedAt: chart.updatedAt ? new Date(chart.updatedAt) : undefined
        })) || [],
        dataSourceIds: dashboard.dataSourceIds || []
      }))
    } catch (e) {
      console.error('Failed to load dashboards from storage:', e)
    }
  }
}
```

### 4.2 Cấu Trúc Dữ Liệu
```typescript
interface Dashboard {
  id: string
  name: string
  description?: string
  category?: string
  charts: DashboardChart[]
  tabs: DashboardTab[]
  dataSourceIds: string[]
  createdAt: Date
  updatedAt?: Date
}

interface DashboardChart {
  id: string
  dashboardId: string
  type: ChartType
  base: BaseChartProperties
  properties: ChartTypeProperties
  layout: { x: number, y: number, w: number, h: number }
  createdAt: Date
  updatedAt?: Date
}
```

## 5. Quản Lý Layout

### 5.1 GridStack Integration
```typescript
function initializeGridStack() {
  if (!gridStackContainer.value || charts.value.length === 0) return

  gridStack = GridStack.init({
    cellHeight: 70,
    margin: 10,
    minRow: 1,
    animate: true,
    resizable: { handles: 'e, se, s, sw, w' },
    draggable: { handle: '.grid-stack-item-content', scroll: false }
  }, gridStackContainer.value)

  // Lắng nghe thay đổi layout
  gridStack.on('change', (event, items) => {
    items.forEach(item => {
      if (currentDashboardId.value && item.id) {
        dashboardStore.updateChartLayout(currentDashboardId.value, item.id, {
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h
        })
      }
    })
  })
}
```

### 5.2 Cập Nhật Layout
```typescript
const updateChartLayout = (dashboardId: string, chartId: string, layout: { x: number, y: number, w: number, h: number }) => {
  const dashboard = dashboards.value.find(d => d.id === dashboardId)
  if (dashboard) {
    const chart = dashboard.charts.find(c => c.id === chartId)
    if (chart) {
      chart.layout = layout
      chart.updatedAt = new Date()
      saveToStorage()
    }
  }
}
```

## 6. Quản Lý Tab

### 6.1 Thêm Tab Mới
```typescript
function addTab() {
  const newTab = { 
    id: nanoid(), 
    name: `Tab ${dashboardTabs.value.length + 1}`, 
    chartIds: [] 
  }
  dashboardTabs.value.push(newTab)
  activeTabId.value = newTab.id
  nextTick(() => initializeGridStack())
}
```

### 6.2 Xóa Tab
```typescript
function removeTab(tabId: string) {
  if (dashboardTabs.value.length === 1) return
  const tab = dashboardTabs.value.find(t => t.id === tabId)
  if (!tab) return
  
  if (confirm(`Are you sure you want to remove the tab "${tab.name}" and all its charts?`)) {
    const idx = dashboardTabs.value.findIndex(t => t.id === tabId)
    dashboardTabs.value.splice(idx, 1)
    if (activeTabId.value === tabId) {
      activeTabId.value = dashboardTabs.value[Math.max(0, idx - 1)].id
      nextTick(() => initializeGridStack())
    }
  }
}
```

## 7. Xử Lý Lỗi và Validation

### 7.1 Validation Chart Config
```typescript
const isChartConfigValid = computed(() => {
  if (!selectedChartType.value) return false
  
  // Cho phép tạo chart mà không cần dữ liệu ban đầu
  switch (selectedChartType.value) {
    case 'bar':
    case 'line':
    case 'pie':
    case 'scatter':
    case 'card':
      return true
    default:
      return false
  }
})
```

### 7.2 Toast Notifications
```typescript
function showToastNotification(type: 'success' | 'warning' | 'error' | 'info', title: string, message?: string) {
  toastType.value = type
  toastTitle.value = title
  toastMessage.value = message || ''
  showToast.value = true
  
  setTimeout(() => {
    hideToast()
  }, 3000)
}
```

## 8. Kết Luận

Hệ thống dashboard được thiết kế với kiến trúc linh hoạt, cho phép:
- Tạo dashboard mới với quy trình đơn giản
- Tạo và cấu hình chart theo nhiều cách khác nhau
- Lưu trữ và khôi phục trạng thái hoàn chỉnh
- Quản lý layout linh hoạt với GridStack
- Hỗ trợ nhiều tab để tổ chức chart
- Validation và xử lý lỗi toàn diện

Tất cả các thao tác đều được lưu trữ trong localStorage để đảm bảo dữ liệu không bị mất khi refresh trang. 