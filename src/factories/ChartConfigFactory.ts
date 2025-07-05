import type { ChartType } from '@/types/chart'
import type { ChartConfig } from '@/strategies/ChartStrategy'
import { chartStrategyRegistry } from '@/strategies'

export class ChartConfigFactory {
  static createConfig(type: ChartType): ChartConfig {
    const strategy = chartStrategyRegistry.get(type)
    if (!strategy) {
      throw new Error(`Unsupported chart type: ${type}`)
    }
    return strategy.createDefaultConfig()
  }

  static validateConfig(config: ChartConfig): boolean {
    const strategy = chartStrategyRegistry.get(config.type)
    if (!strategy) {
      return false
    }
    return strategy.validateConfig(config)
  }

  static getRequiredFields(type: ChartType): string[] {
    const strategy = chartStrategyRegistry.get(type)
    if (!strategy) {
      return []
    }
    return strategy.getRequiredFields()
  }

  static getOptionalFields(type: ChartType): string[] {
    const strategy = chartStrategyRegistry.get(type)
    if (!strategy) {
      return []
    }
    return strategy.getOptionalFields()
  }

  static getDefaultLayout(type: ChartType): { w: number; h: number } {
    const strategy = chartStrategyRegistry.get(type)
    if (!strategy) {
      return { w: 4, h: 4 }
    }
    return strategy.getDefaultLayout()
  }

  static getSupportedDataTypes(type: ChartType): ('string' | 'number' | 'date')[] {
    const strategy = chartStrategyRegistry.get(type)
    if (!strategy) {
      return []
    }
    return strategy.getSupportedDataTypes()
  }

  static getAvailableTypes(): ChartType[] {
    return chartStrategyRegistry.getTypes()
  }

  static isTypeSupported(type: ChartType): boolean {
    return chartStrategyRegistry.has(type)
  }
}
