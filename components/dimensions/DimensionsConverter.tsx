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
      <div className="housing-bevel relative overflow-hidden rounded-lg p-4">
        <div className="screw-head absolute left-2 top-2" />
        <div className="screw-head absolute right-2 top-2" />
        <div className="screw-head absolute bottom-2 left-2" />
        <div className="screw-head absolute bottom-2 right-2" />

        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">
            <span className="inline-block h-2 w-2 rounded-full bg-cyan-glow shadow-[0_0_6px_#00f3ff]" />
            DIMENSION SUB-SECTION
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-glow text-glow-cyan">
            {active.label}
          </span>
        </div>

        <select
          aria-label="Dimension"
          className="instrument-select w-full rounded border border-slate-700 px-3 py-2.5 text-sm font-mono tracking-wider text-slate-200"
          value={dimension}
          onChange={(e) => setDimension(e.target.value)}
        >
          {DIMENSIONS.map((d) => (
            <option key={d.id} value={d.id} className="bg-panel-card text-slate-200">
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <ConverterForm key={active.id} units={active.units} />
    </div>
  );
}