"use client";

import { useState, type ReactNode } from "react";
import LengthConverter from "./length/LengthConverter";
import MassConverter from "./mass/MassConverter";
import TemperatureConverter from "./temperature/TemperatureConverter";
import DimensionsConverter from "./dimensions/DimensionsConverter";
import TimeConverter from "./time/TimeConverter";
import SpeedConverter from "./speed/SpeedConverter";
import EnergyConverter from "./energy/EnergyConverter";
import PressureConverter from "./pressure/PressureConverter";
import CurrencyConverter from "./currency/CurrencyConverter";
import type { Category } from "@/types/conversion";

const CATEGORIES: { id: Category | "dimensions"; label: string; component: ReactNode }[] = [
  { id: "length", label: "Length", component: <LengthConverter /> },
  { id: "mass", label: "Mass", component: <MassConverter /> },
  { id: "temperature", label: "Temperature", component: <TemperatureConverter /> },
  { id: "dimensions", label: "Dimensions", component: <DimensionsConverter /> },
  { id: "time", label: "Time", component: <TimeConverter /> },
  { id: "speed", label: "Speed", component: <SpeedConverter /> },
  { id: "energy", label: "Energy", component: <EnergyConverter /> },
  { id: "pressure", label: "Pressure", component: <PressureConverter /> },
  { id: "currency", label: "Currency", component: <CurrencyConverter /> },
];

export default function CategoryConverter() {
  const [category, setCategory] = useState<Category>("length");
  const activeLabel = CATEGORIES.find((c) => c.id === category)?.label ?? "Length";

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Category selector — instrument panel */}
      <div className="housing-bevel relative overflow-hidden rounded-lg p-4">
        <div className="screw-head absolute left-2 top-2" />
        <div className="screw-head absolute right-2 top-2" />
        <div className="screw-head absolute bottom-2 left-2" />
        <div className="screw-head absolute bottom-2 right-2" />

        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">
            <span className="inline-block h-2 w-2 rounded-full bg-cyan-glow shadow-[0_0_6px_#00f3ff]" />
            ROTARY CATEGORY SELECTOR
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-cyan-glow text-glow-cyan">
            {activeLabel}
          </span>
        </div>

        <div className="relative">
          <select
            aria-label="Category"
            className="instrument-select w-full rounded border border-slate-700 px-3 py-2.5 text-sm font-mono tracking-wider text-slate-200"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id} className="bg-panel-card text-slate-200">
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active converter */}
      {CATEGORIES.find((c) => c.id === category)?.component}
    </div>
  );
}