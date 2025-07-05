import type { ChartStrategy, ChartConfig } from './ChartStrategy'

export class PieChartStrategy implements ChartStrategy {
  type = 'pie' as const
  
  createDefaultConfig(): ChartConfig {
    return {
      type: 'pie',
      title: '',
      dataSourceId: '',
      backgroundColor: '#3b82f6',
      borderColor: '#1d4ed8',
      colorScheme: 'default',
      dimension: [],
      metric: [],
      showLegend: true,
      showValues: false,
      sortBy: '',
      sortDescending: false,
      filter: '',
      innerRadius: 0,
      donut: false
    }
  }
  
  validateConfig(config: ChartConfig): boolean {
    return !!(config.title && config.dataSourceId && 
              config.dimension?.length > 0 && config.metric?.length > 0)
  }
  
  getRequiredFields(): string[] {
    return ['dimension', 'metric']
  }
  
  getOptionalFields(): string[] {
    return ['showLegend', 'showValues', 'sortBy', 'sortDescending', 
            'filter', 'innerRadius', 'donut']
  }
  
  getDefaultLayout() {
    return { w: 4, h: 4 }
  }
  
  getSupportedDataTypes() {
    return ['string', 'number'] as const
  }
}
