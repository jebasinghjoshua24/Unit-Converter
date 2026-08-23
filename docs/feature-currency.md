# Feature: Currency Conversion (DB-backed, first dynamic category)

**Date:** 2026-08-23
**Status:** In development (TDD)
**Branch:** `feature/unit-converter-currency`

## 1. Problem

Currency exchange rates change daily — they are **not** compile-time constants. This
is the first category that uses the PostgreSQL DB (the "ready but lazy" Prisma schema).

## 2. Design

### 2.1 Canonical base currency

Same strategy as every category: a **canonical base unit** (USD) and each currency
stores a **rate relative to USD** (`rate = units of base per 1 USD`). Conversion is
`value × rateFrom ÷ rateTo`, identical to the ratio formula.

- Base: **USD** (rate 1).
- Seeded currencies with live rates: USD, EUR, GBP, JPY, INR, CAD, AUD, CHF.

### 2.2 DB schema

- `Unit` model gains a `rate Float?` column (rate relative to the category's base
  unit; `null` for static categories).
- Currency units are seeded into `Unit` with `category = CURRENCY`.
- Static categories ignore `rate` entirely — no change to their behavior.

### 2.3 Static registry vs dynamic rates

- The registry keeps currency **metadata** (id/code, name, symbol) so the dropdown
  renders without a DB hit. Factors are placeholders and never used for conversion.
- The **API route** detects a currency→currency request and fetches live rates from
  Prisma, then computes via the pure `convertCurrency` function.
- Unit tests test `convertCurrency` (pure) and mock the rate provider for integration
  tests — no live DB required in CI.

## 3. Examples

Rate convention: `rate` = units of currency per 1 USD (USD rate = 1).

- `100` USD → EUR (rate 0.85477): `100 × 0.85477 ÷ 1 = 85.48` → **€85.48**.
- `1000` JPY → USD (rate 158.7): `1000 × 1 ÷ 158.7 = 6.30` → **$6.30**.
- `100` EUR → USD: `100 × 1 ÷ 0.85477 = 116.99` → **$116.99**.

## 4. Seed data (reference rates, 2026-08-21)

Seeded via `prisma/seed.ts` so the app works out of the box; refresh from an
exchange-rate API (e.g. Frankfurter/ECB) as needed.

| Code | Name        | Rate per 1 USD |
| ---- | ----------- | -------------- |
| USD  | US Dollar   | 1              |
| EUR  | Euro        | 0.85477        |
| GBP  | British Pound | 0.73228      |
| JPY  | Japanese Yen | 158.7         |
| INR  | Indian Rupee | 95.7           |
| CAD  | Canadian Dollar | 1.374        |
| AUD  | Australian Dollar | 1.3951     |
| CHF  | Swiss Franc | 0.79947         |
