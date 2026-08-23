# Feature: Mass Conversion

**Date:** 2026-08-23
**Status:** In development (TDD)
**Branch:** `feature/unit-converter-mass`

## 1. Units and factors

Canonical base unit: **kilogram (kg)**. Every unit stores a factor relative to the kilogram.
Conversion formula: `result = value × factorFrom ÷ factorTo`.

| Unit      | Symbol | Factor (kg) | Notes                                |
| --------- | ------ | ----------- | ------------------------------------ |
| milligram | mg     | 0.000001    | 1e-6, exact                          |
| gram      | g      | 0.001       | exact                                |
| kilogram  | kg     | 1           | base (SI)                            |
| tonne     | t      | 1000        | metric ton, exact                    |
| ounce     | oz     | 0.028349523125 | avoirdupois, exact (1 lb = 16 oz) |
| pound     | lb     | 0.45359237  | avoirdupois, exact                   |
| stone     | st     | 6.35029318  | 14 lb, exact                         |

## 2. Static vs dynamic

**Static.** All factors are compile-time constants (exact definitions). No database
required.

## 3. Edge cases

Same as length: zero, negative, identity, unknown units all handled by the engine.

## 4. Example

User enters `10` pounds → kilograms: `10 × 0.45359237 ÷ 1 = 4.5359237` → **4.535924 kg**.