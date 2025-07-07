import type { ChartStrategy } from './ChartStrategy'
import type { CardChartConfig, ChartConfig } from '@/types/chart'
import CardChart from '@/components/charts/types/CardChart.vue'
import ChartPreview from '@/components/charts/ChartPreview.vue'

export class CardChartStrategy implements ChartStrategy {
  type = 'card' as const
  label = 'Card Chart'
  description = 'Hiển thị giá trị KPI dưới dạng card'
  icon = 'Squares2X2Icon'
  category = 'BASIC' as const

  createDefaultConfig(): CardChartConfig {
    return {
      type: 'card',
      title: 'Card Chart',
      dataSourceId: '',
      field: '',
      aggregation: 'sum', // sum | avg | min | max
      decimalPlaces: 0,
      colorScheme: 'default',
      filter: '',
      subHeader: ''
    }
  }

  validateConfig(config: ChartConfig): boolean {
    if (config.type !== 'card') return false
    
    const cardConfig = config as CardChartConfig
    return !!(
      cardConfig.title &&
      cardConfig.dataSourceId &&
      cardConfig.field
    )
  }

  getDefaultLayout(): { w: number; h: number } {
    return { w: 3, h: 2 }
  }

  getComponent(): any {
    return CardChart
  }

  getPreviewComponent(): any {
    return ChartPreview
  }

  processData(data: any[], config: ChartConfig): any {
    if (config.type !== 'card') return data
    
    const cardConfig = config as CardChartConfig
    
    // Apply filter if provided
    let filteredData = data
    if (cardConfig.filter) {
      try {
        filteredData = data.filter(row => {
          // Create a safe evaluation context
          const context = { ...row }
          return eval(cardConfig.filter)
        })
      } catch (error) {
        console.warn('Invalid filter expression:', cardConfig.filter)
        filteredData = data
      }
    }
    
    // Aggregate the data
    const values = filteredData.map(row => Number(row[cardConfig.field]) || 0)
    let result = 0
    
    switch (cardConfig.aggregation) {
      case 'sum':
        result = values.reduce((sum, val) => sum + val, 0)
        break
      case 'avg':
        result = values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0
        break
      case 'min':
        result = values.length > 0 ? Math.min(...values) : 0
        break
      case 'max':
        result = values.length > 0 ? Math.max(...values) : 0
        break
      default:
        result = values.reduce((sum, val) => sum + val, 0)
    }
    
    return {
      value: result,
      field: cardConfig.field,
      aggregation: cardConfig.aggregation,
      decimalPlaces: cardConfig.decimalPlaces || 0,
      subHeader: cardConfig.subHeader || ''
    }
  }

  transformToChartOptions(processedData: any, config: ChartConfig): any {
    if (config.type !== 'card') return {}
    const cardConfig = config as CardChartConfig
    
    return {
      type: 'card',
      data: {
        title: cardConfig.title,
        value: processedData.value,
        field: processedData.field,
        aggregation: processedData.aggregation,
        decimalPlaces: processedData.decimalPlaces,
        subHeader: processedData.subHeader
      },
      options: {
        colorScheme: cardConfig.colorScheme
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

  getExamples(): Array<{
    name: string
    description: string
    config: Partial<ChartConfig>
  }> {
    return [
      {
        name: 'Tổng doanh số',
        description: 'Card hiển thị tổng doanh số bán hàng',
        config: {
          title: 'Tổng doanh số',
          field: 'sales',
          aggregation: 'sum',
          decimalPlaces: 0,
          colorScheme: 'SUCCESS',
          subHeader: 'Triệu VND'
        }
      },
      {
        name: 'Trung bình đơn hàng',
        description: 'Card hiển thị giá trị trung bình mỗi đơn hàng',
        config: {
          title: 'Trung bình đơn hàng',
          field: 'order_value',
          aggregation: 'avg',
          decimalPlaces: 2,
          colorScheme: 'INFO',
          subHeader: 'VND'
        }
      }
    ]
  }
}
