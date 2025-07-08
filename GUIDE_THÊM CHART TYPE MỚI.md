# 📊 Hướng dẫn thêm Chart Type mới

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
- Kế thừa `ChartStrategy`, cài đặt các method cần thiết

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
import { ChartStrategy } from './ChartStrategy'
import type { ChartType, ChartConfig, AreaChartConfig } from '@/types/chart'

export class AreaChartStrategy implements ChartStrategy {
  getType(): ChartType {
    return 'area'
  }

  getDisplayName(): string {
    return 'Area Chart'
  }

  getDescription(): string {
    return 'Shows data as filled areas, useful for showing trends over time'
  }

  getIcon(): string {
    return 'PresentationChartLineIcon' // Sử dụng icon có sẵn
  }

  getDefaultConfig(): AreaChartConfig {
    return {
      type: 'area',
      title: 'Area Chart',
      dataSourceId: '',
      backgroundColor: '#3b82f6',
      borderColor: '#1d4ed8',
      colorScheme: 'DEFAULT',
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
    return (
      typeof areaConfig.title === 'string' &&
      typeof areaConfig.dataSourceId === 'string' &&
      Array.isArray(areaConfig.xAxis) &&
      Array.isArray(areaConfig.yAxis) &&
      areaConfig.xAxis.length > 0 &&
      areaConfig.yAxis.length > 0
    )
  }

  getSupportedDataTypes(): ("string" | "number" | "date")[] {
    return ['string', 'number', 'date']
  }

  getRequiredFields(): string[] {
    return ['xAxis', 'yAxis']
  }

  getOptionalFields(): string[] {
    return ['smooth', 'fillOpacity', 'gradient']
  }
}
```

### 2.2 Đăng ký Strategy

Cập nhật `src/strategies/index.ts`:

```typescript
import { AreaChartStrategy } from './AreaChartStrategy'

export class ChartStrategyRegistry {
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

### 3.1 Tạo file `src/components/charts/AreaChart.vue`

```vue
<template>
  <div class="area-chart">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { AreaChartConfig } from '@/types/chart'

interface Props {
  config: AreaChartConfig
  data: any[]
}

const props = defineProps<Props>()
const chartCanvas = ref<HTMLCanvasElement>()

onMounted(() => {
  renderChart()
})

watch(() => props.config, renderChart, { deep: true })
watch(() => props.data, renderChart, { deep: true })

function renderChart() {
  if (!chartCanvas.value || !props.data.length) return
  
  // Implement chart rendering logic here
  // Sử dụng Chart.js, D3.js, hoặc thư viện chart khác
  console.log('Rendering Area Chart with config:', props.config)
  
  // Ví dụ với Chart.js:
  // const ctx = chartCanvas.value.getContext('2d')
  // new Chart(ctx, {
  //   type: 'line',
  //   data: {
  //     labels: props.data.map(d => d[props.config.xAxis[0]]),
  //     datasets: props.config.yAxis.map((field, index) => ({
  //       label: field,
  //       data: props.data.map(d => d[field]),
  //       fill: true,
  //       backgroundColor: `rgba(59, 130, 246, ${props.config.fillOpacity})`,
  //       borderColor: props.config.backgroundColor,
  //       tension: props.config.smooth ? 0.4 : 0
  //     }))
  //   },
  //   options: {
  //     responsive: true,
  //     maintainAspectRatio: false
  //   }
  // })
}
</script>

<style scoped>
.area-chart {
  width: 100%;
  height: 100%;
}
</style>
```

### 3.2 Cập nhật Component Factory

Cập nhật `src/factories/ChartComponentFactory.ts`:

```typescript
import AreaChart from '@/components/charts/AreaChart.vue'

const chartComponents: Record<ChartType, Component> = {
  bar: BarChart,
  pie: PieChart,
  line: LineChart,
  scatter: ScatterChart,
  card: CardChart,
  area: AreaChart  // <-- Thêm vào đây
}
```

---

## 📋 Bước 4: Cập nhật Constants

### 4.1 Cập nhật `src/constants/chartTypes.ts`

```typescript
export const CHART_TYPES: Record<ChartType, { label: string; icon: string; description: string }> = {
  // ... existing types ...
  
  area: {
    label: 'Area Chart',
    icon: 'PresentationChartLineIcon',
    description: 'Biểu đồ đường có tô màu vùng bên dưới'
  },
  
  // ... rest of types ...
}
```

---

## 📋 Bước 5: Cập nhật Dashboard Types

### 5.1 Cập nhật `src/types/dashboard.ts`

```typescript
// Thêm area chart properties
export interface AreaChartProperties {
  xAxis: string
  yAxis: string
  smooth?: boolean
  fillOpacity?: number
  gradient?: boolean
}

// Cập nhật ChartProperties union type
export type ChartProperties = 
  | { bar: BarChartProperties }
  | { pie: PieChartProperties }
  | { line: LineChartProperties }
  | { scatter: ScatterChartProperties }
  | { card: CardChartProperties }
  | { area: AreaChartProperties }  // <-- Thêm vào đây

// Thêm helper function
export function createAreaChart(
  title: string,
  dataSourceId: string,
  xAxis: string,
  yAxis: string,
  options: Partial<AreaChartProperties> = {}
): DashboardChart {
  return {
    id: nanoid(),
    type: 'area',
    base: {
      title,
      dataSourceId,
      backgroundColor: '#3b82f6',
      borderColor: '#1d4ed8',
      colorScheme: 'DEFAULT'
    },
    properties: {
      area: {
        xAxis,
        yAxis,
        smooth: false,
        fillOpacity: 0.3,
        gradient: true,
        ...options
      }
    },
    layout: {
      x: 0,
      y: 0,
      w: 6,
      h: 4
    }
  }
}
```

---

## 📋 Bước 6: Cập nhật Chart Panel UI

### 6.1 Cập nhật `src/pages/dashboard/components/ChartPanel.vue`

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

## 📋 Bước 7: Cập nhật QuickDashboard

### 7.1 Cập nhật `src/pages/dashboard/QuickDashboard.vue`

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

## 📋 Bước 8: Test và Validation

### 8.1 Test Chart Creation

```typescript
// Test tạo area chart
const areaConfig = createDefaultChartConfig('area')
console.log('Area config:', areaConfig)

// Test validation
const isValid = isChartConfigValid(areaConfig)
console.log('Is valid:', isValid)

// Test strategy
const strategy = new AreaChartStrategy()
console.log('Strategy type:', strategy.getType())
console.log('Strategy name:', strategy.getDisplayName())
```

### 8.2 Test UI Integration

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
- [ ] ✅ Tạo `AreaChartStrategy` class
- [ ] ✅ Đăng ký strategy trong registry
- [ ] ✅ Tạo `AreaChart.vue` component
- [ ] ✅ Cập nhật component factory
- [ ] ✅ Cập nhật constants
- [ ] ✅ Cập nhật dashboard types
- [ ] ✅ Thêm helper function `createAreaChart`
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
- Mỗi chart type có logic riêng biệt
- Dễ test và debug từng strategy riêng lẻ
- Code sạch, có cấu trúc rõ ràng

### 3. **Extensibility**
- Thêm chart type mới chỉ cần tạo 1 strategy class + 1 component
- Không cần sửa code ở nơi khác
- Tự động được đăng ký và sử dụng

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

Sau khi hoàn thành 8 bước trên, bạn sẽ có một chart type mới hoàn toàn tích hợp vào hệ thống với:

- ✅ **Type safety** đầy đủ
- ✅ **UI controls** tương ứng
- ✅ **Validation** tự động
- ✅ **Drag & drop** support
- ✅ **Real-time updates**
- ✅ **Export capabilities**

Chart type mới sẽ hoạt động giống hệt các chart types hiện có và có thể được sử dụng ngay lập tức trong dashboard! 