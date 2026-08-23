import type { Category, Unit } from '../../types/conversion'

const LENGTH_BASE_UNIT = 'meter'

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

export const registry: Record<Category, Unit[]> = {
  length: lengthUnits,
}

export function getBaseUnit(category: Category): string {
  if (category === 'length') {
    return LENGTH_BASE_UNIT
  }
  throw new Error(`Unknown category: ${category}`)
}
