/**
 * Chart Types Constants
 * Định nghĩa các hằng số cho chart types
 */

import type { ChartType } from '@/types/chart'

export const CHART_TYPES: Record<ChartType, { label: string; icon: string; description: string }> = {
  bar: {
    label: 'Bar Chart',
    icon: 'ChartBarIcon',
    description: 'Hiển thị dữ liệu dưới dạng cột dọc'
  },
  line: {
    label: 'Line Chart', 
    icon: 'ChartLineIcon',
    description: 'Hiển thị xu hướng dữ liệu theo thời gian'
  },
  pie: {
    label: 'Pie Chart',
    icon: 'ChartPieIcon', 
    description: 'Hiển thị tỷ lệ phần trăm của các phần'
  },
  doughnut: {
    label: 'Doughnut Chart',
    icon: 'ChartDonutIcon',
    description: 'Biểu đồ tròn có lỗ ở giữa'
  },
  area: {
    label: 'Area Chart',
    icon: 'ChartAreaIcon',
    description: 'Biểu đồ đường có tô màu vùng bên dưới'
  },
  scatter: {
    label: 'Scatter Plot',
    icon: 'ChartScatterIcon', 
    description: 'Hiển thị mối quan hệ giữa hai biến số'
  },
  bubble: {
    label: 'Bubble Chart',
    icon: 'ChartBubbleIcon',
    description: 'Biểu đồ scatter với kích thước bong bóng'
  },
  radar: {
    label: 'Radar Chart',
    icon: 'ChartRadarIcon',
    description: 'Biểu đồ hình sao đa chiều'
  },
  polarArea: {
    label: 'Polar Area Chart', 
    icon: 'ChartPolarIcon',
    description: 'Biểu đồ vùng cực'
  },
  gauge: {
    label: 'Gauge Chart',
    icon: 'ChartGaugeIcon',
    description: 'Biểu đồ đồng hồ đo'
  },
  funnel: {
    label: 'Funnel Chart',
    icon: 'ChartFunnelIcon', 
    description: 'Biểu đồ phễu chuyển đổi'
  },
  heatmap: {
    label: 'Heatmap',
    icon: 'ChartHeatmapIcon',
    description: 'Bản đồ nhiệt hiển thị mật độ dữ liệu'
  },
  treemap: {
    label: 'Treemap',
    icon: 'ChartTreemapIcon',
    description: 'Biểu đồ cây phân cấp'
  },
  card: {
    label: 'KPI Card',
    icon: 'Squares2X2Icon',
    description: 'Thẻ hiển thị chỉ số KPI'
  }
}

export const CHART_CATEGORIES = {
  BASIC: {
    label: 'Cơ bản',
    types: ['bar', 'line', 'pie', 'doughnut'] as ChartType[]
  },
  ADVANCED: {
    label: 'Nâng cao', 
    types: ['area', 'scatter', 'bubble', 'radar'] as ChartType[]
  },
  SPECIALIZED: {
    label: 'Chuyên dụng',
    types: ['gauge', 'funnel', 'heatmap', 'treemap', 'polarArea'] as ChartType[]
  }
}

export const DEFAULT_CHART_COLORS = [
  '#3B82F6', // blue-500
  '#EF4444', // red-500  
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#8B5CF6', // violet-500
  '#EC4899', // pink-500
  '#06B6D4', // cyan-500
  '#84CC16', // lime-500
  '#F97316', // orange-500
  '#6366F1', // indigo-500
]

export const CHART_COLOR_PALETTES = {
  DEFAULT: DEFAULT_CHART_COLORS,
  PASTEL: [
    '#FEF3C7', '#DBEAFE', '#D1FAE5', '#FCE7F3', 
    '#E0E7FF', '#FEF0E7', '#ECFDF5', '#FDF2F8'
  ],
  VIBRANT: [
    '#DC2626', '#EA580C', '#D97706', '#65A30D',
    '#059669', '#0891B2', '#2563EB', '#7C3AED'
  ],
  MONOCHROME: [
    '#111827', '#374151', '#6B7280', '#9CA3AF',
    '#D1D5DB', '#E5E7EB', '#F3F4F6', '#F9FAFB'
  ]
}

export const AGGREGATION_TYPES = {
  sum: { label: 'Tổng', description: 'Tính tổng các giá trị' },
  avg: { label: 'Trung bình', description: 'Tính giá trị trung bình' },
  count: { label: 'Đếm', description: 'Đếm số lượng bản ghi' },
  min: { label: 'Nhỏ nhất', description: 'Giá trị nhỏ nhất' },
  max: { label: 'Lớn nhất', description: 'Giá trị lớn nhất' },
  median: { label: 'Trung vị', description: 'Giá trị trung vị' },
  mode: { label: 'Yếu vị', description: 'Giá trị xuất hiện nhiều nhất' },
  stddev: { label: 'Độ lệch chuẩn', description: 'Độ lệch chuẩn' }
} as const
