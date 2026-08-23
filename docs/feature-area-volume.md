# Feature: Area + Volume Conversion (combined "Dimensions")

**Date:** 2026-08-23
**Status:** In development (TDD)
**Branch:** `feature/unit-converter-area-volume`

## 1. Overview

Area and Volume are both length-derived geometric dimensions. They share similar unit
families (metric: m²/cm², m³/L/mL; imperial: ft²/ft³, acres/gallons) but are physically
distinct — you never convert m² to liters. The engine keeps them as two separate
categories (`area`, `volume`) in the registry, while the UI groups them under a single
"Dimensions" dropdown entry with a nested Area/Volume selector.

## 2. Area units

Base: **square meter (m²)**.

| Unit           | Symbol | Factor (m²)   |
| -------------- | ------ | ------------- |
| sq millimeter  | mm²    | 0.000001      |
| sq centimeter  | cm²    | 0.0001        |
| square meter   | m²     | 1             |
| sq kilometer   | km²    | 1 000 000     |
| sq inch        | in²    | 0.00064516    |
| sq foot        | ft²    | 0.09290304    |
| sq yard        | yd²    | 0.83612736    |
| acre           | ac     | 4 046.8564224 |
| sq mile        | mi²    | 2 589 988.110336 |

## 3. Volume units

Base: **liter (L)**.

| Unit           | Symbol | Factor (L)    |
| -------------- | ------ | ------------- |
| milliliter     | mL     | 0.001         |
| liter          | L      | 1             |
| cubic meter    | m³     | 1000          |
| cubic foot     | ft³    | 28.316846592  |
| cubic inch     | in³    | 0.016387064   |
| gallon (US)    | gal    | 3.785411784   |
| quart (US)     | qt     | 0.946352946   |
| pint (US)      | pt     | 0.473176473   |
| fluid ounce    | fl oz  | 0.0295735295625 |

## 4. Static vs dynamic

**Static.** All factors are compile-time constants.

## 5. Example

User opens the app, selects "Dimensions" → "Area", enters `1` square meter → square feet:
`1 × 1 ÷ 0.09290304 = 10.7639` → **10.764 ft²**.

User selects "Volume", enters `1` gallon → liters:
`1 × 3.785411784 ÷ 1 = 3.7854` → **3.785 L**.