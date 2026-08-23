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
    <label className="flex flex-col gap-1 text-sm font-medium">
      {label}
      <select
        className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {units.map((unit) => (
          <option key={unit.id} value={unit.id}>
            {unit.name}
          </option>
        ))}
      </select>
    </label>
  );
}
