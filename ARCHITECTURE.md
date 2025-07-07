# BI Dashboard - Architecture Documentation (Cập nhật theo Strategy Pattern)

## 🏗️ Tổng quan kiến trúc

BI Dashboard sử dụng kiến trúc **Component-based** kết hợp **Strategy Pattern** cho chart, đảm bảo mở rộng, maintain, type safety cao.

## 📐 Nguyên tắc thiết kế
- **Separation of Concerns**: UI (Vue), State (Pinia), Logic (Strategy), Data (Service)
- **Strategy Pattern cho Chart**: Mỗi loại chart có strategy riêng, component nhận prop chart, tự xử lý config/data
- **Không còn truyền options rời cho chart component**
- **Maintainability & Extensibility**: Thêm chart mới chỉ cần strategy + component

## 🔄 Data Flow Architecture
```
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ Components   │◄──►│   Stores      │◄──►│  Services     │
│ (Vue SFC)    │    │ (Pinia)       │    │ (API Layer)   │
└───────────────┘    └───────────────┘    └───────────────┘
        ▲                    ▲                    ▲
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  Strategy     │    │   Guards      │    │  HTTP Client  │
│ (Chart logic) │    │ (AuthZ)       │    │   (Axios)     │
└───────────────┘    └───────────────┘    └───────────────┘
```
- **Chart Strategy**: Tầng logic riêng cho mỗi loại chart, nhận DashboardChart, trả về config/data/options cho component

## 🎯 Component Architecture
- **Chart Components**: Mỗi chart nhận prop chart, tự xử lý logic, không nhận options rời
- **DashboardChart**: Định nghĩa chuẩn cho mọi chart trong dashboard
- **UI/UX**: Tối ưu cho maintain, test, mở rộng

## 🗂️ Store Architecture
- **DashboardStore**: Quản lý danh sách dashboard, chart, tab, layout
- **Chart lưu dưới dạng DashboardChart, properties theo type**
- **Không còn chartConfig rời trên UI**

## 🔄 Quy trình thêm chart mới
1. Định nghĩa interface/config mới (nếu cần)
2. Tạo component render (MyChart.vue, nhận prop chart)
3. Tạo strategy class (MyChartStrategy.ts)
4. Đăng ký strategy (registry/index.ts)
5. Cập nhật constants/factory/types/UI (nếu cần)
6. Test & hoàn thiện

## 🔒 Security, Performance, Testing, Build
- Không thay đổi, vẫn tuân thủ best practice

## Lưu ý
- Mọi chart mới đều nhận prop chart, tự xử lý logic, không phụ thuộc factory ngoài
- Kiến trúc này giúp maintain dễ, mở rộng nhanh, type safety cao
