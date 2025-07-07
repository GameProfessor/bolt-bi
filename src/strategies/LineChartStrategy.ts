import type { ChartStrategy } from './ChartStrategy'
import type { LineChartConfig, ChartConfig } from '@/types/chart'
import LineChart from '@/components/charts/types/LineChart.vue'
import ChartPreview from '@/components/charts/ChartPreview.vue'

export class LineChartStrategy implements ChartStrategy {
  type = 'line' as const
  label = 'Line Chart'
  description = 'Hiển thị xu hướng dữ liệu theo thời gian'
  icon = 'PresentationChartLineIcon'
  category = 'BASIC' as const

  createDefaultConfig(): LineChartConfig {
    return {
      type: 'line',
      title: 'Line Chart',
      dataSourceId: '',
      colorScheme: 'default',
      xAxis: [],
      yAxis: [],
      smooth: false,
      fillArea: false
    }
  }

  validateConfig(config: ChartConfig): boolean {
    if (config.type !== 'line') return false
    
    const lineConfig = config as LineChartConfig
    return !!(
      lineConfig.title &&
      lineConfig.dataSourceId &&
      lineConfig.xAxis &&
      lineConfig.yAxis &&
      lineConfig.xAxis.length > 0 &&
      lineConfig.yAxis.length > 0
    )
  }

  getDefaultLayout(): { w: number; h: number } {
    return { w: 4, h: 3 }
  }

  getComponent(): any {
    return LineChart
  }

  getPreviewComponent(): any {
    return ChartPreview
  }

  processData(data: any[], config: ChartConfig): any {
    if (config.type !== 'line') return data
    const lineConfig = config as LineChartConfig
    
    // Sort data by x-axis field
    const sortedData = [...data].sort((a, b) => {
      const aVal = a[lineConfig.xAxis[0]]
      const bVal = b[lineConfig.xAxis[0]]
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
    })
    
    return sortedData
  }

  transformToChartOptions(processedData: any, config: ChartConfig): any {
    if (config.type !== 'line') return {}
    const lineConfig = config as LineChartConfig
    
    const labels = processedData.map((item: any) => item[lineConfig.xAxis[0]])
    const datasets = lineConfig.yAxis.map((yField, index) => ({
      label: yField,
      data: processedData.map((item: any) => item[yField] || 0),
      borderColor: this.getColor(index),
      backgroundColor: this.getColor(index) + '20',
      borderWidth: 2,
      fill: lineConfig.fillArea,
      tension: lineConfig.smooth ? 0.4 : 0,
      pointRadius: 4
    }))
    
    return {
      type: 'line',
      data: {
        labels,
        datasets
      },
      options: {
        plugins: {
          legend: { display: true },
          title: { display: true, text: lineConfig.title }
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

  exportConfig(config: ChartConfig): any {
    if (config.type !== 'line') return config
    return {
      ...config,
      exportVersion: '1.0',
      exportDate: new Date().toISOString()
    }
  }

  importConfig(data: any): LineChartConfig {
    return {
      ...this.createDefaultConfig(),
      ...data
    }
  }

  getHelpText(): string {
    return `
      Line Chart là biểu đồ đường hiển thị xu hướng dữ liệu theo thời gian.
      
      Cách sử dụng:
      1. Chọn trường dữ liệu cho trục X (thời gian hoặc danh mục)
      2. Chọn một hoặc nhiều trường dữ liệu cho trục Y (giá trị)
      3. Bật tùy chọn "Smooth" để làm mượt đường
      4. Bật tùy chọn "Fill Area" để tô màu vùng dưới đường
      5. Tùy chỉnh màu sắc và bố cục
      
      Lưu ý: Line chart phù hợp cho dữ liệu có thứ tự thời gian
    `
  }

  getExamples(): Array<{
    name: string
    description: string
    config: Partial<ChartConfig>
  }> {
    return [
      {
        name: 'Doanh số theo tháng',
        description: 'Biểu đồ đường hiển thị xu hướng doanh số theo tháng',
        config: {
          title: 'Doanh số theo tháng',
          xAxis: ['month'],
          yAxis: ['sales'],
          smooth: true,
          fillArea: false
        }
      },
      {
        name: 'So sánh nhiều sản phẩm',
        description: 'Biểu đồ đường so sánh doanh số nhiều sản phẩm',
        config: {
          title: 'So sánh nhiều sản phẩm',
          xAxis: ['date'],
          yAxis: ['product_a', 'product_b', 'product_c'],
          smooth: false,
          fillArea: true
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
}
