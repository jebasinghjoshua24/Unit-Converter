"use client";

import { useState, type ReactNode } from "react";
import LengthConverter from "./length/LengthConverter";
import MassConverter from "./mass/MassConverter";
import type { Category } from "@/types/conversion";

const CATEGORIES: { id: Category; label: string; component: ReactNode }[] = [
  { id: "length", label: "Length", component: <LengthConverter /> },
  { id: "mass", label: "Mass", component: <MassConverter /> },
];

export default function CategoryConverter() {
  const [category, setCategory] = useState<Category>("length");

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm font-medium">
        Category
        <select
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          aria-label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </label>
      {CATEGORIES.find((c) => c.id === category)?.component}
    </div>
  );
}