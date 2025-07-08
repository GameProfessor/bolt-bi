# Mô tả kiến trúc xử lý Biểu Đồ (Chart Architecture Guide)

## 1. Tổng Quan Kiến Trúc & Dòng Dữ Liệu

```
DataSource (raw data)
   ↓
DashboardChart (model chart lưu trong dashboard)
   ↓
ChartTypeProperties (object lưu config từng loại chart)
   ↓
ChartConfig (union type cho UI thao tác)
   ↓
ChartStrategy (xử lý dữ liệu, sinh options, validate, ...)
   ↓
ChartComponent (nhận prop chart, tự render)
```

- **DataSource**: Định nghĩa nguồn dữ liệu (bảng, cột, kiểu dữ liệu, ...)
- **DashboardChart**: Đối tượng chart lưu trong dashboard, gồm type, base, properties, layout, ...
- **ChartTypeProperties**: Object có property cho từng loại chart, dùng để lưu trữ cấu hình chart trong dashboard, type-safe, dễ mở rộng.
- **ChartConfig**: Union type cho từng loại chart, dùng cho UI ChartPanel để binding, validate, nhập liệu, thao tác khi tạo/sửa chart.
- **ChartStrategy**: Lớp xử lý logic cho từng loại chart (tạo config, processData, transformToChartOptions, ...)
- **ChartComponent**: Vue component nhận prop chart, tự trích xuất config/data, tự render

### Flow dữ liệu tổng quát:
1. **UI ChartPanel** thao tác với ChartConfig (union type)
2. Khi lưu, ChartConfig được map sang ChartTypeProperties (object lưu trữ)
3. DashboardChart lưu properties dạng ChartTypeProperties
4. Khi render, lấy properties từ DashboardChart, truyền vào ChartStrategy để xử lý dữ liệu và sinh options
5. ChartComponent nhận prop chart, tự render dựa trên properties và strategy

---

## 2. Các Cấu Trúc Dữ Liệu Chính

### 2.1. ChartConfig (UI Config)
- Union type cho từng loại chart (BarChartConfig, PieChartConfig, CardChartConfig, ...)
- Dùng cho UI ChartPanel: binding dữ liệu, validate, nhập liệu
- Ví dụ:
  ```ts
  export type ChartConfig = BarChartConfig | PieChartConfig | CardChartConfig | ...
  ```
- Khi người dùng chỉnh sửa chart, UI sẽ thao tác với ChartConfig

### 2.2. ChartTypeProperties (Dashboard Storage)
- Object có property cho từng loại chart, dùng để lưu trữ cấu hình chart trong dashboard
- Đảm bảo type-safe, dễ mở rộng, mapping rõ ràng khi lưu/đọc chart
- Ví dụ:
  ```ts
  export interface ChartTypeProperties {
    bar?: BarChartConfig
    pie?: PieChartConfig
    card?: CardChartConfig
    ...
  }
  ```
- Khi lưu chart, ChartConfig sẽ được map sang ChartTypeProperties để lưu vào dashboard

### 2.3. Sự khác biệt & luồng dữ liệu
- **ChartConfig**: dùng cho UI, là union type, dễ validate, binding
- **ChartTypeProperties**: dùng cho lưu trữ, là object, dễ mở rộng, đồng bộ với backend
- Khi tạo/sửa chart:
  - UI thao tác với ChartConfig
  - Khi lưu, map sang ChartTypeProperties (ví dụ: `{ card: { ...config } }`)
  - Khi render, lấy từ ChartTypeProperties để truyền vào component chart

### 2.4. Ví dụ mapping
```ts
// Khi lưu chart Card:
updates.properties = {
  card: {
    field: chartConfig.value.field,
    aggregation: chartConfig.value.aggregation,
    decimalPlaces: chartConfig.value.decimalPlaces,
    colorScheme: chartConfig.value.colorScheme,
    filter: chartConfig.value.filter,
    subHeader: chartConfig.value.subHeader
  }
}
```

### 2.5. Lý do tồn tại hai lớp
- Đảm bảo type-safe, dễ mở rộng khi thêm chart mới
- Phân tách rõ UI (ChartConfig) và lưu trữ (ChartTypeProperties), tránh lỗi khi đồng bộ dữ liệu

### 2.6. Các interface/type chính

#### DataSource
```ts
interface DataSource {
  id: string
  name: string
  columns: Array<{ name: string; type: 'string' | 'number' | 'date' }>
  data: Record<string, any>[]
}
```

#### DashboardChart
```ts
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

#### ChartProperties (ví dụ cho Bar, Card)
```ts
// Bar
interface BarChartProperties {
  xAxis: string[]
  yAxis: string[]
  horizontal?: boolean
}
// Card
interface CardChartProperties {
  field: string
  aggregation: 'sum' | 'avg' | 'min' | 'max' | 'count'
  prefix?: string
  suffix?: string
  decimalPlaces?: number
  color?: string
  backgroundColor?: string
}
```

#### ChartStrategy
```ts
interface ChartStrategy {
  type: ChartType
  createDefaultConfig(): ChartConfig
  processData(rawData: any[], config: ChartConfig): any
  transformToChartOptions(data: any, config: ChartConfig): any
  getComponent(): Component
}
```

---

## 3. Flow Xử Lý Khi Render Chart Lên Dashboard

1. **Lấy dữ liệu từ DataSource** (theo dataSourceId của chart)
2. **DashboardChart** lưu config, properties, layout, ...
3. **ChartStrategy**:
   - Nhận DashboardChart, lấy properties đặc thù
   - Gọi processData để xử lý dữ liệu thô thành data phù hợp
   - Gọi transformToChartOptions để sinh options cho thư viện vẽ
   - Trả về component phù hợp
4. **ChartComponent**:
   - Nhận prop chart (DashboardChart)
   - Tự trích xuất config/data, gọi strategy để lấy options/data
   - Render chart lên dashboard

## 4. Ví dụ: Render Card Chart

```ts
// 1. DataSource
const ds = {
  id: 'ds1',
  name: 'Sales',
  columns: [ { name: 'revenue', type: 'number' }, ... ],
  data: [ { revenue: 100 }, { revenue: 200 }, ... ]
}

// 2. DashboardChart
const chart: DashboardChart = {
  id: 'c1',
  dashboardId: 'd1',
  type: 'card',
  base: { title: 'Tổng doanh thu', dataSourceId: 'ds1', ... },
  properties: { card: { field: 'revenue', aggregation: 'sum', prefix: '$' } },
  layout: { x: 0, y: 0, w: 3, h: 2 },
  createdAt: new Date()
}

// 3. CardChartStrategy
const strategy = new CardChartStrategy()
const processed = strategy.processData(ds.data, chart.properties.card)
const options = strategy.transformToChartOptions(processed, chart.properties.card)

// 4. CardChart.vue
<CardChart :chart="chart" /> // Tự trích xuất config/data, gọi strategy, render value
```

## 5. Lưu Ý
- **Component chart** KHÔNG nhận options rời, chỉ nhận `chart`.
- **Config** của mỗi chart lưu trong `chart.properties.<type>`.
- **Tất cả logic đặc thù nằm trong strategy và component riêng.
- **Flow dữ liệu xuyên suốt, type-safe, maintain dễ, mở rộng nhanh.**

---

# Hướng Dẫn Tạo Biểu Đồ Mới (How to Add a New Chart Type)

## Checklist các bước chuẩn hóa
- [ ] Định nghĩa interface/config mới (nếu cần)
- [ ] Tạo component render (MyChart.vue)
- [ ] Tạo strategy class (MyChartStrategy.ts)
- [ ] Đăng ký strategy (registry/index.ts)
- [ ] Cập nhật constants/factory/types/UI (nếu cần)
- [ ] Test & hoàn thiện

**Mọi chart mới đều tuân thủ: nhận prop `chart`, tự xử lý logic, không phụ thuộc vào factory bên ngoài.** 