# Unit Converter — Instrumentation Panel

A web application that converts values between units of measurement — built as a dark,
tactile **instrumentation panel**: recessed beveled panels, CRT scanlines, glowing
cyan/amber readouts, a rotary category dial, a tactile keypad, and an analog gauge that
sweeps to your answer.

![Desktop](public/screenshots/desktop.png)
*Desktop view — rotary dial on the left, converter form with LCD input, unit banks, and gauge on the right.*

![Mobile](public/screenshots/mobile.png)
*Mobile view — single-column stacked layout.*

## Features

| Category     | Units                                                        |
| ------------ | ------------------------------------------------------------ |
| Length       | mm, cm, m, km, in, ft, yd, mi                                |
| Mass         | mg, g, kg, tonne, oz, lb, st                                 |
| Temperature  | °C, °F, K                                                    |
| Area         | mm², cm², m², km², in², ft², yd², acre, mi²                  |
| Volume       | mL, L, m³, ft³, in³, gal, qt, pt, fl oz                      |
| Time         | ms, s, min, h, day, week                                     |
| Speed        | m/s, km/h, mph, ft/s, knot                                   |
| Energy       | J, kJ, cal, kcal, Wh, kWh                                    |
| Pressure     | Pa, kPa, bar, atm, mmHg, psi                                 |
| Currency     | USD, EUR, GBP, JPY, INR, CAD, AUD, CHF (DB-backed live rates) |

## Tech Stack

- **Next.js 16** (App Router, Route Handlers)
- **TypeScript** (strict)
- **React 19** (Server/Client components)
- **Tailwind CSS v4**
- **PostgreSQL + Prisma 7** (currency rates only)
- **Vitest + React Testing Library + supertest**

## Architecture

Conversions are computed in **pure TypeScript** using a typed registry of factors
relative to a canonical base unit per category (`lib/conversion/registry.ts`,
`lib/conversion/engine.ts`). The database is only involved for **currency** exchange
rates (`lib/conversion/currency.ts`), which change daily.

- Ratio categories: `result = value × factorFrom ÷ factorTo`
- Offset categories (temperature): `base = value × factor + offset`,
  `result = (base − offsetTo) ÷ factorTo`
- Currency: rates fetched from PostgreSQL via Prisma each request

See `AGENTS.md` for the full architecture guide and feature workflow.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Prerequisites

- Node.js 20+
- PostgreSQL running locally on `localhost:5432`

### Database setup (currency)

1. Copy `.env.example` to `.env` and set `DATABASE_URL`:

   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/unit_converter?schema=public"
   ```

2. Apply migrations and seed exchange rates:

   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

The app works without the database for all physical categories; only Currency needs it.

## Scripts

| Command              | Purpose                          |
| -------------------- | -------------------------------- |
| `npm run dev`        | Start dev server                 |
| `npm run build`      | Production build                 |
| `npm run start`      | Start production server          |
| `npm run lint`       | ESLint                           |
| `npm test`           | Vitest (watch mode)              |
| `npm run test:run`   | Vitest (single run)              |

Git hooks (Husky) run tests + lint automatically on commit and push.

## Tests

- **Unit** — conversion engine (`__tests__/unit/`): factor math, edge cases, precision
- **Integration** — API route (`__tests__/integration/`): status codes, response shape
- **Component** — React Testing Library (`__tests__/components/`): user interactions

Run the suite once:

```bash
npm run test:run
```

## API

`POST /api/convert`

```json
{ "value": 5, "from": "meter", "to": "foot" }
```

```json
{ "value": 16.404199, "from": "meter", "to": "foot", "unit": "ft" }
```

Currency pairs (e.g. `usd` → `eur`) use live rates from the database; all other pairs
use the static registry.

## Documentation

- `AGENTS.md` — architecture decisions, folder structure, TDD workflow
- `source.md` — chronological change log of every exchange
- `docs/` — per-feature analysis (units, factors, examples)

## Project Structure

```
app/
  page.tsx                  # Landing / converter UI
  api/convert/route.ts      # POST /api/convert — HTTP boundary
components/
  CategoryConverter.tsx     # Rotary dial category switcher
  RotaryDial.tsx            # Interactive rotary selector
  AnalogGauge.tsx           # Canvas gauge needle (spring physics)
  ConverterForm.tsx         # LCD input, keypad, unit banks, gauge
  UnitSelect.tsx            # Reusable unit dropdown
  length/ mass/ temperature/ dimensions/ currency/ time/ speed/ energy/ pressure/
lib/conversion/
  registry.ts               # Static unit definitions + factors
  engine.ts                 # Pure conversion functions
  currency.ts               # DB-backed currency rates
types/conversion.ts         # Shared TS types
__tests__/                  # Unit, integration, component tests
prisma/                     # Schema, seed, migrations
```
