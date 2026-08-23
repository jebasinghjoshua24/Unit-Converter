import LengthConverter from "@/components/length/LengthConverter";
import MassConverter from "@/components/mass/MassConverter";

export default function Home() {
  return (
    <main className="flex flex-1 items-start justify-center bg-zinc-50 p-6 dark:bg-black">
      <section className="flex w-full max-w-md flex-col items-center gap-8 rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-black">
        <header className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Unit Converter
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Length &amp; mass conversion
          </p>
        </header>
        <div className="w-full">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Length
          </h2>
          <LengthConverter />
        </div>
        <div className="w-full">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            Mass
          </h2>
          <MassConverter />
        </div>
      </section>
    </main>
  );
}
