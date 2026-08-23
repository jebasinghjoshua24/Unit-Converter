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
      className="flex w-full max-w-sm flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        void handleConvert();
      }}
    >
      <label className="flex flex-col gap-1 text-sm font-medium">
        Value
        <input
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
          type="number"
          inputMode="decimal"
          step="any"
          aria-label="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>

      <UnitSelect label="From unit" value={from} units={units} onChange={setFrom} />
      <UnitSelect label="To unit" value={to} units={units} onChange={setTo} />

      <button
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
        type="submit"
        disabled={isConverting}
      >
        {isConverting ? "Converting..." : "Convert"}
      </button>

      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {result ? (
        <output className="text-lg font-semibold text-zinc-900">
          {formatResult(result.value)} {result.unit}
        </output>
      ) : null}
    </form>
  );
}

function formatResult(value: number): string {
  const rounded = Math.round(value * 1_000_000) / 1_000_000;
  return String(rounded);
}
