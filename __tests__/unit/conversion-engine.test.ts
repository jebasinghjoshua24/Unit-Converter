import { describe, expect, it } from 'vitest'
import { convert, listCategories, listUnits } from '../../lib/conversion/engine'
import type { Category } from '../../types/conversion'

describe('conversion engine — length category', () => {
  describe('convert', () => {
    it('converts 5 meters to feet (~16.404)', () => {
      expect(convert(5, 'meter', 'foot')).toBeCloseTo(16.404199, 5)
    })

    it('converts 1 foot to inches (12)', () => {
      expect(convert(1, 'foot', 'inch')).toBeCloseTo(12, 5)
    })

    it('converts 1 kilometer to miles (~0.621371)', () => {
      expect(convert(1, 'kilometer', 'mile')).toBeCloseTo(0.621371, 5)
    })

    it('converts 2.54 centimeters to 1 inch (exact)', () => {
      expect(convert(2.54, 'centimeter', 'inch')).toBeCloseTo(1, 5)
    })

    it('returns identity when source and target are the same unit', () => {
      expect(convert(42, 'meter', 'meter')).toBe(42)
      expect(convert(3.7, 'mile', 'mile')).toBe(3.7)
    })

    it('converts zero to zero', () => {
      expect(convert(0, 'meter', 'foot')).toBe(0)
    })

    it('handles negative values', () => {
      expect(convert(-5, 'meter', 'foot')).toBeCloseTo(-16.404199, 5)
    })

    it('handles fractional values', () => {
      expect(convert(0.5, 'mile', 'kilometer')).toBeCloseTo(0.804672, 5)
    })

    it('round-trips a value through the base unit', () => {
      const original = 123.456
      const roundTripped = convert(convert(original, 'yard', 'meter'), 'meter', 'yard')
      expect(roundTripped).toBeCloseTo(original, 5)
    })

    it('throws for an unknown source unit', () => {
      expect(() => convert(1, 'parsec' as never, 'meter')).toThrow()
    })

    it('throws for an unknown target unit', () => {
      expect(() => convert(1, 'meter', 'parsec' as never)).toThrow()
    })
  })

  describe('listCategories', () => {
    it('returns length as the first available category', () => {
      const categories: Category[] = listCategories()
      expect(categories).toContain('length')
    })
  })

  describe('listUnits', () => {
    it('returns all 8 length units', () => {
      const units = listUnits('length')
      expect(units).toHaveLength(8)
      const ids = units.map((u) => u.id)
      expect(ids).toEqual(
        expect.arrayContaining([
          'millimeter',
          'centimeter',
          'meter',
          'kilometer',
          'inch',
          'foot',
          'yard',
          'mile',
        ]),
      )
    })

    it('throws for an unknown category', () => {
      expect(() => listUnits('mass' as Category)).toThrow()
    })
  })
})
