/**
 * Calculations Tests
 */

import { describe, it, expect } from 'vitest'
import {
  calculateAggregation,
  groupBy,
  calculatePercentages,
  calculateMovingAverage,
  calculateGrowthRate,
  calculateCumulativeSum,
  normalizeValues,
  calculateCorrelation,
  findOutliers,
  binData
} from '@/utils/chart/calculations'

describe('Chart Calculations', () => {
  describe('calculateAggregation', () => {
    const values = [1, 2, 3, 4, 5]

    it('should calculate sum', () => {
      expect(calculateAggregation(values, 'sum')).toBe(15)
    })

    it('should calculate average', () => {
      expect(calculateAggregation(values, 'avg')).toBe(3)
    })

    it('should calculate count', () => {
      expect(calculateAggregation(values, 'count')).toBe(5)
    })

    it('should calculate min', () => {
      expect(calculateAggregation(values, 'min')).toBe(1)
    })

    it('should calculate max', () => {
      expect(calculateAggregation(values, 'max')).toBe(5)
    })

    it('should calculate median for odd count', () => {
      expect(calculateAggregation(values, 'median')).toBe(3)
    })

    it('should calculate median for even count', () => {
      expect(calculateAggregation([1, 2, 3, 4], 'median')).toBe(2.5)
    })

    it('should handle empty array', () => {
      expect(calculateAggregation([], 'sum')).toBe(0)
    })
  })

  describe('groupBy', () => {
    const data = [
      { category: 'A', value: 10 },
      { category: 'B', value: 20 },
      { category: 'A', value: 15 },
      { category: 'C', value: 30 }
    ]

    it('should group by category', () => {
      const grouped = groupBy(data, item => item.category)
      expect(grouped['A']).toHaveLength(2)
      expect(grouped['B']).toHaveLength(1)
      expect(grouped['C']).toHaveLength(1)
    })

    it('should handle empty array', () => {
      const grouped = groupBy([], item => item.category)
      expect(Object.keys(grouped)).toHaveLength(0)
    })
  })

  describe('calculatePercentages', () => {
    it('should calculate percentages', () => {
      const values = [10, 20, 30, 40]
      const percentages = calculatePercentages(values)
      expect(percentages).toEqual([10, 20, 30, 40])
    })

    it('should handle zero total', () => {
      const values = [0, 0, 0]
      const percentages = calculatePercentages(values)
      expect(percentages).toEqual([0, 0, 0])
    })
  })

  describe('calculateMovingAverage', () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    it('should calculate moving average with window size 3', () => {
      const ma = calculateMovingAverage(values, 3)
      expect(ma[0]).toBe(1) // First value
      expect(ma[1]).toBe(1.5) // (1+2)/2
      expect(ma[2]).toBe(2) // (1+2+3)/3
      expect(ma[3]).toBe(2.5) // (2+3+4)/3
    })

    it('should handle window size larger than array', () => {
      const ma = calculateMovingAverage([1, 2, 3], 5)
      expect(ma).toEqual([1, 2, 3])
    })

    it('should handle window size of 1', () => {
      const ma = calculateMovingAverage([1, 2, 3], 1)
      expect(ma).toEqual([1, 2, 3])
    })
  })

  describe('calculateGrowthRate', () => {
    it('should calculate positive growth', () => {
      expect(calculateGrowthRate(120, 100)).toBe(20)
    })

    it('should calculate negative growth', () => {
      expect(calculateGrowthRate(80, 100)).toBe(-20)
    })

    it('should handle zero previous value', () => {
      expect(calculateGrowthRate(100, 0)).toBe(0)
    })
  })

  describe('calculateCumulativeSum', () => {
    it('should calculate cumulative sum', () => {
      const values = [1, 2, 3, 4, 5]
      const cumSum = calculateCumulativeSum(values)
      expect(cumSum).toEqual([1, 3, 6, 10, 15])
    })

    it('should handle empty array', () => {
      const cumSum = calculateCumulativeSum([])
      expect(cumSum).toEqual([])
    })
  })

  describe('normalizeValues', () => {
    it('should normalize values to 0-1 range', () => {
      const values = [10, 20, 30, 40, 50]
      const normalized = normalizeValues(values)
      expect(normalized[0]).toBe(0) // Min value
      expect(normalized[4]).toBe(1) // Max value
      expect(normalized[2]).toBe(0.5) // Middle value
    })

    it('should handle identical values', () => {
      const values = [5, 5, 5, 5]
      const normalized = normalizeValues(values)
      expect(normalized).toEqual([0.5, 0.5, 0.5, 0.5])
    })
  })

  describe('calculateCorrelation', () => {
    it('should calculate perfect positive correlation', () => {
      const x = [1, 2, 3, 4, 5]
      const y = [2, 4, 6, 8, 10]
      const correlation = calculateCorrelation(x, y)
      expect(correlation).toBeCloseTo(1, 5)
    })

    it('should calculate perfect negative correlation', () => {
      const x = [1, 2, 3, 4, 5]
      const y = [10, 8, 6, 4, 2]
      const correlation = calculateCorrelation(x, y)
      expect(correlation).toBeCloseTo(-1, 5)
    })

    it('should handle mismatched array lengths', () => {
      const x = [1, 2, 3]
      const y = [1, 2]
      const correlation = calculateCorrelation(x, y)
      expect(correlation).toBe(0)
    })
  })

  describe('findOutliers', () => {
    it('should find outliers using IQR method', () => {
      const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 100] // 100 is outlier
      const result = findOutliers(values)
      expect(result.outliers).toContain(100)
    })

    it('should handle no outliers', () => {
      const values = [1, 2, 3, 4, 5]
      const result = findOutliers(values)
      expect(result.outliers).toHaveLength(0)
    })
  })

  describe('binData', () => {
    it('should bin data into specified number of bins', () => {
      const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      const bins = binData(values, 5)
      expect(bins).toHaveLength(5)
      expect(bins[0].count).toBeGreaterThan(0)
    })

    it('should handle empty array', () => {
      const bins = binData([], 5)
      expect(bins).toEqual([])
    })
  })
})
