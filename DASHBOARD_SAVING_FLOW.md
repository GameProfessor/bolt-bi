# Dashboard Saving Flow with Multiple Charts

## Overview
This document explains how a dashboard with multiple charts is saved, including the complete flow of chart properties persistence and layout management.

## Data Structure

### 1. Dashboard Structure
```typescript
interface Dashboard {
  id: string
  name: string
  description?: string
  charts: DashboardChart[]         // All charts across all tabs
  tabs: DashboardTab[]             // Tab organization
  createdAt: Date
  dataSourceIds?: string[]         // Associated data sources
  category?: string
}
```

### 2. Chart Structure
```typescript
interface DashboardChart {
  id: string
  dashboardId: string
  type: ChartType
  
  // Base properties
  base: {
    title: string
    dataSourceId: string
    backgroundColor?: string
    borderColor?: string
    colorScheme?: string
  }
  
  // Type-specific properties
  properties: ChartTypeProperties
  
  // Layout properties
  layout: {
    x: number                        // Grid position X
    y: number                        // Grid position Y
    w: number                        // Grid width
    h: number                        // Grid height
  }
  
  createdAt: Date
  updatedAt?: Date
}
```

### 3. Tab Structure
```typescript
interface DashboardTab {
  id: string
  name: string
  chartIds: string[]              // Chart IDs that belong to this tab
}
```

## Complete Saving Flow

### Step 1: Save Dashboard Trigger
```typescript
// User clicks "Save Dashboard" button
const saveDashboard = () => {
  if (!dashboardName.value) return
  
  // Check if there are any charts in any tab
  const hasCharts = dashboardTabs.value.some(tab => tab.chartIds.length > 0)
  if (!hasCharts) return
  
  // Proceed with saving...
}
```

### Step 2: Dashboard Properties Update
```typescript
// Update dashboard metadata
dashboardStore.updateDashboard(currentDashboardId.value, {
  name: dashboardName.value,
  description: dashboardDescription.value,
  category: dashboardCategory.value,
  dataSourceIds: selectedDataSources.value.map(ds => ds.id)
})
```

### Step 3: Clear Existing Data (for updates)
```typescript
// For existing dashboards, clear old data
dashboard.charts.forEach(chart => {
  dashboardStore.removeChart(dashboard.id, chart.id)  // Delete old charts
})
dashboard.charts = []                    // Clear chart references
dashboard.tabs = []                       // Clear tab structure
```

### Step 4: Process Each Tab and Chart
```typescript
dashboardTabs.value.forEach(tab => {
  const tabChartIds: string[] = []
  
  // Process each chart in the tab
  tab.charts.forEach(chartItem => {
    // Step 4a: Create Chart in Dashboard
    const savedChart = dashboardStore.addChart(dashboard.id, {
      type: chartItem.type,
      base: {
        title: chartItem.base.title || defaultTitle,
        dataSourceId: chartItem.base.dataSourceId || '',
        backgroundColor: chartItem.base.backgroundColor || '#3B82F6',
        borderColor: chartItem.base.borderColor || '#1E40AF',
        colorScheme: chartItem.base.colorScheme || 'default'
      },
      properties: chartItem.properties,
      layout: chartItem.layout
    })
    
    // Step 4b: Track Chart for Tab
    tabChartIds.push(savedChart.id)
  })
  
  // Step 4c: Create Tab Entry
  allTabs.push({
    id: tab.id,
    name: tab.name,
    chartIds: tabChartIds
  })
})
```

## Storage Locations

### 1. Dashboard Data (localStorage: 'bi-dashboards')
```json
[
  {
    "id": "1703123456789",
    "name": "Sales Dashboard",
    "description": "Monthly sales overview",
    "category": "Sales",
    "dataSourceIds": ["ds_001", "ds_002"],
    "charts": [
      {
        "id": "chart_001",
        "dashboardId": "1703123456789",
        "type": "bar",
        "base": {
          "title": "Monthly Revenue",
          "dataSourceId": "ds_001",
          "backgroundColor": "#3B82F6",
          "borderColor": "#1E40AF",
          "colorScheme": "default"
        },
        "properties": {
          "bar": {
            "xAxis": ["Month"],
            "yAxis": "Revenue",
            "horizontal": false
          }
        },
        "layout": {
          "x": 0,
          "y": 0,
          "w": 6,
          "h": 4
        },
        "createdAt": "2023-12-21T10:30:00.000Z"
      }
    ],
    "tabs": [
      {
        "id": "tab_001",
        "name": "Overview",
        "chartIds": ["chart_001", "chart_002"]
      },
      {
        "id": "tab_002", 
        "name": "Details",
        "chartIds": ["chart_003"]
      }
    ],
    "createdAt": "2023-12-21T10:30:00.000Z"
  }
]
```

## Chart Properties Saved

### 1. Basic Properties
- **title**: Chart display name
- **type**: Chart type (bar, line, pie, scatter, card)
- **dataSourceId**: Associated data source

### 2. Data Configuration
- **xAxis**: X-axis field(s) - string for single, array for multiple
- **yAxis**: Y-axis field (numeric data)
- **category**: Category field (for pie charts)

### 3. Visual Properties
- **backgroundColor**: Chart background color
- **borderColor**: Chart border color
- **colorScheme**: Color palette (default, pastel, vivid, earth)
- **horizontal**: Bar chart orientation

### 4. Advanced Properties
- **filters**: Chart-specific filters
- **aggregation**: Data aggregation method
- **keyMetric**: For KPI cards
- **previousMetric**: For comparison cards

## Chart Layout Properties

Charts have layout properties that define their position and size in the dashboard grid:

```typescript
layout: {
  x: number,  // Grid column position (0-11 for 12-column grid)
  y: number,  // Grid row position
  w: number,  // Width in grid columns
  h: number   // Height in grid rows
}
```

### Layout Constraints
- **Grid System**: 12-column responsive grid
- **Minimum Size**: 2x2 grid units
- **Maximum Size**: 12x20 grid units
- **Positioning**: Charts can be placed at any valid grid position

## Key Benefits

- Charts are self-contained with all their properties and data
- Tabs organize charts without duplicating chart data
- Layout is managed directly on the chart object
- Simplified data structure with better performance

## Loading Process

### 1. Load Dashboard
```typescript
// Load dashboard metadata
const dashboard = dashboardStore.getDashboardById(dashboardId)

// Restore dashboard properties
dashboardName.value = dashboard.name
dashboardDescription.value = dashboard.description
dashboardCategory.value = dashboard.category
```

### 2. Load Tabs
```typescript
// Restore tab structure
dashboardTabs.value = dashboard.tabs.map(tab => ({
  id: tab.id,
  name: tab.name,
  charts: [] // Will be populated below
}))
```

### 3. Load Charts for Each Tab
```typescript
dashboardTabs.value.forEach(tab => {
  const tabData = dashboard.tabs.find(t => t.id === tab.id)
  if (tabData) {
    // Find charts for this tab
    const tabCharts = dashboard.charts.filter(chart => 
      tabData.chartIds.includes(chart.id)
    )
    
    // Load charts for this tab
    tab.charts = tabCharts.map(chart => {
      const chartData = dashboard.charts.find(c => c.id === chart.id)
      return chartData ? {
        id: chartData.id,
        type: chartData.type,
        base: { ...chartData.base },           // All chart properties
        properties: chartData.properties,
        layout: {                       // Widget layout
          x: chartData.layout.x,
          y: chartData.layout.y,
          w: chartData.layout.w,
          h: chartData.layout.h
        }
      } : null
    }).filter(Boolean)
  }
})
``` 