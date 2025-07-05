/**
 * Strategy Pattern Usage Examples
 * Ví dụ cách sử dụng Strategy Pattern cho Chart Configuration
 */

import { ChartConfigFactory } from '@/factories'
import type { ChartType, ChartConfig } from '@/types/chart'

// Example 1: Creating different chart configurations
export function createChartConfigs() {
  console.log('=== Creating Chart Configurations ===')
  
  // Create bar chart config
  const barConfig = ChartConfigFactory.createConfig('bar')
  console.log('Bar Chart Config:', barConfig)
  
  // Create pie chart config
  const pieConfig = ChartConfigFactory.createConfig('pie')
  console.log('Pie Chart Config:', pieConfig)
  
  // Create line chart config
  const lineConfig = ChartConfigFactory.createConfig('line')
  console.log('Line Chart Config:', lineConfig)
  
  // Create scatter chart config
  const scatterConfig = ChartConfigFactory.createConfig('scatter')
  console.log('Scatter Chart Config:', scatterConfig)
  
  // Create card chart config
  const cardConfig = ChartConfigFactory.createConfig('card')
  console.log('Card Chart Config:', cardConfig)
}

// Example 2: Validating chart configurations
export function validateChartConfigs() {
  console.log('\n=== Validating Chart Configurations ===')
  
  // Create and validate bar chart
  const barConfig = ChartConfigFactory.createConfig('bar')
  barConfig.title = 'Sales by Region'
  barConfig.dataSourceId = 'sales_data'
  barConfig.xAxis = ['region']
  barConfig.yAxis = ['sales']
  
  const isBarValid = ChartConfigFactory.validateConfig(barConfig)
  console.log('Bar Chart Valid:', isBarValid)
  
  // Create and validate pie chart
  const pieConfig = ChartConfigFactory.createConfig('pie')
  pieConfig.title = 'Market Share'
  pieConfig.dataSourceId = 'market_data'
  pieConfig.dimension = ['company']
  pieConfig.metric = ['share']
  
  const isPieValid = ChartConfigFactory.validateConfig(pieConfig)
  console.log('Pie Chart Valid:', isPieValid)
  
  // Invalid config (missing required fields)
  const invalidConfig = ChartConfigFactory.createConfig('bar')
  invalidConfig.title = ''
  invalidConfig.dataSourceId = ''
  
  const isInvalid = ChartConfigFactory.validateConfig(invalidConfig)
  console.log('Invalid Config Valid:', isInvalid)
}

// Example 3: Getting chart information
export function getChartInformation() {
  console.log('\n=== Getting Chart Information ===')
  
  const chartTypes: ChartType[] = ['bar', 'pie', 'line', 'scatter', 'card']
  
  chartTypes.forEach(type => {
    console.log(`\n--- ${type.toUpperCase()} Chart ---`)
    console.log('Required Fields:', ChartConfigFactory.getRequiredFields(type))
    console.log('Optional Fields:', ChartConfigFactory.getOptionalFields(type))
    console.log('Default Layout:', ChartConfigFactory.getDefaultLayout(type))
    console.log('Supported Data Types:', ChartConfigFactory.getSupportedDataTypes(type))
  })
  
  console.log('\nAll Available Types:', ChartConfigFactory.getAvailableTypes())
}

// Example 4: Dynamic chart creation
export function createChartDynamically(chartType: ChartType, title: string, dataSourceId: string) {
  console.log(`\n=== Creating ${chartType.toUpperCase()} Chart Dynamically ===`)
  
  // Check if type is supported
  if (!ChartConfigFactory.isTypeSupported(chartType)) {
    console.error(`Chart type '${chartType}' is not supported`)
    return null
  }
  
  // Create config
  const config = ChartConfigFactory.createConfig(chartType)
  config.title = title
  config.dataSourceId = dataSourceId
  
  // Validate config
  if (!ChartConfigFactory.validateConfig(config)) {
    console.error('Invalid configuration')
    return null
  }
  
  console.log('Created Config:', config)
  return config
}

// Example 5: Chart configuration builder
export class ChartConfigBuilder {
  private config: ChartConfig | null = null
  
  constructor(chartType: ChartType) {
    this.config = ChartConfigFactory.createConfig(chartType)
  }
  
  setTitle(title: string): ChartConfigBuilder {
    if (this.config) {
      this.config.title = title
    }
    return this
  }
  
  setDataSource(dataSourceId: string): ChartConfigBuilder {
    if (this.config) {
      this.config.dataSourceId = dataSourceId
    }
    return this
  }
  
  setColors(backgroundColor: string, borderColor: string): ChartConfigBuilder {
    if (this.config) {
      this.config.backgroundColor = backgroundColor
      this.config.borderColor = borderColor
    }
    return this
  }
  
  // Type-specific methods
  setBarAxes(xAxis: string[], yAxis: string[]): ChartConfigBuilder {
    if (this.config && this.config.type === 'bar') {
      this.config.xAxis = xAxis
      this.config.yAxis = yAxis
    }
    return this
  }
  
  setPieDimensions(dimension: string[], metric: string[]): ChartConfigBuilder {
    if (this.config && this.config.type === 'pie') {
      this.config.dimension = dimension
      this.config.metric = metric
    }
    return this
  }
  
  setLineAxes(xAxis: string[], yAxis: string[]): ChartConfigBuilder {
    if (this.config && this.config.type === 'line') {
      this.config.xAxis = xAxis
      this.config.yAxis = yAxis
    }
    return this
  }
  
  setCardMetric(metric: string[]): ChartConfigBuilder {
    if (this.config && this.config.type === 'card') {
      this.config.metric = metric
    }
    return this
  }
  
  build(): ChartConfig | null {
    if (!this.config || !ChartConfigFactory.validateConfig(this.config)) {
      console.error('Invalid configuration')
      return null
    }
    return this.config
  }
}

// Example 6: Using the builder pattern
export function demonstrateBuilderPattern() {
  console.log('\n=== Builder Pattern Example ===')
  
  // Build bar chart
  const barChart = new ChartConfigBuilder('bar')
    .setTitle('Monthly Sales')
    .setDataSource('sales_data')
    .setColors('#3b82f6', '#1d4ed8')
    .setBarAxes(['month'], ['sales'])
    .build()
  
  console.log('Built Bar Chart:', barChart)
  
  // Build pie chart
  const pieChart = new ChartConfigBuilder('pie')
    .setTitle('Market Share')
    .setDataSource('market_data')
    .setColors('#ef4444', '#dc2626')
    .setPieDimensions(['company'], ['share'])
    .build()
  
  console.log('Built Pie Chart:', pieChart)
  
  // Build card chart
  const cardChart = new ChartConfigBuilder('card')
    .setTitle('Total Revenue')
    .setDataSource('revenue_data')
    .setColors('#10b981', '#059669')
    .setCardMetric(['revenue'])
    .build()
  
  console.log('Built Card Chart:', cardChart)
}

// Example 7: Chart configuration validator
export class ChartConfigValidator {
  static validateAndFix(config: ChartConfig): { isValid: boolean; errors: string[]; fixedConfig?: ChartConfig } {
    const errors: string[] = []
    
    // Check basic required fields
    if (!config.title) {
      errors.push('Title is required')
    }
    
    if (!config.dataSourceId) {
      errors.push('Data source ID is required')
    }
    
    // Check type-specific required fields
    const requiredFields = ChartConfigFactory.getRequiredFields(config.type)
    for (const field of requiredFields) {
      if (!config[field] || (Array.isArray(config[field]) && config[field].length === 0)) {
        errors.push(`${field} is required for ${config.type} charts`)
      }
    }
    
    // Try to fix common issues
    const fixedConfig = { ...config }
    if (!fixedConfig.backgroundColor) {
      fixedConfig.backgroundColor = '#3b82f6'
    }
    if (!fixedConfig.borderColor) {
      fixedConfig.borderColor = '#1d4ed8'
    }
    if (!fixedConfig.colorScheme) {
      fixedConfig.colorScheme = 'default'
    }
    
    const isValid = errors.length === 0
    
    return {
      isValid,
      errors,
      fixedConfig: isValid ? undefined : fixedConfig
    }
  }
}

// Example 8: Using the validator
export function demonstrateValidation() {
  console.log('\n=== Validation Example ===')
  
  // Valid config
  const validConfig = ChartConfigFactory.createConfig('bar')
  validConfig.title = 'Valid Chart'
  validConfig.dataSourceId = 'data_source'
  validConfig.xAxis = ['category']
  validConfig.yAxis = ['value']
  
  const validResult = ChartConfigValidator.validateAndFix(validConfig)
  console.log('Valid Config Result:', validResult)
  
  // Invalid config
  const invalidConfig = ChartConfigFactory.createConfig('pie')
  invalidConfig.title = ''
  invalidConfig.dataSourceId = ''
  
  const invalidResult = ChartConfigValidator.validateAndFix(invalidConfig)
  console.log('Invalid Config Result:', invalidResult)
}

// Run all examples
export function runAllExamples() {
  console.log('🚀 Strategy Pattern Examples\n')
  
  createChartConfigs()
  validateChartConfigs()
  getChartInformation()
  
  createChartDynamically('bar', 'Dynamic Bar Chart', 'dynamic_data')
  createChartDynamically('pie', 'Dynamic Pie Chart', 'dynamic_data')
  
  demonstrateBuilderPattern()
  demonstrateValidation()
  
  console.log('\n✅ All examples completed!')
}

// Export for use in components
export default {
  createChartConfigs,
  validateChartConfigs,
  getChartInformation,
  createChartDynamically,
  ChartConfigBuilder,
  ChartConfigValidator,
  runAllExamples
} 