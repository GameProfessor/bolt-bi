import type { ChartType, BaseChartConfig, ChartConfig } from '@/types/chart'

// Chart Strategy Interface
export interface ChartStrategy {
  type: ChartType
  createDefaultConfig(): ChartConfig
  validateConfig(config: ChartConfig): boolean
  getRequiredFields(): string[]
  getOptionalFields(): string[]
  getDefaultLayout(): { w: number; h: number }
  getSupportedDataTypes(): ('string' | 'number' | 'date')[]
}

// Re-export types for convenience
export type { BaseChartConfig, ChartConfig } from '@/types/chart'
