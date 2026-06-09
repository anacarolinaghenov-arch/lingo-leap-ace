import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Play, Mic, Repeat, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/shadowing")({
  head: () => ({ meta: [{ title: "Voa — Shadowing & Chorusing" }] }),
  component: Shadowing,
});

function Shadowing() {
  return (
    <AppShell>
      <PageHeader eyebrow="Shadowing" title="Soe como nativo." />

      {/* Mode tabs */}
      <div className="px-5 flex gap-2">
        {["Shadowing", "Chorusing", "Pronúncia"].map((t, i) => (
          <button
            key={t}
            className={`px-4 py-2 rounded-full text-xs font-medium ${
              i === 0
                ? "bg-foreground text-background"
                : "border border-border text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Active session card */}
      <section className="px-5 mt-6">
        <div className="rounded-3xl bg-surface border border-border overflow-hidden">
          <div className="aspect-[16/10] bg-gradient-to-br from-accent/30 via-surface-2 to-black relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="size-16 rounded-full bg-accent flex items-center justify-center glow-accent">
                <Play className="size-6 text-accent-foreground fill-current ml-0.5" />
              </button>
            </div>
            <div className="absolute bottom-3 left-4 right-4 flex items-center gap-1">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-white/40 rounded-full"
                  style={{ height: `${8 + Math.sin(i / 2) * 8 + Math.random() * 14}px` }}
                />
              ))}
            </div>
          </div>
          <div className="p-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Discurso · TED</p>
            <h3 className="font-display text-xl font-semibold mt-1.5 leading-tight">
              "The power of vulnerability" — Brené Brown
            </h3>
            <p className="text-xs text-muted-foreground mt-2">3:42 · sotaque americano · B2</p>
          </div>
        </div>
      </section>

      {/* Transcript with highlight */}
      <section className="px-5 mt-5">
        <div className="rounded-2xl bg-surface-2 border border-border p-4">
          <p className="text-[15px] leading-relaxed">
            So, I'll start with this:{" "}
            <span className="bg-accent text-accent-foreground px-1 rounded">a couple years ago,</span>{" "}
            an event planner called me because{" "}
            <span className="underline decoration-accent decoration-2 underline-offset-4">
              I was going to do a speaking event.
            </span>
          </p>
        </div>
      </section>

      {/* Score */}
      <section className="px-5 mt-5">
        <div className="rounded-3xl bg-surface border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Sua última tentativa
            </p>
            <div className="flex items-center gap-1 text-accent text-xs">
              <TrendingUp className="size-3.5" /> +6
            </div>
          </div>
          <div className="flex items-end gap-4">
            <span className="font-display text-6xl font-semibold leading-none">87</span>
            <span className="text-sm text-muted-foreground mb-1">/ 100</span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[
              { l: "Pronúncia", v: 92 },
              { l: "Ritmo", v: 84 },
              { l: "Entonação", v: 88 },
              { l: "Fluidez", v: 81 },
            ].map((s) => (
              <div key={s.l}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground">{s.l}</span>
                  <span className="text-xs font-semibold">{s.v}</span>
                </div>
                <div className="h-1 rounded-full bg-surface-2 overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: `${s.v}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-5 border-t border-border">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
              Coach IA
            </p>
            <p className="text-sm leading-relaxed">
              Você travou em <span className="text-accent font-medium">"vulnerability"</span>. Tente
              dividir em <em>vul·ne·ra·BI·li·ty</em> e acentuar a 4ª sílaba.
            </p>
          </div>
        </div>
      </section>

      {/* Actions */}
      <section className="px-5 mt-5 grid grid-cols-2 gap-3">
        <button className="rounded-2xl bg-surface border border-border p-4 flex items-center gap-3">
          <Repeat className="size-5 text-accent" />
          <span className="text-sm font-medium">Repetir</span>
        </button>
        <button className="rounded-2xl bg-accent text-accent-foreground p-4 flex items-center gap-3 justify-center">
          <Mic className="size-5" />
          <span className="text-sm font-semibold">Gravar de novo</span>
        </button>
      </section>

      {/* Library */}
      <section className="px-5 mt-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg font-semibold">Modo Intercâmbio</h3>
          <button className="text-xs text-muted-foreground">Ver todos</button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { t: "Aeroporto JFK", n: "8 cenas", e: "✈️" },
            { t: "Primeira aula", n: "6 cenas", e: "🎒" },
            { t: "Host Family", n: "12 cenas", e: "🏡" },
            { t: "Pedindo no café", n: "5 cenas", e: "☕" },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl bg-surface border border-border p-4">
              <div className="text-2xl mb-2">{c.e}</div>
              <p className="text-sm font-semibold">{c.t}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{c.n}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
