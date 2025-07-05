import type { ChartStrategy, ChartConfig } from './ChartStrategy'

export class CardChartStrategy implements ChartStrategy {
  type = 'card' as const
  
  createDefaultConfig(): ChartConfig {
    return {
      type: 'card',
      title: '',
      dataSourceId: '',
      backgroundColor: '#3b82f6',
      borderColor: '#1d4ed8',
      colorScheme: 'default',
      metric: [],
      comparison: [],
      format: 'number',
      prefix: '',
      suffix: '',
      decimalPlaces: 0,
      showTrend: false,
      trendPeriod: 'previous',
      filter: '',
      icon: '',
      colorByValue: false
    }
  }
  
  validateConfig(config: ChartConfig): boolean {
    return !!(config.title && config.dataSourceId && config.metric?.length > 0)
  }
  
  getRequiredFields(): string[] {
    return ['metric']
  }
  
  getOptionalFields(): string[] {
    return ['comparison', 'format', 'prefix', 'suffix', 'decimalPlaces', 
            'showTrend', 'trendPeriod', 'filter', 'icon', 'colorByValue']
  }
  
  getDefaultLayout() {
    return { w: 2, h: 2 }
  }
  
  getSupportedDataTypes() {
    return ['number'] as const
  }
}
