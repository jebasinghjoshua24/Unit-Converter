"use client";

import { useState, type ReactNode } from "react";
import RotaryDial from "./RotaryDial";
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

  return (
    <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-start">
      {/* Rotary category selector — left column on desktop */}
      <div className="w-full shrink-0 lg:w-80">
        <div className="housing-bevel scanlines relative overflow-hidden rounded-lg p-3">
          <div className="screw-head absolute left-2 top-2" />
          <div className="screw-head absolute right-2 top-2" />
          <div className="screw-head absolute bottom-2 left-2" />
          <div className="screw-head absolute bottom-2 right-2" />

          <div className="mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-glow shadow-[0_0_6px_#00f3ff]" />
              CATEGORY
            </span>
            <span className="font-mono text-[9px] text-slate-500">DRAG · SCROLL · CLICK</span>
          </div>

          <RotaryDial
            items={CATEGORIES.map((c) => ({ id: c.id, label: c.label }))}
            value={category}
            onChange={(id) => setCategory(id as Category)}
          />
        </div>
      </div>

      {/* Active converter — right column on desktop */}
      <div className="min-w-0 flex-1">
        {CATEGORIES.find((c) => c.id === category)?.component}
      </div>
    </div>
  );
}