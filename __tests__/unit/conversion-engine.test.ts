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

describe('conversion engine — temperature category (offset)', () => {
  describe('convert', () => {
    it('converts 0 °C to 32 °F', () => {
      expect(convert(0, 'celsius', 'fahrenheit')).toBeCloseTo(32, 5)
    })

    it('converts 100 °C to 212 °F', () => {
      expect(convert(100, 'celsius', 'fahrenheit')).toBeCloseTo(212, 5)
    })

    it('converts 32 °F to 0 °C', () => {
      expect(convert(32, 'fahrenheit', 'celsius')).toBeCloseTo(0, 5)
    })

    it('converts 0 °C to 273.15 K', () => {
      expect(convert(0, 'celsius', 'kelvin')).toBeCloseTo(273.15, 3)
    })

    it('converts 273.15 K to 0 °C', () => {
      expect(convert(273.15, 'kelvin', 'celsius')).toBeCloseTo(0, 3)
    })

    it('converts 0 K to -273.15 °C (absolute zero)', () => {
      expect(convert(0, 'kelvin', 'celsius')).toBeCloseTo(-273.15, 3)
    })

    it('converts -40 °C to -40 °F (crossing point)', () => {
      expect(convert(-40, 'celsius', 'fahrenheit')).toBeCloseTo(-40, 5)
    })

    it('converts 300 K to ~80.33 °F', () => {
      expect(convert(300, 'kelvin', 'fahrenheit')).toBeCloseTo(80.33, 1)
    })

    it('returns identity when source and target are the same', () => {
      expect(convert(37, 'celsius', 'celsius')).toBe(37)
      expect(convert(98.6, 'fahrenheit', 'fahrenheit')).toBeCloseTo(98.6, 5)
    })
  })

  describe('listCategories', () => {
    it('contains temperature', () => {
      expect(listCategories()).toContain('temperature')
    })
  })

  describe('listUnits', () => {
    it('returns all 3 temperature units', () => {
      const units = listUnits('temperature')
      expect(units).toHaveLength(3)
      const ids = units.map((u) => u.id)
      expect(ids).toEqual(expect.arrayContaining(['celsius', 'fahrenheit', 'kelvin']))
    })
  })

  describe('getUnit', () => {
    it('returns temperature units by id with symbols', () => {
      expect(getUnit('celsius')).toMatchObject({ id: 'celsius', symbol: '°C' })
      expect(getUnit('fahrenheit')).toMatchObject({ id: 'fahrenheit', symbol: '°F' })
      expect(getUnit('kelvin')).toMatchObject({ id: 'kelvin', symbol: 'K' })
    })
  })
})

describe('conversion engine — area category', () => {
  describe('convert', () => {
    it('converts 1 square meter to ~10.7639 square feet', () => {
      expect(convert(1, 'square-meter', 'square-foot')).toBeCloseTo(10.7639, 3)
    })

    it('converts 1 acre to ~4046.856 square meters', () => {
      expect(convert(1, 'acre', 'square-meter')).toBeCloseTo(4046.856, 2)
    })

    it('converts 1 square mile to ~640 acres', () => {
      expect(convert(1, 'square-mile', 'acre')).toBeCloseTo(640, 4)
    })

    it('returns identity when source and target are the same', () => {
      expect(convert(25, 'square-foot', 'square-foot')).toBe(25)
    })
  })

  describe('listUnits', () => {
    it('returns all 9 area units', () => {
      const units = listUnits('area')
      expect(units).toHaveLength(9)
    })
  })
})

describe('conversion engine — volume category', () => {
  describe('convert', () => {
    it('converts 1 gallon to ~3.7854 liters', () => {
      expect(convert(1, 'gallon', 'liter')).toBeCloseTo(3.7854, 3)
    })

    it('converts 1 liter to 1000 milliliters', () => {
      expect(convert(1, 'liter', 'milliliter')).toBeCloseTo(1000, 4)
    })

    it('converts 1 cubic meter to 1000 liters', () => {
      expect(convert(1, 'cubic-meter', 'liter')).toBeCloseTo(1000, 4)
    })

    it('converts 16 fluid ounces to 1 US pint', () => {
      expect(convert(16, 'fluid-ounce', 'pint')).toBeCloseTo(1, 4)
    })

    it('returns identity when source and target are the same', () => {
      expect(convert(2.5, 'liter', 'liter')).toBe(2.5)
    })
  })

  describe('listUnits', () => {
    it('returns all 9 volume units', () => {
      const units = listUnits('volume')
      expect(units).toHaveLength(9)
    })
  })
})

describe('conversion engine — combined dimensions categories', () => {
  it('lists both area and volume categories', () => {
    const categories: Category[] = listCategories()
    expect(categories).toContain('area')
    expect(categories).toContain('volume')
  })
})
