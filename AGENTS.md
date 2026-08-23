<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Unit Converter — Agent & Architecture Guide

High-level overview of the system, architecture decisions, and the exact workflow for
adding new unit-conversion features. Read this before writing any code.

## 1. Project Overview

A web application that converts values between units of measurement (length, mass,
temperature, etc.). Built for a single user flow: **enter a value + source unit +
target unit → get the converted value**.

**Current feature status:**

| Feature     | Status        |
| ----------- | ------------- |
| Length      | Implemented (first feature) |
| Mass        | Implemented   |
| Temperature | Implemented   |
| Volume      | Not started   |
| ...         | Not started   |

## 2. Tech Stack (mandated — no alternatives)

| Concern        | Technology                                    |
| -------------- | --------------------------------------------- |
| Framework      | Next.js 16 (App Router, Route Handlers)       |
| Language       | TypeScript (strict mode)                      |
| UI             | React 19 components (Server/Client as needed) |
| Styling        | Tailwind CSS v4                               |
| Database       | PostgreSQL                                    |
| ORM            | Prisma 7                                      |
| Tests          | Vitest + React Testing Library + supertest    |
| Validation     | zod (to be added when features require it)    |

All code, comments, variable names, and documentation are written in **English**.

## 3. Architecture Decisions

### 3.1 Two-layer conversion model

Conversions are computed in **pure TypeScript code** using a typed registry of
conversion factors. The database is **not** involved in a conversion request.

- **Why:** Static conversion factors (e.g. 1 meter = 3.28084 feet) are compile-time
  constants. Querying a database per request adds latency and complexity with zero benefit.
- **Lookup strategy:** every unit stores a factor relative to a canonical base unit per
  category (e.g. `meter` for length). Conversion is `value_from × factor_from ÷ factor_to`.
  This avoids storing an O(n²) matrix of pairwise factors.
- **Offsets (linear maps):** categories like temperature are not pure ratios. Each unit
  may carry an `offset` such that `base = value × factor + offset`, and conversion is
  `(base_from − offset_to) ÷ factor_to`. Length/mass units use `offset: 0`, which reduces
  to the simple ratio formula above.

### 3.2 Database is "ready but lazy"

Prisma + PostgreSQL schema exists (`prisma/schema.prisma`) with `Unit` and
`ConversionFactor` tables so that **dynamic or user-contributed** units can be added
later without a redesign.

- **When to use the DB:** only if/when a conversion category has dynamic factors
  (e.g. currency exchange rates, user-defined units).
- **Migration scripts** live in `prisma/migrations/` and are created with
  `npx prisma migrate dev`.

### 3.3 Single Responsibility

Every file has exactly one clear purpose. The rules:

- A pure conversion engine module must not import React or Next.js.
- An API route handler must not contain UI code.
- A client component must not contain business logic — it delegates to the engine.
- If a file grows beyond one purpose, split it.

### 3.4 Server-first rendering

- **Server Components** by default. Data fetching and pure computation happen on the server.
- **Client Components** (`"use client"`) only where interactivity is required
  (form inputs, instant results, unit dropdowns).
- Follow the Vercel React Best Practices skill
  (`.agents/skills/vercel-react-best-practices/AGENTS.md`): no barrel imports, parallel
  fetches, derive state during render, functional setState, etc.

## 4. Folder Structure

```
app/
  page.tsx                  # Landing / converter UI (Server Component shell)
  layout.tsx                # Root layout
  api/
    convert/route.ts        # POST /api/convert — HTTP boundary (thin)
components/
  CategoryConverter.tsx     # (client) dropdown to switch between categories
  ConverterForm.tsx         # (client) generic converter form (value, units, result)
  UnitSelect.tsx            # (client) reusable unit dropdown
  length/
    LengthConverter.tsx     # (client) length wrapper around ConverterForm
  mass/
    MassConverter.tsx       # (client) mass wrapper around ConverterForm
  temperature/
    TemperatureConverter.tsx # (client) temperature wrapper around ConverterForm
lib/
  conversion/
    registry.ts             # Static unit definitions + factors (the source of truth)
    engine.ts               # Pure conversion functions (convert, listCategories, ...)
types/
  conversion.ts             # Shared TS types (Unit, Category, ConvertRequest, ...)
__tests__/
  unit/
    conversion-engine.test.ts
  integration/
    api-convert.test.ts
  components/
    length-converter.test.tsx
    mass-converter.test.tsx
    category-converter.test.tsx
prisma/
  schema.prisma             # Unit + ConversionFactor models (ready, unused for static)
  migrations/               # Generated migration scripts
docs/                       # Design notes, ADRs (architecture decision records)
source.md                   # Change log (see §7)
AGENTS.md                   # This file
```

## 5. Test-Driven Development (mandatory)

**Never write a line of production code before a failing test exists for it.**

### 5.1 Test layers

| Layer       | Location                     | Tool / approach                                  |
| ----------- | ---------------------------- | ------------------------------------------------ |
| Unit        | `__tests__/unit/*.test.ts`   | Vitest; pure functions, edge cases, precision    |
| Integration | `__tests__/integration/*.test.ts` | supertest against the real Route Handler |
| Component   | `__tests__/components/*.test.tsx` | React Testing Library; user interactions  |

### 5.2 Commands

| Command              | Purpose                          |
| -------------------- | -------------------------------- |
| `npm run dev`        | Start dev server                 |
| `npm test`           | Vitest (watch mode)              |
| `npm run test:run`   | Vitest (single run)              |
| `npm run lint`       | ESLint                           |
| `npm run build`      | Production build                 |

> **Note:** async Server Components are not yet supported by Vitest. Unit-test
> synchronous components; use E2E (Playwright/Cypress, not yet configured) for async ones.

### 5.3 Git hooks (Husky)

Husky runs quality gates automatically:

- **pre-commit:** `npm run test:run && npm run lint`
- **pre-push:** `npm run test:run && npm run lint`

No code can be committed or pushed while the suite is red. Hooks live in `.husky/`
and are installed on `npm install` via the `prepare` script. On Windows, Husky uses
the `bash.exe` bundled with Git for Windows (not WSL).

## 6. Feature Workflow (repeat for every new category)

Follow this exact sequence, one category at a time:

1. **Analyse the feature** — list units + formulas. Decide: static factors (pure code)
   or dynamic (DB). Record the analysis in `docs/`.
2. **Design DB schema (only if dynamic)** — write the migration first, run it.
3. **Create empty files** — one purpose per file (see §4).
4. **Write failing tests first** — unit → integration → component. These are the spec.
5. **Implement (TDD cycle)** — minimal code to pass: engine → API → UI.
6. **Run tests, iterate** — fix failures, refactor while green.
7. **Document** — update `source.md` (§7) and this file's §1 table.
8. **Commit atomically** — see §8.
9. **Hand over** — summarize assumptions, edge cases, improvements. Do **not** merge/push.

## 7. Documentation (`source.md`)

Append a log entry to `source.md` after every exchange containing:

- What changed (files, functions).
- Why the approach was chosen (e.g. lookup-table vs code constants).
- A real-world example (`5 meters → 16.404 feet`).
- Inputs/outputs of each function and which internal functions it calls.

## 8. Git Workflow

- Branch per feature: `feature/unit-converter-<category>` (e.g. `feature/unit-converter-length`).
- Commit frequently, atomic commits, clear messages.
- **Never merge to `main` or push** — that is the user's responsibility after final
  verification.

## 9. Final Self-Review Checklist

- [ ] All tests pass (`npm run test:run`)
- [ ] `npm run lint` clean
- [ ] `npm run build` succeeds
- [ ] `source.md` updated
- [ ] Feature table in §1 updated
- [ ] Atomic commits on the feature branch
