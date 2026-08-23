# Change Log

Chronological log of every exchange on this project. Newest entries first.

---

## Exchange 2 — Length conversion feature (TDD: red → green)

**Date:** 2026-08-23

### What changed

- Recorded feature analysis in `docs/feature-length.md`: 8 length units, all with
  static factors relative to the meter.
- Wrote failing tests first (the spec, committed as `1e6e9ac`):
  - `__tests__/unit/conversion-engine.test.ts` — 11 tests for `convert`,
    `listCategories`, `listUnits` (factor math, identity, zero, negatives,
    round-trip, unknown units/categories).
  - `__tests__/integration/api-convert.test.ts` — 5 tests for `POST /api/convert`
    (200 success shape, 400 validation, 405 method).
  - `__tests__/components/length-converter.test.tsx` — 4 tests for the UI
    (rendering, options, conversion flow, error display).
- Implemented the feature (green, committed as `9eb2b43`):
  - `types/conversion.ts` — `Category`, `UnitId`, `LengthUnitId`, `Unit`,
    `ConvertRequest`, `ConvertResult`.
  - `lib/conversion/registry.ts` — `lengthUnits` (source of truth) + `registry`
    map + `getBaseUnit`.
  - `lib/conversion/engine.ts` — pure `convert`, `listCategories`, `listUnits`;
    no React/Next imports.
  - `app/api/convert/route.ts` — thin `POST` handler: JSON parse, validation,
    delegates to `convert`, returns `ConvertResult` with target symbol.
  - `components/length/UnitSelect.tsx` — reusable client dropdown.
  - `components/length/LengthConverter.tsx` — client form: value input, two unit
    selects, convert button, result/error display; calls `/api/convert`.
  - `app/page.tsx` — landing page now renders `LengthConverter`.
  - `__tests__/components/page-smoke.test.tsx` — updated heading assertion.

### Why the approach was chosen

- **Registry lookup table (canonical base unit) over pairwise matrix:** each unit
  stores one factor relative to `meter`; `convert` = `value × factorFrom ÷
  factorTo`. Adding a unit is one array entry, and conversion is O(1).
- **Engine is pure TS:** no database, no I/O, so unit tests run instantly and the
  same module is reused by both the API route and the client component.
- **Thin route handler:** the handler only parses/validates the request and maps
  results; all conversion math stays in the engine (single responsibility).
- **Client component delegates to the engine via the API:** the form never
  contains conversion logic; it fetches `/api/convert` (server-first per AGENTS.md
  §3.4).
- **Integration tests route through the real handler:** supertest drives the actual
  exported `POST` handler via a minimal Node HTTP server so status codes, headers,
  and body shape are verified end-to-end without starting Next.js.

### Real-world example

User opens the app, enters `5` in the value field, selects `Meter` as the source
unit and `Foot` as the target, and presses Convert. The client POSTs
`{ value: 5, from: "meter", to: "foot" }`; the engine computes
`5 × 1 ÷ 0.3048 = 16.404199`; the UI shows **`16.404199 ft`**.

### Functions

- `convert(value: number, from: UnitId, to: UnitId): number`
  - Inputs: numeric value, source unit id, target unit id.
  - Output: converted number (`value × factorFrom ÷ factorTo`).
  - Calls: internal `lookupUnit(unitId)` for both units (throws on unknown).
- `listCategories(): Category[]`
  - Inputs: none. Output: `["length"]` from `registry` keys.
- `listUnits(category: Category): Unit[]`
  - Inputs: category id. Output: array of `Unit`. Throws on unknown category.
- `POST /api/convert` (route handler)
  - Inputs: JSON body `{ value: number, from: string, to: string }`.
  - Output: `200` `{ value, from, to, unit }` or `400` `{ error }`.
  - Calls: `convert()`, `listUnits()` (to resolve the target symbol).
- `LengthConverter.handleConvert()`
  - Inputs: current form state (value, from, to).
  - Output: sets `result` (from API) or `error`; calls `fetch("/api/convert")`.

---

## Exchange 1 — Project scaffold, architecture, and docs

**Date:** 2026-08-23

### What changed

- Scaffolded a Next.js 16.3.2 App Router project (`create-next-app`) with
  TypeScript, Tailwind CSS v4, and ESLint.
  - `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `public/` (generated defaults).
- Installed test tooling: `vitest`, `@vitejs/plugin-react`, `jsdom`,
  `@testing-library/react`, `@testing-library/dom`, `@testing-library/jest-dom`,
  `vite-tsconfig-paths`, `supertest`, `@types/supertest`.
  - `vitest.config.mts` — jsdom environment, tsconfig path alias, test globs.
  - `vitest.setup.ts` — registers `@testing-library/jest-dom/vitest`.
  - `package.json` — added `test`, `test:run`, `test:watch` scripts.
- Installed database tooling: `prisma` (dev) + `@prisma/client`.
  - `prisma/schema.prisma` — `Unit`, `ConversionFactor` models, `UnitCategory` enum.
  - `.env.example` — documented `DATABASE_URL` (ignored, real credentials never committed).
- Created the planned folder skeleton:
  `app/api/convert/`, `components/length/`, `lib/conversion/`, `types/`,
  `__tests__/{unit,integration,components}/`, `prisma/migrations/`, `docs/`.
- Wrote `AGENTS.md` — architecture decisions, folder structure, TDD workflow,
  commands, git workflow, self-review checklist.
- Wrote this file (`source.md`) — per-feature change log.

### Why the approach was chosen

- **Pure-code conversion engine over database lookups:** length (and most physical
  categories) have compile-time constant factors. Storing them in PostgreSQL adds
  per-request latency and complexity with zero benefit. See AGENTS.md §3.1.
- **Canonical-base-unit registry:** each unit stores a factor relative to one base
  unit (e.g. `meter` for length), so conversion is `value_from × factor_from ÷
  factor_to` — no O(n²) pairwise factor matrix. See AGENTS.md §3.1.
- **Prisma schema kept "ready but lazy":** `Unit` + `ConversionFactor` exist now so
  dynamic/user-contributed categories (currency, custom units) can be added later
  without a redesign, but no migration is applied until a dynamic category needs it.
- **Vitest over Jest:** faster, native TS/ESM, drop-in Jest API, and is the test
  runner documented by the installed Next.js version (`node_modules/next/dist/docs/`).
- **Folder named `unit-converter` for npm:** npm package names cannot contain spaces
  or uppercase; `create-next-app` refuses the folder name "Unit Converter", so the
  scaffold was created in a temp dir and moved into place.

### Real-world example

Not yet applicable — no conversion feature is implemented in this exchange.
First real-world example arrives with the Length feature:
"User enters `5` in meters, selects feet → gets `16.404` feet."

### Functions

None yet (scaffolding exchange only).
