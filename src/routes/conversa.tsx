import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Mic, SendHorizontal, Sparkles, Users } from "lucide-react";

export const Route = createFileRoute("/conversa")({
  head: () => ({ meta: [{ title: "Voa — Conversa com IA" }] }),
  component: Conversa,
});

const personas = [
  { name: "Sarah", role: "Host mom · Boston", emoji: "👩🏼", active: true },
  { name: "Jake", role: "Colega 15a · LA", emoji: "🧑🏻" },
  { name: "Mr. Davis", role: "Teacher", emoji: "👨🏾‍🏫" },
  { name: "TSA Agent", role: "Aeroporto JFK", emoji: "👮" },
  { name: "Barista", role: "Starbucks", emoji: "👨🏽" },
];

const messages = [
  { from: "ai", text: "Hey Marina! Come on in, sweetie. How was the flight from São Paulo?" },
  { from: "user", text: "It was good, thank you! A little tired but very excited." },
  { from: "ai", text: "Aww, I bet! Make yourself at home. Your room is upstairs — second door on the left. Dinner's at 6, sound good?" },
  { from: "ai_tip", text: "💡 “Sound good?” = jeito casual americano de pedir confirmação. Mais informal que “Is that ok?”." },
  { from: "user", text: "Sounds great. Should I help with anything?" },
];

function Conversa() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Conversa IA"
        title="Fale com pessoas reais."
        action={
          <button className="size-10 rounded-full bg-surface border border-border flex items-center justify-center">
            <Users className="size-4" />
          </button>
        }
      />

      {/* Persona selector */}
      <div className="px-5 mt-1">
        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
          {personas.map((p) => (
            <button
              key={p.name}
              className={`shrink-0 rounded-2xl border px-3.5 py-3 text-left min-w-[140px] transition ${
                p.active
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-surface border-border text-foreground"
              }`}
            >
              <div className="text-2xl mb-1.5">{p.emoji}</div>
              <p className="text-sm font-semibold leading-tight">{p.name}</p>
              <p className={`text-[10px] mt-0.5 ${p.active ? "opacity-70" : "text-muted-foreground"}`}>
                {p.role}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Scenario chip */}
      <div className="px-5 mt-4 flex items-center gap-2">
        <div className="rounded-full bg-surface border border-border px-3 py-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
          Cenário · Host Family
        </div>
        <div className="rounded-full bg-surface border border-border px-3 py-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
          Informal · gírias on
        </div>
      </div>

      {/* Chat */}
      <div className="px-5 mt-5 space-y-3">
        {messages.map((m, i) => {
          if (m.from === "ai_tip") {
            return (
              <div key={i} className="rounded-2xl border border-accent/30 bg-accent-soft p-3.5">
                <p className="text-xs leading-relaxed">{m.text}</p>
              </div>
            );
          }
          const user = m.from === "user";
          return (
            <div key={i} className={`flex ${user ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  user
                    ? "bg-accent text-accent-foreground rounded-br-md"
                    : "bg-surface border border-border rounded-bl-md"
                }`}
              >
                <p className="text-[14px] leading-snug">{m.text}</p>
              </div>
            </div>
          );
        })}

        <div className="flex items-center gap-2 pl-1">
          <div className="flex gap-1">
            <span className="size-1.5 rounded-full bg-muted-foreground animate-pulse" />
            <span className="size-1.5 rounded-full bg-muted-foreground animate-pulse [animation-delay:150ms]" />
            <span className="size-1.5 rounded-full bg-muted-foreground animate-pulse [animation-delay:300ms]" />
          </div>
          <span className="text-[11px] text-muted-foreground">Sarah está digitando…</span>
        </div>
      </div>

      {/* Suggestions */}
      <div className="px-5 mt-5">
        <div className="flex items-center gap-1.5 mb-2">
          <Sparkles className="size-3.5 text-accent" />
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Sugestões IA</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["Yeah, that'd be awesome.", "I can set the table!", "What are we having?"].map((s) => (
            <button key={s} className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs">
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Composer */}
      <div className="fixed bottom-[88px] left-1/2 -translate-x-1/2 w-full max-w-[440px] px-4 z-40">
        <div className="flex items-center gap-2 rounded-full bg-surface-2 border border-border pl-4 pr-1.5 py-1.5">
          <input
            placeholder="Digite ou segure para falar…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground py-2"
          />
          <button className="size-10 rounded-full bg-surface flex items-center justify-center">
            <Mic className="size-4" />
          </button>
          <button className="size-10 rounded-full bg-accent flex items-center justify-center">
            <SendHorizontal className="size-4 text-accent-foreground" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}
