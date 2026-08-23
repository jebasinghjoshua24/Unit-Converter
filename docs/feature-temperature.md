# Feature: Temperature Conversion

**Date:** 2026-08-23
**Status:** In development (TDD)
**Branch:** `feature/unit-converter-temperature`

## 1. Units and factors + offsets

Temperature is a **linear map with an offset**, not a pure ratio. The engine model
becomes:

```
base       = value × factor + offset   // convert unit → base (Celsius)
result     = (base − offsetTo) / factorTo
```

Canonical base unit: **Celsius (°C)**.

| Unit       | Symbol | Factor         | Offset         | Notes                              |
| ---------- | ------ | -------------- | -------------- | ---------------------------------- |
| Celsius    | °C     | 1              | 0              | base                               |
| Fahrenheit | °F     | 5/9            | −160/9         | F = C×9/5 + 32 → C = (F−32)×5/9    |
| Kelvin     | K      | 1              | −273.15        | C = K − 273.15                     |

Existing length/mass units keep `offset: 0`, so the formula reduces to the previous
`value × factorFrom ÷ factorTo`.

## 2. Static vs dynamic

**Static.** All factors/offsets are compile-time constants.

## 3. Edge cases

- Absolute zero: `0 K → −273.15 °C`.
- Negative temperatures are valid (e.g. `−40 °C → −40 °F`).
- Identity conversions hold.
- Round-trip through the base unit holds.

## 4. Example

User enters `100` Celsius → Fahrenheit: base = 100×1 + 0 = 100;
result = (100 − (−160/9)) / (5/9) = 212 → **212 °F**.
