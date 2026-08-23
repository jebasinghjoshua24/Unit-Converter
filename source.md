# Change Log

Chronological log of every exchange on this project. Newest entries first.

---

## Exchange 9 — Instrument Panel UI (visual redesign)

**Date:** 2026-08-23

### What changed

- `README.md` — rewrote from create-next-app boilerplate to full project documentation
  (features, architecture, setup, scripts, tests, API, project structure).

- Redesigned the entire UI as a **dark tactical instrument panel** (approved direction
  based on the "Night Instrument Cluster" prototype):
  - `app/globals.css` — full instrument theme: palette (`panel-dark`, `panel-card`,
    `panel-housing`, `panel-inner`, `panel-bevel`, `cyan-glow`, `amber-glow`,
    `hazard-red`, `status-green`), CRT scanlines, screw-head corners, recessed panels,
    housing bevels, glow text, keypad/hazard switch button styles, custom scrollbar,
    instrument-styled native selects, LCD input.
  - `app/layout.tsx` — added Orbitron, Share Tech Mono, VT323 fonts; dark panel body.
  - `app/page.tsx` — instrument workspace: telemetry header (SYS.READY, VOLT/FREQ/STATUS),
    main, system footer.
  - `components/CategoryConverter.tsx` — category select wrapped in a beveled panel
    with glowing active-category readout.
  - `components/UnitSelect.tsx` — unit dropdown styled as an instrument control.
  - `components/ConverterForm.tsx` — LCD value input with scanlines, dual unit banks,
    hazard "ENGAGE CONVERT" switch, amber analog-gauge result readout.
  - `components/dimensions/DimensionsConverter.tsx` — nested selector in a beveled panel.

### Interactive enhancements

- `components/RotaryDial.tsx` — drag-to-rotate, scroll-wheel, and click-to-select category
  dial. Drives the same state as a hidden native `<select aria-label="Category">` (kept
  `sr-only` for test + screen-reader compatibility). Shows tick marks, a rotating knob
  with a glowing cyan notch, and compact code buttons for quick access.
- `components/AnalogGauge.tsx` — canvas-based gauge with spring-physics needle sweep,
  active cyan arc, 20 tick marks, amber needle, and pivot. Animates via
  `requestAnimationFrame` with `useRef` for physics state.
- `components/ConverterForm.tsx` added:
  - **Tactile keypad** (0-9, ., CLR, DEL, +/-) and a **SWAP** button (swap from/to units).
  - **AnalogGauge** result display with amber readout.
- `vitest.setup.ts` — canvas `getContext` mock for jsdom test compatibility.

### Why the approach was chosen

- The user supplied a full interactive prototype and approved the instrument-cluster
  aesthetic: dark, mechanical, precise, with glowing readouts and tactile controls.
- **All form controls remain native** (`<select>`, `<input>`, `<button>`) with the same
  aria-labels and option names, so the entire test suite (140 tests) stays green —
  the redesign is purely visual plus the page shell.

### Real-world example

User opens the app → sees a dark instrument panel with a telemetry header (SYS.READY).
Selects "Length" in the category panel, types `5` into the glowing LCD input, picks
Meter → Foot, presses "ENGAGE CONVERT" (the hazard switch sinks on click), and the
amber readout shows **`16.404199 ft`**.

### Functions

- `CategoryConverter`, `UnitSelect`, `ConverterForm`, `DimensionsConverter` — unchanged
  logic; only styling/markup wrapper changed.
- New CSS utility classes in `globals.css`: `screw-head`, `scanlines`, `recessed-panel`,
  `housing-bevel`, `text-glow-*`, `pulse-led`, `instrument-select`, `lcd-input`,
  `key-btn`, `hazard-btn`.

### Detector note

Impeccable detector flagged the faint grid background as advisory. Kept deliberately:
an instrument panel is a measurement surface, the intended exception in the detector's
own rule, and the grid is a committed part of the approved direction.

---

## Exchange 8 — Currency conversion (first DB-backed category)

**Date:** 2026-08-23

### What changed

- Recorded analysis in `docs/feature-currency.md`.
- Wrote failing tests first (red, committed as `4664c4e`):
  - `__tests__/unit/currency.test.ts` — 6 tests for the pure `convertCurrency`.
  - 4 currency engine tests (listCategories/listUnits/getUnit, static-convert guard).
  - `__tests__/integration/api-convert-currency.test.ts` — 3 tests with mocked rates.
  - `__tests__/components/currency-converter.test.tsx` — 3 UI tests.
  - Updated CategoryConverter test with Currency option.
- Implemented (green, committed as `04c181f`):
  - `prisma/schema.prisma` — added `rate Float?` to `Unit`, made `symbol` unique.
  - `prisma.config.ts` — Prisma 7 config (adapter + seed); removed `url` from schema.
  - `prisma/seed.ts` — seeds 8 currency rates relative to USD.
  - `lib/conversion/currency.ts` — pure `convertCurrency` + DB-backed
    `getCurrencyRates` / `convertCurrencyWithDb` using `@prisma/adapter-pg`.
  - `lib/conversion/engine.ts` — `isCurrencyUnit`; `convert()` refuses currency units.
  - `app/api/convert/route.ts` — branches currency→currency to the DB path.
  - `components/currency/CurrencyConverter.tsx` + CategoryConverter entry.
- Ran `prisma migrate dev` (created `20260823164345_add_currency_rates`) and
  `prisma db seed` (seeded 8 rates). Verified end-to-end: POST 100 USD→EUR → 85.48.

### Why the approach was chosen

- **Currency is dynamic:** exchange rates change daily, so they belong in PostgreSQL.
  The registry keeps only metadata so the dropdown needs no DB query.
- **Pure core + injected rates:** `convertCurrency(value, fromRate, toRate)` is a pure
  function, fully unit-testable. The route fetches rates via Prisma and injects them.
- **Prisma 7 requires a driver adapter:** `@prisma/adapter-pg` + `pg`, configured in
  `prisma.config.ts`; the schema `url` is no longer valid.
- **Live rates:** seed data was refreshed from the Frankfurter/ECB API (2026-08-21)
  after the initial seed used outdated approximations.

### Real-world example

User selects "Currency", enters `100` USD → EUR. The route detects a currency pair,
loads live rates from `Unit` (`usd=1`, `eur=0.85477`), and computes
`100 × 0.85477 ÷ 1 = 85.48` → **€85.48**.

### Functions

- `convertCurrency(value, fromRate, toRate)` — pure: `value × toRate ÷ fromRate`.
- `getCurrencyRates()` — async, Prisma query returning `Map<code, rate>`.
- `convertCurrencyWithDb(value, from, to)` — async, fetches rates then converts.
- `isCurrencyUnit(unitId)` — engine helper used by the route to branch.

---

## Exchange 7 — Time, Speed, Energy, Pressure (pure-ratio categories)

**Date:** 2026-08-23

### What changed

- Recorded analysis in `docs/feature-ratio-units.md` (4 categories, all pure ratio).
- Wrote failing tests first (red, committed as `95e6c0b`):
  - Added 21 engine tests, 4 integration tests, 12 component tests
    (`time/speed/energy/pressure-converter.test.tsx`), and updated the
    CategoryConverter test.
- Implemented the feature (green, committed as `4172b86`):
  - `types/conversion.ts` — added `time`, `speed`, `energy`, `pressure` categories
    and their unit-id unions.
  - `lib/conversion/registry.ts` — added `timeUnits` (6), `speedUnits` (5),
    `energyUnits` (6), `pressureUnits` (6).
  - New wrappers: `components/{time,speed,energy,pressure}/*Converter.tsx`.
  - `components/CategoryConverter.tsx` — added the 4 entries.

### Why the approach was chosen

- All four are pure ratios, so they reuse the existing `ConverterForm`/`UnitSelect`
  with zero engine changes. This branch bundles them to reduce branch/commit overhead;
  each category is still an atomic commit.

### Real-world example

User selects "Speed", enters `100` km/h → `62.137 mph`. Selects "Pressure",
enters `1` atm → `14.696 psi`.

### Functions

- Four thin wrappers around `ConverterForm` (one per category).

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
