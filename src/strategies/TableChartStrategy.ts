import type { ChartStrategy } from './ChartStrategy'
import type { TableChartConfig, ChartConfig, ChartType } from '@/types/chart'
import type { Component } from 'vue'
import TableChart from '@/components/charts/types/TableChart.vue'

export class TableChartStrategy implements ChartStrategy {
  type: ChartType = 'table'
  label = 'Table'
  description = 'Display data in a table format with filtering and row limit.'
  icon = 'TableCellsIcon' // Changed from Squares2X2Icon to TableCellsIcon
  category = 'BASIC' as const

  createDefaultConfig(): TableChartConfig {
    return {
      type: 'table',
      title: 'Table',
      dataSourceId: '',
      colorScheme: 'default',
      columns: [],
      rowLimit: 10,
      filter: ''
    }
  }

  validateConfig(config: ChartConfig): boolean {
    if (config.type !== 'table') return false
    const tableConfig = config as TableChartConfig
    return tableConfig.rowLimit > 0
  }

  getDefaultLayout() {
    return { w: 4, h: 3 }
  }

  getComponent(): Component {
    return TableChart
  }

  getPreviewComponent(): Component {
    return TableChart
  }

  processData(data: any[], config: ChartConfig): any[] {
    if (config.type !== 'table') return []
    const tableConfig = config as TableChartConfig
    let filtered = data
    // Simple filter: if filter string is present, filter rows containing the string in any column
    if (tableConfig.filter) {
      const filterStr = tableConfig.filter.toLowerCase()
      filtered = filtered.filter(row =>
        tableConfig.columns.some(col => String(row[col] ?? '').toLowerCase().includes(filterStr))
      )
    }
    // Select columns
    const selected = filtered.map(row => {
      const obj: Record<string, any> = {}
      tableConfig.columns.forEach(col => { obj[col] = row[col] })
      return obj
    })
    // Limit rows
    return selected.slice(0, tableConfig.rowLimit)
  }

  transformToChartOptions(processedData: any[], config: ChartConfig): any {
    // For datatable, just return the processed data and columns
    if (config.type !== 'table') return { columns: [], rows: [] }
    const tableConfig = config as TableChartConfig
    return {
      columns: tableConfig.columns,
      rows: processedData
    }
  }

  exportConfig(config: ChartConfig): any {
    return { ...config }
  }

  importConfig(data: any): TableChartConfig {
    return { ...this.createDefaultConfig(), ...data }
  }

  getExamples() {
    return [
      {
        name: 'Top 10 Customers',
        description: 'Shows the top 10 customers by revenue',
        config: {
          title: 'Top 10 Customers',
          columns: ['customer', 'revenue'],
          rowLimit: 10,
          filter: ''
        }
      }
    ]
  }
} 