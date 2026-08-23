import CategoryConverter from "@/components/CategoryConverter";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col justify-between p-2 md:p-6 text-slate-300">
      {/* TOP TELEMETRY BAR */}
      <header className="mx-auto mb-4 w-full max-w-7xl">
        <div className="housing-bevel relative overflow-hidden rounded-lg p-3 md:p-4">
          <div className="screw-head absolute left-2 top-2" />
          <div className="screw-head absolute right-2 top-2" />
          <div className="screw-head absolute bottom-2 left-2" />
          <div className="screw-head absolute bottom-2 right-2" />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 pl-4">
              <div className="h-3 w-3 animate-pulse rounded-full bg-status-green shadow-[0_0_10px_#00ff66]" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-orbitron text-lg font-extrabold uppercase tracking-wider text-slate-100 md:text-xl">
                    Unit Converter
                  </h1>
                  <span className="rounded border border-cyan-glow/40 bg-cyan-950 px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest text-cyan-glow text-glow-cyan">
                    SYS.READY
                  </span>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  PRECISION INSTRUMENTATION // MK-IV LAB ENGINE
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-6 border-x border-slate-800 px-6 py-1 text-xs font-mono text-slate-400 lg:flex">
              <div>
                <span className="text-slate-600">VOLT:</span>{" "}
                <span className="text-cyan-glow">12.04 V</span>
              </div>
              <div>
                <span className="text-slate-600">FREQ:</span>{" "}
                <span className="text-amber-glow">60.00 Hz</span>
              </div>
              <div>
                <span className="text-slate-600">STATUS:</span>{" "}
                <span className="text-status-green">NOMINAL</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN WORKSPACE */}
      <main className="mx-auto w-full max-w-7xl flex-1">
        <CategoryConverter />
      </main>

      {/* FOOTER */}
      <footer className="mx-auto mt-6 w-full max-w-7xl border-t border-slate-800/80 pt-3 text-center font-mono text-[11px] text-slate-600">
        TACTILE INSTRUMENTATION CORE // MK-IV ENGINE // LOW-LIGHT LOW-NOISE CALIBRATED
      </footer>
    </div>
  );
}