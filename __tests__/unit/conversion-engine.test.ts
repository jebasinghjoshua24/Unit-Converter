import { describe, expect, it } from 'vitest'
import { convert, listCategories, listUnits, getUnit } from '../../lib/conversion/engine'
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
      expect(() => listUnits('energy' as Category)).toThrow()
    })
  })
})

describe('conversion engine — mass category', () => {
  describe('convert', () => {
    it('converts 10 pounds to kilograms (~4.535924)', () => {
      expect(convert(10, 'pound', 'kilogram')).toBeCloseTo(4.535924, 5)
    })

    it('converts 1 kilogram to pounds (~2.204623)', () => {
      expect(convert(1, 'kilogram', 'pound')).toBeCloseTo(2.204623, 5)
    })

    it('converts 1 tonne to kilograms (1000)', () => {
      expect(convert(1, 'tonne', 'kilogram')).toBeCloseTo(1000, 5)
    })

    it('converts 500 grams to pounds (~1.102311)', () => {
      expect(convert(500, 'gram', 'pound')).toBeCloseTo(1.102311, 5)
    })

    it('converts 1 stone to pounds (14)', () => {
      expect(convert(1, 'stone', 'pound')).toBeCloseTo(14, 5)
    })

    it('converts 1 ounce to grams (~28.349523)', () => {
      expect(convert(1, 'ounce', 'gram')).toBeCloseTo(28.349523, 5)
    })

    it('returns identity when source and target are the same unit', () => {
      expect(convert(7, 'kilogram', 'kilogram')).toBe(7)
    })

    it('converts zero to zero', () => {
      expect(convert(0, 'pound', 'tonne')).toBe(0)
    })

    it('handles negative values', () => {
      expect(convert(-2, 'tonne', 'kilogram')).toBeCloseTo(-2000, 5)
    })
  })

  describe('listCategories', () => {
    it('returns both length and mass', () => {
      const categories: Category[] = listCategories()
      expect(categories).toContain('length')
      expect(categories).toContain('mass')
    })
  })

  describe('listUnits', () => {
    it('returns all 7 mass units', () => {
      const units = listUnits('mass')
      expect(units).toHaveLength(7)
      const ids = units.map((u) => u.id)
      expect(ids).toEqual(
        expect.arrayContaining([
          'milligram',
          'gram',
          'kilogram',
          'tonne',
          'ounce',
          'pound',
          'stone',
        ]),
      )
    })
  })

  describe('getUnit', () => {
    it('returns a unit by id with its symbol', () => {
      expect(getUnit('pound')).toMatchObject({ id: 'pound', symbol: 'lb' })
      expect(getUnit('kilogram')).toMatchObject({ id: 'kilogram', symbol: 'kg' })
    })

    it('throws for an unknown unit id', () => {
      expect(() => getUnit('parsec' as never)).toThrow()
    })
  })
})
