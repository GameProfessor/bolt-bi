# Hướng Dẫn Thêm Chart Mới

## Tổng Quan

Hệ thống chart đã được migrate sang **Strategy Pattern**, giúp việc thêm chart mới trở nên đơn giản và có cấu trúc rõ ràng. Thay vì phải sửa nhiều file, giờ đây bạn chỉ cần tạo **1 strategy class** và **1 component** để thêm chart mới.

## Kiến Trúc Mới

### Strategy Pattern
- **ChartStrategy Interface**: Định nghĩa tất cả hành vi liên quan đến chart
- **Individual Strategies**: Mỗi loại chart có 1 strategy riêng (BarChartStrategy, PieChartStrategy, etc.)
- **ChartStrategyRegistry**: Registry trung tâm quản lý tất cả strategies
- **ChartUtils**: Các hàm tiện ích cho các thao tác phổ biến

### Lợi Ích
1. **Trách Nhiệm Đơn Lẻ**: Mỗi strategy chỉ xử lý 1 loại chart
2. **Dễ Mở Rộng**: Thêm chart mới chỉ cần tạo 1 strategy class
3. **Type Safety**: Hỗ trợ TypeScript đầy đủ với type guards
4. **Logic Tập Trung**: Tất cả logic chart ở một nơi
5. **API Nhất Quán**: Interface thống nhất cho tất cả chart types

## Các Bước Thêm Chart Mới

### Bước 1: Tạo Strategy Class

Tạo file mới: `src/strategies/NewChartStrategy.ts`

```typescript
import type { ChartStrategy } from './ChartStrategy'
import type { ChartConfig } from '@/types/chart'
import NewChart from '@/components/charts/types/NewChart.vue'
import NewChartPreview from '@/components/charts/types/NewChartPreview.vue'

export class NewChartStrategy implements ChartStrategy {
  // 1. Thông tin cơ bản
  type = 'new' as const
  label = 'New Chart'
  description = 'Mô tả chart mới của bạn'
  icon = 'NewIcon' // Tên icon từ Heroicons
  category = 'BASIC' as const // 'BASIC' | 'ADVANCED' | 'SPECIALIZED'

  // 2. Tạo config mặc định
  createDefaultConfig(): ChartConfig {
    return {
      type: 'new',
      title: 'New Chart',
      dataSourceId: '',
      // Các thuộc tính đặc thù của chart mới
      newProperty1: '',
      newProperty2: [],
      newProperty3: false,
      // Thuộc tính chung
      backgroundColor: '#3b82f6',
      borderColor: '#1d4ed8',
      colorScheme: 'DEFAULT'
    }
  }

  // 3. Validate config
  validateConfig(config: ChartConfig): boolean {
    if (config.type !== 'new') return false
    
    // Kiểm tra các thuộc tính bắt buộc
    if (!config.title || !config.dataSourceId) return false
    if (!config.newProperty1) return false
    
    return true
  }

  // 4. Các trường bắt buộc
  getRequiredFields(): string[] {
    return ['title', 'dataSourceId', 'newProperty1']
  }

  // 5. Các trường tùy chọn
  getOptionalFields(): string[] {
    return ['newProperty2', 'newProperty3', 'backgroundColor', 'borderColor', 'colorScheme']
  }

  // 6. Kiểu dữ liệu được hỗ trợ
  getSupportedDataTypes(): ('string' | 'number' | 'date')[] {
    return ['string', 'number', 'date']
  }

  // 7. Layout mặc định
  getDefaultLayout(): { w: number; h: number } {
    return { w: 4, h: 3 }
  }

  // 8. Layout tối thiểu
  getMinLayout(): { w: number; h: number } {
    return { w: 2, h: 2 }
  }

  // 9. Layout tối đa
  getMaxLayout(): { w: number; h: number } {
    return { w: 12, h: 8 }
  }

  // 10. Component chính
  getComponent() {
    return NewChart
  }

  // 11. Component preview
  getPreviewComponent() {
    return NewChartPreview
  }

  // 12. Xử lý dữ liệu
  processData(data: any[], config: ChartConfig): any {
    // Logic xử lý dữ liệu cho chart mới
    return data.map(item => ({
      // Transform data theo yêu cầu
      label: item[config.newProperty1],
      value: item[config.newProperty2?.[0] || ''],
      // ... các trường khác
    }))
  }

  // 13. Yêu cầu dữ liệu
  getDataRequirements(): {
    minRows: number
    maxRows: number
    minColumns: number
    maxColumns: number
  } {
    return {
      minRows: 1,
      maxRows: 10000,
      minColumns: 2,
      maxColumns: 10
    }
  }

  // 14. Quy tắc validation
  getValidationRules(): {
    required: string[]
    optional: string[]
    constraints: Record<string, any>
  } {
    return {
      required: ['title', 'dataSourceId', 'newProperty1'],
      optional: ['newProperty2', 'newProperty3'],
      constraints: {
        title: { minLength: 1, maxLength: 100 },
        newProperty1: { type: 'string' }
      }
    }
  }

  // 15. Export config
  exportConfig(config: ChartConfig): any {
    return {
      type: config.type,
      title: config.title,
      dataSourceId: config.dataSourceId,
      newProperty1: config.newProperty1,
      newProperty2: config.newProperty2,
      newProperty3: config.newProperty3,
      backgroundColor: config.backgroundColor,
      borderColor: config.borderColor,
      colorScheme: config.colorScheme
    }
  }

  // 16. Import config
  importConfig(data: any): ChartConfig {
    return {
      type: 'new',
      title: data.title || '',
      dataSourceId: data.dataSourceId || '',
      newProperty1: data.newProperty1 || '',
      newProperty2: data.newProperty2 || [],
      newProperty3: data.newProperty3 || false,
      backgroundColor: data.backgroundColor || '#3b82f6',
      borderColor: data.borderColor || '#1d4ed8',
      colorScheme: data.colorScheme || 'DEFAULT'
    }
  }

  // 17. Text hướng dẫn
  getHelpText(): string {
    return `
      <h3>New Chart</h3>
      <p>Chart mới này được sử dụng để...</p>
      <ul>
        <li><strong>newProperty1</strong>: Mô tả thuộc tính 1</li>
        <li><strong>newProperty2</strong>: Mô tả thuộc tính 2</li>
        <li><strong>newProperty3</strong>: Mô tả thuộc tính 3</li>
      </ul>
    `
  }

  // 18. Ví dụ sử dụng
  getExamples(): Array<{
    name: string
    description: string
    config: Partial<ChartConfig>
  }> {
    return [
      {
        name: 'Ví dụ cơ bản',
        description: 'Chart mới với cấu hình cơ bản',
        config: {
          title: 'Ví dụ Chart Mới',
          newProperty1: 'category',
          newProperty2: ['value'],
          newProperty3: false
        }
      },
      {
        name: 'Ví dụ nâng cao',
        description: 'Chart mới với cấu hình nâng cao',
        config: {
          title: 'Chart Mới Nâng Cao',
          newProperty1: 'region',
          newProperty2: ['sales', 'profit'],
          newProperty3: true,
          colorScheme: 'VIBRANT'
        }
      }
    ]
  }
}
```

### Bước 2: Tạo Chart Component

Tạo file mới: `src/components/charts/types/NewChart.vue`

```vue
<template>
  <div class="new-chart-container">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <span>Đang tải dữ liệu...</span>
    </div>
    
    <div v-else-if="error" class="error">
      <ExclamationTriangleIcon class="h-5 w-5" />
      <span>{{ error }}</span>
    </div>
    
    <div v-else-if="!data || data.length === 0" class="no-data">
      <Squares2X2Icon class="h-8 w-8" />
      <span>Không có dữ liệu</span>
    </div>
    
    <div v-else class="chart-content">
      <!-- Implement chart rendering logic here -->
      <div class="chart-title">{{ chart.base.title }}</div>
      
      <!-- Example: Simple data display -->
      <div class="data-display">
        <div v-for="(item, index) in processedData" :key="index" class="data-item">
          <span class="label">{{ item.label }}</span>
          <span class="value">{{ item.value }}</span>
        </div>
      </div>
      
      <!-- Add your chart library here (Chart.js, D3.js, etc.) -->
      <!-- <canvas ref="chartCanvas"></canvas> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ExclamationTriangleIcon, Squares2X2Icon } from '@heroicons/vue/24/outline'
import type { DashboardChart } from '@/types/dashboard'
import { ChartUtils } from '@/strategies'

interface Props {
  chart: DashboardChart
}

const props = defineProps<Props>()

// State
const loading = ref(false)
const error = ref<string | null>(null)
const data = ref<any[]>([])

// Computed
const processedData = computed(() => {
  if (!data.value || !props.chart) return []
  
  const strategy = ChartUtils.getChartTypeInfo(props.chart.type)
  if (!strategy) return data.value
  
  return strategy.processData(data.value, props.chart.properties[props.chart.type])
})

// Methods
const loadData = async () => {
  if (!props.chart.base.dataSourceId) {
    error.value = 'Chưa chọn nguồn dữ liệu'
    return
  }

  loading.value = true
  error.value = null

  try {
    // Load data from data source
    // This is where you would integrate with your data service
    const mockData = [
      { category: 'A', value: 100 },
      { category: 'B', value: 200 },
      { category: 'C', value: 150 }
    ]
    
    data.value = mockData
  } catch (err) {
    error.value = 'Lỗi khi tải dữ liệu: ' + (err as Error).message
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadData()
})

// Watch for chart changes
watch(() => props.chart.base.dataSourceId, () => {
  loadData()
})
</script>

<style scoped>
.new-chart-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.loading, .error, .no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 0.5rem;
  color: #6b7280;
}

.error {
  color: #ef4444;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.chart-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chart-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}

.data-display {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.data-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
}

.label {
  font-weight: 500;
}

.value {
  color: #3b82f6;
  font-weight: 600;
}
</style>
```

### Bước 3: Tạo Preview Component

Tạo file mới: `src/components/charts/types/NewChartPreview.vue`

```vue
<template>
  <div class="new-chart-preview">
    <div class="preview-header">
      <component :is="getIcon()" class="h-4 w-4" />
      <span class="preview-title">{{ chart.base.title || 'New Chart' }}</span>
    </div>
    
    <div class="preview-content">
      <!-- Simplified preview of the chart -->
      <div class="preview-placeholder">
        <div class="preview-bar" v-for="i in 3" :key="i" 
             :style="{ height: `${20 + i * 10}px` }"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChartBarIcon } from '@heroicons/vue/24/outline'
import type { DashboardChart } from '@/types/dashboard'

interface Props {
  chart: DashboardChart
}

const props = defineProps<Props>()

const getIcon = () => {
  // Return appropriate icon based on chart type
  return ChartBarIcon
}
</script>

<style scoped>
.new-chart-preview {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.preview-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview-content {
  flex: 1;
  display: flex;
  align-items: end;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.5rem;
}

.preview-placeholder {
  display: flex;
  align-items: end;
  gap: 0.25rem;
  height: 100%;
}

.preview-bar {
  width: 0.75rem;
  background-color: #3b82f6;
  border-radius: 0.125rem;
  min-height: 0.5rem;
}
</style>
```

### Bước 4: Cập Nhật Types

Cập nhật file: `src/types/chart.ts`

```typescript
// Thêm 'new' vào ChartType
export type ChartType = 'bar' | 'line' | 'pie' | 'scatter' | 'card' | 'new'

// Thêm NewChartConfig interface
export interface NewChartConfig extends BaseChartConfig {
  type: 'new'
  newProperty1: string
  newProperty2: string[]
  newProperty3: boolean
}

// Cập nhật ChartConfig union type
export type ChartConfig = BarChartConfig | LineChartConfig | PieChartConfig | ScatterChartConfig | CardChartConfig | NewChartConfig

// Thêm type guard
export function isNewChartConfig(config: ChartConfig): config is NewChartConfig {
  return config.type === 'new'
}
```

### Bước 5: Đăng Ký Strategy

Cập nhật file: `src/strategies/index.ts`

```typescript
import { NewChartStrategy } from './NewChartStrategy'

// Trong constructor của ChartStrategyRegistry
constructor() {
  this.register(new BarChartStrategy())
  this.register(new PieChartStrategy())
  this.register(new LineChartStrategy())
  this.register(new ScatterChartStrategy())
  this.register(new CardChartStrategy())
  this.register(new NewChartStrategy()) // Thêm dòng này
}
```

### Bước 6: Export Strategy

Cập nhật file: `src/strategies/index.ts`

```typescript
// Thêm vào cuối file
export { NewChartStrategy }
```

## Kiểm Tra và Test

### 1. Build Project
```bash
npm run build
```

### 2. Chạy Development Server
```bash
npm run dev
```

### 3. Test Chart Mới
1. Tạo dashboard mới
2. Chọn chart type "New Chart" từ panel
3. Cấu hình các thuộc tính
4. Thêm vào dashboard
5. Kiểm tra chart hiển thị đúng

## Ví Dụ Thực Tế: Area Chart

### Strategy Class
```typescript
export class AreaChartStrategy implements ChartStrategy {
  type = 'area' as const
  label = 'Area Chart'
  description = 'Biểu đồ vùng hiển thị xu hướng dữ liệu'
  icon = 'PresentationChartLineIcon'
  category = 'ADVANCED' as const

  createDefaultConfig(): ChartConfig {
    return {
      type: 'area',
      title: 'Area Chart',
      dataSourceId: '',
      xAxis: '',
      yAxis: '',
      smooth: false,
      fillArea: true,
      backgroundColor: '#3b82f6',
      borderColor: '#1d4ed8',
      colorScheme: 'DEFAULT'
    }
  }

  // ... implement các method khác
}
```

### Component
```vue
<template>
  <div class="area-chart">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

// Implement area chart với Chart.js
</script>
```

## Lưu Ý Quan Trọng

### 1. Type Safety
- Luôn sử dụng type guards (`isNewChartConfig`)
- Đảm bảo config có đúng type
- Validate dữ liệu đầu vào

### 2. Performance
- Lazy load chart libraries nếu cần
- Optimize data processing
- Cache processed data khi có thể

### 3. Error Handling
- Xử lý lỗi khi load data
- Validate config trước khi render
- Hiển thị thông báo lỗi thân thiện

### 4. Responsive Design
- Chart phải responsive
- Handle resize events
- Maintain aspect ratio

### 5. Accessibility
- Thêm ARIA labels
- Keyboard navigation
- Screen reader support

## Troubleshooting

### Lỗi Thường Gặp

1. **Chart không hiển thị**
   - Kiểm tra data source
   - Validate config
   - Check console errors

2. **Type errors**
   - Đảm bảo đã cập nhật ChartType
   - Check type guards
   - Verify interface implementation

3. **Performance issues**
   - Optimize data processing
   - Use debouncing cho resize
   - Implement virtual scrolling nếu cần

### Debug Tips

1. **Console logging**
   ```typescript
   console.log('Chart config:', config)
   console.log('Processed data:', processedData)
   ```

2. **Vue DevTools**
   - Inspect component props
   - Check reactive data
   - Monitor performance

3. **Network tab**
   - Check data loading
   - Verify API calls
   - Monitor response times

## Kết Luận

Với Strategy Pattern, việc thêm chart mới trở nên đơn giản và có cấu trúc rõ ràng. Chỉ cần:

1. **1 Strategy Class** - Xử lý logic chart
2. **1 Component** - Hiển thị chart
3. **1 Preview Component** - Preview trong panel
4. **Cập nhật types** - Type safety
5. **Đăng ký strategy** - Tích hợp vào hệ thống

Hệ thống mới cung cấp:
- ✅ Type safety đầy đủ
- ✅ API nhất quán
- ✅ Dễ mở rộng
- ✅ Dễ maintain
- ✅ Performance tốt
- ✅ Error handling tốt 