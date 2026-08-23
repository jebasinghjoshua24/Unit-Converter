"use client";

import type { Unit } from "@/types/conversion";

interface UnitSelectProps {
  label: string;
  value: string;
  units: Unit[];
  onChange: (value: string) => void;
}

export default function UnitSelect({ label, value, units, onChange }: UnitSelectProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-glow/70 shadow-[0_0_6px_#00f3ff66]" />
        {label}
      </span>
      <select
        aria-label={label}
        className="instrument-select w-full rounded border border-slate-700 px-2.5 py-1.5 text-xs font-mono tracking-wider text-slate-200"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {units.map((unit) => (
          <option key={unit.id} value={unit.id} className="bg-panel-card text-slate-200">
            {unit.name}
          </option>
        ))}
      </select>
    </label>
  );
}
