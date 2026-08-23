"use client";

import { useState } from "react";
import UnitSelect from "./UnitSelect";
import type { ConvertResult, Unit } from "@/types/conversion";

interface ConverterFormProps {
  units: Unit[];
}

export default function ConverterForm({ units }: ConverterFormProps) {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState<string>(units[0].id);
  const [to, setTo] = useState<string>(units[1].id);
  const [result, setResult] = useState<ConvertResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  async function handleConvert() {
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) {
      setError("Please enter a valid number.");
      return;
    }

    setError(null);
    setIsConverting(true);

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: numericValue, from, to }),
      });
      const body = await response.json();

      if (!response.ok) {
        setError(body.error ?? "Conversion failed.");
        setResult(null);
        return;
      }

      setResult(body as ConvertResult);
    } catch {
      setError("Something went wrong. Please try again.");
      setResult(null);
    } finally {
      setIsConverting(false);
    }
  }

  return (
    <form
      className="flex w-full flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        void handleConvert();
      }}
    >
      {/* Digital LCD value input */}
      <div className="housing-bevel relative overflow-hidden rounded-lg p-4">
        <div className="screw-head absolute left-2 top-2" />
        <div className="screw-head absolute right-2 top-2" />
        <div className="screw-head absolute bottom-2 left-2" />
        <div className="screw-head absolute bottom-2 right-2" />

        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-glow shadow-[0_0_6px_#ffaa00]" />
            DIGITAL LCD INPUT
          </span>
          <span className="font-mono text-[11px] text-slate-500">PRECISION: 6 DEC</span>
        </div>

        <div className="recessed-panel scanlines relative flex min-h-[72px] flex-col justify-end rounded border border-cyan-glow/20 p-3">
          <label className="absolute left-2 top-1.5 font-mono text-[10px] uppercase tracking-widest text-cyan-700">
            INPUT REGISTER
          </label>
          <input
            className="lcd-input w-full bg-transparent text-right text-4xl font-bold tracking-widest text-cyan-glow text-glow-cyan focus:outline-none md:text-5xl"
            type="number"
            inputMode="decimal"
            step="any"
            aria-label="Value"
            placeholder="0"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </div>

      {/* From / To unit banks */}
      <div className="housing-bevel relative overflow-hidden rounded-lg p-4">
        <div className="screw-head absolute left-2 top-2" />
        <div className="screw-head absolute right-2 top-2" />
        <div className="screw-head absolute bottom-2 left-2" />
        <div className="screw-head absolute bottom-2 right-2" />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UnitSelect label="From unit" value={from} units={units} onChange={setFrom} />
          <UnitSelect label="To unit" value={to} units={units} onChange={setTo} />
        </div>
      </div>

      {/* Hazard convert switch */}
      <div className="housing-bevel relative overflow-hidden rounded-lg p-4">
        <div className="screw-head absolute left-2 top-2" />
        <div className="screw-head absolute right-2 top-2" />
        <div className="screw-head absolute bottom-2 left-2" />
        <div className="screw-head absolute bottom-2 right-2" />

        <button
          type="submit"
          disabled={isConverting}
          className="hazard-btn group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-lg px-6 py-3 font-orbitron text-sm font-extrabold tracking-widest text-slate-100 disabled:opacity-50"
        >
          <span className="absolute inset-0 rounded-lg border border-cyan-glow/40 transition-colors group-hover:border-cyan-glow" />
          <span className="h-3 w-3 rounded-full bg-hazard-red shadow-[0_0_10px_#ff3344] transition-transform group-hover:scale-125" />
          <span className="text-glow-cyan">
            {isConverting ? "CONVERTING..." : "ENGAGE CONVERT"}
          </span>
        </button>
      </div>

      {/* Error readout */}
      {error ? (
        <div className="housing-bevel rounded-lg border border-hazard-red/40 p-3">
          <p className="font-mono text-sm text-hazard-red text-glow-red" role="alert">
            {error}
          </p>
        </div>
      ) : null}

      {/* Analog gauge result */}
      {result ? (
        <div className="housing-bevel scanlines relative overflow-hidden rounded-lg p-4 text-center">
          <div className="screw-head absolute left-2 top-2" />
          <div className="screw-head absolute right-2 top-2" />
          <div className="screw-head absolute bottom-2 left-2" />
          <div className="screw-head absolute bottom-2 right-2" />

          <div className="mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">
              <span className="inline-block h-2 w-2 rounded-full bg-hazard-red shadow-[0_0_6px_#ff3344]" />
              ANALOG INSTRUMENT READOUT
            </span>
            <span className="font-mono text-xs text-slate-500">INERTIA DAMPED</span>
          </div>

          <div className="mx-auto min-w-[200px] max-w-sm rounded-lg border border-amber-glow/30 bg-slate-950/80 px-6 py-3 shadow-[0_0_15px_rgba(255,170,0,0.15)]">
            <output className="font-orbitron text-3xl font-black tracking-wider text-amber-glow text-glow-amber">
              {formatResult(result.value)} {result.unit}
            </output>
          </div>
        </div>
      ) : null}
    </form>
  );
}

function formatResult(value: number): string {
  const rounded = Math.round(value * 1_000_000) / 1_000_000;
  return String(rounded);
}
