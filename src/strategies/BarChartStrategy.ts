import type { ChartStrategy, ChartConfig } from './ChartStrategy'

export class BarChartStrategy implements ChartStrategy {
  type = 'bar' as const
  
  createDefaultConfig(): ChartConfig {
    return {
      type: 'bar',
      title: '',
      dataSourceId: '',
      backgroundColor: '#3b82f6',
      borderColor: '#1d4ed8',
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
  
  validateConfig(config: ChartConfig): boolean {
    return !!(config.title && config.dataSourceId && 
              config.xAxis?.length > 0 && config.yAxis?.length > 0)
  }
  
  getRequiredFields(): string[] {
    return ['xAxis', 'yAxis']
  }
  
  getOptionalFields(): string[] {
    return ['horizontal', 'stackedDimension', 'stacked', 'sortXAxisBy', 
            'sortDescending', 'filter', 'showLegend']
  }
  
  getDefaultLayout() {
    return { w: 6, h: 4 }
  }
  
  getSupportedDataTypes() {
    return ['string', 'number', 'date'] as const
  }
}
