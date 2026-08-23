"use client";

import { useState } from "react";
import ConverterForm from "../ConverterForm";
import { listUnits } from "@/lib/conversion/engine";
import type { Unit } from "@/types/conversion";

const DIMENSIONS: { id: string; label: string; units: Unit[] }[] = [
  { id: "area", label: "Area", units: listUnits("area") },
  { id: "volume", label: "Volume", units: listUnits("volume") },
];

export default function DimensionsConverter() {
  const [dimension, setDimension] = useState("area");
  const active = DIMENSIONS.find((d) => d.id === dimension) ?? DIMENSIONS[0];

  return (
    <div className="flex w-full flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm font-medium">
        Dimension
        <select
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          aria-label="Dimension"
          value={dimension}
          onChange={(e) => setDimension(e.target.value)}
        >
          {DIMENSIONS.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label}
            </option>
          ))}
        </select>
      </label>
      <ConverterForm key={active.id} units={active.units} />
    </div>
  );
}
