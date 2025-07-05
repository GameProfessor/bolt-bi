import type { ChartStrategy, ChartConfig } from './ChartStrategy'

export class LineChartStrategy implements ChartStrategy {
  type = 'line' as const
  
  createDefaultConfig(): ChartConfig {
    return {
      type: 'line',
      title: '',
      dataSourceId: '',
      backgroundColor: '#3b82f6',
      borderColor: '#1d4ed8',
      colorScheme: 'default',
      xAxis: [],
      yAxis: [],
      showLegend: true,
      showPoints: true,
      smooth: false,
      area: false,
      sortXAxisBy: '',
      sortDescending: false,
      filter: '',
      gridLines: true
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
    return ['showLegend', 'showPoints', 'smooth', 'area', 'sortXAxisBy', 
            'sortDescending', 'filter', 'gridLines']
  }
  
  getDefaultLayout() {
    return { w: 6, h: 4 }
  }
  
  getSupportedDataTypes() {
    return ['string', 'number', 'date'] as const
  }
}
