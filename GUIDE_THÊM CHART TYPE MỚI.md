# 📊 Hướng dẫn thêm Chart Type mới (Chart Type mới có thể dùng 1 thư viện khác, hoặc là 1 kiểu chart khác hẳn như filter, table,...)

## Checklist các bước chuẩn hóa
- [ ] Định nghĩa interface/config mới (nếu cần)
- [ ] Tạo component render (MyChart.vue)
- [ ] Tạo strategy class (MyChartStrategy.ts)
- [ ] Đăng ký strategy (registry/index.ts)
- [ ] Cập nhật constants/factory/types/UI (nếu cần)
- [ ] Test & hoàn thiện

---

## Tổng quan
- Hệ thống sử dụng **Strategy Pattern** cho mỗi loại biểu đồ.
- Mỗi loại chart có một strategy class riêng, tự xử lý config, data, render.
- Tất cả chart component đều nhận prop duy nhất: `chart: DashboardChart`.
- Sử dụng **ChartStrategyRegistry** để quản lý tất cả strategies.

---

## Các Bước Thêm Biểu Đồ Mới (Chuẩn hóa)

### 1. Định nghĩa interface/config mới (nếu cần)
- Thêm interface mới vào `src/types/chart.ts`.

### 2. Tạo component render
- Tạo file: `src/components/charts/types/MyChart.vue`
- Nhận prop: `chart: DashboardChart`
- Tự trích xuất config/data từ `chart`

### 3. Tạo strategy class
- Tạo file: `src/strategies/MyChartStrategy.ts`
- Implement interface `ChartStrategy`, cài đặt các method cần thiết

### 4. Đăng ký strategy
- Thêm vào registry trong `src/strategies/index.ts`

### 5. Cập nhật constants/factory/types/UI (nếu cần)
- Thêm vào danh sách chart types, cập nhật factory, constants, types, UI selector...

### 6. Test & hoàn thiện
- Kéo thả, cấu hình, kiểm tra preview, lưu dashboard

---

**Lưu ý:**
- Mọi chart mới đều tuân thủ: nhận prop `chart`, tự xử lý logic, không phụ thuộc vào factory bên ngoài.
- Có thể tham khảo ví dụ AreaChart ở phần dưới để thực hiện từng bước.

## 🎯 Ví dụ: Thêm Area Chart

Chúng ta sẽ thêm **Area Chart** làm ví dụ minh họa. Area Chart là biểu đồ đường có tô màu vùng bên dưới, thích hợp để hiển thị xu hướng dữ liệu theo thời gian.

---

## 📋 Bước 1: Định nghĩa Chart Type Interface

### 1.1 Cập nhật `src/types/chart.ts`

Thêm interface cho chart type mới:

```typescript
// Thêm AreaChartConfig interface
export interface AreaChartConfig extends BaseChartConfig {
  type: 'area'
  xAxis: string[]
  yAxis: string[]
  smooth?: boolean
  fillOpacity?: number
  gradient?: boolean
}

// Cập nhật union type ChartConfig
export type ChartConfig = 
  | BarChartConfig 
  | PieChartConfig 
  | LineChartConfig 
  | ScatterChartConfig 
  | CardChartConfig
  | AreaChartConfig  // <-- Thêm vào đây
```

### 1.2 Cập nhật helper functions

Thêm vào `src/types/chart.ts`:

```typescript
// Thêm type guard
export function isAreaChartConfig(config: ChartConfig): config is AreaChartConfig {
  return config.type === 'area'
}

// Cập nhật createDefaultChartConfig
export function createDefaultChartConfig(type: ChartType): ChartConfig {
  const baseConfig = {
    title: '',
    dataSourceId: '',
    backgroundColor: '#3b82f6',
    borderColor: '#1d4ed8',
    colorScheme: 'DEFAULT'
  }

  switch (type) {
    // ... existing cases ...
    
    case 'area':
      return {
        ...baseConfig,
        type: 'area',
        xAxis: [],
        yAxis: [],
        smooth: false,
        fillOpacity: 0.3,
        gradient: true
      }
    
    default:
      throw new Error(`Unsupported chart type: ${type}`)
  }
}

// Cập nhật isChartConfigValid
export function isChartConfigValid(config: ChartConfig): boolean {
  if (!config.title || !config.dataSourceId) return false
  
  switch (config.type) {
    // ... existing cases ...
    
    case 'area':
      return config.xAxis.length > 0 && config.yAxis.length > 0
    
    default:
      return false
  }
}
```

---

## 📋 Bước 2: Tạo Strategy Class

### 2.1 Tạo file `src/strategies/AreaChartStrategy.ts`

```typescript
import type { ChartStrategy } from './ChartStrategy'
import type { ChartType, ChartConfig, AreaChartConfig } from '@/types/chart'
import AreaChart from '@/components/charts/types/AreaChart.vue'
import ChartPreview from '@/components/charts/ChartPreview.vue'

export class AreaChartStrategy implements ChartStrategy {
  type = 'area' as const
  label = 'Area Chart'
  description = 'Shows data as filled areas, useful for showing trends over time'
  icon = 'PresentationChartLineIcon'
  category = 'BASIC' as const

  createDefaultConfig(): AreaChartConfig {
    return {
      type: 'area',
      title: 'Area Chart',
      dataSourceId: '',
      colorScheme: 'default',
      xAxis: [],
      yAxis: [],
      smooth: false,
      fillOpacity: 0.3,
      gradient: true
    }
  }

  validateConfig(config: ChartConfig): boolean {
    if (config.type !== 'area') return false
    
    const areaConfig = config as AreaChartConfig
    return !!(
      areaConfig.title &&
      areaConfig.dataSourceId &&
      Array.isArray(areaConfig.xAxis) &&
      Array.isArray(areaConfig.yAxis) &&
      areaConfig.xAxis.length > 0 &&
      areaConfig.yAxis.length > 0
    )
  }

  getDefaultLayout(): { w: number; h: number } {
    return { w: 4, h: 3 }
  }

  getComponent(): any {
    return AreaChart
  }

  getPreviewComponent(): any {
    return ChartPreview
  }

  processData(data: any[], config: ChartConfig): any {
    if (config.type !== 'area') return data
    const areaConfig = config as AreaChartConfig
    
    // Xử lý dữ liệu cho area chart
    const processedData = data.map(row => ({
      x: row[areaConfig.xAxis[0]],
      y: row[areaConfig.yAxis[0]]
    })).filter(item => item.x != null && item.y != null)
    
    return processedData
  }

  transformToChartOptions(processedData: any, config: ChartConfig): any {
    if (config.type !== 'area') return {}
    const areaConfig = config as AreaChartConfig
    
    const labels = processedData.map((item: any) => item.x)
    const datasets = [{
      label: areaConfig.yAxis[0],
      data: processedData.map((item: any) => item.y),
      backgroundColor: `rgba(59, 130, 246, ${areaConfig.fillOpacity || 0.3})`,
      borderColor: '#3b82f6',
      borderWidth: 2,
      fill: true,
      tension: areaConfig.smooth ? 0.4 : 0
    }]
    
    return {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true },
          title: { display: true, text: areaConfig.title }
        },
        scales: {
          x: { beginAtZero: true },
          y: { beginAtZero: true }
        }
      }
    }
  }

  exportConfig(config: ChartConfig): any {
    if (config.type !== 'area') return config
    return {
      ...config,
      exportVersion: '1.0',
      exportDate: new Date().toISOString()
    }
  }

  importConfig(data: any): AreaChartConfig {
    return {
      ...this.createDefaultConfig(),
      ...data
    }
  }

  getExamples(): Array<{
    name: string
    description: string
    config: Partial<ChartConfig>
  }> {
    return [
      {
        name: 'Doanh số theo thời gian',
        description: 'Biểu đồ area hiển thị xu hướng doanh số',
        config: {
          title: 'Doanh số theo thời gian',
          xAxis: ['date'],
          yAxis: ['sales'],
          smooth: true,
          fillOpacity: 0.3
        }
      }
    ]
  }
}
```

### 2.2 Đăng ký Strategy

Cập nhật `src/strategies/index.ts`:

```typescript
import { AreaChartStrategy } from './AreaChartStrategy'

class ChartStrategyRegistry {
  private strategies = new Map<ChartType, ChartStrategy>()

  constructor() {
    // Đăng ký các strategy hiện có
    this.register(new BarChartStrategy())
    this.register(new PieChartStrategy())
    this.register(new LineChartStrategy())
    this.register(new ScatterChartStrategy())
    this.register(new CardChartStrategy())
    this.register(new AreaChartStrategy()) // <-- Thêm vào đây
  }
  
  // ... rest of the code
}
```

---

## 📋 Bước 3: Tạo Chart Component

### 3.1 Tạo file `src/components/charts/types/AreaChart.vue`

```vue
<template>
  <div class="area-chart">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { Chart as ChartJS } from 'chart.js/auto'
import type { DashboardChart } from '@/types/dashboard'
import type { AreaChartConfig } from '@/types/chart'

interface Props {
  chart: DashboardChart
}

const props = defineProps<Props>()
const chartCanvas = ref<HTMLCanvasElement>()
let chartInstance: ChartJS | null = null

// Extract config and data from chart prop
const chartData = computed(() => {
  if (props.chart.type !== 'area') return null
  return {
    config: props.chart.properties.area as AreaChartConfig,
    base: props.chart.base,
    data: [] // Will be populated from data source
  }
})

onMounted(() => {
  renderChart()
})

watch(() => props.chart, renderChart, { deep: true })

async function renderChart() {
  if (!chartCanvas.value || !chartData.value) return
  
  // Destroy existing chart
  if (chartInstance) {
    chartInstance.destroy()
  }
  
  // Get data from data source (simplified)
  const data = getChartData()
  
  // Use strategy to process data
  const strategy = new AreaChartStrategy()
  const processedData = strategy.processData(data, chartData.value.config)
  const chartOptions = strategy.transformToChartOptions(processedData, chartData.value.config)
  
  await nextTick()
  if (chartCanvas.value) {
    chartInstance = new ChartJS(chartCanvas.value, chartOptions)
  }
}

function getChartData() {
  // Simplified - in real implementation, get from data source
  return [
    { date: 'Jan', sales: 100 },
    { date: 'Feb', sales: 150 },
    { date: 'Mar', sales: 120 },
    { date: 'Apr', sales: 200 }
  ]
}
</script>

<style scoped>
.area-chart {
  width: 100%;
  height: 100%;
}
</style>
```

---

## 📋 Bước 4: Cập nhật Dashboard Types

### 4.1 Cập nhật `src/types/dashboard.ts`

```typescript
// Thêm area chart properties
export interface AreaChartProperties {
  xAxis: string
  yAxis: string
  smooth?: boolean
  fillOpacity?: number
  gradient?: boolean
}

// Cập nhật ChartTypeProperties
export interface ChartTypeProperties {
  // ... existing properties ...
  
  area?: AreaChartProperties  // <-- Thêm vào đây
}
```

---

## 📋 Bước 5: Cập nhật Chart Panel UI

### 5.1 Cập nhật `src/pages/dashboard/components/ChartPanel.vue`

Thêm controls cho area chart:

```vue
<template>
  <!-- Thêm controls cho area chart -->
  <div v-if="selectedChartType === 'area' && isAreaChartConfig(chartConfig)">
    <div class="form-group">
      <label class="block text-xs font-medium text-gray-600 mb-1">Fill Opacity</label>
      <input 
        v-model.number="chartConfig.fillOpacity" 
        type="range" 
        min="0" 
        max="1" 
        step="0.1"
        class="w-full"
      />
      <span class="text-xs text-gray-500">{{ chartConfig.fillOpacity }}</span>
    </div>
    
    <div class="form-group">
      <label class="block text-xs font-medium text-gray-600 mb-1">
        <input 
          v-model="chartConfig.gradient" 
          type="checkbox"
          class="mr-2"
        />
        Enable Gradient
      </label>
    </div>
    
    <div class="form-group">
      <label class="block text-xs font-medium text-gray-600 mb-1">
        <input 
          v-model="chartConfig.smooth" 
          type="checkbox"
          class="mr-2"
        />
        Smooth Line
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
// Thêm type guard import
import {
  isBarChartConfig,
  isPieChartConfig,
  isLineChartConfig,
  isScatterChartConfig,
  isCardChartConfig,
  isAreaChartConfig  // <-- Thêm vào đây
} from '@/types/chart'
</script>
```

---

## 📋 Bước 6: Cập nhật QuickDashboard

### 6.1 Cập nhật `src/pages/dashboard/QuickDashboard.vue`

Thêm xử lý cho area chart:

```typescript
// Trong hàm editChart, thêm case 'area':
case 'area':
  if (chart.properties.area && isAreaChartConfig(chartConfig.value)) {
    chartConfig.value.xAxis = [chart.properties.area.xAxis]
    chartConfig.value.yAxis = [chart.properties.area.yAxis]
    chartConfig.value.smooth = chart.properties.area.smooth || false
    chartConfig.value.fillOpacity = chart.properties.area.fillOpacity || 0.3
    chartConfig.value.gradient = chart.properties.area.gradient || true
  }
  break

// Trong hàm addChart, thêm case 'area':
case 'area':
  newChart = createAreaChart({
    title: chartConfig.value.title,
    dataSourceId: chartConfig.value.dataSourceId,
    xAxis: chartConfig.value.xAxis[0] || '',
    yAxis: chartConfig.value.yAxis[0] || '',
    smooth: chartConfig.value.smooth,
    fillOpacity: chartConfig.value.fillOpacity,
    gradient: chartConfig.value.gradient,
    backgroundColor: chartConfig.value.backgroundColor,
    borderColor: chartConfig.value.borderColor,
    colorScheme: chartConfig.value.colorScheme
  })
  break
```

---

## 📋 Bước 7: Test và Validation

### 7.1 Test Chart Creation

```typescript
// Test tạo area chart
const strategy = new AreaChartStrategy()
const areaConfig = strategy.createDefaultConfig()
console.log('Area config:', areaConfig)

// Test validation
const isValid = strategy.validateConfig(areaConfig)
console.log('Is valid:', isValid)

// Test strategy properties
console.log('Strategy type:', strategy.type)
console.log('Strategy name:', strategy.label)
```

### 7.2 Test UI Integration

1. Mở dashboard
2. Chọn "Area Chart" từ chart type selector
3. Kéo thả fields vào X-Axis và Y-Axis
4. Điều chỉnh các options (fill opacity, gradient, smooth)
5. Click "Add to Dashboard"
6. Verify chart hiển thị đúng

---

## ✅ Checklist hoàn thành

- [ ] ✅ Định nghĩa interface `AreaChartConfig`
- [ ] ✅ Cập nhật union type `ChartConfig`
- [ ] ✅ Thêm type guard `isAreaChartConfig`
- [ ] ✅ Cập nhật helper functions
- [ ] ✅ Tạo `AreaChartStrategy` class với đầy đủ methods
- [ ] ✅ Đăng ký strategy trong registry
- [ ] ✅ Tạo `AreaChart.vue` component
- [ ] ✅ Cập nhật dashboard types
- [ ] ✅ Cập nhật ChartPanel UI
- [ ] ✅ Cập nhật QuickDashboard logic
- [ ] ✅ Test chart creation và validation
- [ ] ✅ Test UI integration

---

## 🎯 Lợi ích của cách tiếp cận này

### 1. **Type Safety**
- TypeScript đảm bảo type safety cho mọi chart type
- Compile-time checking cho config properties
- IntelliSense support đầy đủ

### 2. **Maintainability**
- Mỗi chart type có logic riêng biệt trong strategy class
- Dễ test và debug từng strategy riêng lẻ
- Code sạch, có cấu trúc rõ ràng

### 3. **Extensibility**
- Thêm chart type mới chỉ cần tạo 1 strategy class + 1 component
- Không cần sửa code ở nơi khác
- Tự động được đăng ký và sử dụng qua registry

### 4. **Performance**
- Lazy loading chart components
- Chỉ load strategy khi cần thiết
- Tối ưu bundle size

### 5. **Developer Experience**
- API nhất quán cho mọi chart type
- Documentation tự động từ TypeScript
- IDE support tốt

---

## 🚀 Kết luận

Sau khi hoàn thành 7 bước trên, bạn sẽ có một chart type mới hoàn toàn tích hợp vào hệ thống với:

- ✅ **Type safety** đầy đủ
- ✅ **UI controls** tương ứng
- ✅ **Validation** tự động
- ✅ **Drag & drop** support
- ✅ **Real-time updates**
- ✅ **Export capabilities**

Chart type mới sẽ hoạt động giống hệt các chart types hiện có và có thể được sử dụng ngay lập tức trong dashboard! 