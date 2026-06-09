import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { GraduationCap, Plane, Home, FileText, Check, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/intercambio")({
  head: () => ({ meta: [{ title: "Voa — Intercâmbio & Testes" }] }),
  component: Intercambio,
});

function Intercambio() {
  return (
    <AppShell>
      <PageHeader eyebrow="Voa · Intercâmbio" title="Preparada para morar fora." />

      {/* Countdown hero */}
      <section className="px-5">
        <div className="rounded-3xl bg-surface border border-border p-6 relative overflow-hidden">
          <div className="absolute -top-12 -right-10 size-48 rounded-full bg-accent/20 blur-3xl" />
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Sua jornada</p>
          <h2 className="font-display text-2xl font-semibold mt-2 leading-tight">
            High School USA<br />Boston · Agosto 2026
          </h2>
          <div className="mt-5 flex items-end gap-6">
            <div>
              <p className="font-display text-5xl font-semibold text-accent">187</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">dias restantes</p>
            </div>
            <div className="flex-1 pb-1.5">
              <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
                <div className="h-full bg-accent" style={{ width: "63%" }} />
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">63% pronta</p>
            </div>
          </div>
        </div>
      </section>

      {/* Test prep cards */}
      <section className="px-5 mt-7">
        <h3 className="font-display text-lg font-semibold mb-3">Preparação para testes</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { t: "TOEFL iBT", s: "78 → meta 95", c: "ativo", p: 64 },
            { t: "Duolingo Test", s: "115 → 130", c: null, p: 40 },
            { t: "IELTS", s: "Não iniciado", c: null, p: 0 },
            { t: "SAT inglês", s: "Não iniciado", c: null, p: 0 },
          ].map((t) => (
            <div
              key={t.t}
              className={`rounded-2xl p-4 border ${
                t.c ? "bg-accent text-accent-foreground border-accent" : "bg-surface border-border"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <FileText className="size-4 opacity-70" />
                {t.c && (
                  <span className="text-[9px] uppercase tracking-wider font-semibold bg-black/15 px-2 py-0.5 rounded-full">
                    Ativo
                  </span>
                )}
              </div>
              <p className="font-display text-base font-semibold">{t.t}</p>
              <p className={`text-[11px] mt-0.5 ${t.c ? "opacity-70" : "text-muted-foreground"}`}>
                {t.s}
              </p>
              <div className={`mt-3 h-1 rounded-full overflow-hidden ${t.c ? "bg-black/15" : "bg-surface-2"}`}>
                <div className={`h-full ${t.c ? "bg-black" : "bg-accent"}`} style={{ width: `${t.p}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section className="px-5 mt-8">
        <h3 className="font-display text-lg font-semibold mb-3">Roteiro de preparação</h3>
        <div className="rounded-3xl bg-surface border border-border divide-y divide-border">
          {[
            { i: GraduationCap, t: "Escolha do programa", s: "EF · STB · CI", done: true },
            { i: FileText, t: "Documentação + visto", s: "Checklist de 14 itens", done: true },
            { i: Plane, t: "Simulação de aeroporto", s: "3 cenários completos", done: false, active: true },
            { i: Home, t: "Primeira semana na host family", s: "12 conversas guiadas", done: false },
            { i: GraduationCap, t: "Sala de aula americana", s: "Apresentações + group work", done: false },
          ].map((s, i) => {
            const Icon = s.i;
            return (
              <div key={i} className="flex items-center gap-4 p-4">
                <div
                  className={`size-10 rounded-full flex items-center justify-center shrink-0 ${
                    s.done
                      ? "bg-accent text-accent-foreground"
                      : s.active
                      ? "border-2 border-accent text-accent"
                      : "bg-surface-2 text-muted-foreground"
                  }`}
                >
                  {s.done ? <Check className="size-5" /> : <Icon className="size-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${!s.done && !s.active ? "text-muted-foreground" : ""}`}>
                    {s.t}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.s}</p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
            );
          })}
        </div>
      </section>

      {/* Simulations */}
      <section className="px-5 mt-8 mb-4">
        <h3 className="font-display text-lg font-semibold mb-3">Simulações realistas</h3>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {[
            { e: "🛂", t: "Imigração JFK", n: "5 min" },
            { e: "🎤", t: "Entrevista de bolsa", n: "12 min" },
            { e: "🏫", t: "Apresentação acadêmica", n: "8 min" },
            { e: "🍕", t: "Pedindo delivery", n: "3 min" },
          ].map((c) => (
            <div key={c.t} className="shrink-0 w-40 rounded-2xl bg-surface border border-border p-4">
              <div className="text-3xl mb-3">{c.e}</div>
              <p className="text-sm font-semibold leading-tight">{c.t}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{c.n}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
