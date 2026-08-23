import { PrismaClient, UnitCategory } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

// Rates: units of currency per 1 USD, as of 2026-08-21 (Frankfurter API, ECB reference).
const CURRENCIES: { symbol: string; name: string; rate: number }[] = [
  { symbol: 'USD', name: 'US Dollar', rate: 1 },
  { symbol: 'EUR', name: 'Euro', rate: 0.85477 },
  { symbol: 'GBP', name: 'British Pound', rate: 0.73228 },
  { symbol: 'JPY', name: 'Japanese Yen', rate: 158.7 },
  { symbol: 'INR', name: 'Indian Rupee', rate: 95.7 },
  { symbol: 'CAD', name: 'Canadian Dollar', rate: 1.374 },
  { symbol: 'AUD', name: 'Australian Dollar', rate: 1.3951 },
  { symbol: 'CHF', name: 'Swiss Franc', rate: 0.79947 },
]

async function main() {
  for (const currency of CURRENCIES) {
    await prisma.unit.upsert({
      where: { symbol: currency.symbol },
      create: {
        symbol: currency.symbol,
        name: currency.name,
        category: UnitCategory.CURRENCY,
        rate: currency.rate,
      },
      update: { rate: currency.rate },
    })
  }
  console.log(`Seeded ${CURRENCIES.length} currency rates`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
