import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const Input = z.object({
  name: z.string().min(1).max(60),
  age: z.string().min(1).max(3),
  language: z.string().min(1).max(20),
  level: z.string().min(1).max(10),
  goal: z.string().min(1).max(40),
  dailyMinutes: z.number().min(5).max(240),
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

    const system = `Você é um especialista em aprendizado de idiomas e neurociência cognitiva.
Responda APENAS com JSON válido (sem markdown, sem \`\`\`), no formato exato:
{
  "title": string,
  "summary": string,
  "ageInsight": string,
  "weeks": [{"week": number, "focus": string, "activities": string[]}],
  "dailyRoutine": string[],
  "tips": string[]
}`;

    const prompt = `Crie um plano de estudos PERSONALIZADO em português do Brasil para:

- Nome: ${data.name}
- Idade: ${data.age} anos
- Idioma alvo: ${data.language}
- Nível atual: ${data.level} (CEFR)
- Objetivo: ${data.goal}
- Tempo disponível: ${data.dailyMinutes} min/dia

Considere COMO o cérebro aprende em cada faixa etária:
- Crianças/adolescentes: muita imersão, áudio, repetição lúdica.
- 20-35 anos: ritmo intenso, conteúdo de cultura pop, conversas.
- 35-50 anos: contextualização, conexão com vida real/trabalho, menos memorização bruta.
- 50+: ritmo gentil, repetição espaçada, foco em compreensão antes de produção.

Gere um plano de 4 semanas (weeks com 4 itens), prático e realista no tempo diário informado.
dailyRoutine: 3 a 5 itens. tips: 3 a 5 itens. Linguagem acolhedora, sem clichês.
Retorne SOMENTE o JSON.`;

    const { text } = await generateText({
      model: gateway("google/gemini-2.5-flash"),
      system,
      prompt,
    });

    const parsed = PlanSchema.parse(extractJSON(text));
    return parsed;
  });
