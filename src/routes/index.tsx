import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/app-shell";
import { useProfile } from "@/lib/profile-store";
import { Flame, ArrowUpRight, Mic, MessagesSquare, Compass, Plane, Sparkle } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "flui — Início" },
      { name: "description", content: "Seu progresso para a fluência real." },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const profile = useProfile();
  useEffect(() => {
    if (typeof window !== "undefined" && profile === null) {
      const raw = localStorage.getItem("flui_profile_v1");
      if (!raw) navigate({ to: "/onboarding" });
    }
  }, [profile, navigate]);

  const firstName = profile?.name?.split(" ")[0] ?? "Marina";
  return (
    <AppShell>
      <header className="px-5 pt-10 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-accent flex items-center justify-center">
            <span className="font-display font-bold text-accent-foreground text-sm">f</span>
          </div>
          <span className="font-display font-semibold tracking-tight lowercase">flui</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5">
          <Flame className="size-3.5 text-accent" />
          <span className="text-xs font-semibold">27</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">dias</span>
        </div>
      </header>

      <section className="px-5 pt-6">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Olá, {firstName}</p>
        <h1 className="font-display text-[34px] leading-[1.02] font-semibold mt-2 text-balance">
          Você está a <span className="text-accent">63%</span> da fluência B2 em inglês.
        </h1>
      </section>

      {/* Today card */}
      <section className="px-5 mt-7">
        <div className="relative overflow-hidden rounded-3xl bg-accent text-accent-foreground p-6 glow-accent">
          <div className="absolute -right-10 -top-10 size-44 rounded-full bg-black/10 blur-2xl" />
          <p className="text-[11px] uppercase tracking-[0.22em] font-semibold opacity-70">Hoje</p>
          <h2 className="font-display text-2xl font-semibold mt-2 leading-tight">
            Simulação: Primeiro dia na <br />host family
          </h2>
          <p className="text-sm mt-2 opacity-80 max-w-[280px]">
            8 min · Conversa com Sarah, sua host mom em Boston.
          </p>
          <Link
            to="/conversa"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-black text-white px-4 py-2.5 text-sm font-medium"
          >
            Começar sessão <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Metrics */}
      <section className="px-5 mt-6 grid grid-cols-3 gap-3">
        {[
          { v: "247", l: "min essa semana" },
          { v: "B1+", l: "nível atual" },
          { v: "94%", l: "pronúncia" },
        ].map((m) => (
          <div key={m.l} className="rounded-2xl bg-surface border border-border p-4">
            <p className="font-display text-2xl font-semibold">{m.v}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1 leading-tight">
              {m.l}
            </p>
          </div>
        ))}
      </section>

      {/* Continue */}
      <section className="px-5 mt-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg font-semibold">Continuar</h3>
          <button className="text-xs text-muted-foreground">Ver tudo</button>
        </div>
        <div className="space-y-2.5">
          {[
            { icon: Mic, t: "Shadowing · Obama at Stanford", s: "ep 3 de 8", to: "/shadowing" },
            { icon: MessagesSquare, t: "Conversa com Jake (15 anos)", s: "ontem · 12 msg", to: "/conversa" },
            { icon: Compass, t: "Gírias do TikTok USA 2026", s: "imersão · 4 lições", to: "/imersao" },
          ].map((r) => {
            const Icon = r.icon;
            return (
              <Link
                key={r.t}
                to={r.to}
                className="flex items-center gap-3 rounded-2xl bg-surface border border-border p-3.5 active:scale-[0.98] transition"
              >
                <div className="size-11 rounded-xl bg-surface-2 flex items-center justify-center">
                  <Icon className="size-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{r.t}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.s}</p>
                </div>
                <ArrowUpRight className="size-4 text-muted-foreground" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* Intercâmbio progress */}
      <section className="px-5 mt-8">
        <Link to="/intercambio" className="block rounded-3xl bg-surface border border-border p-5 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Plane className="size-4 text-accent" />
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Meta de intercâmbio</p>
              </div>
              <h3 className="font-display text-xl font-semibold leading-tight">
                High School USA<br />Agosto 2026
              </h3>
            </div>
            <span className="font-display text-3xl font-semibold text-accent">63%</span>
          </div>
          <div className="mt-4 h-1.5 rounded-full bg-surface-2 overflow-hidden">
            <div className="h-full bg-accent rounded-full" style={{ width: "63%" }} />
          </div>
          <div className="mt-3 flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>TOEFL 78</span><span>Meta 95</span>
          </div>
        </Link>
      </section>

      {/* Daily challenge */}
      <section className="px-5 mt-6">
        <div className="rounded-2xl border border-accent/30 bg-accent-soft p-4 flex items-center gap-3">
          <Sparkle className="size-5 text-accent shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold">Desafio diário · +50 XP</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Use 3 gírias americanas em uma conversa real.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
