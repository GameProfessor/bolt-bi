import type { ChartStrategy } from './ChartStrategy'
import type { ScatterChartConfig, ChartConfig } from '@/types/chart'
import ScatterChart from '@/components/charts/types/ScatterChart.vue'
import ChartPreview from '@/components/charts/ChartPreview.vue'

export class ScatterChartStrategy implements ChartStrategy {
  type = 'scatter' as const
  label = 'Scatter Chart'
  description = 'Hiển thị mối quan hệ giữa hai biến số'
  icon = 'CircleStackIcon'
  category = 'BASIC' as const

  createDefaultConfig(): ScatterChartConfig {
    return {
      type: 'scatter',
      title: 'Scatter Chart',
      dataSourceId: '',
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

  getDefaultLayout(): { w: number; h: number } {
    return { w: 4, h: 3 }
  }

  getComponent(): any {
    return ScatterChart
  }

  getPreviewComponent(): any {
    return ChartPreview
  }

  processData(data: any[], config: ChartConfig): any {
    if (config.type !== 'scatter') return data
    const scatterConfig = config as ScatterChartConfig
    
    // Filter out invalid data points
    return data.filter(row => {
      const xVal = Number(row[scatterConfig.xAxis[0]])
      const yVal = Number(row[scatterConfig.yAxis[0]])
      return !isNaN(xVal) && !isNaN(yVal)
    })
  }

  transformToChartOptions(processedData: any, config: ChartConfig): any {
    if (config.type !== 'scatter') return {}
    const scatterConfig = config as ScatterChartConfig
    
    const datasets = scatterConfig.yAxis.map((yField, index) => ({
      label: yField,
      data: processedData.map((item: any) => ({
        x: Number(item[scatterConfig.xAxis[0]]),
        y: Number(item[yField])
      })),
      backgroundColor: this.getColor(index),
      borderColor: this.getColor(index),
      borderWidth: 1,
      pointRadius: scatterConfig.size ? 6 : 4
    }))
    
    return {
      type: 'scatter',
      data: {
        datasets
      },
      options: {
        plugins: {
          legend: { display: true },
          title: { display: true, text: scatterConfig.title }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { 
            type: 'linear',
            position: 'bottom',
            beginAtZero: true
          },
          y: { 
            type: 'linear',
            position: 'left',
            beginAtZero: true
          }
        }
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

  getExamples(): Array<{
    name: string
    description: string
    config: Partial<ChartConfig>
  }> {
    return [
      {
        name: 'Mối quan hệ giá và số lượng',
        description: 'Biểu đồ scatter hiển thị mối quan hệ giữa giá và số lượng bán',
        config: {
          title: 'Mối quan hệ giá và số lượng',
          xAxis: ['price'],
          yAxis: ['quantity'],
          size: ''
        }
      },
      {
        name: 'Phân tích tuổi và thu nhập',
        description: 'Biểu đồ scatter phân tích mối quan hệ giữa tuổi và thu nhập',
        config: {
          title: 'Phân tích tuổi và thu nhập',
          xAxis: ['age'],
          yAxis: ['income'],
          size: 'experience'
        }
      }
    ]
  }

  // Helper: lấy màu cho từng dataset
  private getColor(index: number): string {
    const palette = [
      '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
      '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1'
    ]
    return palette[index % palette.length]
  }
}
