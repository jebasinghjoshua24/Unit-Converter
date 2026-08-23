# Feature: Time, Speed, Energy, Pressure (pure-ratio categories)

**Date:** 2026-08-23
**Status:** In development (TDD)
**Branch:** `feature/unit-converter-ratio-units`

## 1. Overview

Four independent categories, all **pure ratios** (no offsets) — same engine path as
length/mass. Each unit stores a factor relative to a canonical base unit.

## 2. Time — base: second (s)

| Unit         | Symbol | Factor (s) |
| ------------ | ------ | ---------- |
| millisecond  | ms     | 0.001      |
| second       | s      | 1          |
| minute       | min    | 60         |
| hour         | h      | 3600       |
| day          | d      | 86400      |
| week         | wk     | 604800     |

## 3. Speed — base: meter/second (m/s)

| Unit              | Symbol | Factor (m/s) |
| ----------------- | ------ | ------------ |
| meter/second      | m/s    | 1            |
| kilometer/hour    | km/h   | 0.277778     |
| mile/hour         | mph    | 0.44704      |
| foot/second       | ft/s   | 0.3048       |
| knot              | kn     | 0.514444     |

## 4. Energy — base: joule (J)

| Unit          | Symbol | Factor (J) |
| ------------- | ------ | ---------- |
| joule         | J      | 1          |
| kilojoule     | kJ     | 1000       |
| calorie       | cal    | 4.184      |
| kilocalorie   | kcal   | 4184       |
| watt-hour     | Wh     | 3600       |
| kilowatt-hour | kWh    | 3600000    |

## 5. Pressure — base: pascal (Pa)

| Unit        | Symbol | Factor (Pa) |
| ----------- | ------ | ----------- |
| pascal      | Pa     | 1           |
| kilopascal  | kPa    | 1000        |
| bar         | bar    | 100000      |
| atmosphere  | atm    | 101325      |
| mmHg        | mmHg   | 133.322     |
| psi         | psi    | 6894.757    |

## 6. Static vs dynamic

**Static** for all four — compile-time constants.

## 7. Examples

- Time: `2` hours → minutes = `2 × 3600 ÷ 60 = 120` → **120 min**.
- Speed: `100` km/h → mph = `100 × 0.277778 ÷ 0.44704 = 62.137` → **62.137 mph**.
- Energy: `1` kWh → kJ = `1 × 3600000 ÷ 1000 = 3600` → **3600 kJ**.
- Pressure: `1` atm → psi = `1 × 101325 ÷ 6894.757 = 14.696` → **14.696 psi**.
