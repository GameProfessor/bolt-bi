import type { ChartStrategy } from './ChartStrategy'
import type { ScatterChartConfig, ChartConfig } from '@/types/chart'
import ScatterChart from '@/components/charts/types/ScatterChart.vue'
import ChartPreview from '@/components/charts/ChartPreview.vue'

export class ScatterChartStrategy implements ChartStrategy {
  type = 'scatter' as const
  label = 'Scatter Plot'
  description = 'Hiển thị mối quan hệ giữa hai biến số'
  icon = 'CircleStackIcon'
  category = 'ADVANCED' as const

  createDefaultConfig(): ScatterChartConfig {
    return {
      type: 'scatter',
      title: 'Scatter Plot',
      dataSourceId: '',
      backgroundColor: '#3B82F6',
      borderColor: '#1E40AF',
      colorScheme: 'default',
      xAxis: [],
      yAxis: [],
      size: ''
    }
  }

  validateConfig(config: ChartConfig): boolean {
    if (config.type !== 'scatter') return false
    
    const scatterConfig = config as ScatterChartConfig
    return !!(
      scatterConfig.title &&
      scatterConfig.dataSourceId &&
      scatterConfig.xAxis &&
      scatterConfig.yAxis &&
      scatterConfig.xAxis.length > 0 &&
      scatterConfig.yAxis.length > 0
    )
  }

  getRequiredFields(): string[] {
    return ['xAxis', 'yAxis']
  }

  getOptionalFields(): string[] {
    return ['size', 'backgroundColor', 'borderColor', 'colorScheme']
  }

  getSupportedDataTypes(): ('string' | 'number' | 'date')[] {
    return ['number']
  }

  getDefaultLayout(): { w: number; h: number } {
    return { w: 6, h: 4 }
  }

  getMinLayout(): { w: number; h: number } {
    return { w: 4, h: 3 }
  }

  getMaxLayout(): { w: number; h: number } {
    return { w: 10, h: 6 }
  }

  getComponent(): any {
    return ScatterChart
  }

  getPreviewComponent(): any {
    return ChartPreview
  }

  getChartLibrary(): string {
    return 'chartjs'
  }

  processData(data: any[], config: ChartConfig): any {
    if (config.type !== 'scatter') return data
    
    const scatterConfig = config as ScatterChartConfig
    
    // Filter out invalid data points
    const validData = data.filter(row => {
      const xVal = Number(row[scatterConfig.xAxis[0]])
      const yVal = Number(row[scatterConfig.yAxis[0]])
      return !isNaN(xVal) && !isNaN(yVal)
    })

    // Transform to chart.js scatter format
    const datasets = [{
      label: `${scatterConfig.yAxis[0]} vs ${scatterConfig.xAxis[0]}`,
      data: validData.map(row => ({
        x: Number(row[scatterConfig.xAxis[0]]),
        y: Number(row[scatterConfig.yAxis[0]]),
        r: scatterConfig.size ? Number(row[scatterConfig.size]) || 5 : 5
      })),
      backgroundColor: scatterConfig.backgroundColor,
      borderColor: scatterConfig.borderColor,
      borderWidth: 1,
      pointRadius: scatterConfig.size ? undefined : 5,
      pointHoverRadius: scatterConfig.size ? undefined : 8
    }]

    return {
      datasets
    }
  }

  transformToChartOptions(processedData: any, config: ChartConfig): any {
    if (config.type !== 'scatter') return {}
    const scatterConfig = config as ScatterChartConfig
    return {
      type: 'scatter',
      data: {
        datasets: [{
          label: `${scatterConfig.yAxis[0]} vs ${scatterConfig.xAxis[0]}`,
          data: processedData,
          backgroundColor: scatterConfig.backgroundColor,
          borderColor: scatterConfig.borderColor,
          borderWidth: 1,
          pointRadius: scatterConfig.size ? undefined : 5,
          pointHoverRadius: scatterConfig.size ? undefined : 8
        }]
      },
      options: {
        plugins: {
          legend: { display: true, position: 'top' },
          title: { display: true, text: scatterConfig.title }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { beginAtZero: false, title: { display: true, text: scatterConfig.xAxis[0] } },
          y: { beginAtZero: false, title: { display: true, text: scatterConfig.yAxis[0] } }
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
      minRows: 5,
      maxRows: 10000,
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
      optional: ['size'],
      constraints: {
        xAxis: { minLength: 1, maxLength: 1, type: 'number' },
        yAxis: { minLength: 1, maxLength: 1, type: 'number' },
        size: { type: 'number', optional: true }
      }
    }
  }

  exportConfig(config: ChartConfig): any {
    if (config.type !== 'scatter') return config
    return {
      ...config,
      exportVersion: '1.0',
      exportDate: new Date().toISOString()
    }
  }

  importConfig(data: any): ScatterChartConfig {
    return {
      ...this.createDefaultConfig(),
      ...data
    }
  }

  getHelpText(): string {
    return `
      Scatter Plot là biểu đồ phân tán hiển thị mối quan hệ giữa hai biến số.
      
      Cách sử dụng:
      1. Chọn trường dữ liệu số cho trục X
      2. Chọn trường dữ liệu số cho trục Y
      3. Tùy chọn: Chọn trường dữ liệu cho kích thước điểm (Size)
      4. Tùy chỉnh màu sắc và bố cục
      
      Lưu ý: 
      - Scatter plot phù hợp cho dữ liệu số liên tục
      - Cần ít nhất 5 điểm dữ liệu để có ý nghĩa
      - Có thể phát hiện mối tương quan giữa các biến
    `
  }

  getExamples(): Array<{
    name: string
    description: string
    config: Partial<ChartConfig>
  }> {
    return [
      {
        name: 'Tương quan giá và doanh số',
        description: 'Biểu đồ phân tán hiển thị mối tương quan giữa giá và doanh số',
        config: {
          title: 'Tương quan giá và doanh số',
          xAxis: ['price'],
          yAxis: ['sales'],
          size: ''
        }
      },
      {
        name: 'Phân tích khách hàng',
        description: 'Biểu đồ phân tán với kích thước điểm theo giá trị đơn hàng',
        config: {
          title: 'Phân tích khách hàng',
          xAxis: ['age'],
          yAxis: ['income'],
          size: 'orderValue'
        }
      }
    ]
  }
}
