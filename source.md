# Change Log

Chronological log of every exchange on this project. Newest entries first.

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
