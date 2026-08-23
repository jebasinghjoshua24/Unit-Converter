import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import type { CurrencyUnitId } from '../../types/conversion'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

// Rate convention: `rate` = units of currency per 1 USD (USD rate = 1).
// Pure function — takes rates as arguments so it is fully unit-testable.
export function convertCurrency(value: number, fromRate: number, toRate: number): number {
  return (value * toRate) / fromRate
}

export async function getCurrencyRates(): Promise<Map<string, number>> {
  const units = await prisma.unit.findMany({
    where: { category: 'CURRENCY' },
    select: { symbol: true, rate: true },
  })
  const rates = new Map<string, number>()
  for (const unit of units) {
    if (unit.rate != null) {
      rates.set(unit.symbol.toLowerCase(), unit.rate)
    }
  }
  return rates
}

export async function convertCurrencyWithDb(
  value: number,
  from: CurrencyUnitId,
  to: CurrencyUnitId,
): Promise<number> {
  const rates = await getCurrencyRates()
  const fromRate = rates.get(from)
  const toRate = rates.get(to)
  if (fromRate == null || toRate == null) {
    throw new Error(`Missing currency rate`)
  }
  return convertCurrency(value, fromRate, toRate)
}
