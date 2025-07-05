# Chart Strategy Pattern Implementation Guide

## Tổng quan

Hệ thống chart configuration đã được refactor để sử dụng **Strategy Pattern** và **Factory Pattern**, giúp code dễ maintain và extend hơn.

## Kiến trúc

### 1. Strategy Pattern Structure

```
src/
├── strategies/
│   ├── ChartStrategy.ts          # Interface định nghĩa strategy
│   ├── BarChartStrategy.ts       # Strategy cho Bar Chart
│   ├── PieChartStrategy.ts       # Strategy cho Pie Chart
│   ├── LineChartStrategy.ts      # Strategy cho Line Chart
│   ├── ScatterChartStrategy.ts   # Strategy cho Scatter Chart
│   ├── CardChartStrategy.ts      # Strategy cho Card Chart
│   └── index.ts                  # Strategy Registry
├── factories/
│   ├── ChartConfigFactory.ts     # Factory để tạo và validate config
│   ├── ChartComponentFactory.ts  # Factory để lấy chart components
│   └── index.ts                  # Factory exports
└── types/
    └── chart.ts                  # Type definitions
```

### 2. Core Components

#### ChartStrategy Interface
```typescript
export interface ChartStrategy {
  type: ChartType
  createDefaultConfig(): ChartConfig
  validateConfig(config: ChartConfig): boolean
  getRequiredFields(): string[]
  getOptionalFields(): string[]
  getDefaultLayout(): { w: number; h: number }
  getSupportedDataTypes(): ('string' | 'number' | 'date')[]
}
```

#### Strategy Registry
```typescript
class ChartStrategyRegistry {
  private strategies = new Map<ChartType, ChartStrategy>()
  
  register(strategy: ChartStrategy): void
  get(type: ChartType): ChartStrategy | undefined
  getAll(): ChartStrategy[]
  getTypes(): ChartType[]
  has(type: ChartType): boolean
}
```

#### Chart Config Factory
```typescript
export class ChartConfigFactory {
  static createConfig(type: ChartType): ChartConfig
  static validateConfig(config: ChartConfig): boolean
  static getRequiredFields(type: ChartType): string[]
  static getOptionalFields(type: ChartType): string[]
  static getDefaultLayout(type: ChartType): { w: number; h: number }
  static getSupportedDataTypes(type: ChartType): ('string' | 'number' | 'date')[]
  static getAvailableTypes(): ChartType[]
  static isTypeSupported(type: ChartType): boolean
}
```

## Cách sử dụng

### 1. Tạo Chart Config mới
```typescript
import { ChartConfigFactory } from '@/factories'

// Tạo config mặc định cho Bar Chart
const barConfig = ChartConfigFactory.createConfig('bar')

// Tạo config mặc định cho Pie Chart
const pieConfig = ChartConfigFactory.createConfig('pie')
```

### 2. Validate Chart Config
```typescript
// Kiểm tra config có hợp lệ không
const isValid = ChartConfigFactory.validateConfig(chartConfig)

// Lấy danh sách fields bắt buộc
const requiredFields = ChartConfigFactory.getRequiredFields('bar')
// Returns: ['xAxis', 'yAxis']

// Lấy danh sách fields tùy chọn
const optionalFields = ChartConfigFactory.getOptionalFields('bar')
// Returns: ['horizontal', 'stackedDimension', 'stacked', ...]
```

### 3. Lấy thông tin Chart Type
```typescript
// Lấy layout mặc định
const layout = ChartConfigFactory.getDefaultLayout('bar')
// Returns: { w: 6, h: 4 }

// Lấy data types được support
const dataTypes = ChartConfigFactory.getSupportedDataTypes('bar')
// Returns: ['string', 'number', 'date']

// Lấy tất cả chart types có sẵn
const availableTypes = ChartConfigFactory.getAvailableTypes()
// Returns: ['bar', 'pie', 'line', 'scatter', 'card']
```

## Thêm Chart Type mới

### Bước 1: Tạo Strategy Class
```typescript
// src/strategies/AreaChartStrategy.ts
import type { ChartStrategy, ChartConfig } from './ChartStrategy'

export class AreaChartStrategy implements ChartStrategy {
  type = 'area' as const
  
  createDefaultConfig(): ChartConfig {
    return {
      type: 'area',
      title: '',
      dataSourceId: '',
      backgroundColor: '#3b82f6',
      borderColor: '#1d4ed8',
      colorScheme: 'default',
      xAxis: [],
      yAxis: [],
      showLegend: true,
      fillOpacity: 0.3,
      smooth: false,
      stacked: false,
      sortXAxisBy: '',
      sortDescending: false,
      filter: ''
    }
  }
  
  validateConfig(config: ChartConfig): boolean {
    return !!(config.title && config.dataSourceId && 
              config.xAxis?.length > 0 && config.yAxis?.length > 0)
  }
  
  getRequiredFields(): string[] {
    return ['xAxis', 'yAxis']
  }
  
  getOptionalFields(): string[] {
    return ['showLegend', 'fillOpacity', 'smooth', 'stacked', 
            'sortXAxisBy', 'sortDescending', 'filter']
  }
  
  getDefaultLayout() {
    return { w: 6, h: 4 }
  }
  
  getSupportedDataTypes() {
    return ['string', 'number', 'date'] as const
  }
}
```

### Bước 2: Đăng ký Strategy
```typescript
// src/strategies/index.ts
import { AreaChartStrategy } from './AreaChartStrategy'

class ChartStrategyRegistry {
  constructor() {
    // ... existing registrations
    this.register(new AreaChartStrategy())
  }
}
```

### Bước 3: Cập nhật ChartType
```typescript
// src/types/chart.ts
export type ChartType = 
  | 'bar' 
  | 'line' 
  | 'pie' 
  | 'scatter' 
  | 'card'
  | 'area'  // Thêm type mới
```

### Bước 4: Tạo Chart Component
```vue
<!-- src/components/charts/types/AreaChart.vue -->
<template>
  <div class="area-chart">
    <!-- Chart implementation -->
  </div>
</template>

<script setup lang="ts">
// Component logic
</script>
```

### Bước 5: Đăng ký Component
```typescript
// src/factories/ChartComponentFactory.ts
import AreaChart from '@/components/charts/types/AreaChart.vue'

const chartComponents: Record<ChartType, Component> = {
  // ... existing components
  area: AreaChart
}
```

## Lợi ích của Strategy Pattern

### 1. **Dễ mở rộng**
- Thêm chart type mới chỉ cần tạo 1 strategy class và 1 component
- Không cần sửa code ở nhiều nơi

### 2. **Type Safety**
- Mỗi chart type có config riêng với type checking
- TypeScript có thể validate config đúng cho từng loại chart

### 3. **Maintainability**
- Logic cho mỗi chart type được tách biệt
- Dễ test và debug từng strategy riêng lẻ

### 4. **Polymorphism**
- Tất cả chart types đều implement cùng interface
- Code có thể xử lý chart types một cách uniform

### 5. **Scalability**
- Có thể thêm nhiều chart types mà không ảnh hưởng performance
- Registry pattern cho phép lazy loading strategies

## Demo

Xem file `src/examples/StrategyPatternDemo.vue` để thấy cách sử dụng Strategy Pattern trong thực tế.

## Migration từ code cũ

### Trước (Type-safe approach):
```typescript
// Cần import nhiều type guards
import { 
  isBarChartConfig,
  isPieChartConfig,
  isLineChartConfig,
  // ... nhiều imports
} from '@/types/chartConfig'

// Cần switch case cho mỗi chart type
switch (chartConfig.type) {
  case 'bar':
    if (isBarChartConfig(chartConfig)) {
      // Handle bar chart
    }
    break
  case 'pie':
    if (isPieChartConfig(chartConfig)) {
      // Handle pie chart
    }
    break
  // ... nhiều cases
}
```

### Sau (Strategy Pattern):
```typescript
// Chỉ cần import factory
import { ChartConfigFactory } from '@/factories'

// Tạo config tự động
const config = ChartConfigFactory.createConfig(chartType)

// Validate tự động
const isValid = ChartConfigFactory.validateConfig(config)

// Lấy thông tin tự động
const requiredFields = ChartConfigFactory.getRequiredFields(chartType)
```

## Kết luận

Strategy Pattern đã giải quyết được các vấn đề:
- ✅ **Complexity**: Không cần nhiều type guards và switch cases
- ✅ **Maintainability**: Logic tách biệt, dễ maintain
- ✅ **Extensibility**: Thêm chart type mới rất đơn giản
- ✅ **Type Safety**: Vẫn giữ được type safety
- ✅ **Performance**: Không ảnh hưởng performance

Hệ thống giờ đây có thể scale tốt và dễ dàng thêm chart types mới mà không cần thay đổi code ở nhiều nơi. 