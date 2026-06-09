import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Flame, Trophy, Crown, Settings, ChevronRight, Check, Palette } from "lucide-react";
import { ACCENT_PRESETS, useProfile, updateProfile, type AccentKey } from "@/lib/profile-store";
import { applyAccent } from "@/components/theme-provider";

export const Route = createFileRoute("/perfil")({
  head: () => ({ meta: [{ title: "flui — Perfil" }] }),
  component: Perfil,
});

function Perfil() {
  const profile = useProfile();
  const name = profile?.name ?? "Marina Alves";
  const initial = name.charAt(0).toUpperCase();
  const currentAccent: AccentKey = profile?.accent ?? "lime";

  function pickColor(k: AccentKey) {
    applyAccent(k);
    if (profile) updateProfile({ accent: k });
  }

  return (
    <AppShell>
      <PageHeader
        eyebrow="Perfil"
        title={name}
        action={
          <button className="size-10 rounded-full bg-surface border border-border flex items-center justify-center">
            <Settings className="size-4" />
          </button>
        }
      />

      {/* Identity card */}
      <section className="px-5">
        <div className="rounded-3xl bg-surface border border-border p-5 flex items-center gap-4">
          <div className="size-16 rounded-full bg-gradient-to-br from-accent to-accent/30 flex items-center justify-center font-display text-2xl font-semibold text-accent-foreground">
            {initial}
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Nível atual</p>
            <p className="font-display text-2xl font-semibold">B1+ Inglês 🇺🇸</p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-accent-soft border border-accent/30 px-3 py-1.5">
            <Flame className="size-3.5 text-accent" />
            <span className="text-xs font-semibold text-accent">27</span>
          </div>
        </div>
      </section>

      {/* CEFR ladder */}
      <section className="px-5 mt-6">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
          Sua escada CEFR
        </p>
        <div className="flex items-end justify-between gap-2">
          {["A1", "A2", "B1", "B2", "C1", "C2"].map((l, i) => {
            const reached = i <= 2;
            const current = i === 2;
            return (
              <div key={l} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className={`w-full rounded-md ${reached ? "bg-accent" : "bg-surface-2"}`}
                  style={{ height: `${24 + i * 14}px` }}
                />
                <span className={`text-[11px] font-semibold ${current ? "text-accent" : reached ? "text-foreground" : "text-muted-foreground"}`}>
                  {l}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Color customization */}
      <section className="px-5 mt-7">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Palette className="size-4 text-accent" />
            <h3 className="font-display text-lg font-semibold">Cor do seu flui</h3>
          </div>
          <span className="text-[11px] text-muted-foreground">
            {ACCENT_PRESETS[currentAccent].label}
          </span>
        </div>
        <div className="rounded-3xl bg-surface border border-border p-4">
          <div className="grid grid-cols-6 gap-2">
            {(Object.keys(ACCENT_PRESETS) as AccentKey[]).map((k) => {
              const p = ACCENT_PRESETS[k];
              const sel = currentAccent === k;
              return (
                <button
                  key={k}
                  onClick={() => pickColor(k)}
                  aria-label={p.label}
                  className={`aspect-square rounded-full flex items-center justify-center transition border-2 ${
                    sel ? "border-foreground scale-95" : "border-transparent"
                  }`}
                  style={{ background: p.swatch }}
                >
                  {sel && <Check className="size-4 text-black" />}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Premium */}
      <section className="px-5 mt-7">
        <div className="rounded-3xl bg-accent text-accent-foreground p-5 relative overflow-hidden glow-accent">
          <Crown className="absolute -right-4 -top-4 size-24 opacity-15" />
          <p className="text-[11px] uppercase tracking-[0.22em] font-semibold opacity-70">
            flui Premium
          </p>
          <h3 className="font-display text-xl font-semibold mt-1.5 leading-tight">
            Conversas ilimitadas + todos os simulados de intercâmbio.
          </h3>
          <button className="mt-4 rounded-full bg-black text-white px-5 py-2.5 text-sm font-medium">
            R$ 29/mês · 7 dias grátis
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="px-5 mt-7 grid grid-cols-2 gap-3">
        {[
          { v: "1,287", l: "palavras dominadas" },
          { v: "42h", l: "conversação IA" },
          { v: "94", l: "lições completas" },
          { v: "B2", l: "previsão p/ ago" },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl bg-surface border border-border p-4">
            <p className="font-display text-2xl font-semibold">{s.v}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{s.l}</p>
          </div>
        ))}
      </section>

      {/* Achievements */}
      <section className="px-5 mt-7">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg font-semibold">Conquistas</h3>
          <span className="text-xs text-muted-foreground">12 / 48</span>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide">
          {[
            { e: "🔥", t: "Streak de 30" },
            { e: "🎤", t: "100 shadowings" },
            { e: "🛫", t: "Pronta p/ voar" },
            { e: "🗣️", t: "Falante real" },
            { e: "📚", t: "1k palavras" },
          ].map((a, i) => (
            <div
              key={i}
              className="shrink-0 w-24 rounded-2xl bg-surface border border-border p-3 text-center"
            >
              <div className="text-3xl mb-1.5">{a.e}</div>
              <p className="text-[11px] leading-tight">{a.t}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Menu */}
      <section className="px-5 mt-7 mb-4">
        <div className="rounded-3xl bg-surface border border-border divide-y divide-border">
          {[
            { i: Trophy, t: "Ranking entre amigos" },
            { i: Settings, t: "Preferências de idioma" },
            { i: Crown, t: "Gerenciar assinatura" },
          ].map((m) => {
            const Icon = m.i;
            return (
              <button key={m.t} className="w-full flex items-center gap-3 p-4 text-left">
                <Icon className="size-4 text-accent" />
                <span className="text-sm flex-1">{m.t}</span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </button>
            );
          })}
        </div>
      </section>
    </AppShell>
  );
}
