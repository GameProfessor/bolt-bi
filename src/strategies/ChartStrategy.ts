import type { ChartType, ChartConfig } from '@/types/chart'
import type { Component } from 'vue'

// Chart Strategy Interface - Everything related to a chart type in one place
// Each chart type can use its own chart library and options type
export interface ChartStrategy {
  // Basic identification
  type: ChartType
  label: string
  description: string
  icon: string
  category: 'BASIC' | 'ADVANCED' | 'SPECIALIZED'
  
  // Configuration management
  createDefaultConfig(): ChartConfig
  validateConfig(config: ChartConfig): boolean
  
  // Layout and display
  getDefaultLayout(): { w: number; h: number }
  
  // Component management
  getComponent(): Component
  getPreviewComponent(): Component
  
  // Data processing (transformation layer)
  // Step 1: Transform raw data to intermediate data (logic layer)
  processData(data: any[], config: ChartConfig): any
  // Step 2: Transform intermediate data to chart library options/dataset (render layer)
  transformToChartOptions(processedData: any, config: ChartConfig): any
  
  // Export and sharing
  exportConfig(config: ChartConfig): any
  importConfig(data: any): ChartConfig
  
  // Documentation and help
  getExamples(): Array<{
    name: string
    description: string
    config: Partial<ChartConfig>
  }>
}

// Re-export types for convenience
export type { BaseChartConfig, ChartConfig } from '@/types/chart'
