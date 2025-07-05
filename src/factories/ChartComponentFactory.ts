import type { ChartType } from '@/types/chart'
import type { Component } from 'vue'

// Import chart components
import BarChart from '@/components/charts/types/BarChart.vue'
import PieChart from '@/components/charts/types/PieChart.vue'
import LineChart from '@/components/charts/types/LineChart.vue'
import ScatterChart from '@/components/charts/types/ScatterChart.vue'
import CardChart from '@/components/charts/types/CardChart.vue'

// Component mapping
const chartComponents: Record<ChartType, Component> = {
  bar: BarChart,
  pie: PieChart,
  line: LineChart,
  scatter: ScatterChart,
  card: CardChart
}

export class ChartComponentFactory {
  static getComponent(type: ChartType): Component {
    const component = chartComponents[type]
    if (!component) {
      throw new Error(`No component found for chart type: ${type}`)
    }
    return component
  }

  static hasComponent(type: ChartType): boolean {
    return type in chartComponents
  }

  static getAvailableComponents(): ChartType[] {
    return Object.keys(chartComponents) as ChartType[]
  }
}
