import { PrismaClient, UnitCategory } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

const CURRENCIES: { symbol: string; name: string; rate: number }[] = [
  { symbol: 'USD', name: 'US Dollar', rate: 1 },
  { symbol: 'EUR', name: 'Euro', rate: 0.92 },
  { symbol: 'GBP', name: 'British Pound', rate: 0.79 },
  { symbol: 'JPY', name: 'Japanese Yen', rate: 149 },
  { symbol: 'INR', name: 'Indian Rupee', rate: 83.3 },
  { symbol: 'CAD', name: 'Canadian Dollar', rate: 1.36 },
  { symbol: 'AUD', name: 'Australian Dollar', rate: 1.52 },
  { symbol: 'CHF', name: 'Swiss Franc', rate: 0.88 },
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
