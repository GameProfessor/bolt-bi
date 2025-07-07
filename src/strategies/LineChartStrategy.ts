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
      backgroundColor: '#3B82F6',
      borderColor: '#1E40AF',
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

  getRequiredFields(): string[] {
    return ['xAxis', 'yAxis']
  }

  getOptionalFields(): string[] {
    return ['smooth', 'fillArea', 'backgroundColor', 'borderColor', 'colorScheme']
  }

  getSupportedDataTypes(): ('string' | 'number' | 'date')[] {
    return ['string', 'number', 'date']
  }

  getDefaultLayout(): { w: number; h: number } {
    return { w: 8, h: 4 }
  }

  getMinLayout(): { w: number; h: number } {
    return { w: 4, h: 3 }
  }

  getMaxLayout(): { w: number; h: number } {
    return { w: 12, h: 6 }
  }

  getComponent(): any {
    return LineChart
  }

  getPreviewComponent(): any {
    return ChartPreview
  }

  getChartLibrary(): string {
    return 'chartjs'
  }

  processData(data: any[], config: ChartConfig): any {
    if (config.type !== 'line') return data
    
    const lineConfig = config as LineChartConfig
    
    // Sort data by x-axis field
    const sortedData = data.sort((a, b) => {
      const aVal = a[lineConfig.xAxis[0]]
      const bVal = b[lineConfig.xAxis[0]]
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal)
      }
      
      return (aVal || 0) - (bVal || 0)
    })

    // Extract labels and datasets
    const labels = sortedData.map(row => row[lineConfig.xAxis[0]])
    
    const datasets = lineConfig.yAxis.map((yField, index) => ({
      label: yField,
      data: sortedData.map(row => Number(row[yField]) || 0),
      borderColor: this.getColor(index),
      backgroundColor: lineConfig.fillArea ? this.getColor(index, 0.2) : 'transparent',
      borderWidth: 2,
      fill: lineConfig.fillArea,
      tension: lineConfig.smooth ? 0.4 : 0,
      pointRadius: 4,
      pointHoverRadius: 6
    }))

    return {
      labels,
      datasets
    }
  }

  transformToChartOptions(processedData: any, config: ChartConfig): any {
    if (config.type !== 'line') return {}
    const lineConfig = config as LineChartConfig
    const labels = processedData.map((item: any) => item.label)
    const datasets = lineConfig.yAxis.map((yField, index) => ({
      label: yField,
      data: processedData.map((item: any) => item[yField] || 0),
      borderColor: this.getColor(index),
      backgroundColor: lineConfig.fillArea ? this.getColor(index, 0.2) : 'transparent',
      borderWidth: 2,
      fill: lineConfig.fillArea,
      tension: lineConfig.smooth ? 0.4 : 0,
      pointRadius: 4,
      pointHoverRadius: 6
    }))
    return {
      type: 'line',
      data: {
        labels,
        datasets
      },
      options: {
        plugins: {
          legend: { display: true, position: 'top' },
          title: { display: true, text: lineConfig.title }
        },
        responsive: true,
        maintainAspectRatio: false,
        elements: {
          line: { tension: lineConfig.smooth ? 0.4 : 0 }
        },
        scales: {
          x: { beginAtZero: false },
          y: { beginAtZero: true }
        }
      }
    }
  }

  getDataRequirements(): {
    minRows: number
    maxRows: number
    minColumns: number
    maxColumns: number
  } {
    return {
      minRows: 2,
      maxRows: 1000,
      minColumns: 2,
      maxColumns: 10
    }
  }

  getValidationRules(): {
    required: string[]
    optional: string[]
    constraints: Record<string, any>
  } {
    return {
      required: ['xAxis', 'yAxis'],
      optional: ['smooth', 'fillArea'],
      constraints: {
        xAxis: { minLength: 1, maxLength: 1 },
        yAxis: { minLength: 1, maxLength: 5 }
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
        name: 'Doanh số theo thời gian',
        description: 'Biểu đồ đường hiển thị xu hướng doanh số theo tháng',
        config: {
          title: 'Doanh số theo thời gian',
          xAxis: ['month'],
          yAxis: ['sales'],
          smooth: true,
          fillArea: false
        }
      },
      {
        name: 'Nhiều chỉ số theo thời gian',
        description: 'Biểu đồ đường hiển thị nhiều chỉ số cùng lúc',
        config: {
          title: 'Nhiều chỉ số theo thời gian',
          xAxis: ['date'],
          yAxis: ['revenue', 'cost', 'profit'],
          smooth: false,
          fillArea: true
        }
      }
    ]
  }

  private getColor(index: number, alpha: number = 1): string {
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
      '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
    ]
    const color = colors[index % colors.length]
    
    if (alpha < 1) {
      // Convert hex to rgba
      const r = parseInt(color.slice(1, 3), 16)
      const g = parseInt(color.slice(3, 5), 16)
      const b = parseInt(color.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }
    
    return color
  }
}
