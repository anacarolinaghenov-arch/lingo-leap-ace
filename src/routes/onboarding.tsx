import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, ArrowLeft, Check, Sparkles, Loader2 } from "lucide-react";
import {
  ACCENT_PRESETS,
  writeProfile,
  type AccentKey,
  type LearningPlan,
  type MusicPlatform,
  type Profile,
} from "@/lib/profile-store";
import { applyAccent } from "@/components/theme-provider";
import { generateLearningPlan } from "@/lib/plan.functions";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "flui — Criar conta" }] }),
  component: Onboarding,
});

const LANGUAGES = [
  { code: "en", label: "Inglês", flag: "🇺🇸" },
  { code: "es", label: "Espanhol", flag: "🇪🇸" },
  { code: "fr", label: "Francês", flag: "🇫🇷" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "de", label: "Alemão", flag: "🇩🇪" },
  { code: "ja", label: "Japonês", flag: "🇯🇵" },
];

const LEVELS = [
  { v: "A1", l: "Iniciante", d: "Sei poucas palavras" },
  { v: "A2", l: "Básico", d: "Frases simples" },
  { v: "B1", l: "Intermediário", d: "Conversas do dia a dia" },
  { v: "B2", l: "Avançado", d: "Discuto qualquer tema" },
];

const GOALS = [
  { v: "intercambio", l: "Intercâmbio", e: "🛫" },
  { v: "trabalho", l: "Trabalho fora", e: "💼" },
  { v: "viagem", l: "Viajar", e: "🌍" },
  { v: "conteudo", l: "Consumir conteúdo", e: "🎬" },
  { v: "amigos", l: "Fazer amigos", e: "🫶" },
  { v: "prova", l: "Passar em prova", e: "🎓" },
];

const MINUTES = [10, 20, 30, 60];

const PLATFORMS: { v: MusicPlatform; l: string; e: string }[] = [
  { v: "spotify", l: "Spotify", e: "🟢" },
  { v: "apple", l: "Apple Music", e: "🍎" },
  { v: "youtube", l: "YouTube Music", e: "▶️" },
  { v: "outro", l: "Outro", e: "🎧" },
];

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [language, setLanguage] = useState("en");
  const [level, setLevel] = useState("A2");
  const [goal, setGoal] = useState("intercambio");
  const [dailyMinutes, setDailyMinutes] = useState(20);
  const [favoriteSeries, setFavoriteSeries] = useState("");
  const [favoriteSongs, setFavoriteSongs] = useState("");
  const [favoritePodcasts, setFavoritePodcasts] = useState("");
  const [musicPlatform, setMusicPlatform] = useState<MusicPlatform>("spotify");
  const [accent, setAccent] = useState<AccentKey>("lime");
  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);

  const genPlan = useServerFn(generateLearningPlan);

  const steps = [
    "nome",
    "idade",
    "idioma",
    "nível",
    "objetivo",
    "tempo",
    "séries",
    "músicas",
    "podcasts",
    "plataforma",
    "cor",
    "plano",
  ] as const;
  const total = steps.length;
  const PLAN_STEP = total - 1; // 11
  const ACCENT_STEP = total - 2; // 10
  const progress = ((step + 1) / total) * 100;

  function previewAccent(k: AccentKey) {
    setAccent(k);
    applyAccent(k);
  }

  async function requestPlan() {
    setPlanLoading(true);
    setPlanError(null);
    try {
      const langLabel = LANGUAGES.find((l) => l.code === language)?.label ?? language;
      const goalLabel = GOALS.find((g) => g.v === goal)?.l ?? goal;
      const platLabel = PLATFORMS.find((p) => p.v === musicPlatform)?.l ?? musicPlatform;
      const result = await genPlan({
        data: {
          name: name.trim() || "Você",
          age,
          language: langLabel,
          level,
          goal: goalLabel,
          dailyMinutes,
          favoriteSeries: favoriteSeries.trim() || undefined,
          favoriteSongs: favoriteSongs.trim() || undefined,
          favoritePodcasts: favoritePodcasts.trim() || undefined,
          musicPlatform: platLabel,
        },
      });
      setPlan(result as LearningPlan);
    } catch (e) {
      setPlanError(
        e instanceof Error ? e.message : "Não consegui gerar seu plano agora. Tente novamente.",
      );
    } finally {
      setPlanLoading(false);
    }
  }

  function next() {
    if (step === ACCENT_STEP) {
      setStep(PLAN_STEP);
      if (!plan && !planLoading) void requestPlan();
      return;
    }
    if (step < total - 1) setStep(step + 1);
  }
  function back() {
    if (step > 0) setStep(step - 1);
  }

  function finish() {
    const profile: Profile = {
      name: name.trim() || "Você",
      age,
      language,
      level,
      goal,
      dailyMinutes,
      accent,
      favoriteSeries: favoriteSeries.trim() || undefined,
      favoriteSongs: favoriteSongs.trim() || undefined,
      favoritePodcasts: favoritePodcasts.trim() || undefined,
      musicPlatform,
      plan: plan ?? undefined,
    };
    writeProfile(profile);
    applyAccent(accent);
    navigate({ to: "/" });
  }

  const canNext = () => {
    switch (step) {
      case 0:
        return name.trim().length >= 2;
      case 1:
        return Number(age) >= 8 && Number(age) <= 99;
      case PLAN_STEP:
        return !planLoading;
      default:
        return true;
    }
  };

  const pad = (n: number) => String(n + 1).padStart(2, "0");

  return (
    <div className="min-h-screen bg-background text-foreground flex justify-center">
      <div className="relative w-full max-w-[440px] min-h-screen border-x border-border/40 flex flex-col">
        <div className="grain absolute inset-0 pointer-events-none opacity-60" />

        {/* Top bar */}
        <div className="relative px-5 pt-8 pb-4 flex items-center gap-3">
          <button
            onClick={back}
            disabled={step === 0}
            className="size-9 rounded-full bg-surface border border-border flex items-center justify-center disabled:opacity-30"
          >
            <ArrowLeft className="size-4" />
          </button>
          <div className="flex-1 h-1.5 rounded-full bg-surface overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {step + 1}/{total}
          </span>
        </div>

        {/* Brand */}
        <div className="relative px-5 mb-2 flex items-center gap-2">
          <div className="size-7 rounded-full bg-accent flex items-center justify-center">
            <span className="font-display font-bold text-accent-foreground text-xs">f</span>
          </div>
          <span className="font-display font-semibold tracking-tight lowercase">flui</span>
        </div>

        <div className="relative flex-1 px-5 pt-8 pb-6 flex flex-col">
          {step === 0 && (
            <Step
              eyebrow={`${pad(step)} · Identidade`}
              title="Como devemos te chamar?"
              hint="Esse será seu nome dentro do flui."
            >
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="w-full bg-transparent border-0 border-b border-border focus:border-accent outline-none font-display text-3xl py-3 placeholder:text-muted-foreground/40"
              />
            </Step>
          )}

          {step === 1 && (
            <Step
              eyebrow={`${pad(step)} · Idade`}
              title={`Quantos anos você tem, ${name.split(" ")[0]}?`}
              hint="Usamos isso para adaptar gírias e conteúdos."
            >
              <input
                autoFocus
                inputMode="numeric"
                value={age}
                onChange={(e) => setAge(e.target.value.replace(/\D/g, "").slice(0, 2))}
                placeholder="00"
                className="w-full bg-transparent border-0 border-b border-border focus:border-accent outline-none font-display text-5xl py-3 placeholder:text-muted-foreground/30"
              />
            </Step>
          )}

          {step === 2 && (
            <Step
              eyebrow={`${pad(step)} · Idioma`}
              title="Qual língua você quer dominar?"
              hint="Você pode adicionar outras depois."
            >
              <div className="grid grid-cols-2 gap-3 mt-2">
                {LANGUAGES.map((l) => {
                  const sel = language === l.code;
                  return (
                    <button
                      key={l.code}
                      onClick={() => setLanguage(l.code)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        sel
                          ? "bg-accent text-accent-foreground border-accent"
                          : "bg-surface border-border"
                      }`}
                    >
                      <div className="text-2xl">{l.flag}</div>
                      <p className="text-sm font-semibold mt-2">{l.label}</p>
                    </button>
                  );
                })}
              </div>
            </Step>
          )}

          {step === 3 && (
            <Step
              eyebrow={`${pad(step)} · Nível`}
              title="Como você se descreveria hoje?"
              hint="Sem teste chato — só uma referência inicial."
            >
              <div className="space-y-2.5 mt-2">
                {LEVELS.map((lv) => {
                  const sel = level === lv.v;
                  return (
                    <button
                      key={lv.v}
                      onClick={() => setLevel(lv.v)}
                      className={`w-full flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                        sel
                          ? "bg-accent text-accent-foreground border-accent"
                          : "bg-surface border-border"
                      }`}
                    >
                      <span className="font-display text-xl font-semibold w-10">{lv.v}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{lv.l}</p>
                        <p
                          className={`text-xs ${sel ? "opacity-70" : "text-muted-foreground"}`}
                        >
                          {lv.d}
                        </p>
                      </div>
                      {sel && <Check className="size-4" />}
                    </button>
                  );
                })}
              </div>
            </Step>
          )}

          {step === 4 && (
            <Step
              eyebrow={`${pad(step)} · Objetivo`}
              title="O que te move?"
              hint="Seu plano de estudos é montado a partir daqui."
            >
              <div className="grid grid-cols-2 gap-3 mt-2">
                {GOALS.map((g) => {
                  const sel = goal === g.v;
                  return (
                    <button
                      key={g.v}
                      onClick={() => setGoal(g.v)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        sel
                          ? "bg-accent text-accent-foreground border-accent"
                          : "bg-surface border-border"
                      }`}
                    >
                      <div className="text-2xl">{g.e}</div>
                      <p className="text-sm font-semibold mt-2">{g.l}</p>
                    </button>
                  );
                })}
              </div>
            </Step>
          )}

          {step === 5 && (
            <Step
              eyebrow={`${pad(step)} · Ritmo`}
              title="Quanto tempo por dia?"
              hint="Pode ajustar quando quiser."
            >
              <div className="grid grid-cols-2 gap-3 mt-2">
                {MINUTES.map((m) => {
                  const sel = dailyMinutes === m;
                  return (
                    <button
                      key={m}
                      onClick={() => setDailyMinutes(m)}
                      className={`rounded-2xl border p-5 text-left transition ${
                        sel
                          ? "bg-accent text-accent-foreground border-accent"
                          : "bg-surface border-border"
                      }`}
                    >
                      <p className="font-display text-3xl font-semibold">{m}</p>
                      <p
                        className={`text-xs mt-1 ${
                          sel ? "opacity-70" : "text-muted-foreground"
                        }`}
                      >
                        min / dia
                      </p>
                    </button>
                  );
                })}
              </div>
            </Step>
          )}

          {step === 6 && (
            <Step
              eyebrow={`${pad(step)} · Séries`}
              title="Quais séries você ama?"
              hint="Vamos sugerir séries no seu idioma alvo parecidas com essas."
            >
              <textarea
                autoFocus
                value={favoriteSeries}
                onChange={(e) => setFavoriteSeries(e.target.value.slice(0, 280))}
                placeholder="Ex: Friends, Stranger Things, La Casa de Papel…"
                rows={4}
                className="w-full bg-surface border border-border rounded-2xl p-4 text-sm outline-none focus:border-accent resize-none placeholder:text-muted-foreground/50"
              />
              <p className="text-[11px] text-muted-foreground mt-2">
                Pode deixar vazio se preferir.
              </p>
            </Step>
          )}

          {step === 7 && (
            <Step
              eyebrow={`${pad(step)} · Músicas`}
              title="Quem está na sua playlist?"
              hint="Artistas, bandas ou músicas favoritas."
            >
              <textarea
                autoFocus
                value={favoriteSongs}
                onChange={(e) => setFavoriteSongs(e.target.value.slice(0, 280))}
                placeholder="Ex: Taylor Swift, Coldplay, Tyler the Creator…"
                rows={4}
                className="w-full bg-surface border border-border rounded-2xl p-4 text-sm outline-none focus:border-accent resize-none placeholder:text-muted-foreground/50"
              />
            </Step>
          )}

          {step === 8 && (
            <Step
              eyebrow={`${pad(step)} · Podcasts`}
              title="E podcasts que você curte?"
              hint="Para sugerirmos algo parecido no seu nível."
            >
              <textarea
                autoFocus
                value={favoritePodcasts}
                onChange={(e) => setFavoritePodcasts(e.target.value.slice(0, 280))}
                placeholder="Ex: Flow, Joe Rogan, The Daily…"
                rows={4}
                className="w-full bg-surface border border-border rounded-2xl p-4 text-sm outline-none focus:border-accent resize-none placeholder:text-muted-foreground/50"
              />
            </Step>
          )}

          {step === 9 && (
            <Step
              eyebrow={`${pad(step)} · Plataforma`}
              title="Onde você ouve música?"
              hint="Vamos direcionar as recomendações pra lá."
            >
              <div className="grid grid-cols-2 gap-3 mt-2">
                {PLATFORMS.map((p) => {
                  const sel = musicPlatform === p.v;
                  return (
                    <button
                      key={p.v}
                      onClick={() => setMusicPlatform(p.v)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        sel
                          ? "bg-accent text-accent-foreground border-accent"
                          : "bg-surface border-border"
                      }`}
                    >
                      <div className="text-2xl">{p.e}</div>
                      <p className="text-sm font-semibold mt-2">{p.l}</p>
                    </button>
                  );
                })}
              </div>
            </Step>
          )}

          {step === ACCENT_STEP && (
            <Step
              eyebrow={`${pad(step)} · Seu estilo`}
              title="Qual cor combina com você?"
              hint="Personalize o seu flui. Pode trocar depois no perfil."
            >
              <div className="grid grid-cols-4 gap-2.5 mt-2">
                {(Object.keys(ACCENT_PRESETS) as AccentKey[]).map((k) => {
                  const p = ACCENT_PRESETS[k];
                  const sel = accent === k;
                  return (
                    <button
                      key={k}
                      onClick={() => previewAccent(k)}
                      className={`rounded-2xl border p-2.5 flex flex-col items-center gap-1.5 transition ${
                        sel ? "border-accent bg-surface" : "border-border bg-surface"
                      }`}
                    >
                      <div
                        className="size-10 rounded-full flex items-center justify-center"
                        style={{ background: p.swatch }}
                      >
                        {sel && <Check className="size-4 text-black" />}
                      </div>
                      <p className="text-[10px] font-medium leading-tight">{p.label}</p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 rounded-2xl bg-surface border border-border p-4">
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  Preview
                </p>
                <p className="font-display text-xl mt-2">
                  Olá, <span className="text-accent">{name.split(" ")[0] || "você"}</span>.
                </p>
                <div className="mt-3 h-1.5 rounded-full bg-surface-2 overflow-hidden">
                  <div className="h-full bg-accent w-2/3" />
                </div>
              </div>
            </Step>
          )}

          {step === PLAN_STEP && (
            <Step
              eyebrow={`${pad(step)} · Seu plano`}
              title={`Um plano feito para os seus ${age || "—"} anos`}
              hint="Nossa IA considera como o seu cérebro aprende melhor e o que você curte consumir."
            >
              {planLoading && (
                <div className="rounded-2xl border border-border bg-surface p-6 flex flex-col items-center gap-3 text-center">
                  <Loader2 className="size-6 animate-spin text-accent" />
                  <p className="text-sm text-muted-foreground">
                    Montando seu plano personalizado…
                  </p>
                </div>
              )}

              {planError && !planLoading && (
                <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
                  <p className="font-medium mb-2">Algo deu errado.</p>
                  <p className="text-muted-foreground text-xs mb-3">{planError}</p>
                  <button
                    onClick={requestPlan}
                    className="text-xs font-semibold underline underline-offset-2"
                  >
                    Tentar de novo
                  </button>
                </div>
              )}

              {plan && !planLoading && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-accent/40 bg-accent-soft p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="size-4 text-accent" />
                      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                        Plano gerado por IA
                      </p>
                    </div>
                    <p className="font-display text-lg leading-tight">{plan.title}</p>
                    <p className="text-sm text-muted-foreground mt-2">{plan.summary}</p>
                  </div>

                  <div className="rounded-2xl border border-border bg-surface p-4">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                      Por que assim para você
                    </p>
                    <p className="text-sm">{plan.ageInsight}</p>
                  </div>

                  <div className="rounded-2xl border border-border bg-surface p-4">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                      Sua rotina diária
                    </p>
                    <ul className="space-y-1.5">
                      {plan.dailyRoutine.map((r, i) => (
                        <li key={i} className="text-sm flex gap-2">
                          <span className="text-accent">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    {plan.weeks.map((w) => (
                      <div
                        key={w.week}
                        className="rounded-2xl border border-border bg-surface p-4"
                      >
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="font-display text-xl font-semibold">
                            S{w.week}
                          </span>
                          <span className="text-sm font-medium">{w.focus}</span>
                        </div>
                        <ul className="space-y-1">
                          {w.activities.map((a, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex gap-2">
                              <span>›</span>
                              <span>{a}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {plan.series && plan.series.length > 0 && (
                    <RecBlock label="Séries para você" emoji="🎬" items={plan.series} />
                  )}
                  {plan.songs && plan.songs.length > 0 && (
                    <RecBlock label="Músicas no seu estilo" emoji="🎧" items={plan.songs} />
                  )}
                  {plan.podcasts && plan.podcasts.length > 0 && (
                    <RecBlock label="Podcasts no seu nível" emoji="🎙️" items={plan.podcasts} />
                  )}

                  {plan.vocabulary && plan.vocabulary.length > 0 && (
                    <div className="rounded-2xl border border-border bg-surface p-4">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                        Vocabulário inicial
                      </p>
                      <div className="space-y-2.5">
                        {plan.vocabulary.map((v, i) => (
                          <div key={i} className="text-sm">
                            <div className="flex items-baseline gap-2">
                              <span className="font-display font-semibold">{v.word}</span>
                              <span className="text-xs text-muted-foreground">
                                — {v.translation}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground italic">{v.example}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {plan.flashcards && plan.flashcards.length > 0 && (
                    <div className="rounded-2xl border border-border bg-surface p-4">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
                        Flashcards prontos ({plan.flashcards.length})
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {plan.flashcards.slice(0, 8).map((f, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2 py-1 rounded-full bg-surface-2 border border-border"
                          >
                            {f.front}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {plan.comprehension && plan.comprehension.length > 0 && (
                    <div className="rounded-2xl border border-border bg-surface p-4">
                      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                        Compreensão auditiva ({plan.comprehension.length} perguntas)
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Liberadas conforme você avança nas atividades de áudio.
                      </p>
                    </div>
                  )}

                  <div className="rounded-2xl border border-border bg-surface p-4">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
                      Dicas para você
                    </p>
                    <ul className="space-y-1.5">
                      {plan.tips.map((t, i) => (
                        <li key={i} className="text-sm flex gap-2">
                          <span className="text-accent">★</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </Step>
          )}

          <div className="mt-auto pt-8">
            <button
              onClick={step === total - 1 ? finish : next}
              disabled={!canNext()}
              className="w-full rounded-full bg-accent text-accent-foreground font-semibold py-4 flex items-center justify-center gap-2 disabled:opacity-40 transition"
            >
              {step === total - 1
                ? planLoading
                  ? "Gerando plano…"
                  : "Entrar no flui"
                : step === ACCENT_STEP
                  ? "Gerar meu plano"
                  : "Continuar"}
              {!planLoading && <ArrowRight className="size-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecBlock({
  label,
  emoji,
  items,
}: {
  label: string;
  emoji: string;
  items: { title: string; creator?: string; why: string }[];
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
        {emoji} {label}
      </p>
      <div className="space-y-2.5">
        {items.map((r, i) => (
          <div key={i} className="text-sm">
            <p className="font-semibold leading-tight">
              {r.title}
              {r.creator && (
                <span className="text-muted-foreground font-normal"> — {r.creator}</span>
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{r.why}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step({
  eyebrow,
  title,
  hint,
  children,
}: {
  eyebrow: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        {eyebrow}
      </p>
      <h1 className="font-display text-[28px] leading-[1.1] font-semibold mt-3 text-balance">
        {title}
      </h1>
      {hint && <p className="text-sm text-muted-foreground mt-2">{hint}</p>}
      <div className="mt-7">{children}</div>
    </div>
  );
}
