import { registry } from './registry'
import type { Category, Unit, UnitId } from '../../types/conversion'

const unitById = new Map<string, Unit>()
const currencyUnitIds = new Set<string>(registry.currency.map((u) => u.id))

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

export function isCurrencyUnit(unitId: UnitId): boolean {
  return currencyUnitIds.has(unitId)
}

export function convert(value: number, from: UnitId, to: UnitId): number {
  if (isCurrencyUnit(from) || isCurrencyUnit(to)) {
    throw new Error('Currency conversion requires live rates')
  }
  const fromUnit = lookupUnit(from)
  const toUnit = lookupUnit(to)
  const baseValue = value * fromUnit.factor + (fromUnit.offset ?? 0)
  return (baseValue - (toUnit.offset ?? 0)) / toUnit.factor
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
