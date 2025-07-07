import type { ChartStrategy } from './ChartStrategy'
import type { PieChartConfig, ChartConfig } from '@/types/chart'
import PieChart from '@/components/charts/types/PieChart.vue'
import ChartPreview from '@/components/charts/ChartPreview.vue'

export class PieChartStrategy implements ChartStrategy {
  type = 'pie' as const
  label = 'Pie Chart'
  description = 'Hiển thị tỷ lệ phần trăm của các phần'
  icon = 'ChartPieIcon'
  category = 'BASIC' as const

  createDefaultConfig(): PieChartConfig {
    return {
      type: 'pie',
      title: 'Pie Chart',
      dataSourceId: '',
      backgroundColor: '#3B82F6',
      borderColor: '#1E40AF',
      colorScheme: 'default',
      category: '',
      value: '',
      donut: false
    }
  }

  validateConfig(config: ChartConfig): boolean {
    if (config.type !== 'pie') return false
    
    const pieConfig = config as PieChartConfig
    return !!(
      pieConfig.title &&
      pieConfig.dataSourceId &&
      pieConfig.category &&
      pieConfig.value
    )
  }

  getRequiredFields(): string[] {
    return ['category', 'value']
  }

  getOptionalFields(): string[] {
    return ['donut', 'backgroundColor', 'borderColor', 'colorScheme']
  }

  getSupportedDataTypes(): ('string' | 'number' | 'date')[] {
    return ['string', 'number']
  }

  getDefaultLayout(): { w: number; h: number } {
    return { w: 4, h: 4 }
  }

  getMinLayout(): { w: number; h: number } {
    return { w: 3, h: 3 }
  }

  getMaxLayout(): { w: number; h: number } {
    return { w: 8, h: 8 }
  }

  getComponent(): any {
    return PieChart
  }

  getPreviewComponent(): any {
    return ChartPreview
  }

  getChartLibrary(): string {
    return 'chartjs'
  }

  processData(data: any[], config: ChartConfig): any {
    if (config.type !== 'pie') return data
    
    const pieConfig = config as PieChartConfig
    
    // Group data by category field and sum values
    const groupedData = data.reduce((acc, row) => {
      const category = row[pieConfig.category]
      const value = Number(row[pieConfig.value]) || 0
      
      if (!acc[category]) {
        acc[category] = 0
      }
      acc[category] += value
      
      return acc
    }, {} as Record<string, number>)

    // Transform to chart.js format
    const labels = Object.keys(groupedData)
    const values = Object.values(groupedData)
    const backgroundColor = this.getColors(labels.length)

    return {
      labels,
      datasets: [{
        data: values,
        backgroundColor,
        borderColor: backgroundColor.map(color => this.darkenColor(color)),
        borderWidth: 2
      }]
    }
  }

  transformToChartOptions(processedData: any, config: ChartConfig): any {
    if (config.type !== 'pie') return {}
    const pieConfig = config as PieChartConfig
    const labels = processedData.map((item: any) => item.label)
    const values = processedData.map((item: any) => item.value)
    const backgroundColor = this.getColors(labels.length)
    return {
      type: pieConfig.donut ? 'doughnut' : 'pie',
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor,
          borderColor: backgroundColor.map(color => this.darkenColor(color)),
          borderWidth: 2
        }]
      },
      options: {
        plugins: {
          legend: { display: true, position: 'top' },
          title: { display: true, text: pieConfig.title }
        },
        responsive: true,
        maintainAspectRatio: false
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
      minRows: 1,
      maxRows: 50,
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
      required: ['category', 'value'],
      optional: ['donut'],
      constraints: {
        category: { type: 'string' },
        value: { type: 'number' }
      }
    }
  }

  exportConfig(config: ChartConfig): any {
    if (config.type !== 'pie') return config
    return {
      ...config,
      exportVersion: '1.0',
      exportDate: new Date().toISOString()
    }
  }

  importConfig(data: any): PieChartConfig {
    return {
      ...this.createDefaultConfig(),
      ...data
    }
  }

  getHelpText(): string {
    return `
      Pie Chart là biểu đồ tròn hiển thị tỷ lệ phần trăm của các phần.
      
      Cách sử dụng:
      1. Chọn trường dữ liệu cho danh mục (Category)
      2. Chọn trường dữ liệu cho giá trị (Value)
      3. Tùy chỉnh màu sắc và bố cục
      4. Bật tùy chọn "Donut" để tạo biểu đồ hình vòng
      
      Lưu ý: Pie chart phù hợp cho dữ liệu có ít hơn 10 danh mục
    `
  }

  getExamples(): Array<{
    name: string
    description: string
    config: Partial<ChartConfig>
  }> {
    return [
      {
        name: 'Phân bố doanh số theo khu vực',
        description: 'Biểu đồ tròn hiển thị tỷ lệ doanh số theo từng khu vực',
        config: {
          title: 'Phân bố doanh số theo khu vực',
          category: 'region',
          value: 'sales',
          donut: false
        }
      },
      {
        name: 'Tỷ lệ sản phẩm bán ra',
        description: 'Biểu đồ donut hiển thị tỷ lệ các sản phẩm bán ra',
        config: {
          title: 'Tỷ lệ sản phẩm bán ra',
          category: 'product',
          value: 'quantity',
          donut: true
        }
      }
    ]
  }

  private getColors(count: number): string[] {
    const colors = [
      '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
      '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
    ]
    return colors.slice(0, count)
  }

  private darkenColor(color: string): string {
    const num = parseInt(color.replace('#', ''), 16)
    const amt = Math.round(2.55 * -20)
    const R = (num >> 16) + amt
    const G = (num >> 8 & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt
    return '#' + (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1)
  }
}
