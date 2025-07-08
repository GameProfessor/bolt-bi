# HƯỚNG DẪN SỬA CHART: Thêm/Xóa/Sửa Trường Thuộc Tính cho Chart

Tài liệu này hướng dẫn chi tiết quy trình Thêm/Xóa/Sửa trường thuộc tính (field/property) cho một loại chart trong hệ thống dashboard, đảm bảo trường mới hoạt động bình thường, type-safe và đồng bộ UI/backend.

---

## 1. Tổng Quan Kiến Trúc Chart

- **ChartConfig**: Dùng cho UI (ChartPanel.vue), là union type cho từng loại chart.
- **ChartTypeProperties**: Dùng để lưu trữ trong dashboard, là object với property cho từng loại chart.
- **ChartStrategy**: Mỗi loại chart có một strategy class riêng, xử lý config, data transformation, và rendering logic.
- **ChartStrategyRegistry**: Registry pattern để quản lý tất cả chart strategies.

---

## 2. Các Bước Thêm Trường Mới cho Chart

### Bước 1: Định nghĩa type cho trường mới

- **File:** `src/types/chart.ts` (ChartConfig) và `src/types/dashboard.ts` (ChartTypeProperties)
- **Ví dụ:** Thêm trường `decimalPlaces` cho Card Chart

```typescript
// src/types/chart.ts
export interface CardChartConfig extends BaseChartConfig {
  type: 'card'
  field: string
  aggregation: 'sum' | 'avg' | 'min' | 'max'
  decimalPlaces?: number // Thêm trường mới
  colorScheme: string
  filter: string
}
```

```typescript
// src/types/dashboard.ts
export interface ChartTypeProperties {
  // ...
  card?: {
    field: string
    aggregation?: 'sum' | 'avg' | 'min' | 'max'
    decimalPlaces?: number // Thêm trường mới
    colorScheme?: string
    filter?: string
  }
}
```

- Nếu trường mới áp dụng cho nhiều loại chart, thêm vào các interface tương ứng.

### Bước 2: Cập nhật Strategy class

- **File:** `src/strategies/CardChartStrategy.ts` (hoặc strategy tương ứng)
- Cập nhật method `createDefaultConfig()` để thêm giá trị mặc định:

```typescript
createDefaultConfig(): CardChartConfig {
  return {
    type: 'card',
    title: 'Card Chart',
    dataSourceId: '',
    colorScheme: 'default',
    field: '',
    aggregation: 'sum',
    decimalPlaces: 0, // Giá trị mặc định
    filter: ''
  }
}
```

- Cập nhật method `validateConfig()` nếu cần:

```typescript
validateConfig(config: ChartConfig): boolean {
  if (config.type !== 'card') return false
  
  const cardConfig = config as CardChartConfig
  return !!(
    cardConfig.title &&
    cardConfig.dataSourceId &&
    cardConfig.field &&
    typeof cardConfig.decimalPlaces === 'number' // Kiểm tra trường mới
  )
}
```

### Bước 3: Cập nhật UI để hiển thị/truy cập trường mới

- **File:** `src/pages/dashboard/components/ChartPanel.vue`
- Thêm input cho trường mới vào phần cấu hình chart tương ứng (dùng v-model với chartConfig).

```vue
<!-- Thêm vào phần Card Chart -->
<div v-if="selectedChartType === 'card'">
  <!-- ... -->
  <div class="mt-3">
    <label class="block text-xs font-medium text-gray-600 mb-1">Số chữ số thập phân</label>
    <input
      v-model.number="cardDecimalPlaces"
      type="number"
      min="0"
      max="10"
      class="w-full text-sm rounded border-gray-300 shadow-sm"
    />
  </div>
</div>
```

- Đảm bảo có computed property cho trường mới:

```typescript
const cardDecimalPlaces = computed({
  get: () => (props.chartConfig && isCardChartConfig(props.chartConfig)) ? (props.chartConfig.decimalPlaces || 0) : 0,
  set: (value: number) => {
    if (props.chartConfig && isCardChartConfig(props.chartConfig)) props.chartConfig.decimalPlaces = value
  }
})
```

### Bước 4: Cập nhật logic lưu/đọc field

- Đảm bảo khi lưu chart, trường mới được truyền vào object config/properties.
- Khi render chart, trường mới được sử dụng đúng.
- Nếu có mapping giữa ChartConfig và ChartTypeProperties, cập nhật mapping này.
- **Lưu ý quan trọng:** Khi cập nhật hoặc tạo chart (ví dụ trong hàm updateChart/addChart hoặc dashboardStore.updateChart/addChart), cần truyền đầy đủ các trường mới từ ChartConfig vào object properties của chart.
- **Ví dụ thực tế cho Card Chart:**
  ```typescript
  updates.properties = {
    card: {
      field: chartConfig.value.field,
      aggregation: chartConfig.value.aggregation,
      decimalPlaces: chartConfig.value.decimalPlaces,
      colorScheme: chartConfig.value.colorScheme,
      filter: chartConfig.value.filter,
      subHeader: chartConfig.value.subHeader // BẮT BUỘC truyền trường mới vào đây
    }
  }
  ```
- Nếu không truyền trường mới vào object properties, field sẽ không được lưu và không hiển thị khi render preview/chart.
- Luôn kiểm tra lại logic mapping khi thêm field mới để tránh lỗi không đồng bộ dữ liệu.

### Bước 5: Cập nhật component hiển thị chart

- **File:** `src/components/charts/types/CardChart.vue` (hoặc BarChart.vue, PieChart.vue, ...)
- Đọc và sử dụng trường mới khi render chart.

```typescript
const decimalPlaces = computed(() => props.chart.properties.card?.decimalPlaces ?? 0)
// Khi format số:
const formattedValue = computed(() => value.value.toFixed(decimalPlaces.value))
```

### Bước 6: Cập nhật Strategy data processing (nếu cần)

- **File:** `src/strategies/CardChartStrategy.ts`
- Nếu trường mới ảnh hưởng đến data processing, cập nhật method `processData()`:

```typescript
processData(data: any[], config: ChartConfig): any {
  if (config.type !== 'card') return data
  const cardConfig = config as CardChartConfig
  
  // Xử lý data với trường mới decimalPlaces
  const processedData = data.map(row => ({
    ...row,
    formattedValue: Number(row[cardConfig.field]).toFixed(cardConfig.decimalPlaces || 0)
  }))
  
  return processedData
}
```

### Bước 7: Cập nhật validate, type guard, helper liên quan

- **File:** `src/types/chart.ts`
- Nếu có hàm validate, type guard, cập nhật để kiểm tra trường mới:

```typescript
export function isCardChartConfig(config: ChartConfig): config is CardChartConfig {
  return config.type === 'card'
}
// ...
export function isChartConfigValid(config: ChartConfig): boolean {
  // ...
  case 'card':
    return !!config.field && typeof config.decimalPlaces === 'number'
}
```

### Bước 8: Cập nhật style nếu trường mới ảnh hưởng đến style

- Nếu trường mới là style (color, background, ...), cập nhật object style (ví dụ: `cardColorSchemes`) và logic render style trong component chart.

### Bước 9: Test lại UI và logic

- Tạo mới chart, chỉnh sửa chart, kiểm tra trường mới xuất hiện và hoạt động đúng.
- Kiểm tra trường hợp trường mới không có giá trị (default).
- Kiểm tra lưu, load, render chart với trường mới.

---

## 3. Các Bước Xóa Trường Thuộc Tính

1. Xóa trường khỏi type (ChartConfig, ChartTypeProperties).
2. Xóa input liên quan trong UI (ChartPanel.vue).
3. Xóa logic sử dụng trường đó trong strategy class.
4. Xóa logic sử dụng trường đó trong component chart.
5. Xóa validate, type guard, helper liên quan.
6. Test lại việc tạo/sửa chart để đảm bảo không lỗi.

---

## 4. Các Bước Sửa Trường Thuộc Tính

1. Sửa tên/trường trong type (ChartConfig, ChartTypeProperties).
2. Sửa UI (ChartPanel.vue) cho đúng tên/trường mới.
3. Sửa logic trong strategy class.
4. Sửa logic lưu/đọc, mapping, validate, render liên quan.
5. Sửa style nếu cần.
6. Test lại toàn bộ luồng tạo/sửa chart.

---

## 5. Checklist Khi Thêm/Xóa/Sửa Field hoặc Style

- [ ] Cập nhật type (ChartConfig, ChartTypeProperties)
- [ ] Cập nhật strategy class (createDefaultConfig, validateConfig, processData nếu cần)
- [ ] Cập nhật UI (ChartPanel.vue)
- [ ] Cập nhật logic lưu/đọc config
- [ ] Cập nhật component hiển thị chart
- [ ] Cập nhật object color scheme (nếu liên quan style)
- [ ] Cập nhật validate, type guard, helper
- [ ] Test lại việc tạo/sửa chart trên dashboard

---

## 6. Lưu ý

- Luôn đảm bảo type an toàn, không để field thừa/thừa logic cũ.
- Nếu thêm field mới, nên có giá trị mặc định hợp lý trong strategy `createDefaultConfig()`.
- Nếu xóa field, kiểm tra kỹ các nơi sử dụng (UI, strategy, render, validate...).
- Nếu thêm chart mới, hãy làm tương tự: định nghĩa type, UI, strategy, component, style.
- Sử dụng `chartStrategyRegistry` và `ChartUtils` để truy cập chart strategies thay vì truy cập trực tiếp.

---

**Tài liệu này áp dụng cho tất cả các loại chart. Nếu thêm chart mới, hãy làm tương tự: định nghĩa type, UI, strategy, component, style.** 