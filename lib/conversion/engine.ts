import { registry } from './registry'
import type { Category, Unit, UnitId } from '../../types/conversion'

const unitById = new Map<string, Unit>()

for (const units of Object.values(registry)) {
  for (const unit of units) {
    unitById.set(unit.id, unit)
  }
}

function lookupUnit(unitId: string): Unit {
  const unit = unitById.get(unitId)
  if (!unit) {
    throw new Error(`Unknown unit: ${unitId}`)
  }
  return unit
}

export function getUnit(unitId: UnitId): Unit {
  return lookupUnit(unitId)
}

export function convert(value: number, from: UnitId, to: UnitId): number {
  const fromUnit = lookupUnit(from)
  const toUnit = lookupUnit(to)
  return (value * fromUnit.factor) / toUnit.factor
}

export function listCategories(): Category[] {
  return Object.keys(registry) as Category[]
}

export function listUnits(category: Category): Unit[] {
  const units = registry[category]
  if (!units) {
    throw new Error(`Unknown category: ${category}`)
  }
  return units
}
