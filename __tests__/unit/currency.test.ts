import { describe, expect, it } from 'vitest'
import { convertCurrency } from '../../lib/conversion/currency'

describe('convertCurrency (pure, rate convention = units of currency per 1 USD)', () => {
  it('converts 100 USD to ~92 EUR', () => {
    expect(convertCurrency(100, 1, 0.92)).toBeCloseTo(92, 5)
  })

  it('converts 1000 JPY to ~6.71 USD', () => {
    expect(convertCurrency(1000, 149, 1)).toBeCloseTo(6.7114, 3)
  })

  it('converts 100 EUR to ~108.70 USD', () => {
    expect(convertCurrency(100, 0.92, 1)).toBeCloseTo(108.6957, 3)
  })

  it('converts zero to zero', () => {
    expect(convertCurrency(0, 1, 0.92)).toBe(0)
  })

  it('returns identity when both rates are equal', () => {
    expect(convertCurrency(50, 1, 1)).toBe(50)
  })

  it('handles negative values', () => {
    expect(convertCurrency(-100, 1, 0.92)).toBeCloseTo(-92, 5)
  })
})
