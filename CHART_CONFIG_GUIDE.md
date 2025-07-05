# Hướng Dẫn Chart Configuration System

## Tổng Quan

Hệ thống `chartConfig` được thiết kế để cung cấp type safety cho các loại chart khác nhau. Mỗi loại chart có cấu hình riêng biệt nhưng chia sẻ một số thuộc tính chung.

## Cách ChartConfig Hoạt Động

### 1. Cấu Trúc Cơ Bản

```typescript
// Base configuration cho tất cả chart types
interface BaseChartConfig {
  title: string           // Tiêu đề chart
  dataSourceId: string    // ID của data source
  backgroundColor: string // Màu nền
  borderColor: string     // Màu viền
  colorScheme: string     // Bảng màu
}
```

### 2. Chart-Specific Configurations

Mỗi loại chart có interface riêng kế thừa từ `BaseChartConfig`:

```typescript
// Bar Chart
interface BarChartConfig extends BaseChartConfig {
  type: 'bar'
  xAxis: string[]         // Trục X (dimensions)
  yAxis: string[]         // Trục Y (values)
  horizontal: boolean     // Bar ngang hay dọc
  stackedDimension: string[] // Dimension để stack
  stacked?: boolean       // Có stack hay không
  sortXAxisBy?: string    // Sắp xếp theo field nào
  sortDescending?: boolean // Sắp xếp giảm dần
  filter?: string         // Filter expression
  showLegend?: boolean    // Hiển thị legend
}

// Pie Chart
interface PieChartConfig extends BaseChartConfig {
  type: 'pie'
  category: string        // Field category
  value: string          // Field value
  donut?: boolean        // Có phải donut chart
}

// Line Chart
interface LineChartConfig extends BaseChartConfig {
  type: 'line'
  xAxis: string[]        // Trục X
  yAxis: string[]        // Trục Y
  smooth: boolean        // Đường mượt
  fillArea: boolean      // Tô màu vùng dưới
}

// Scatter Chart
interface ScatterChartConfig extends BaseChartConfig {
  type: 'scatter'
  xAxis: string[]        // Trục X
  yAxis: string[]        // Trục Y
  size?: string          // Field cho kích thước điểm
}

// Card/KPI Chart
interface CardChartConfig extends BaseChartConfig {
  type: 'card'
  keyMetric: string      // Metric chính
  previousMetric: string // Metric so sánh
  differenceType: 'absolute' | 'percentage' // Loại so sánh
  aggregation: 'sum' | 'avg' | 'count' | 'min' | 'max' // Phép tính
}
```

### 3. Union Type

```typescript
type ChartConfig = 
  | BarChartConfig 
  | PieChartConfig 
  | LineChartConfig 
  | ScatterChartConfig 
  | CardChartConfig
```

### 4. Type Guards

Để kiểm tra loại chart một cách an toàn:

```typescript
function isBarChartConfig(config: ChartConfig): config is BarChartConfig {
  return config.type === 'bar'
}

// Sử dụng
if (isBarChartConfig(chartConfig)) {
  // TypeScript biết đây là BarChartConfig
  chartConfig.xAxis.push('field')
}
```

### 5. Helper Functions

```typescript
// Tạo config mặc định cho chart type
const config = createDefaultChartConfig('bar')

// Reset config về mặc định
resetChartConfig(existingConfig)

// Kiểm tra config có hợp lệ
const isValid = isChartConfigValid(config)
```

## Cách Sử Dụng Trong Components

### 1. Trong QuickDashboard.vue

```typescript
// Khai báo
const chartConfig = ref<ChartConfig | null>(null)

// Tạo chart mới
const createEmptyChart = (chartType: ChartType) => {
  chartConfig.value = createDefaultChartConfig(chartType)
}

// Xử lý field drop
const onFieldDrop = (event: DragEvent, target: string) => {
  if (!chartConfig.value) return
  
  if (isBarChartConfig(chartConfig.value)) {
    if (target === 'xAxis') {
      chartConfig.value.xAxis.push(fieldName)
    }
  }
}
```

### 2. Trong ChartPanel.vue

```typescript
// Props
const props = defineProps<{
  chartConfig: ChartConfig | null
}>()

// Computed properties cho two-way binding
const chartTitle = computed({
  get: () => props.chartConfig?.title || '',
  set: (value: string) => {
    if (props.chartConfig) props.chartConfig.title = value
  }
})

// Template với type guards
<template>
  <div v-if="chartConfig && isBarChartConfig(chartConfig)">
    <input v-model="chartConfig.xAxis" />
  </div>
</template>
```

## Hướng Dẫn Thêm Chart Type Mới

### Bước 1: Định Nghĩa Interface

Thêm interface mới vào `src/types/chartConfig.ts`:

```typescript
// Ví dụ: Area Chart
export interface AreaChartConfig extends BaseChartConfig {
  type: 'area'
  xAxis: string[]
  yAxis: string[]
  stacked: boolean
  gradient: boolean
  opacity: number
}
```

### Bước 2: Cập Nhật Union Type

```typescript
export type ChartConfig = 
  | BarChartConfig 
  | PieChartConfig 
  | LineChartConfig 
  | ScatterChartConfig 
  | CardChartConfig
  | AreaChartConfig  // Thêm vào đây
```

### Bước 3: Thêm Type Guard

```typescript
export function isAreaChartConfig(config: ChartConfig): config is AreaChartConfig {
  return config.type === 'area'
}
```

### Bước 4: Cập Nhật Helper Functions

```typescript
export function createDefaultChartConfig(type: ChartType): ChartConfig {
  const baseConfig = {
    title: '',
    dataSourceId: '',
    backgroundColor: '#3b82f6',
    borderColor: '#1d4ed8',
    colorScheme: 'default'
  }

  switch (type) {
    // ... existing cases
    
    case 'area':
      return {
        ...baseConfig,
        type: 'area',
        xAxis: [],
        yAxis: [],
        stacked: false,
        gradient: true,
        opacity: 0.7
      }
    
    default:
      throw new Error(`Unsupported chart type: ${type}`)
  }
}

export function isChartConfigValid(config: ChartConfig): boolean {
  if (!config.title || !config.dataSourceId) return false
  
  switch (config.type) {
    // ... existing cases
    
    case 'area':
      return config.xAxis.length > 0 && config.yAxis.length > 0
    
    default:
      return false
  }
}
```

### Bước 5: Cập Nhật Chart Type Constants

Thêm vào `src/types/chart.ts`:

```typescript
export type ChartType = 'bar' | 'line' | 'pie' | 'scatter' | 'card' | 'area'

export const CHART_TYPES = [
  { value: 'bar', label: 'Bar Chart', icon: ChartBarIcon },
  { value: 'line', label: 'Line Chart', icon: PresentationChartLineIcon },
  { value: 'pie', label: 'Pie Chart', icon: ChartPieIcon },
  { value: 'scatter', label: 'Scatter Plot', icon: CircleStackIcon },
  { value: 'card', label: 'KPI Card', icon: DocumentCheckIcon },
  { value: 'area', label: 'Area Chart', icon: AreaChartIcon } // Thêm vào đây
] as const
```

### Bước 6: Cập Nhật Dashboard Types

Thêm vào `src/types/dashboard.ts`:

```typescript
export function createAreaChart(config: AreaChartConfig): DashboardChart {
  return {
    id: nanoid(),
    type: 'area',
    base: {
      title: config.title,
      dataSourceId: config.dataSourceId,
      backgroundColor: config.backgroundColor,
      borderColor: config.borderColor,
      colorScheme: config.colorScheme
    },
    properties: {
      area: {
        xAxis: config.xAxis,
        yAxis: config.yAxis,
        stacked: config.stacked,
        gradient: config.gradient,
        opacity: config.opacity
      }
    },
    layout: { x: 0, y: 0, w: 6, h: 4 },
    createdAt: new Date(),
    updatedAt: new Date()
  }
}
```

### Bước 7: Cập Nhật Components

#### QuickDashboard.vue

```typescript
// Import
import { createAreaChart } from '@/types/dashboard'
import { isAreaChartConfig } from '@/types/chartConfig'

// Trong addChart function
case 'area':
  if (isAreaChartConfig(chartConfig.value)) {
    newChart = createAreaChart({
      title: chartConfig.value.title,
      dataSourceId: chartConfig.value.dataSourceId,
      xAxis: chartConfig.value.xAxis,
      yAxis: chartConfig.value.yAxis,
      stacked: chartConfig.value.stacked,
      gradient: chartConfig.value.gradient,
      opacity: chartConfig.value.opacity,
      backgroundColor: chartConfig.value.backgroundColor,
      borderColor: chartConfig.value.borderColor,
      colorScheme: chartConfig.value.colorScheme
    })
  }
  break
```

#### ChartPanel.vue

```typescript
// Thêm computed properties
const areaStacked = computed({
  get: () => (props.chartConfig && isAreaChartConfig(props.chartConfig) ? props.chartConfig.stacked : false),
  set: (value: boolean) => {
    if (props.chartConfig && isAreaChartConfig(props.chartConfig)) props.chartConfig.stacked = value
  }
})

// Template
<template v-if="selectedChartType === 'area'">
  <div class="space-y-2">
    <div>
      <label>X-Axis</label>
      <div @drop="$emit('field-drop', $event, 'xAxis')" @dragover.prevent>
        <template v-if="chartConfig && isAreaChartConfig(chartConfig) && chartConfig.xAxis.length > 0">
          <span v-for="field in chartConfig.xAxis" :key="field">{{ field }}</span>
        </template>
      </div>
    </div>
    <div>
      <label>Y-Axis</label>
      <div @drop="$emit('field-drop', $event, 'yAxis')" @dragover.prevent>
        <template v-if="chartConfig && isAreaChartConfig(chartConfig) && chartConfig.yAxis.length > 0">
          <span v-for="field in chartConfig.yAxis" :key="field">{{ field }}</span>
        </template>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <input type="checkbox" v-model="areaStacked" />
      <label>Stacked</label>
    </div>
  </div>
</template>
```

### Bước 8: Cập Nhật Chart Preview Component

Tạo component hiển thị cho chart mới trong `src/components/charts/`:

```vue
<!-- AreaChart.vue -->
<template>
  <div class="area-chart">
    <!-- Implementation -->
  </div>
</template>

<script setup lang="ts">
import type { AreaChartConfig } from '@/types/chartConfig'

defineProps<{
  config: AreaChartConfig
  data: any[]
}>()
</script>
```

## Best Practices

### 1. Type Safety
- Luôn sử dụng type guards khi truy cập chart-specific properties
- Không bao giờ cast type trực tiếp

### 2. Validation
- Implement validation logic trong `isChartConfigValid`
- Kiểm tra required fields cho mỗi chart type

### 3. Default Values
- Cung cấp default values hợp lý trong `createDefaultChartConfig`
- Đảm bảo tất cả optional properties có giá trị mặc định

### 4. Error Handling
- Xử lý trường hợp config null/undefined
- Provide meaningful error messages

### 5. Performance
- Sử dụng computed properties cho two-way binding
- Tránh re-render không cần thiết

## Ví Dụ Hoàn Chỉnh

Xem file `src/types/chartConfig.ts` để tham khảo implementation đầy đủ của tất cả chart types hiện tại.

## Troubleshooting

### Lỗi Thường Gặp

1. **Type Error: Property does not exist**
   - Sử dụng type guard trước khi truy cập properties
   - Kiểm tra config không null

2. **Vue v-model Error**
   - Sử dụng computed properties thay vì complex expressions
   - Đảm bảo two-way binding hoạt động đúng

3. **Runtime Error: Cannot read property**
   - Kiểm tra null/undefined trước khi truy cập
   - Sử dụng optional chaining (`?.`)

### Debug Tips

```typescript
// Debug chart config
console.log('Chart Config:', chartConfig)
console.log('Chart Type:', chartConfig?.type)

// Check type guard
if (isBarChartConfig(chartConfig)) {
  console.log('Is Bar Chart:', true)
  console.log('X-Axis:', chartConfig.xAxis)
}
``` 