/**
 * Formatters Tests
 */

import { describe, it, expect } from 'vitest'
import {
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatLargeNumber,
  formatChartDate,
  truncateLabel,
  generateColorPalette,
  applyTransparency
} from '@/utils/chart/formatters'

describe('Chart Formatters', () => {
  describe('formatNumber', () => {
    it('should format number with default options', () => {
      expect(formatNumber(1234.567)).toBe('1.234,57')
    })

    it('should format number with custom options', () => {
      expect(formatNumber(1234.567, { maximumFractionDigits: 0 })).toBe('1.235')
    })

    it('should handle zero', () => {
      expect(formatNumber(0)).toBe('0')
    })
  })

  describe('formatCurrency', () => {
    it('should format VND currency', () => {
      expect(formatCurrency(1000000)).toBe('1.000.000 ₫')
    })

    it('should format USD currency', () => {
      expect(formatCurrency(1000, 'USD')).toContain('1.000')
    })
  })

  describe('formatPercentage', () => {
    it('should format percentage with default decimals', () => {
      expect(formatPercentage(25.5)).toBe('25,5%')
    })

    it('should format percentage with custom decimals', () => {
      expect(formatPercentage(25.567, 2)).toBe('25,57%')
    })
  })

  describe('formatLargeNumber', () => {
    it('should format thousands', () => {
      expect(formatLargeNumber(1500)).toBe('1,5K')
    })

    it('should format millions', () => {
      expect(formatLargeNumber(2500000)).toBe('2,5M')
    })

    it('should format billions', () => {
      expect(formatLargeNumber(1200000000)).toBe('1,2B')
    })

    it('should handle small numbers', () => {
      expect(formatLargeNumber(500)).toBe('500')
    })
  })

  describe('formatChartDate', () => {
    const testDate = new Date('2023-12-25')

    it('should format short date', () => {
      const result = formatChartDate(testDate, 'short')
      expect(result).toBe('25/12')
    })

    it('should format medium date', () => {
      const result = formatChartDate(testDate, 'medium')
      expect(result).toBe('25/12/23')
    })

    it('should format long date', () => {
      const result = formatChartDate(testDate, 'long')
      expect(result).toContain('25')
      expect(result).toContain('2023')
    })

    it('should handle string dates', () => {
      const result = formatChartDate('2023-12-25', 'short')
      expect(result).toBe('25/12')
    })
  })

  describe('truncateLabel', () => {
    it('should truncate long labels', () => {
      const longLabel = 'This is a very long label that should be truncated'
      expect(truncateLabel(longLabel, 20)).toBe('This is a very lo...')
    })

    it('should not truncate short labels', () => {
      const shortLabel = 'Short'
      expect(truncateLabel(shortLabel, 20)).toBe('Short')
    })

    it('should handle exact length', () => {
      const label = '12345678901234567890'
      expect(truncateLabel(label, 20)).toBe('12345678901234567890')
    })
  })

  describe('generateColorPalette', () => {
    it('should generate correct number of colors', () => {
      const palette = generateColorPalette(5)
      expect(palette).toHaveLength(5)
    })

    it('should use custom base colors', () => {
      const baseColors = ['#FF0000', '#00FF00', '#0000FF']
      const palette = generateColorPalette(5, baseColors)
      expect(palette[0]).toBe('#FF0000')
      expect(palette[1]).toBe('#00FF00')
      expect(palette[2]).toBe('#0000FF')
      expect(palette[3]).toBe('#FF0000') // Should repeat
    })

    it('should handle zero count', () => {
      const palette = generateColorPalette(0)
      expect(palette).toHaveLength(0)
    })
  })

  describe('applyTransparency', () => {
    it('should convert hex to rgba', () => {
      const result = applyTransparency('#FF0000', 0.5)
      expect(result).toBe('rgba(255, 0, 0, 0.5)')
    })

    it('should update existing rgba', () => {
      const result = applyTransparency('rgba(255, 0, 0, 1)', 0.3)
      expect(result).toBe('rgba(255, 0, 0, 0.3)')
    })

    it('should convert rgb to rgba', () => {
      const result = applyTransparency('rgb(255, 0, 0)', 0.7)
      expect(result).toBe('rgba(255, 0, 0, 0.7)')
    })

    it('should handle invalid colors', () => {
      const result = applyTransparency('invalid-color', 0.5)
      expect(result).toBe('invalid-color')
    })
  })
})
