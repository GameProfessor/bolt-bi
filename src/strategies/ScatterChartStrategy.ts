import type { ChartStrategy, ChartConfig } from './ChartStrategy'

export class ScatterChartStrategy implements ChartStrategy {
  type = 'scatter' as const
  
  createDefaultConfig(): ChartConfig {
    return {
      type: 'scatter',
      title: '',
      dataSourceId: '',
      backgroundColor: '#3b82f6',
      borderColor: '#1d4ed8',
      colorScheme: 'default',
      xAxis: [],
      yAxis: [],
      size: [],
      color: [],
      showLegend: true,
      bubbleSize: 10,
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
    return ['size', 'color', 'showLegend', 'bubbleSize', 'sortXAxisBy', 
            'sortDescending', 'filter', 'gridLines']
  }
  
  getDefaultLayout() {
    return { w: 6, h: 4 }
  }
  
  getSupportedDataTypes() {
    return ['number'] as const
  }
}
