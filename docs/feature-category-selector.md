# Feature: Category Selector (dropdown switcher)

**Date:** 2026-08-23
**Status:** In development (TDD)
**Branch:** `feature/category-selector`

## 1. Problem

The landing page currently stacks every category's converter vertically
(`app/page.tsx` renders `LengthConverter` then `MassConverter`). As more categories
are added (temperature, volume, ...), the page grows unbounded and becomes hard to use.

## 2. Solution

Replace the vertical stack with a **category dropdown**. The user picks a category
(Length, Mass, ...) and only that category's converter is shown.

- New client component `components/CategoryConverter.tsx`:
  - Holds the selected category in state (default: `length`).
  - Renders a `<select aria-label="Category">` with one option per category.
  - Renders the matching converter (`LengthConverter`, `MassConverter`, ...) — one at a time.
- `app/page.tsx` renders `<CategoryConverter />` instead of the stacked list.
- Existing `LengthConverter` / `MassConverter` wrappers stay untouched (still tested).

## 3. Why a dropdown (not tabs)

A `<select>` is the simplest accessible control and scales naturally as categories are
added — adding a category only requires a label entry and a branch in the switcher.

## 4. Example

User opens the app → sees Length converter. Opens "Category" dropdown → selects
"Mass" → the Mass converter appears (7 units). Selects "Length" again → Length returns.
