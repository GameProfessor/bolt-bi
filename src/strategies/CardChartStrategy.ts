import type { ChartStrategy } from './ChartStrategy'
import type { CardChartConfig, ChartConfig } from '@/types/chart'
import CardChart from '@/components/charts/types/CardChart.vue'
import ChartPreview from '@/components/charts/ChartPreview.vue'

export class CardChartStrategy implements ChartStrategy {
  type = 'card' as const
  label = 'Card'
  description = 'Hiển thị giá trị tổng hợp (tổng, trung bình, ...)' 
  icon = 'Squares2X2Icon'
  category = 'SPECIALIZED' as const

  // Tạo config mặc định cho Card Chart
  createDefaultConfig(): CardChartConfig {
    return {
      type: 'card',
      title: 'Card',
      dataSourceId: '',
      field: '',
      aggregation: 'sum', // sum | avg | min | max
      decimalPlaces: 0,
      colorScheme: 'default',
      filter: ''
    }
  }

  // Kiểm tra tính hợp lệ của config
  validateConfig(config: ChartConfig): boolean {
    if (config.type !== 'card') return false
    const cardConfig = config as CardChartConfig
    return !!(cardConfig.title && cardConfig.dataSourceId && cardConfig.field)
  }

  getRequiredFields(): string[] {
    return ['field']
  }

  getOptionalFields(): string[] {
    return ['aggregation', 'decimalPlaces', 'colorScheme', 'filter']
  }

  getSupportedDataTypes(): ('string' | 'number' | 'date')[] {
    return ['number']
  }

  getDefaultLayout(): { w: number; h: number } {
    return { w: 2, h: 2 }
  }

  getMinLayout(): { w: number; h: number } {
    return { w: 1, h: 1 }
  }

  getMaxLayout(): { w: number; h: number } {
    return { w: 4, h: 4 }
  }

  getComponent(): any {
    return CardChart
  }

  getPreviewComponent(): any {
    return ChartPreview
  }

  // Xác định thư viện chart sử dụng để render (ở đây là custom component)
  getChartLibrary(): string {
    return 'custom'
  }

  /**
   * Bước 1: Xử lý dữ liệu thô thành giá trị tổng hợp (sum, avg, min, max)
   * - Không phụ thuộc vào component render
   */
  processData(data: any[], config: ChartConfig): any {
    if (config.type !== 'card') return null
    const cardConfig = config as CardChartConfig
    // Apply filter if present (simple JS eval, production should use safe parser)
    let filtered = data
    if (cardConfig.filter && cardConfig.filter.trim()) {
      try {
        filtered = data.filter(row => eval(cardConfig.filter.replace(/\b(\w+)\b/g, 'row.$1')))
      } catch (e) {
        // ignore filter error, fallback to all data
      }
    }
    const values = filtered.map(row => Number(row[cardConfig.field])).filter(v => !isNaN(v))
    if (!values.length) return null
    let value = 0
    switch (cardConfig.aggregation) {
      case 'avg':
        value = values.reduce((a, b) => a + b, 0) / values.length
        break
      case 'min':
        value = Math.min(...values)
        break
      case 'max':
        value = Math.max(...values)
        break
      case 'sum':
      default:
        value = values.reduce((a, b) => a + b, 0)
        break
    }
    return value
  }

  /**
   * Bước 2: Chuyển giá trị tổng hợp sang options cho CardChart.vue
   */
  transformToChartOptions(processedData: any, config: ChartConfig): any {
    if (config.type !== 'card') return {}
    const cardConfig = config as CardChartConfig
    return {
      value: processedData,
      title: cardConfig.title,
      decimalPlaces: cardConfig.decimalPlaces,
      colorScheme: cardConfig.colorScheme
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
      maxRows: 10000,
      minColumns: 1,
      maxColumns: 10
    }
  }

  getValidationRules(): {
    required: string[]
    optional: string[]
    constraints: Record<string, any>
  } {
    return {
      required: ['field'],
      optional: ['aggregation', 'decimalPlaces'],
      constraints: {
        field: { type: 'number' },
        aggregation: { enum: ['sum', 'avg', 'min', 'max'] },
        decimalPlaces: { type: 'number', min: 0, max: 6, optional: true }
      }
    }
  }

  exportConfig(config: ChartConfig): any {
    if (config.type !== 'card') return config
    return {
      ...config,
      exportVersion: '1.0',
      exportDate: new Date().toISOString()
    }
  }

  importConfig(data: any): CardChartConfig {
    return {
      ...this.createDefaultConfig(),
      ...data
    }
  }

  getHelpText(): string {
    return `
      Card Chart dùng để hiển thị giá trị tổng hợp như tổng, trung bình, lớn nhất, nhỏ nhất của một trường dữ liệu số.\n\nCách sử dụng:\n1. Chọn trường dữ liệu số\n2. Chọn phép tổng hợp (sum, avg, min, max)\n3. Tuỳ chỉnh hiển thị (tiền tố, hậu tố, số chữ số thập phân, màu sắc)\n\nLưu ý: Card phù hợp cho các chỉ số tổng quan (KPI, tổng doanh thu, ...)
    `
  }

  getExamples(): Array<{
    name: string
    description: string
    config: Partial<ChartConfig>
  }> {
    return [
      {
        name: 'Tổng doanh thu',
        description: 'Card hiển thị tổng doanh thu',
        config: {
          title: 'Tổng doanh thu',
          field: 'revenue',
          aggregation: 'sum',
          decimalPlaces: 0,
          colorScheme: 'default',
          filter: ''
        }
      },
      {
        name: 'Giá trị đơn hàng trung bình',
        description: 'Card hiển thị giá trị đơn hàng trung bình',
        config: {
          title: 'Giá trị đơn hàng TB',
          field: 'orderValue',
          aggregation: 'avg',
          decimalPlaces: 2,
          colorScheme: 'success',
          filter: ''
        }
      }
    ]
  }
}
