"use client";

import { useState } from "react";
import UnitSelect from "./UnitSelect";
import AnalogGauge from "./AnalogGauge";
import type { ConvertResult, Unit } from "@/types/conversion";

interface ConverterFormProps {
  units: Unit[];
}

function normalizeToGauge(value: number): number {
  if (value === 0) return 0;
  const mag = Math.log10(Math.abs(value) + 1);
  return Math.max(0.05, Math.min(0.95, mag / 4));
}

export default function ConverterForm({ units }: ConverterFormProps) {
  const [value, setValue] = useState("");
  const [from, setFrom] = useState<string>(units[0].id);
  const [to, setTo] = useState<string>(units[1].id);
  const [result, setResult] = useState<ConvertResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  function appendKey(key: string) {
    if (key === "." && value.includes(".")) return;
    setValue((prev) => (prev === "0" && key !== "." ? key : prev + key));
  }

  function clearKeypad() {
    setValue("");
  }

  function backspaceKeypad() {
    setValue((prev) => prev.slice(0, -1));
  }

  function invertSign() {
    setValue((prev) => (prev.startsWith("-") ? prev.slice(1) : "-" + prev));
  }

  function swapUnits() {
    setFrom(to);
    setTo(from);
  }

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

      const converted = body as ConvertResult;
      setResult(converted);
    } catch {
      setError("Something went wrong. Please try again.");
      setResult(null);
    } finally {
      setIsConverting(false);
    }
  }

  return (
    <form
      className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        void handleConvert();
      }}
    >
      {/* LEFT: Digital LCD input + keypad */}
      <div className="flex flex-col gap-4">
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

          <div className="recessed-panel scanlines relative flex min-h-[64px] flex-col justify-end rounded border border-cyan-glow/20 p-3">
            <label className="absolute left-2 top-1.5 font-mono text-[10px] uppercase tracking-widest text-cyan-700">
              INPUT REGISTER
            </label>
            <input
              className="lcd-input w-full bg-transparent text-right text-3xl font-bold tracking-widest text-cyan-glow text-glow-cyan focus:outline-none md:text-4xl"
              type="number"
              inputMode="decimal"
              step="any"
              aria-label="Value"
              placeholder="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>

          {/* Tactical keypad */}
          <div className="mt-3 grid grid-cols-4 gap-2">
            <button type="button" className="key-btn rounded py-2 font-mono text-lg font-bold text-slate-200" onClick={() => appendKey("7")}>7</button>
            <button type="button" className="key-btn rounded py-2 font-mono text-lg font-bold text-slate-200" onClick={() => appendKey("8")}>8</button>
            <button type="button" className="key-btn rounded py-2 font-mono text-lg font-bold text-slate-200" onClick={() => appendKey("9")}>9</button>
            <button type="button" className="key-btn rounded border-amber-800/40 bg-amber-950/20 py-2 font-mono text-sm font-bold text-amber-400 hover:bg-amber-900/30" onClick={clearKeypad}>CLR</button>

            <button type="button" className="key-btn rounded py-2 font-mono text-lg font-bold text-slate-200" onClick={() => appendKey("4")}>4</button>
            <button type="button" className="key-btn rounded py-2 font-mono text-lg font-bold text-slate-200" onClick={() => appendKey("5")}>5</button>
            <button type="button" className="key-btn rounded py-2 font-mono text-lg font-bold text-slate-200" onClick={() => appendKey("6")}>6</button>
            <button type="button" className="key-btn rounded border-rose-800/40 bg-rose-950/20 py-2 font-mono text-sm font-bold text-rose-400 hover:bg-rose-900/30" onClick={backspaceKeypad}>DEL</button>

            <button type="button" className="key-btn rounded py-2 font-mono text-lg font-bold text-slate-200" onClick={() => appendKey("1")}>1</button>
            <button type="button" className="key-btn rounded py-2 font-mono text-lg font-bold text-slate-200" onClick={() => appendKey("2")}>2</button>
            <button type="button" className="key-btn rounded py-2 font-mono text-lg font-bold text-slate-200" onClick={() => appendKey("3")}>3</button>
            <button type="button" className="key-btn rounded border-cyan-800/40 bg-cyan-950/20 py-2 font-mono text-sm font-bold text-cyan-glow hover:bg-cyan-900/30" onClick={invertSign}>+/-</button>

            <button type="button" className="key-btn col-span-2 rounded py-2 font-mono text-lg font-bold text-slate-200" onClick={() => appendKey("0")}>0</button>
            <button type="button" className="key-btn rounded py-2 font-mono text-lg font-bold text-slate-200" onClick={() => appendKey(".")}>.</button>
            <button type="button" className="key-btn flex items-center justify-center gap-1 rounded border-cyan-700/50 bg-cyan-950/30 py-2 font-mono text-xs font-bold text-cyan-glow" onClick={swapUnits}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              SWAP
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: unit banks + hazard + gauge */}
      <div className="flex flex-col gap-4">
        {/* From / To unit banks */}
        <div className="housing-bevel relative overflow-hidden rounded-lg p-4">
          <div className="screw-head absolute left-2 top-2" />
          <div className="screw-head absolute right-2 top-2" />
          <div className="screw-head absolute bottom-2 left-2" />
          <div className="screw-head absolute bottom-2 right-2" />

          <div className="grid grid-cols-1 gap-4">
            <UnitSelect label="From unit" value={from} units={units} onChange={setFrom} />
            <UnitSelect label="To unit" value={to} units={units} onChange={setTo} />
          </div>
        </div>

        {/* Hazard convert switch */}
        <div className="housing-bevel relative overflow-hidden rounded-lg p-3">
          <div className="screw-head absolute left-2 top-2" />
          <div className="screw-head absolute right-2 top-2" />
          <div className="screw-head absolute bottom-2 left-2" />
          <div className="screw-head absolute bottom-2 right-2" />

          <button
            type="submit"
            disabled={isConverting}
            className="hazard-btn group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg px-4 py-2.5 font-orbitron text-xs font-extrabold tracking-widest text-slate-100 disabled:opacity-50"
          >
            <span className="absolute inset-0 rounded-lg border border-cyan-glow/40 transition-colors group-hover:border-cyan-glow" />
            <span className="h-2.5 w-2.5 rounded-full bg-hazard-red shadow-[0_0_10px_#ff3344] transition-transform group-hover:scale-125" />
            <span className="text-glow-cyan">{isConverting ? "CONVERTING..." : "ENGAGE CONVERT"}</span>
          </button>
        </div>

        {/* Error readout */}
        {error ? (
          <div className="housing-bevel rounded-lg border border-hazard-red/40 p-2">
            <p className="font-mono text-xs text-hazard-red text-glow-red" role="alert">
              {error}
            </p>
          </div>
        ) : null}

        {/* Analog gauge result */}
        <div className="housing-bevel scanlines relative overflow-hidden rounded-lg p-3 text-center">
          <div className="screw-head absolute left-2 top-2" />
          <div className="screw-head absolute right-2 top-2" />
          <div className="screw-head absolute bottom-2 left-2" />
          <div className="screw-head absolute bottom-2 right-2" />

          <div className="mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-hazard-red shadow-[0_0_6px_#ff3344]" />
              GAUGE READOUT
            </span>
            <span className="font-mono text-[10px] text-slate-500">INERTIA DAMPED</span>
          </div>

          <AnalogGauge normalized={result ? normalizeToGauge(result.value) : 0} />

          <div className="mx-auto min-w-[120px] max-w-xs rounded-lg border border-amber-glow/30 bg-slate-950/80 px-4 py-2 shadow-[0_0_15px_rgba(255,170,0,0.15)]">
            <output className="font-orbitron text-2xl font-black tracking-wider text-amber-glow text-glow-amber">
              {result ? `${formatResult(result.value)} ${result.unit}` : "--.--"}
            </output>
          </div>
        </div>
      </div>
    </form>
  );
}

function formatResult(value: number): string {
  const rounded = Math.round(value * 1_000_000) / 1_000_000;
  return String(rounded);
}
