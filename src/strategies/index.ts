import type { ChartType } from '@/types/chart'
import type { ChartStrategy } from './ChartStrategy'
import { BarChartStrategy } from './BarChartStrategy'
import { PieChartStrategy } from './PieChartStrategy'
import { LineChartStrategy } from './LineChartStrategy'
import { ScatterChartStrategy } from './ScatterChartStrategy'
import { CardChartStrategy } from './CardChartStrategy'

// Strategy Registry
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
}

// Singleton instance
export const chartStrategyRegistry = new ChartStrategyRegistry()

// Export strategies for direct access
export { BarChartStrategy, PieChartStrategy, LineChartStrategy, ScatterChartStrategy, CardChartStrategy }
export type { ChartStrategy, ChartConfig } from './ChartStrategy'
