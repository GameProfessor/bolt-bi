/**
 * Chart Calculations
 * Utility functions để tính toán dữ liệu cho charts
 */

/**
 * Calculate aggregation
 */
export const calculateAggregation = (
  values: number[],
  type: 'sum' | 'avg' | 'count' | 'min' | 'max' | 'median' | 'mode' | 'stddev'
): number => {
  if (values.length === 0) return 0
  
  switch (type) {
    case 'sum':
      return values.reduce((sum, val) => sum + val, 0)
    
    case 'avg':
      return values.reduce((sum, val) => sum + val, 0) / values.length
    
    case 'count':
      return values.length
    
    case 'min':
      return Math.min(...values)
    
    case 'max':
      return Math.max(...values)
    
    case 'median':
      const sorted = [...values].sort((a, b) => a - b)
      const mid = Math.floor(sorted.length / 2)
      return sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid]
    
    case 'mode':
      const frequency: Record<number, number> = {}
      values.forEach(val => {
        frequency[val] = (frequency[val] || 0) + 1
      })
      
      let maxFreq = 0
      let mode = values[0]
      Object.entries(frequency).forEach(([val, freq]) => {
        if (freq > maxFreq) {
          maxFreq = freq
          mode = Number(val)
        }
      })
      return mode
    
    case 'stddev':
      const mean = calculateAggregation(values, 'avg')
      const squaredDiffs = values.map(val => Math.pow(val - mean, 2))
      const avgSquaredDiff = calculateAggregation(squaredDiffs, 'avg')
      return Math.sqrt(avgSquaredDiff)
    
    default:
      return 0
  }
}

/**
 * Group data by field
 */
export const groupBy = <T>(
  data: T[],
  keyFn: (item: T) => string | number
): Record<string, T[]> => {
  return data.reduce((groups, item) => {
    const key = String(keyFn(item))
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

/**
 * Calculate percentage distribution
 */
export const calculatePercentages = (values: number[]): number[] => {
  const total = values.reduce((sum, val) => sum + val, 0)
  if (total === 0) return values.map(() => 0)
  
  return values.map(val => (val / total) * 100)
}

/**
 * Calculate moving average
 */
export const calculateMovingAverage = (
  values: number[],
  windowSize: number
): number[] => {
  if (windowSize <= 0 || windowSize > values.length) {
    return values
  }
  
  const result: number[] = []
  
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - windowSize + 1)
    const end = i + 1
    const window = values.slice(start, end)
    const average = calculateAggregation(window, 'avg')
    result.push(average)
  }
  
  return result
}

/**
 * Calculate growth rate
 */
export const calculateGrowthRate = (
  currentValue: number,
  previousValue: number
): number => {
  if (previousValue === 0) return 0
  return ((currentValue - previousValue) / previousValue) * 100
}

/**
 * Calculate cumulative sum
 */
export const calculateCumulativeSum = (values: number[]): number[] => {
  const result: number[] = []
  let sum = 0
  
  values.forEach(val => {
    sum += val
    result.push(sum)
  })
  
  return result
}

/**
 * Normalize values to 0-1 range
 */
export const normalizeValues = (values: number[]): number[] => {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min
  
  if (range === 0) return values.map(() => 0.5)
  
  return values.map(val => (val - min) / range)
}

/**
 * Calculate correlation coefficient
 */
export const calculateCorrelation = (
  xValues: number[],
  yValues: number[]
): number => {
  if (xValues.length !== yValues.length || xValues.length === 0) {
    return 0
  }
  
  const n = xValues.length
  const xMean = calculateAggregation(xValues, 'avg')
  const yMean = calculateAggregation(yValues, 'avg')
  
  let numerator = 0
  let xSumSquares = 0
  let ySumSquares = 0
  
  for (let i = 0; i < n; i++) {
    const xDiff = xValues[i] - xMean
    const yDiff = yValues[i] - yMean
    
    numerator += xDiff * yDiff
    xSumSquares += xDiff * xDiff
    ySumSquares += yDiff * yDiff
  }
  
  const denominator = Math.sqrt(xSumSquares * ySumSquares)
  
  return denominator === 0 ? 0 : numerator / denominator
}

/**
 * Calculate linear regression
 */
export const calculateLinearRegression = (
  xValues: number[],
  yValues: number[]
): { slope: number; intercept: number; rSquared: number } => {
  if (xValues.length !== yValues.length || xValues.length === 0) {
    return { slope: 0, intercept: 0, rSquared: 0 }
  }
  
  const n = xValues.length
  const xMean = calculateAggregation(xValues, 'avg')
  const yMean = calculateAggregation(yValues, 'avg')
  
  let numerator = 0
  let denominator = 0
  
  for (let i = 0; i < n; i++) {
    const xDiff = xValues[i] - xMean
    const yDiff = yValues[i] - yMean
    
    numerator += xDiff * yDiff
    denominator += xDiff * xDiff
  }
  
  const slope = denominator === 0 ? 0 : numerator / denominator
  const intercept = yMean - slope * xMean
  
  // Calculate R-squared
  const correlation = calculateCorrelation(xValues, yValues)
  const rSquared = correlation * correlation
  
  return { slope, intercept, rSquared }
}

/**
 * Generate trend line points
 */
export const generateTrendLine = (
  xValues: number[],
  yValues: number[]
): { x: number; y: number }[] => {
  const { slope, intercept } = calculateLinearRegression(xValues, yValues)
  
  return xValues.map(x => ({
    x,
    y: slope * x + intercept
  }))
}

/**
 * Calculate outliers using IQR method
 */
export const findOutliers = (values: number[]): {
  outliers: number[]
  lowerBound: number
  upperBound: number
} => {
  const sorted = [...values].sort((a, b) => a - b)
  const n = sorted.length
  
  const q1Index = Math.floor(n * 0.25)
  const q3Index = Math.floor(n * 0.75)
  
  const q1 = sorted[q1Index]
  const q3 = sorted[q3Index]
  const iqr = q3 - q1
  
  const lowerBound = q1 - 1.5 * iqr
  const upperBound = q3 + 1.5 * iqr
  
  const outliers = values.filter(val => val < lowerBound || val > upperBound)
  
  return { outliers, lowerBound, upperBound }
}

/**
 * Bin data for histogram
 */
export const binData = (
  values: number[],
  binCount: number = 10
): { bin: string; count: number; range: [number, number] }[] => {
  if (values.length === 0) return []
  
  const min = Math.min(...values)
  const max = Math.max(...values)
  const binWidth = (max - min) / binCount
  
  const bins: { bin: string; count: number; range: [number, number] }[] = []
  
  for (let i = 0; i < binCount; i++) {
    const start = min + i * binWidth
    const end = i === binCount - 1 ? max : start + binWidth
    
    const count = values.filter(val => val >= start && val < end).length
    
    bins.push({
      bin: `${start.toFixed(1)}-${end.toFixed(1)}`,
      count,
      range: [start, end]
    })
  }
  
  return bins
}
