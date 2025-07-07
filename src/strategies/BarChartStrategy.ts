import type { ChartStrategy } from './ChartStrategy'
import type { BarChartConfig, ChartConfig } from '@/types/chart'
import BarChart from '@/components/charts/types/BarChart.vue'
import ChartPreview from '@/components/charts/ChartPreview.vue'
// Icon is referenced as string in the interface

export class BarChartStrategy implements ChartStrategy {
  type = 'bar' as const
  label = 'Bar Chart'
  description = 'Hiển thị dữ liệu dưới dạng cột dọc'
  icon = 'ChartBarIcon'
  category = 'BASIC' as const

  // Tạo config mặc định cho Bar Chart
  createDefaultConfig(): BarChartConfig {
    return {
      type: 'bar',
      title: 'Bar Chart',
      dataSourceId: '',
      backgroundColor: '#3B82F6',
      borderColor: '#1E40AF',
      colorScheme: 'default',
      xAxis: [],
      yAxis: [],
      horizontal: false,
      stackedDimension: [],
      stacked: false,
      sortXAxisBy: '',
      sortDescending: false,
      filter: '',
      showLegend: true
    }
  }

  // Kiểm tra tính hợp lệ của config
  validateConfig(config: ChartConfig): boolean {
    if (config.type !== 'bar') return false
    
    const barConfig = config as BarChartConfig
    return !!(
      barConfig.title &&
      barConfig.dataSourceId &&
      barConfig.xAxis &&
      barConfig.yAxis &&
      barConfig.xAxis.length > 0 &&
      barConfig.yAxis.length > 0
    )
  }

  getRequiredFields(): string[] {
    return ['xAxis', 'yAxis']
  }

  getOptionalFields(): string[] {
    return ['horizontal', 'stacked', 'backgroundColor', 'borderColor', 'colorScheme']
  }

  getSupportedDataTypes(): ('string' | 'number' | 'date')[] {
    return ['string', 'number', 'date']
  }

  getDefaultLayout(): { w: number; h: number } {
    return { w: 6, h: 4 }
  }

  getMinLayout(): { w: number; h: number } {
    return { w: 3, h: 3 }
  }

  getMaxLayout(): { w: number; h: number } {
    return { w: 12, h: 8 }
  }

  getComponent(): any {
    return BarChart
  }

  getPreviewComponent(): any {
    return ChartPreview
  }

  // Xác định thư viện chart sử dụng để render (ở đây là Chart.js)
  getChartLibrary(): string {
    return 'chartjs'
  }

  /**
   * Bước 1: Xử lý dữ liệu thô từ data source thành dữ liệu trung gian (intermediate)
   * - Kết quả trả về là mảng các object dạng { label, ...yField }
   * - Chỉ xử lý logic, KHÔNG phụ thuộc vào thư viện vẽ
   */
  processData(data: any[], config: ChartConfig): any {
    if (config.type !== 'bar') return data
    const barConfig = config as BarChartConfig
    // Gom nhóm dữ liệu theo trường xAxis
    const groupedData = data.reduce((acc, row) => {
      const xValue = row[barConfig.xAxis[0]]
      if (!acc[xValue]) {
        acc[xValue] = {}
      }
      barConfig.yAxis.forEach(yField => {
        if (!acc[xValue][yField]) {
          acc[xValue][yField] = 0
        }
        acc[xValue][yField] += Number(row[yField]) || 0
      })
      return acc
    }, {} as Record<string, Record<string, number>>)
    // Chuyển sang mảng intermediate
    return Object.keys(groupedData).map(label => ({
      label,
      ...groupedData[label]
    }))
  }

  /**
   * Bước 2: Chuyển dữ liệu trung gian sang options/dataset đúng chuẩn thư viện Chart.js
   * - Kết quả trả về là object options cho Chart.js
   * - Nếu sau này dùng thư viện khác, chỉ cần đổi hàm này
   */
  transformToChartOptions(processedData: any, config: ChartConfig): any {
    if (config.type !== 'bar') return {}
    const barConfig = config as BarChartConfig
    const labels = processedData.map((item: any) => item.label)
    const datasets = barConfig.yAxis.map((yField, index) => ({
      label: yField,
      data: processedData.map((item: any) => item[yField] || 0),
      backgroundColor: this.getColor(index),
      borderColor: this.getBorderColor(index),
      borderWidth: 1
    }))
    return {
      type: 'bar',
      data: {
        labels,
        datasets
      },
      options: {
        indexAxis: barConfig.horizontal ? 'y' : 'x',
        plugins: {
          legend: { display: barConfig.showLegend ?? true },
          title: { display: true, text: barConfig.title }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { beginAtZero: true },
          y: { beginAtZero: true }
        }
      }
    }
  }

  // Yêu cầu dữ liệu tối thiểu/tối đa
  getDataRequirements(): {
    minRows: number
    maxRows: number
    minColumns: number
    maxColumns: number
  } {
    return {
      minRows: 1,
      maxRows: 1000,
      minColumns: 2,
      maxColumns: 10
    }
  }

  // Quy tắc validation cho config
  getValidationRules(): {
    required: string[]
    optional: string[]
    constraints: Record<string, any>
  } {
    return {
      required: ['xAxis', 'yAxis'],
      optional: ['horizontal', 'stacked'],
      constraints: {
        xAxis: { minLength: 1, maxLength: 1 },
        yAxis: { minLength: 1, maxLength: 5 }
      }
    }
  }

  // Export config (dùng cho export/import dashboard)
  exportConfig(config: ChartConfig): any {
    if (config.type !== 'bar') return config
    return {
      ...config,
      exportVersion: '1.0',
      exportDate: new Date().toISOString()
    }
  }

  // Import config (dùng cho import dashboard)
  importConfig(data: any): BarChartConfig {
    return {
      ...this.createDefaultConfig(),
      ...data
    }
  }

  // Text hướng dẫn sử dụng
  getHelpText(): string {
    return `
      Bar Chart là biểu đồ cột dọc hoặc ngang để so sánh các giá trị.
      
      Cách sử dụng:
      1. Chọn trường dữ liệu cho trục X (danh mục)
      2. Chọn một hoặc nhiều trường dữ liệu cho trục Y (giá trị)
      3. Tùy chỉnh màu sắc và bố cục
      4. Bật tùy chọn "Ngang" để hiển thị cột ngang
      5. Bật tùy chọn "Xếp chồng" để xếp các cột lên nhau
    `
  }

  // Ví dụ cấu hình chart
  getExamples(): Array<{
    name: string
    description: string
    config: Partial<ChartConfig>
  }> {
    return [
      {
        name: 'Doanh số theo tháng',
        description: 'Biểu đồ cột hiển thị doanh số bán hàng theo từng tháng',
        config: {
          title: 'Doanh số theo tháng',
          xAxis: ['month'],
          yAxis: ['sales'],
          horizontal: false,
          stacked: false
        }
      },
      {
        name: 'So sánh sản phẩm',
        description: 'Biểu đồ cột ngang so sánh doanh số các sản phẩm',
        config: {
          title: 'So sánh sản phẩm',
          xAxis: ['product'],
          yAxis: ['revenue'],
          horizontal: true,
          stacked: false
        }
      }
    ]
  }

  // Helper: lấy màu cho từng dataset
  private getColor(index: number): string {
    const palette = [
      '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
      '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1'
    ]
    return palette[index % palette.length]
  }

  // Helper: lấy màu viền cho từng dataset
  private getBorderColor(index: number): string {
    const palette = [
      '#1e40af', '#991b1b', '#065f46', '#92400e', '#6d28d9',
      '#0e7490', '#c2410c', '#365314', '#be185d', '#4338ca'
    ]
    return palette[index % palette.length]
  }
}
