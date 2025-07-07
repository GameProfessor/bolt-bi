import type { ChartType } from '@/types/chart'
import type { ChartStrategy } from './ChartStrategy'
import { BarChartStrategy } from './BarChartStrategy'
import { PieChartStrategy } from './PieChartStrategy'
import { LineChartStrategy } from './LineChartStrategy'
import { ScatterChartStrategy } from './ScatterChartStrategy'
import { CardChartStrategy } from './CardChartStrategy'

// Comprehensive Strategy Registry - Single source of truth for all chart types
class ChartStrategyRegistry {
  private strategies = new Map<ChartType, ChartStrategy>()

  constructor() {
    this.register(new BarChartStrategy())
    this.register(new PieChartStrategy())
    this.register(new LineChartStrategy())
    this.register(new ScatterChartStrategy())
    this.register(new CardChartStrategy())
  }

  register(strategy: ChartStrategy): void {
    this.strategies.set(strategy.type, strategy)
  }

  get(type: ChartType): ChartStrategy | undefined {
    return this.strategies.get(type)
  }

  getAll(): ChartStrategy[] {
    return Array.from(this.strategies.values())
  }

  getTypes(): ChartType[] {
    return Array.from(this.strategies.keys())
  }

  has(type: ChartType): boolean {
    return this.strategies.has(type)
  }

  // Get all chart types grouped by category
  getByCategory(): Record<string, ChartStrategy[]> {
    const categories: Record<string, ChartStrategy[]> = {
      BASIC: [],
      ADVANCED: [],
      SPECIALIZED: []
    }

    this.strategies.forEach(strategy => {
      categories[strategy.category].push(strategy)
    })

    return categories
  }

  // Get chart types for UI display
  getChartTypesForUI(): Array<{
    type: ChartType
    label: string
    description: string
    icon: string
    category: string
  }> {
    return Array.from(this.strategies.values()).map(strategy => ({
      type: strategy.type,
      label: strategy.label,
      description: strategy.description,
      icon: strategy.icon,
      category: strategy.category
    }))
  }

  // Get available chart types as constants (replaces chartTypes.ts)
  getChartTypesConstants(): Record<ChartType, { label: string; icon: string; description: string }> {
    const constants: Record<ChartType, { label: string; icon: string; description: string }> = {} as any
    
    this.strategies.forEach(strategy => {
      constants[strategy.type] = {
        label: strategy.label,
        icon: strategy.icon,
        description: strategy.description
      }
    })

    return constants
  }

  // Get chart categories (replaces chartTypes.ts categories)
  getChartCategories(): Record<string, { label: string; types: ChartType[] }> {
    const categories: Record<string, { label: string; types: ChartType[] }> = {
      BASIC: { label: 'Cơ bản', types: [] },
      ADVANCED: { label: 'Nâng cao', types: [] },
      SPECIALIZED: { label: 'Chuyên dụng', types: [] }
    }

    this.strategies.forEach(strategy => {
      categories[strategy.category].types.push(strategy.type)
    })

    return categories
  }

  // Get components mapping (replaces ChartComponentFactory)
  getComponentsMapping(): Record<ChartType, any> {
    const components: Record<ChartType, any> = {} as any
    
    this.strategies.forEach(strategy => {
      components[strategy.type] = strategy.getComponent()
    })

    return components
  }

  // Get preview components mapping
  getPreviewComponentsMapping(): Record<ChartType, any> {
    const components: Record<ChartType, any> = {} as any
    
    this.strategies.forEach(strategy => {
      components[strategy.type] = strategy.getPreviewComponent()
    })

    return components
  }

  // Get default layouts mapping
  getDefaultLayoutsMapping(): Record<ChartType, { w: number; h: number }> {
    const layouts: Record<ChartType, { w: number; h: number }> = {} as any
    
    this.strategies.forEach(strategy => {
      layouts[strategy.type] = strategy.getDefaultLayout()
    })

    return layouts
  }

  // Get validation rules for all chart types
  getAllValidationRules(): Record<ChartType, {
    required: string[]
    optional: string[]
    constraints: Record<string, any>
  }> {
    const rules: Record<ChartType, {
      required: string[]
      optional: string[]
      constraints: Record<string, any>
    }> = {} as any
    
    this.strategies.forEach(strategy => {
      rules[strategy.type] = strategy.getValidationRules()
    })

    return rules
  }

  // Get data requirements for all chart types
  getAllDataRequirements(): Record<ChartType, {
    minRows: number
    maxRows: number
    minColumns: number
    maxColumns: number
  }> {
    const requirements: Record<ChartType, {
      minRows: number
      maxRows: number
      minColumns: number
      maxColumns: number
    }> = {} as any
    
    this.strategies.forEach(strategy => {
      requirements[strategy.type] = strategy.getDataRequirements()
    })

    return requirements
  }

  // Get help text for all chart types
  getAllHelpText(): Record<ChartType, string> {
    const helpText: Record<ChartType, string> = {} as any
    
    this.strategies.forEach(strategy => {
      helpText[strategy.type] = strategy.getHelpText()
    })

    return helpText
  }

  // Get examples for all chart types
  getAllExamples(): Record<ChartType, Array<{
    name: string
    description: string
    config: any
  }>> {
    const examples: Record<ChartType, Array<{
      name: string
      description: string
      config: any
    }>> = {} as any
    
    this.strategies.forEach(strategy => {
      examples[strategy.type] = strategy.getExamples()
    })

    return examples
  }
}

// Export singleton instance
export const chartStrategyRegistry = new ChartStrategyRegistry()

// Export convenience functions that replace scattered utilities
export const ChartUtils = {
  // Get chart type info
  getChartTypeInfo: (type: ChartType) => chartStrategyRegistry.get(type),
  
  // Get component for chart type
  getChartComponent: (type: ChartType) => {
    const strategy = chartStrategyRegistry.get(type)
    return strategy?.getComponent()
  },
  
  // Get preview component for chart type
  getChartPreviewComponent: (type: ChartType) => {
    const strategy = chartStrategyRegistry.get(type)
    return strategy?.getPreviewComponent()
  },
  
  // Create default config for chart type
  createDefaultConfig: (type: ChartType) => {
    const strategy = chartStrategyRegistry.get(type)
    if (!strategy) {
      throw new Error(`Unsupported chart type: ${type}`)
    }
    return strategy.createDefaultConfig()
  },
  
  // Validate config for chart type
  validateConfig: (config: any) => {
    const strategy = chartStrategyRegistry.get(config.type)
    if (!strategy) return false
    return strategy.validateConfig(config)
  },
  
  // Process data for chart type
  processData: (data: any[], config: any) => {
    const strategy = chartStrategyRegistry.get(config.type)
    if (!strategy) return data
    return strategy.processData(data, config)
  },
  
  // Get all available chart types
  getAvailableTypes: () => chartStrategyRegistry.getTypes(),
  
  // Get chart types by category
  getTypesByCategory: () => chartStrategyRegistry.getByCategory(),
  
  // Get chart types for UI
  getChartTypesForUI: () => chartStrategyRegistry.getChartTypesForUI(),
  
  // Get constants (replaces chartTypes.ts)
  getConstants: () => chartStrategyRegistry.getChartTypesConstants(),
  
  // Get categories (replaces chartTypes.ts categories)
  getCategories: () => chartStrategyRegistry.getChartCategories(),
  
  // Get components mapping
  getComponentsMapping: () => chartStrategyRegistry.getComponentsMapping(),
  
  // Get default layouts
  getDefaultLayouts: () => chartStrategyRegistry.getDefaultLayoutsMapping(),
  
  // Get validation rules
  getValidationRules: () => chartStrategyRegistry.getAllValidationRules(),
  
  // Get data requirements
  getDataRequirements: () => chartStrategyRegistry.getAllDataRequirements(),
  
  // Get help text
  getHelpText: () => chartStrategyRegistry.getAllHelpText(),
  
  // Get examples
  getExamples: () => chartStrategyRegistry.getAllExamples()
}

// Export strategies for direct access
export { BarChartStrategy, PieChartStrategy, LineChartStrategy, ScatterChartStrategy, CardChartStrategy }
export type { ChartStrategy, ChartConfig } from './ChartStrategy'
