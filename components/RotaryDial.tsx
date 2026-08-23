"use client";

import { useRef } from "react";

interface RotaryDialProps {
  items: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}

export default function RotaryDial({ items, value, onChange }: RotaryDialProps) {
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === value),
  );
  const knobRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startAngle = useRef(0);
  const accumAngle = useRef(0);

  const rotation = (360 / items.length) * activeIndex;

  function angleFromEvent(clientX: number, clientY: number): number {
    const el = knobRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return (Math.atan2(clientY - cy, clientX - cx) * 180) / Math.PI;
  }

  function handlePointerDown(e: React.PointerEvent) {
    isDragging.current = true;
    startAngle.current = angleFromEvent(e.clientX, e.clientY);
    accumAngle.current = 0;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!isDragging.current) return;
    const currentAngle = angleFromEvent(e.clientX, e.clientY);
    let delta = currentAngle - startAngle.current;
    startAngle.current = currentAngle;

    // wrap across -180/180
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    accumAngle.current += delta;

    const stepDeg = 360 / items.length;
    while (accumAngle.current >= stepDeg) {
      next();
      accumAngle.current -= stepDeg;
    }
    while (accumAngle.current <= -stepDeg) {
      prev();
      accumAngle.current += stepDeg;
    }
  }

  function handlePointerUp() {
    isDragging.current = false;
    accumAngle.current = 0;
  }

  function next() {
    onChange(items[(activeIndex + 1) % items.length].id);
  }

  function prev() {
    onChange(items[(activeIndex - 1 + items.length) % items.length].id);
  }

  function handleWheel(e: React.WheelEvent) {
    if (e.deltaY > 0) next();
    else prev();
  }

  const activeItem = items[activeIndex];

  return (
    <div className="flex w-full flex-col items-center gap-3">
      {/* Hidden native select — keeps tests + screen readers working */}
      <select
        aria-label="Category"
        className="sr-only"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        tabIndex={-1}
      >
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>

      {/* Dial face */}
      <div className="relative my-2 flex h-64 w-64 items-center justify-center select-none">
        {/* Outer metallic bevel ring */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-800 bg-gradient-to-b from-slate-900 to-black shadow-[inset_0_4px_8px_rgba(0,0,0,0.8),0_4px_12px_rgba(0,0,0,0.6)]" />

        {/* Tick marks */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 256 256">
          {items.map((item, i) => {
            const angleDeg = (i * (360 / items.length) - 90) * (Math.PI / 180);
            const isActive = i === activeIndex;
            const x1 = 128 + 104 * Math.cos(angleDeg);
            const y1 = 128 + 104 * Math.sin(angleDeg);
            const x2 = 128 + 118 * Math.cos(angleDeg);
            const y2 = 128 + 118 * Math.sin(angleDeg);
            return (
              <line
                key={item.id}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isActive ? "#00f3ff" : "#2b3648"}
                strokeWidth={isActive ? 3 : 1.5}
                style={isActive ? { filter: "drop-shadow(0 0 4px #00f3ff)" } : undefined}
              />
            );
          })}
        </svg>

        {/* Rotating knob */}
        <div
          ref={knobRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          className="relative flex h-40 w-40 cursor-grab touch-none items-center justify-center rounded-full border-2 border-slate-700 bg-gradient-to-br from-slate-800 via-slate-900 to-black shadow-[0_6px_16px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.15)] transition-transform duration-300 ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* textured grip */}
          <div className="absolute inset-2 rounded-full border border-slate-700/50 opacity-40 [background-image:radial-gradient(#1e293b_1px,transparent_1px)] [background-size:8px_8px]" />

          {/* center cap */}
          <div className="relative flex h-20 w-20 flex-col items-center justify-center rounded-full border border-slate-700/80 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 shadow-inner">
            <div className="absolute top-1.5 h-5 w-2 rounded-full bg-cyan-glow shadow-[0_0_8px_#00f3ff]" />
            <span className="mt-3 font-mono text-[10px] font-bold text-slate-500">MODE</span>
          </div>
        </div>
      </div>

      {/* Active category readout */}
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-cyan-glow shadow-[0_0_8px_#00f3ff] pulse-led" />
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-glow text-glow-cyan">
          {activeItem?.label}
        </span>
      </div>

      {/* Quick access chips */}
      <div className="grid w-full grid-cols-5 gap-1.5">
        {items.map((item, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={
                "truncate rounded border px-1 py-1 text-center font-mono text-[10px] transition " +
                (isActive
                  ? "border-cyan-glow/80 bg-cyan-950 font-bold text-cyan-glow shadow-[0_0_8px_rgba(0,243,255,0.3)]"
                  : "border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200")
              }
            >
              {item.label.slice(0, 3).toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
