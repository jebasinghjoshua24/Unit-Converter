import type { Category, Unit } from '../../types/conversion'

const LENGTH_BASE_UNIT = 'meter'
const MASS_BASE_UNIT = 'kilogram'

export const lengthUnits: Unit[] = [
  { id: 'millimeter', name: 'Millimeter', symbol: 'mm', factor: 0.001 },
  { id: 'centimeter', name: 'Centimeter', symbol: 'cm', factor: 0.01 },
  { id: 'meter', name: 'Meter', symbol: 'm', factor: 1 },
  { id: 'kilometer', name: 'Kilometer', symbol: 'km', factor: 1000 },
  { id: 'inch', name: 'Inch', symbol: 'in', factor: 0.0254 },
  { id: 'foot', name: 'Foot', symbol: 'ft', factor: 0.3048 },
  { id: 'yard', name: 'Yard', symbol: 'yd', factor: 0.9144 },
  { id: 'mile', name: 'Mile', symbol: 'mi', factor: 1609.344 },
]

export const massUnits: Unit[] = [
  { id: 'milligram', name: 'Milligram', symbol: 'mg', factor: 0.000001 },
  { id: 'gram', name: 'Gram', symbol: 'g', factor: 0.001 },
  { id: 'kilogram', name: 'Kilogram', symbol: 'kg', factor: 1 },
  { id: 'tonne', name: 'Tonne', symbol: 't', factor: 1000 },
  { id: 'ounce', name: 'Ounce', symbol: 'oz', factor: 0.028349523125 },
  { id: 'pound', name: 'Pound', symbol: 'lb', factor: 0.45359237 },
  { id: 'stone', name: 'Stone', symbol: 'st', factor: 6.35029318 },
]

export const registry: Record<Category, Unit[]> = {
  length: lengthUnits,
  mass: massUnits,
}

export function getBaseUnit(category: Category): string {
  if (category === 'length') {
    return LENGTH_BASE_UNIT
  }
  if (category === 'mass') {
    return MASS_BASE_UNIT
  }
  throw new Error(`Unknown category: ${category}`)
}
