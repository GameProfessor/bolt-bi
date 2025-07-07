---

## 7. Hướng Dẫn Thêm Chart Mới

Quy trình này giúp bạn thêm một loại chart hoàn toàn mới (ví dụ: Gauge, Heatmap, ...), đảm bảo đồng bộ, type-safe và dễ mở rộng.

### Bước 1: Định nghĩa type cho chart mới

- **File:** `src/types/chart.ts` (ChartConfig) và `src/types/dashboard.ts` (ChartTypeProperties)
- Thêm type mới vào ChartType:

```ts
// src/types/chart.ts
export type ChartType = ... | 'gauge' | ...

export interface GaugeChartConfig extends BaseChartConfig {
  type: 'gauge'
  value: string
  min?: number
  max?: number
  thresholds?: Array<{ value: number, color: string }>
}
```

- Thêm vào union ChartConfig:

```ts
export type ChartConfig = ... | GaugeChartConfig
```

- Thêm property mới vào ChartTypeProperties:

```ts
// src/types/dashboard.ts
export interface ChartTypeProperties {
  // ...
  gauge?: {
    value: string
    min?: number
    max?: number
    thresholds?: Array<{ value: number, color: string }>
  }
}
```

### Bước 2: Thêm config mặc định cho chart mới

- **File:** `src/types/chart.ts`
- Cập nhật hàm `createDefaultChartConfig`:

```ts
case 'gauge':
  return {
    ...baseConfig,
    type: 'gauge',
    value: '',
    min: 0,
    max: 100,
    thresholds: []
  }
```

### Bước 3: Tạo component hiển thị chart mới

- **File:** `src/components/charts/types/GaugeChart.vue`
- Tạo component nhận prop là `chart: DashboardChart` và render theo config.

### Bước 4: Tạo strategy cho chart mới

- **File:** `src/components/charts/strategies/GaugeChartStrategy.ts` (nếu dùng Strategy Pattern)
- Định nghĩa class xử lý transform data, config, render logic cho chart mới.

### Bước 5: Cập nhật UI để cấu hình chart mới

- **File:** `src/pages/dashboard/components/ChartPanel.vue`
- Thêm vào danh sách chartTypes, icon, label.
- Thêm các input cho trường dữ liệu của chart mới (dùng v-model với chartConfig).

### Bước 6: Cập nhật validate, type guard, helper

- **File:** `src/types/chart.ts`
- Thêm type guard, validate cho chart mới:

```ts
export function isGaugeChartConfig(config: ChartConfig): config is GaugeChartConfig {
  return config.type === 'gauge'
}
```

### Bước 7: Cập nhật render động chart

- **File:** `src/components/charts/ChartPreview.vue` (hoặc nơi render chart động)
- Thêm case render GaugeChart khi type là 'gauge'.

### Bước 8: Cập nhật mapping lưu/đọc giữa ChartConfig và ChartTypeProperties

- Đảm bảo khi lưu chart, config được map đúng sang ChartTypeProperties.gauge và ngược lại khi load.

### Bước 9: Test lại toàn bộ luồng

- Tạo mới chart, chỉnh sửa, lưu, load, render chart mới.
- Kiểm tra validate, UI, style, dữ liệu.

---

**Lưu ý:**
- Luôn cập nhật đầy đủ cả ChartConfig (UI), ChartTypeProperties (lưu trữ), component, strategy, validate, render.
- Đảm bảo type-safe, không để sót trường hoặc logic.
- Nếu chart mới có style riêng, định nghĩa object style tương ứng.

---

**Tài liệu này đã bao gồm hướng dẫn thêm, sửa, xóa field và thêm chart mới cho hệ thống dashboard chart.** 