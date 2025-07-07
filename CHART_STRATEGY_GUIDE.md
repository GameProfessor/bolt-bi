# Chart Strategy Pattern System

## Overview

The new Chart Strategy Pattern system consolidates all chart-related logic into self-contained strategy classes, making it much easier to manage and extend chart functionality. Each chart type has its own strategy class that contains everything needed for that chart type.

## Architecture

### Core Components

1. **ChartStrategy Interface** (`src/strategies/ChartStrategy.ts`)
   - Defines the contract for all chart strategies
   - Contains all methods that a chart type must implement

2. **Strategy Classes** (`src/strategies/*ChartStrategy.ts`)
   - One class per chart type (BarChartStrategy, PieChartStrategy, etc.)
   - Contains ALL logic for that chart type in one place

3. **Strategy Registry** (`src/strategies/index.ts`)
   - Central registry that manages all chart strategies
   - Provides convenience functions and utilities
   - Replaces scattered configuration files

4. **ChartUtils** (`src/strategies/index.ts`)
   - Convenience functions that replace scattered utilities
   - Single point of access for all chart operations

## What's Consolidated

### Before (Scattered Across Multiple Files)
- Chart types: `src/constants/chartTypes.ts`
- Chart components: `src/factories/ChartComponentFactory.ts`
- Chart configs: `src/factories/ChartConfigFactory.ts`
- Chart validation: Multiple places
- Chart data processing: Multiple places
- Chart examples: Multiple places
- Chart help text: Multiple places

### After (All in Strategy Classes)
- **Everything** for each chart type is in its strategy class
- Single source of truth for each chart type
- Easy to find, modify, and extend

## How to Add a New Chart Type

### Step 1: Create the Strategy Class

Create a new file `src/strategies/NewChartStrategy.ts`:

```typescript
import type { ChartStrategy } from './ChartStrategy'
import type { NewChartConfig, ChartConfig } from '@/types/chart'
import NewChart from '@/components/charts/types/NewChart.vue'
import ChartPreview from '@/components/charts/ChartPreview.vue'

export class NewChartStrategy implements ChartStrategy {
  type = 'newChart' as const
  label = 'New Chart'
  description = 'Description of the new chart type'
  icon = 'IconName'
  category = 'BASIC' as const

  createDefaultConfig(): NewChartConfig {
    return {
      type: 'newChart',
      title: 'New Chart',
      dataSourceId: '',
      backgroundColor: '#3B82F6',
      borderColor: '#1E40AF',
      colorScheme: 'default',
      // Add your chart-specific properties here
    }
  }

  validateConfig(config: ChartConfig): boolean {
    if (config.type !== 'newChart') return false
    
    const newChartConfig = config as NewChartConfig
    return !!(
      newChartConfig.title &&
      newChartConfig.dataSourceId &&
      // Add your validation logic here
    )
  }

  getRequiredFields(): string[] {
    return ['field1', 'field2'] // Your required fields
  }

  getOptionalFields(): string[] {
    return ['optionalField1', 'optionalField2'] // Your optional fields
  }

  getSupportedDataTypes(): ('string' | 'number' | 'date')[] {
    return ['number', 'string'] // Supported data types
  }

  getDefaultLayout(): { w: number; h: number } {
    return { w: 6, h: 4 } // Default size
  }

  getMinLayout(): { w: number; h: number } {
    return { w: 3, h: 3 } // Minimum size
  }

  getMaxLayout(): { w: number; h: number } {
    return { w: 12, h: 8 } // Maximum size
  }

  getComponent(): any {
    return NewChart // Your Vue component
  }

  getPreviewComponent(): any {
    return ChartPreview // Preview component
  }

  processData(data: any[], config: ChartConfig): any {
    if (config.type !== 'newChart') return data
    
    const newChartConfig = config as NewChartConfig
    
    // Add your data processing logic here
    // Transform data to chart.js format
    
    return {
      labels: [],
      datasets: []
    }
  }

  getDataRequirements(): {
    minRows: number
    maxRows: number
    minColumns: number
    maxColumns: number
  } {
    return {
      minRows: 1,
      maxRows: 1000,
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
      required: ['field1', 'field2'],
      optional: ['optionalField1'],
      constraints: {
        field1: { type: 'number' },
        field2: { type: 'string' }
      }
    }
  }

  exportConfig(config: ChartConfig): any {
    if (config.type !== 'newChart') return config
    return {
      ...config,
      exportVersion: '1.0',
      exportDate: new Date().toISOString()
    }
  }

  importConfig(data: any): NewChartConfig {
    return {
      ...this.createDefaultConfig(),
      ...data
    }
  }

  getHelpText(): string {
    return `
      Help text for your new chart type.
      
      Cách sử dụng:
      1. Step 1
      2. Step 2
      3. Step 3
      
      Lưu ý: Important notes
    `
  }

  getExamples(): Array<{
    name: string
    description: string
    config: Partial<ChartConfig>
  }> {
    return [
      {
        name: 'Example 1',
        description: 'Description of example 1',
        config: {
          title: 'Example 1',
          // Your example configuration
        }
      }
    ]
  }
}
```

### Step 2: Add Type Definition

Add your chart type to `src/types/chart.ts`:

```typescript
// Add to ChartType union
export type ChartType = 
  | 'bar' 
  | 'line' 
  | 'pie' 
  | 'scatter'
  | 'card'
  | 'newChart' // Add your new type

// Add your config interface
export interface NewChartConfig extends BaseChartConfig {
  type: 'newChart'
  // Add your chart-specific properties
  field1: string
  field2: string
  optionalField1?: string
}

// Add to ChartConfig union
export type ChartConfig = 
  | BarChartConfig 
  | PieChartConfig 
  | LineChartConfig 
  | ScatterChartConfig 
  | CardChartConfig
  | NewChartConfig // Add your config

// Add type guard
export function isNewChartConfig(config: ChartConfig): config is NewChartConfig {
  return config.type === 'newChart'
}
```

### Step 3: Create Vue Component

Create `src/components/charts/types/NewChart.vue`:

```vue
<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { ChartConfig } from '@/types/chart'

const props = defineProps<{
  config: ChartConfig
  data: any
}>()

const chartCanvas = ref<HTMLCanvasElement>()

onMounted(() => {
  // Initialize your chart
})

watch(() => props.data, () => {
  // Update chart when data changes
}, { deep: true })
</script>
```

### Step 4: Register the Strategy

Add your strategy to `src/strategies/index.ts`:

```typescript
import { NewChartStrategy } from './NewChartStrategy'

// In the constructor
constructor() {
  this.register(new BarChartStrategy())
  this.register(new PieChartStrategy())
  this.register(new LineChartStrategy())
  this.register(new ScatterChartStrategy())
  this.register(new CardChartStrategy())
  this.register(new NewChartStrategy()) // Add your strategy
}
```

## Benefits of This Approach

### 1. **Single Responsibility**
- Each strategy class handles everything for one chart type
- No scattered logic across multiple files

### 2. **Easy to Add New Chart Types**
- Only need to create one strategy class
- Register it in the registry
- Everything else is automatic

### 3. **Consistent Interface**
- All chart types follow the same interface
- Predictable behavior across the system

### 4. **Self-Contained**
- Each strategy contains its own:
  - Configuration logic
  - Validation rules
  - Data processing
  - Component references
  - Help text
  - Examples

### 5. **Easy to Maintain**
- All logic for a chart type is in one place
- Easy to find and modify
- No need to search across multiple files

### 6. **Type Safety**
- Full TypeScript support
- Compile-time checking
- Better IDE support

## Usage Examples

### Getting Chart Information
```typescript
import { ChartUtils } from '@/strategies'

// Get all available chart types
const types = ChartUtils.getAvailableTypes()

// Get chart type info
const barInfo = ChartUtils.getChartTypeInfo('bar')

// Get chart component
const BarComponent = ChartUtils.getChartComponent('bar')

// Create default config
const config = ChartUtils.createDefaultConfig('bar')

// Validate config
const isValid = ChartUtils.validateConfig(config)

// Process data
const processedData = ChartUtils.processData(rawData, config)
```

### Getting Constants (Replaces chartTypes.ts)
```typescript
import { ChartUtils } from '@/strategies'

// Get chart types constants
const constants = ChartUtils.getConstants()

// Get categories
const categories = ChartUtils.getCategories()

// Get components mapping
const components = ChartUtils.getComponentsMapping()

// Get default layouts
const layouts = ChartUtils.getDefaultLayouts()
```

## Migration Guide

### Files to Remove/Replace
- `src/constants/chartTypes.ts` → Use `ChartUtils.getConstants()`
- `src/factories/ChartComponentFactory.ts` → Use `ChartUtils.getChartComponent()`
- `src/factories/ChartConfigFactory.ts` → Use `ChartUtils.createDefaultConfig()`
- Scattered validation logic → Use `ChartUtils.validateConfig()`

### Files to Update
- Components that use chart types → Use `ChartUtils` functions
- Any hardcoded chart configurations → Use strategy methods

## Conclusion

This Strategy Pattern approach dramatically simplifies chart management by:

1. **Consolidating** all chart logic into self-contained classes
2. **Reducing** the number of files to edit when adding new chart types
3. **Providing** a consistent interface for all chart operations
4. **Making** the codebase more maintainable and extensible

Adding a new chart type now requires only:
1. Create one strategy class
2. Add type definitions
3. Create one Vue component
4. Register the strategy

Everything else is handled automatically by the registry and utility functions. 