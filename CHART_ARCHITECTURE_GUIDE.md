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

---

## 5. Luồng Xử Lý Real-time Updates

### 5.1. Tổng Quan Real-time Flow

Hệ thống hỗ trợ cập nhật real-time các thay đổi chart property, cho phép người dùng thấy kết quả ngay lập tức mà không cần click "Update Chart":

```
User Input (ChartPanel.vue)
   ↓
Vue Watcher (deep watch chartConfig)
   ↓
Emit real-time-update event
   ↓
QuickDashboard.vue onRealTimeUpdate handler
   ↓
DashboardStore.updateChart()
   ↓
Chart Component re-render (via Vue reactivity)
   ↓
Real-time preview trên dashboard
```

### 5.2. Chi Tiết Implementation

#### 5.2.1. ChartPanel.vue - Real-time Trigger

```typescript
// Generic real-time update function
const triggerRealTimeUpdate = () => {
  if (props.editingChartId && props.chartConfig && props.selectedChartType) {
    emit('real-time-update', {
      type: props.selectedChartType,
      properties: JSON.parse(JSON.stringify(props.chartConfig))
    })
  }
}

// Watch for changes in chartConfig and trigger real-time updates
watch(() => props.chartConfig, () => {
  if (props.editingChartId) {
    triggerRealTimeUpdate()
  }
}, { deep: true })
```

**Cơ chế hoạt động:**
- Sử dụng Vue `watch` với `deep: true` để theo dõi mọi thay đổi trong `chartConfig`
- Khi có thay đổi và đang trong chế độ edit (`editingChartId` tồn tại), tự động emit event `real-time-update`
- Event chứa type chart và properties đã được deep clone để tránh reference issues

#### 5.2.2. QuickDashboard.vue - Real-time Handler

```typescript
const onRealTimeUpdate = (update: { type: string; properties: any }) => {
  if (editingChartId.value && currentDashboardId.value) {
    // Update chart-specific properties
    let updates: Partial<DashboardChart> = {
      base: {
        title: chartConfig.value?.title || '',
        dataSourceId: chartConfig.value?.dataSourceId || '',
      },
      properties: {
        [update.type]: update.properties
      }
    }
    dashboardStore.updateChart(currentDashboardId.value, editingChartId.value, updates)
    markUnsaved()
  }
}
```

**Cơ chế hoạt động:**
- Nhận event từ ChartPanel
- Tạo object `updates` với base properties và type-specific properties
- Gọi `dashboardStore.updateChart()` để cập nhật chart trong store
- Mark dashboard là unsaved để nhắc nhở lưu

#### 5.2.3. Field Drop Real-time Update

Khi kéo thả field vào chart, cũng có real-time update:

```typescript
// Trong onFieldDrop function
chartConfig.value.dataSourceId = fieldData.dataSourceId

// Real-time update: if editing a chart, update it immediately
if (editingChartId.value && currentDashboardId.value) {
  let updates: Partial<DashboardChart> = {
    base: {
      title: chartConfig.value.title,
      dataSourceId: chartConfig.value.dataSourceId,
    },
    properties: {
      [selectedChartType.value]: JSON.parse(JSON.stringify(chartConfig.value))
    }
  }
  // Type-specific mapping...
  dashboardStore.updateChart(currentDashboardId.value, editingChartId.value, updates)
  markUnsaved()
}
```

#### 5.2.4. Chart Component Reactivity

Chart components tự động re-render khi props thay đổi:

```typescript
// Trong các chart components (BarChart.vue, CardChart.vue, ...)
watch(() => chartData.value, () => {
  if (hasValidData.value) {
    createChart() // Re-create chart with new data
  }
}, { deep: true })

// Watch for changes in data source
watch(() => dataSourceStore.dataSources, () => {
  if (hasValidData.value) {
    createChart() // Re-create chart when data source changes
  }
}, { deep: true })
```

### 5.3. Lợi Ích Của Real-time Updates

1. **UX Tốt Hơn**: Người dùng thấy kết quả ngay lập tức
2. **Giảm Cognitive Load**: Không cần nhớ click "Update Chart"
3. **Iterative Design**: Dễ dàng thử nghiệm các cấu hình khác nhau
4. **Consistency**: Tất cả thay đổi đều được áp dụng real-time

### 5.4. Performance Considerations

1. **Debouncing**: Có thể thêm debounce để tránh quá nhiều updates
2. **Deep Clone**: Sử dụng `JSON.parse(JSON.stringify())` để tránh reference issues
3. **Conditional Updates**: Chỉ update khi đang edit chart
4. **Chart Re-creation**: Chart components destroy và recreate chart instance để đảm bảo clean state

### 5.5. Error Handling

```typescript
// Trong chart components
try {
  createChart()
} catch (err) {
  console.error('Error creating chart:', err)
  error.value = 'Failed to create chart'
}
```

---
## 6. Luồng cập nhật hiển thị chart khi kéo thả trường dữ liệu vào Chart properties

### Luồng cập nhật hiển thị Table Chart khi kéo thả trường dữ liệu vào cột Columns

1. **Người dùng kéo thả trường dữ liệu vào khu vực Columns của Table chart**
   - Trong giao diện ChartPanel, người dùng kéo một trường dữ liệu (ví dụ: "revenue", "name") và thả vào khu vực "Columns" của Table chart.
   - Sự kiện này sẽ kích hoạt event `field-drop` với target là `'columns'`.

2. **Hàm onFieldDrop cập nhật cấu hình chart**
   - Component cha (ví dụ: `QuickDashboard.vue`) lắng nghe event `field-drop`.
   - Trong handler `onFieldDrop`:
     - Nếu target là `'columns'` và chart config là Table chart, tên trường được thêm vào mảng `chartConfig.value.columns`.

3. **ChartConfig là đối tượng reactive**
   - `chartConfig` là một đối tượng reactive (`ref` hoặc `reactive`).
   - Khi `columns` được cập nhật, các component sử dụng config này sẽ tự động cập nhật theo.

4. **TableChart.vue nhận config mới**
   - Component Table chart preview (`TableChart.vue`) nhận prop chart (chứa config mới).
   - Bên trong TableChart.vue:
     - Tính toán lại `config` (lấy columns, rowLimit, filter...)
     - Tính lại `tableColumns` (danh sách cột hiển thị dựa trên `config.columns`)
     - Tính lại `tableRows` (dữ liệu thực tế để hiển thị)

5. **Lấy dữ liệu từ DataSource**
   - TableChart.vue sử dụng `dataSourceId` từ config để lấy đúng data source từ store (ví dụ: `useDataSourceStore().getDataSourceById(dataSourceId)`).
   - Data source chứa:
     - `columns`: tất cả các cột có trong nguồn dữ liệu
     - `rows`: tất cả các dòng dữ liệu (object key-value)

6. **Xử lý dữ liệu để hiển thị**
   - Table chart strategy (`TableChartStrategy`) xử lý dữ liệu thô:
     - Chỉ lấy các cột được chọn trong `config.columns`.
     - Áp dụng filter và row limit nếu có.
   - Kết quả là mảng các object chỉ chứa các trường đã chọn.

7. **Render bảng dữ liệu**
   - Các cột và dòng đã xử lý được truyền vào component bảng (ví dụ: `EasyDataTable`).
   - Bảng hiển thị:
     - Header: tên các cột từ `config.columns`
     - Rows: dữ liệu tương ứng từng cột

8. **Reactivity (Tính phản ứng)**
   - Nếu người dùng thêm/xóa cột, thay đổi filter hoặc row limit, config sẽ cập nhật.
   - Các computed property trong TableChart.vue sẽ tự động tính lại và bảng sẽ re-render.

#### Sơ đồ luồng

```mermaid
flowchart TD
    A[Người dùng kéo thả trường vào Columns] --> B[onFieldDrop thêm trường vào chartConfig.columns]
    B --> C[TableChart.vue nhận config mới]
    C --> D[Lấy data source theo dataSourceId]
    D --> E[TableChartStrategy xử lý dữ liệu: chọn cột, filter, limit]
    E --> F[TableChart.vue truyền columns/rows vào EasyDataTable]
    F --> G[Bảng hiển thị dữ liệu các cột đã chọn]
```

**Nếu muốn debug hoặc mở rộng luồng này, tập trung vào:**
- Logic `onFieldDrop` ở component cha
- Các computed property và logic lấy dữ liệu trong TableChart.vue
- Định dạng props và reactivity của component bảng

---

## 7. Lưu Ý
- **Component chart** KHÔNG nhận options rời, chỉ nhận `chart`.
- **Config** của mỗi chart lưu trong `chart.properties.<type>`.
- **Tất cả logic đặc thù nằm trong strategy và component riêng.
- **Flow dữ liệu xuyên suốt, type-safe, maintain dễ, mở rộng nhanh.**
- **Real-time updates** hoạt động tự động khi edit chart, không cần manual trigger.

---

