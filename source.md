# Change Log

Chronological log of every exchange on this project. Newest entries first.

---

## Exchange 6 — Area + Volume conversion (combined "Dimensions")

**Date:** 2026-08-23

### What changed

- Recorded analysis in `docs/feature-area-volume.md`.
- Wrote failing tests first (red, committed as `c9117e8`):
  - Added 14 area + volume tests to `__tests__/unit/conversion-engine.test.ts`.
  - Added 2 integration tests (m²→ft², gallon→L).
  - New `__tests__/components/dimensions-converter.test.tsx` — 4 UI tests.
  - Updated `__tests__/components/category-converter.test.tsx` — Dimensions option.
- Implemented the feature (green, committed as `6bd42c9`):
  - `types/conversion.ts` — added `Category: 'area' | 'volume'`, `AreaUnitId`,
    `VolumeUnitId`, extended `UnitId`.
  - `lib/conversion/registry.ts` — added `areaUnits` (9 units) and `volumeUnits`
    (9 units) with base square meter and liter.
  - `components/dimensions/DimensionsConverter.tsx` — nested selector (Area/Volume)
    rendering the appropriate `ConverterForm`.
  - `components/CategoryConverter.tsx` — added "Dimensions" entry.

### Why the approach was chosen

- Area and Volume are physically distinct (m² ≠ L) so they remain separate registry
  categories. The UI groups them under one "Dimensions" dropdown entry with a nested
  Area/Volume selector, keeping the category dropdown compact.

### Real-world example

User selects "Dimensions" → "Area", enters `1` square meter → `10.764 ft²`.
Switches to "Volume", enters `1` gallon → `3.785 L`.

### Functions

- `DimensionsConverter` — client component with nested `dimension` state (area/volume)
  rendering the appropriate `ConverterForm`.

---

## Exchange 5 — Temperature conversion feature (TDD: red → green)

**Date:** 2026-08-23

### What changed

- Recorded analysis in `docs/feature-temperature.md`.
- Wrote failing tests first (red, committed as `271ecd8`):
  - Added 12 temperature tests to `__tests__/unit/conversion-engine.test.ts`
    (offset conversions, identity, listCategories/listUnits/getUnit).
  - Added 2 temperature integration tests (`__tests__/integration/api-convert.test.ts`).
  - New `__tests__/components/temperature-converter.test.tsx` — 4 UI tests.
  - Updated `__tests__/components/category-converter.test.tsx` — Temperature option.
- Implemented the feature (green, committed as `06fa885`):
  - `types/conversion.ts` — added `Category: 'temperature'`, `TemperatureUnitId`,
    extended `UnitId`, added optional `offset` to `Unit`.
  - `lib/conversion/registry.ts` — added `temperatureUnits` (Celsius, Fahrenheit,
    Kelvin) with factor + offset.
  - `lib/conversion/engine.ts` — `convert` now computes `base = value × factor + offset`
    then `(base − offsetTo) ÷ factorTo`; length/mass (offset 0) reduce to the old ratio.
  - `components/temperature/TemperatureConverter.tsx` — thin wrapper around
    `ConverterForm` with temperature units.
  - `components/CategoryConverter.tsx` — added Temperature to the dropdown.

### Why the approach was chosen

- **Offset model (linear map):** temperature cannot be expressed as a pure ratio.
  Each unit stores `factor` + `offset` relative to Celsius; `offset` is optional and
  defaults to 0, so existing length/mass conversions are unchanged.
- Reuses the shared `ConverterForm` and `UnitSelect`; the temperature category is just
  data (units with offsets) plus a thin wrapper.

### Real-world example

User opens the app, selects "Temperature", enters `100` Celsius → Fahrenheit.
Engine: base = 100×1 + 0 = 100; result = (100 − (−160/9)) ÷ (5/9) = 212 → **212 °F**.

### Functions

- `convert(value, from, to)` — now offset-aware:
  `base = value × factorFrom + (offsetFrom ?? 0)`; return
  `(base − (offsetTo ?? 0)) / factorTo`.
- `TemperatureConverter` — thin wrapper: `ConverterForm units={listUnits("temperature")}`.

---

## Exchange 4 — Category selector (dropdown switcher)

**Date:** 2026-08-23

### What changed

- Recorded analysis in `docs/feature-category-selector.md`.
- Wrote failing tests first (red, committed as `9ed971d`):
  - New `__tests__/components/category-converter.test.tsx` — 5 UI tests: renders
    dropdown with Length/Mass, defaults to Length, switches to Mass, switches back,
    converts after switching.
- Implemented the feature (green, committed as `eeb499f`):
  - `components/CategoryConverter.tsx` — new client component: category `<select>`
    (default `length`) + renders the matching converter one at a time.
  - `app/page.tsx` — now renders `<CategoryConverter />` instead of stacking
    `LengthConverter` and `MassConverter` vertically.

### Why the approach was chosen

- A vertical stack grows unbounded as categories are added. A single dropdown keeps
  the page compact and scales by adding one entry + one branch per category.
- Kept `LengthConverter` / `MassConverter` wrappers unchanged (still tested) so the
  switcher is purely a presentational concern (single responsibility).

### Real-world example

User opens the app → sees the Length converter by default. Opens the "Category"
dropdown, selects "Mass" → the Mass converter appears. Selects "Length" → Length returns.

### Functions

- `CategoryConverter` — client component. Inputs: none (state-internal). Output:
  category `<select>` + the selected converter. Internal state: `category`.

---

## Exchange 3 — Mass conversion feature (TDD: red → green)

**Date:** 2026-08-23

### What changed

- Recorded feature analysis in `docs/feature-mass.md`: 7 mass units (mg→st), all
  static factors relative to kilogram.
- Wrote failing tests first (red, committed as `be18883`):
  - Added 12 mass-specific tests to `__tests__/unit/conversion-engine.test.ts`
    (convert, listCategories, listUnits, getUnit).
  - Added 2 mass integration tests to `__tests__/integration/api-convert.test.ts`
    (pound→kg, tonne→lb).
  - New `__tests__/components/mass-converter.test.tsx` — 4 UI tests.
- Implemented the feature (green, committed as `85182e5`):
  - `types/conversion.ts` — added `Category: 'mass'`, `MassUnitId`, extended `UnitId`.
  - `lib/conversion/registry.ts` — added `massUnits` (7 units) and registered in the
    registry map.
  - `lib/conversion/engine.ts` — added exported `getUnit(unitId)` for generic symbol
    lookup (used by the API route).
  - `app/api/convert/route.ts` — replaced length-specific `listUnits('length').find()`
    with generic `getUnit(body.to)`, so any category works.
  - `components/UnitSelect.tsx` — moved reusable dropdown to shared location.
  - `components/ConverterForm.tsx` — extracted shared generic converter form (used by
    both LengthConverter and MassConverter).
  - `components/length/LengthConverter.tsx` — refactored to thin wrapper around
    ConverterForm.
  - `components/mass/MassConverter.tsx` — thin wrapper around ConverterForm with mass
    units.
  - `components/length/UnitSelect.tsx` — deleted (moved to shared).
  - `app/page.tsx` — renders both Length and Mass converters side by side.

### Why the approach was chosen

- **Extracted `ConverterForm`:** Both converters had identical form logic. The shared
  generic component accepts `units: Unit[]` as a prop, so future categories (temperature,
  volume, ...) need only a thin wrapper + unit list.
- **`getUnit` abstraction:** The API route no longer hardcodes `listUnits('length')` for
  resolving the target symbol. `getUnit(unitId)` works across all categories.
- **`UnitSelect` moved to shared location:** Was `components/length/UnitSelect.tsx`, now
  `components/UnitSelect.tsx` — reusable by any category without cross-folder imports.

### Real-world example

User opens the app, enters `10` pounds → kilograms. The client POSTs
`{ value: 10, from: "pound", to: "kilogram" }`; the engine computes
`10 × 0.45359237 ÷ 1 = 4.5359237`; the UI shows **`4.535924 kg`**.

### Functions

- `getUnit(unitId: UnitId): Unit` — looks up a unit by id across all categories; throws
  if unknown. Used by the route handler.
- `ConverterForm` — generic client component: value input, two unit selects, convert
  button, result/error display. Takes `units: Unit[]` as prop.
- `MassConverter` — thin wrapper: `ConverterForm units={listUnits("mass")}`.

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
- Added Husky git hooks:
  - `package.json` — added `prepare: "husky"` script and `husky` dev dependency.
  - `.husky/pre-commit` — runs `npm run test:run && npm run lint`.
  - `.husky/pre-push` — runs `npm run test:run && npm run lint` (quality gate on push).

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
