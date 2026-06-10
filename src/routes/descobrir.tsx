import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, PageHeader } from "@/components/app-shell";
import {
  Sparkles,
  Youtube,
  Film,
  Tv,
  BookOpen,
  Music,
  Headphones,
  Wand2,
  Heart,
  Play,
  ChevronRight,
  Check,
  RefreshCw,
} from "lucide-react";
import { useProfile } from "@/lib/profile-store";

export const Route = createFileRoute("/descobrir")({
  head: () => ({
    meta: [
      { title: "flui — Descobrir com IA" },
      {
        name: "description",
        content:
          "Diga à IA o tipo de influenciador, filme, série ou livro que combina com você e receba recomendações no idioma que está aprendendo.",
      },
    ],
  }),
  component: Descobrir,
});

type Kind = "youtuber" | "influencer" | "filme" | "serie" | "livro" | "podcast" | "musica";

const KINDS: { v: Kind; l: string; i: any; e: string }[] = [
  { v: "youtuber", l: "YouTuber", i: Youtube, e: "📹" },
  { v: "influencer", l: "Influencer", i: Sparkles, e: "✨" },
  { v: "filme", l: "Filme", i: Film, e: "🎬" },
  { v: "serie", l: "Série", i: Tv, e: "📺" },
  { v: "livro", l: "Livro", i: BookOpen, e: "📚" },
  { v: "podcast", l: "Podcast", i: Headphones, e: "🎙️" },
  { v: "musica", l: "Música", i: Music, e: "🎧" },
];

const GENDERS = ["Qualquer", "Mulher", "Homem", "Não-binário"] as const;
const AGES = ["Teen", "20-30", "30-40", "40-50", "50+"] as const;
const ETHNICITY = [
  "Indiferente",
  "Negra",
  "Morena",
  "Branca",
  "Asiática",
  "Latina",
  "Indígena",
] as const;
const VIBES = [
  "Engraçado",
  "Educativo",
  "Inspirador",
  "Realista",
  "Romântico",
  "Suspense",
  "Lifestyle",
  "Viagem",
  "Beleza",
  "Tech",
  "Negócios",
  "Esporte",
  "Cultura pop",
] as const;
const DIFFICULTY = ["Fácil de entender", "Equilibrado", "Desafiador"] as const;

type Recommendation = {
  title: string;
  meta: string;
  desc: string;
  level: string;
  emoji: string;
  image?: string;
};

// Imagens reais — Wikipedia (Special:FilePath redireciona pro arquivo atual)
// e Open Library (capas de livros por ISBN). Se a URL quebrar, o <img>
// dispara onError e o card volta a mostrar só o emoji.
const wiki = (filename: string) =>
  `https://en.wikipedia.org/wiki/Special:FilePath/${filename}?width=320`;
const bookCover = (isbn: string) =>
  `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

function genRecommendations(
  kind: Kind,
  gender: string,
  age: string,
  ethnicity: string,
  vibes: string[],
  difficulty: string,
  language: string,
  userLevel: string,
): Recommendation[] {
  const lang = language === "en" ? "🇺🇸" : language === "es" ? "🇪🇸" : language === "fr" ? "🇫🇷" : "🌐";
  const vibe = vibes[0] ?? "Lifestyle";
  const filterNote = `Combina com o que você pediu (${[gender, age, ethnicity, vibe]
    .filter((x) => x && x !== "Qualquer" && x !== "Indiferente")
    .join(" · ") || "geral"}).`;

  if (kind === "livro") {
    return [
      {
        emoji: "📖",
        image: bookCover("9780679734772"),
        title: "The House on Mango Street",
        meta: `${lang} · Sandra Cisneros · 110 pgs`,
        desc: `Capítulos curtos, prosa poética — ótimo pro nível ${userLevel}. ${filterNote}`,
        level: userLevel,
      },
      {
        emoji: "📕",
        image: bookCover("9780525541905"),
        title: "Such a Fun Age",
        meta: `${lang} · Kiley Reid · 320 pgs`,
        desc: `Romance contemporâneo com diálogos naturais e gírias atuais. ${filterNote}`,
        level: userLevel,
      },
      {
        emoji: "📘",
        image: bookCover("9780399590504"),
        title: "Educated",
        meta: `${lang} · Tara Westover · memórias`,
        desc: `Memórias inspiradoras, vocabulário variado, linguagem ${difficulty.toLowerCase()}.`,
        level: userLevel,
      },
      {
        emoji: "📙",
        image: bookCover("9781982185824"),
        title: "I'm Glad My Mom Died",
        meta: `${lang} · Jennette McCurdy · 320 pgs`,
        desc: `Autobiografia direta, linguagem do dia a dia. Mistura humor e profundidade.`,
        level: userLevel,
      },
    ];
  }

  if (kind === "filme" || kind === "serie") {
    const isFilm = kind === "filme";
    return isFilm
      ? [
          {
            emoji: "🎬",
            image: wiki("Past_Lives_poster.jpeg"),
            title: "Past Lives",
            meta: `${lang} · A24 · 1h45`,
            desc: `Diálogos íntimos e ritmo ${difficulty.toLowerCase()}. ${filterNote}`,
            level: userLevel,
          },
          {
            emoji: "🍿",
            image: wiki("Lady_Bird_poster.jpeg"),
            title: "Lady Bird",
            meta: `${lang} · Greta Gerwig`,
            desc: `Vibe ${vibe.toLowerCase()}, cheio de expressões idiomáticas reais.`,
            level: userLevel,
          },
          {
            emoji: "🎭",
            image: wiki("20th_Century_Women.png"),
            title: "20th Century Women",
            meta: `${lang} · drama`,
            desc: `Bom pra treinar listening contextual com diálogos longos.`,
            level: userLevel,
          },
        ]
      : [
          {
            emoji: "📺",
            image: wiki("Fleabag_title_card.jpg"),
            title: "Fleabag",
            meta: `${lang} · BBC · 2 temporadas`,
            desc: `Quebra de quarta parede e inglês britânico real. ${filterNote}`,
            level: userLevel,
          },
          {
            emoji: "🎞️",
            image: wiki("Insecure_(TV_series).png"),
            title: "Insecure",
            meta: `${lang} · HBO · Issa Rae`,
            desc: `Vibe ${vibe.toLowerCase()}, gírias atuais e diálogos rápidos.`,
            level: userLevel,
          },
          {
            emoji: "🎭",
            image: wiki("Master_of_None_title_card.png"),
            title: "Master of None",
            meta: `${lang} · Netflix`,
            desc: `Episódios independentes — ótimo pra listening contextual.`,
            level: userLevel,
          },
        ];
  }

  if (kind === "podcast") {
    return [
      {
        emoji: "🎙️",
        image: wiki("Emma_Chamberlain_2019_by_Glenn_Francis.jpg"),
        title: "Anything Goes with Emma Chamberlain",
        meta: `${lang} · ~45 min/ep`,
        desc: `Conversas reais, ritmo natural Gen Z. Vibe ${vibe.toLowerCase()}.`,
        level: userLevel,
      },
      {
        emoji: "🎧",
        image: wiki("The_Daily_podcast_logo.png"),
        title: "The Daily",
        meta: `${lang} · NYT · ~25 min`,
        desc: `Inglês de jornalismo, claro e bem articulado. Vocabulário formal.`,
        level: userLevel,
      },
      {
        emoji: "🗣️",
        image: wiki("Alexandra_Cooper_in_2024.jpg"),
        title: "Call Her Daddy",
        meta: `${lang} · Alex Cooper · 1h`,
        desc: `Gírias atuais e temas pop. Ritmo rápido — bom pra B1+.`,
        level: userLevel,
      },
    ];
  }

  if (kind === "musica") {
    return [
      {
        emoji: "🎵",
        image: wiki("Olivia_Rodrigo_-_Guts.png"),
        title: "Olivia Rodrigo — GUTS",
        meta: `${lang} · pop rock`,
        desc: `Letras com inglês conversacional — perfeito pra cantar junto e fixar pronúncia.`,
        level: userLevel,
      },
      {
        emoji: "🎶",
        image: wiki("Sabrina_Carpenter_-_Short_n%27_Sweet.png"),
        title: "Sabrina Carpenter — Short n' Sweet",
        meta: `${lang} · pop`,
        desc: `Cheio de wordplay e gírias. Vibe ${vibe.toLowerCase()}.`,
        level: userLevel,
      },
      {
        emoji: "🎤",
        image: wiki("Mitski_-_The_Land_Is_Inhospitable_and_So_Are_We.png"),
        title: "Mitski — The Land Is Inhospitable",
        meta: `${lang} · indie`,
        desc: `Letras poéticas, ótimo pra vocabulário descritivo e metáforas.`,
        level: userLevel,
      },
    ];
  }

  // youtuber / influencer — fotos oficiais via Wikipedia
  return [
    {
      emoji: "📹",
      image: wiki("Michelle_Khare_by_Gage_Skidmore.jpg"),
      title: "Michelle Khare",
      meta: `${lang} · ~4M subs · challenges`,
      desc: `Fala clara, edição rápida, vibe ${vibe.toLowerCase()}. ${filterNote}`,
      level: userLevel,
    },
    {
      emoji: "✨",
      image: wiki("Patricia_Bright_2017.jpg"),
      title: "Patricia Bright",
      meta: `${lang} · UK · lifestyle & beleza`,
      desc: `Sotaque britânico real, conteúdo de lifestyle e carreira.`,
      level: userLevel,
    },
    {
      emoji: "🎥",
      image: wiki("Hannah_Witton_2016.jpg"),
      title: "Hannah Witton",
      meta: `${lang} · UK · cultura & livros`,
      desc: `Conteúdo educativo + pessoal. ${difficulty} pra seu nível ${userLevel}.`,
      level: userLevel,
    },
    {
      emoji: "🌟",
      image: wiki("Yes_Theory_logo.png"),
      title: "Yes Theory",
      meta: `${lang} · viagem & coragem`,
      desc: `Conteúdo inspirador, vários sotaques. Bom pra listening de não-nativos.`,
      level: userLevel,
    },
  ];
}

function Descobrir() {
  const profile = useProfile();
  const [kind, setKind] = useState<Kind>("youtuber");
  const [gender, setGender] = useState<string>("Qualquer");
  const [age, setAge] = useState<string>("20-30");
  const [ethnicity, setEthnicity] = useState<string>("Indiferente");
  const [vibes, setVibes] = useState<string[]>(["Lifestyle"]);
  const [difficulty, setDifficulty] = useState<string>("Equilibrado");
  const [extra, setExtra] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const toggleVibe = (v: string) =>
    setVibes((cur) =>
      cur.includes(v) ? cur.filter((x) => x !== v) : cur.length < 3 ? [...cur, v] : cur,
    );

  const recs = useMemo(
    () =>
      genRecommendations(
        kind,
        gender,
        age,
        ethnicity,
        vibes,
        difficulty,
        profile?.language ?? "en",
        profile?.level ?? "B1",
      ),
    [kind, gender, age, ethnicity, vibes, difficulty, profile, refreshKey],
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Descobrir com IA"
        title="Diga o que combina com você."
        action={
          <Link
            to="/imersao"
            className="size-10 rounded-full bg-surface border border-border flex items-center justify-center"
          >
            <ChevronRight className="size-4 rotate-180" />
          </Link>
        }
      />

      <section className="px-5">
        <div className="rounded-3xl bg-accent-soft border border-accent/30 p-4 flex items-start gap-3">
          <div className="size-9 rounded-full bg-accent flex items-center justify-center shrink-0">
            <Wand2 className="size-4 text-accent-foreground" />
          </div>
          <p className="text-sm leading-snug">
            <span className="text-accent font-semibold">flui IA</span> vai
            recomendar conteúdos no seu idioma alvo a partir do que você gosta —
            sem algoritmo viciante, só o que ajuda na fluência.
          </p>
        </div>
      </section>

      {/* Tipo */}
      <section className="px-5 mt-7">
        <SectionLabel n="01" t="Que tipo de conteúdo?" />
        <div className="grid grid-cols-4 gap-2 mt-3">
          {KINDS.map((k) => {
            const sel = kind === k.v;
            return (
              <button
                key={k.v}
                onClick={() => setKind(k.v)}
                className={`rounded-2xl border p-2.5 flex flex-col items-center gap-1 transition ${
                  sel
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-surface border-border"
                }`}
              >
                <span className="text-lg">{k.e}</span>
                <span className="text-[10px] font-medium leading-tight text-center">
                  {k.l}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Pessoa: gênero */}
      {(kind === "youtuber" ||
        kind === "influencer" ||
        kind === "podcast" ||
        kind === "musica") && (
        <>
          <FilterRow
            label="02"
            title="Gênero"
            options={[...GENDERS]}
            value={gender}
            onChange={setGender}
          />
          <FilterRow
            label="03"
            title="Faixa etária"
            options={[...AGES]}
            value={age}
            onChange={setAge}
          />
          <FilterRow
            label="04"
            title="Etnia / aparência"
            options={[...ETHNICITY]}
            value={ethnicity}
            onChange={setEthnicity}
          />
        </>
      )}

      {/* Personagem para filme/série/livro */}
      {(kind === "filme" || kind === "serie" || kind === "livro") && (
        <>
          <FilterRow
            label="02"
            title={kind === "livro" ? "Autor(a) / protagonista" : "Protagonista"}
            options={[...GENDERS]}
            value={gender}
            onChange={setGender}
          />
          <FilterRow
            label="03"
            title="Idade do personagem"
            options={[...AGES]}
            value={age}
            onChange={setAge}
          />
          <FilterRow
            label="04"
            title="Etnia / origem"
            options={[...ETHNICITY]}
            value={ethnicity}
            onChange={setEthnicity}
          />
        </>
      )}

      {/* Vibes */}
      <section className="px-5 mt-7">
        <SectionLabel n="05" t="Vibe (até 3)" extra={`${vibes.length}/3`} />
        <div className="flex flex-wrap gap-2 mt-3">
          {VIBES.map((v) => {
            const sel = vibes.includes(v);
            return (
              <button
                key={v}
                onClick={() => toggleVibe(v)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                  sel
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-surface border-border text-muted-foreground"
                }`}
              >
                {sel && <Check className="size-3 inline mr-1 -mt-0.5" />}
                {v}
              </button>
            );
          })}
        </div>
      </section>

      {/* Dificuldade */}
      <FilterRow
        label="06"
        title="Nível de dificuldade do conteúdo"
        options={[...DIFFICULTY]}
        value={difficulty}
        onChange={setDifficulty}
      />

      {/* Extra */}
      <section className="px-5 mt-7">
        <SectionLabel n="07" t="Algo mais? (opcional)" />
        <textarea
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
          placeholder="Ex: gosto de quem fala devagar, com sotaque britânico, sobre rotina e cafés…"
          rows={3}
          className="w-full mt-3 rounded-2xl bg-surface border border-border p-4 text-sm placeholder:text-muted-foreground/60 focus:border-accent outline-none resize-none"
        />
      </section>

      {/* CTA */}
      <section className="px-5 mt-6">
        <button
          onClick={() => {
            setSubmitted(true);
            setRefreshKey((k) => k + 1);
          }}
          className="w-full rounded-full bg-accent text-accent-foreground font-semibold py-4 flex items-center justify-center gap-2"
        >
          <Sparkles className="size-4" />
          {submitted ? "Gerar novamente" : "Pedir recomendações"}
        </button>
      </section>

      {/* Recomendações */}
      {submitted && (
        <section className="px-5 mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-lg font-semibold">
              flui escolheu para você
            </h3>
            <button
              onClick={() => setRefreshKey((k) => k + 1)}
              className="text-[11px] text-muted-foreground flex items-center gap-1"
            >
              <RefreshCw className="size-3" />
              Trocar
            </button>
          </div>
          <div className="space-y-3">
            {recs.map((r, i) => (
              <article
                key={i}
                className="rounded-3xl bg-surface border border-border p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="size-14 rounded-2xl bg-accent-soft border border-accent/20 overflow-hidden flex items-center justify-center text-2xl shrink-0 relative">
                    {r.image ? (
                      <>
                        <img
                          src={r.image}
                          alt={r.title}
                          loading="lazy"
                          className="absolute inset-0 size-full object-cover"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 size-6 rounded-full bg-surface border border-border flex items-center justify-center text-xs">
                          {r.emoji}
                        </span>
                      </>
                    ) : (
                      r.emoji
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-base font-semibold leading-tight">
                      {r.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {r.meta}
                    </p>
                    <p className="text-xs leading-relaxed mt-2 text-foreground/80">
                      {r.desc}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-[10px] uppercase tracking-wider bg-accent-soft text-accent px-2 py-1 rounded-full">
                        Nível {r.level}
                      </span>
                      <button className="ml-auto size-8 rounded-full bg-surface-2 border border-border flex items-center justify-center">
                        <Heart className="size-3.5" />
                      </button>
                      <button className="size-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                        <Play className="size-3.5 fill-current" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="text-[11px] text-muted-foreground text-center mt-5">
            Personalizado para nível{" "}
            <span className="text-accent">{profile?.level ?? "B1"}</span> ·{" "}
            {extra ? `"${extra.slice(0, 40)}${extra.length > 40 ? "…" : ""}"` : "sem nota extra"}
          </p>
        </section>
      )}
    </AppShell>
  );
}

function SectionLabel({ n, t, extra }: { n: string; t: string; extra?: string }) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {n}
        </p>
        <h3 className="font-display text-base font-semibold mt-1">{t}</h3>
      </div>
      {extra && <span className="text-[11px] text-muted-foreground">{extra}</span>}
    </div>
  );
}

function FilterRow({
  label,
  title,
  options,
  value,
  onChange,
}: {
  label: string;
  title: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <section className="px-5 mt-7">
      <SectionLabel n={label} t={title} />
      <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide -mx-5 px-5">
        {options.map((o) => {
          const sel = value === o;
          return (
            <button
              key={o}
              onClick={() => onChange(o)}
              className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-medium border transition ${
                sel
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-surface border-border text-muted-foreground"
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </section>
  );
}
