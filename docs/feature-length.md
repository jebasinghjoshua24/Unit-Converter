# Feature: Length Conversion

**Date:** 2026-08-23
**Status:** Planned → In development (TDD)
**Branch:** `feature/unit-converter-length`

## 1. Units and factors

Canonical base unit: **meter (m)**. Every unit stores a factor relative to the meter.
Conversion formula: `result = value × factorFrom ÷ factorTo`.

| Unit      | Symbol | Factor (meters) | Precision source                       |
| --------- | ------ | --------------- | -------------------------------------- |
| millimeter | mm   | 0.001           | exact                                  |
| centimeter | cm   | 0.01            | exact                                  |
| meter     | m     | 1               | base                                   |
| kilometer | km    | 1000            | exact                                  |
| inch      | in    | 0.0254          | exact (2.54 cm)                        |
| foot      | ft    | 0.3048          | exact (12 in)                          |
| yard      | yd    | 0.9144          | exact (3 ft)                           |
| mile      | mi    | 1609.344        | exact (5280 ft)                        |

## 2. Static vs dynamic

**Static.** All factors are compile-time constants (exact definitions). No database
required. The Prisma schema stays unused for this category (AGENTS.md §3.2).

## 3. Edge cases

- Value `0` → result `0`.
- Negative values → valid (signed magnitudes).
- Same unit → identity (factorFrom ÷ factorTo = 1).
- Division by `factorTo` never divides by zero: every factor > 0.
- Fractional rounding: results are rounded to a sensible precision for display
  (6 decimal places by default); the engine returns the raw float and the UI formats.

## 4. Example

User enters `5` meters → feet: `5 × 1 ÷ 0.3048 = 16.404199...` → **16.404 ft**.
