import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Headphones, Film, BookOpen, Music, Tv, Youtube, Sparkles, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/imersao")({
  head: () => ({ meta: [{ title: "Voa — Imersão Inteligente" }] }),
  component: Imersao,
});

function Imersao() {
  return (
    <AppShell>
      <PageHeader eyebrow="Imersão Inteligente" title="Viva o idioma. Sem sair do quarto." />

      {/* AI Discovery CTA */}
      <section className="px-5 mb-5">
        <Link
          to="/descobrir"
          className="block rounded-3xl bg-accent text-accent-foreground p-5 relative overflow-hidden glow-accent"
        >
          <Sparkles className="absolute -right-3 -top-3 size-24 opacity-15" />
          <p className="text-[11px] uppercase tracking-[0.22em] font-semibold opacity-70">
            Novo · flui IA
          </p>
          <h3 className="font-display text-xl font-semibold mt-1.5 leading-tight">
            Diga o tipo de criador, filme ou livro que você curte.
          </h3>
          <p className="text-sm mt-2 opacity-80">
            A IA monta uma lista no seu idioma alvo — por gênero, idade, vibe e nível.
          </p>
          <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium">
            Descobrir agora <ChevronRight className="size-4" />
          </div>
        </Link>
      </section>


      {/* Filter pills */}
      <div className="px-5">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {["Para você", "USA 🇺🇸", "UK 🇬🇧", "Austrália 🇦🇺", "Canadá 🇨🇦"].map((c, i) => (
            <button
              key={c}
              className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-medium ${
                i === 0 ? "bg-accent text-accent-foreground" : "bg-surface border border-border text-muted-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Editorial feature */}
      <section className="px-5 mt-6">
        <div className="rounded-3xl border border-border bg-surface overflow-hidden">
          <div className="aspect-[5/3] bg-gradient-to-br from-accent/40 via-surface-2 to-black relative grain">
            <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.22em] bg-black/60 backdrop-blur px-2.5 py-1 rounded-full">
              Trending · Gen Z USA
            </span>
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="font-display text-2xl font-semibold leading-[1.05]">
                As 12 gírias que os teens americanos mais usaram em 2026
              </h2>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">7 min · com áudio nativo · vocabulário B1</p>
            <button className="text-xs font-medium text-accent">Ler →</button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-5 mt-6 grid grid-cols-4 gap-3">
        {[
          { i: Youtube, l: "YouTubers" },
          { i: Music, l: "Música" },
          { i: Tv, l: "Séries" },
          { i: Film, l: "Filmes" },
          { i: Headphones, l: "Podcasts" },
          { i: BookOpen, l: "Livros" },
          { i: Tv, l: "Streamers" },
          { i: Youtube, l: "Criadores" },
        ].map((c, i) => {
          const I = c.i;
          return (
            <button key={i} className="aspect-square rounded-2xl bg-surface border border-border flex flex-col items-center justify-center gap-1.5">
              <I className="size-5 text-accent" />
              <span className="text-[10px] text-muted-foreground">{c.l}</span>
            </button>
          );
        })}
      </section>

      {/* Recommended creators */}
      <section className="px-5 mt-8">
        <h3 className="font-display text-lg font-semibold mb-3">Criadores para você</h3>
        <div className="space-y-3">
          {[
            { n: "Drew Binsky", h: "Viagens · clear english", t: "Para B1+" },
            { n: "Vsauce", h: "Curiosidades · vocab rico", t: "Para B2" },
            { n: "Emma Chamberlain", h: "Vlogs · gírias Gen Z", t: "Para B1" },
          ].map((c) => (
            <div key={c.n} className="flex items-center gap-3 rounded-2xl bg-surface border border-border p-3.5">
              <div className="size-12 rounded-full bg-gradient-to-br from-accent to-accent/40" />
              <div className="flex-1">
                <p className="text-sm font-semibold">{c.n}</p>
                <p className="text-xs text-muted-foreground">{c.h}</p>
              </div>
              <span className="text-[10px] uppercase tracking-wider bg-accent-soft text-accent px-2 py-1 rounded-full">
                {c.t}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Cultural tile */}
      <section className="px-5 mt-8">
        <h3 className="font-display text-lg font-semibold mb-3">Cultura da semana</h3>
        <div className="rounded-3xl bg-accent text-accent-foreground p-5">
          <p className="text-[11px] uppercase tracking-[0.22em] opacity-70">Thanksgiving 🦃</p>
          <h4 className="font-display text-xl font-semibold mt-1.5 leading-tight">
            Por que toda família americana briga durante o jantar de Ação de Graças?
          </h4>
          <p className="text-sm mt-2 opacity-80">
            Mini-aula cultural + 8 frases para sobreviver ao próximo Thanksgiving na sua host family.
          </p>
        </div>
      </section>
    </AppShell>
  );
}
