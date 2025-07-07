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

  getDefaultLayout(): { w: number; h: number } {
    return { w: 3, h: 3 }
  }

  getComponent(): any {
    return PieChart
  }

  getPreviewComponent(): any {
    return ChartPreview
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
        description: 'Biểu đồ vòng hiển thị tỷ lệ các sản phẩm bán ra',
        config: {
          title: 'Tỷ lệ sản phẩm bán ra',
          category: 'product',
          value: 'quantity',
          donut: true
        }
      }
    ]
  }

  // Helper: lấy màu cho từng phần
  private getColors(count: number): string[] {
    const palette = [
      '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
      '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1'
    ]
    return palette.slice(0, count)
  }

  // Helper: làm tối màu
  private darkenColor(color: string): string {
    return color
  }
}
