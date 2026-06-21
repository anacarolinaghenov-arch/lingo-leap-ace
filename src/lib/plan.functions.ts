import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const Input = z.object({
  name: z.string().min(1).max(60),
  age: z.string().min(1).max(3),
  language: z.string().min(1).max(20),
  level: z.string().min(1).max(10),
  goal: z.string().min(1).max(60),
  dailyMinutes: z.number().min(5).max(240),
  favoriteSeries: z.string().max(300).optional(),
  favoriteSongs: z.string().max(300).optional(),
  favoritePodcasts: z.string().max(300).optional(),
  musicPlatform: z.string().max(20).optional(),
});

const Rec = z.object({
  title: z.string(),
  creator: z.string().optional(),
  why: z.string(),
});

const PlanSchema = z.object({
  title: z.string(),
  summary: z.string(),
  ageInsight: z.string(),
  weeks: z.array(
    z.object({
      week: z.number(),
      focus: z.string(),
      activities: z.array(z.string()),
    }),
  ),
  dailyRoutine: z.array(z.string()),
  tips: z.array(z.string()),
  series: z.array(Rec).optional().default([]),
  songs: z.array(Rec).optional().default([]),
  podcasts: z.array(Rec).optional().default([]),
  vocabulary: z
    .array(z.object({ word: z.string(), translation: z.string(), example: z.string() }))
    .optional()
    .default([]),
  comprehension: z
    .array(
      z.object({
        question: z.string(),
        options: z.array(z.string()),
        answer: z.number(),
      }),
    )
    .optional()
    .default([]),
  flashcards: z
    .array(z.object({ front: z.string(), back: z.string() }))
    .optional()
    .default([]),
});

export type GeneratedPlan = z.infer<typeof PlanSchema>;

function extractJSON(raw: string): unknown {
  let cleaned = raw
    .replace(/^```json\s*/im, "")
    .replace(/^```\s*/im, "")
    .replace(/```\s*$/im, "")
    .trim();
  if (!cleaned.startsWith("{") && !cleaned.startsWith("[")) {
    const s = cleaned.indexOf("{");
    const e = cleaned.lastIndexOf("}");
    if (s !== -1 && e > s) cleaned = cleaned.slice(s, e + 1);
    else throw new Error("Resposta sem JSON válido");
  }
  return JSON.parse(cleaned);
}

export const generateLearningPlan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }): Promise<GeneratedPlan> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);

    const system = `Você é um tutor de idiomas (especialista em inglês) inteligente, divertido, estilo Duolingo, com base em neurociência cognitiva.
Responda APENAS com JSON válido (sem markdown, sem \`\`\`), no formato EXATO:
{
  "title": string,
  "summary": string,
  "ageInsight": string,
  "weeks": [{"week": number, "focus": string, "activities": string[]}],
  "dailyRoutine": string[],
  "tips": string[],
  "series": [{"title": string, "creator": string, "why": string}],
  "songs": [{"title": string, "creator": string, "why": string}],
  "podcasts": [{"title": string, "creator": string, "why": string}],
  "vocabulary": [{"word": string, "translation": string, "example": string}],
  "comprehension": [{"question": string, "options": string[], "answer": number}],
  "flashcards": [{"front": string, "back": string}]
}
Use SEMPRE textos em português do Brasil nos campos descritivos (summary, ageInsight, focus, activities, why, tips, dailyRoutine, question, translation, example).
"word", "front" e títulos de séries/músicas/podcasts ficam no idioma alvo. "back" pode ser tradução em PT-BR.
"answer" é o índice (0-based) da opção correta em "options".`;

    const prompt = `Crie um plano de estudos PERSONALIZADO para:

- Nome: ${data.name}
- Idade: ${data.age} anos
- Idioma alvo: ${data.language}
- Nível atual: ${data.level} (CEFR)
- Objetivo: ${data.goal}
- Tempo disponível: ${data.dailyMinutes} min/dia
- Séries favoritas: ${data.favoriteSeries || "não informado"}
- Músicas/artistas favoritos: ${data.favoriteSongs || "não informado"}
- Podcasts favoritos: ${data.favoritePodcasts || "não informado"}
- Plataforma de música: ${data.musicPlatform || "não informado"}

Considere COMO o cérebro aprende em cada faixa etária:
- Crianças/adolescentes: muita imersão, áudio, repetição lúdica, gamificação intensa.
- 20-35 anos: ritmo intenso, cultura pop, conversas reais.
- 35-50 anos: contextualização, conexão com vida real/trabalho.
- 50+: ritmo gentil, repetição espaçada, compreensão antes de produção.

REGRAS DE CONTEÚDO:
- weeks: exatamente 4 semanas, atividades curtas (estilo Duolingo, 5–15 min cada).
- dailyRoutine: 3–5 itens encaixados no tempo diário informado.
- tips: 3–5 dicas práticas.
- series: 3–5 séries no idioma alvo PARECIDAS com os gostos do usuário, adequadas ao nível ${data.level}.
- songs: 4–6 músicas/artistas no idioma alvo parecidos com os favoritos do usuário (cite a plataforma quando fizer sentido).
- podcasts: 3–5 podcasts no idioma alvo no nível ${data.level} (mencione se há transcrição).
- vocabulary: 8–12 palavras úteis tiradas dos universos acima, com tradução PT-BR e exemplo curto.
- comprehension: 4 perguntas de compreensão (em PT-BR) com 4 opções cada e o índice (0–3) da correta.
- flashcards: 8–12 cartões (front no idioma alvo, back em PT-BR).
- Priorize situações reais de comunicação. Linguagem acolhedora, sem clichês. Retorne SOMENTE o JSON.`;

    const { text } = await generateText({
      model: gateway("google/gemini-2.5-flash"),
      system,
      prompt,
    });

    return PlanSchema.parse(extractJSON(text));
  });
