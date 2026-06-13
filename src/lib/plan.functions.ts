import { createServerFn } from "@tanstack/react-start";
import { generateObject } from "ai";
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

export const generateLearningPlan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);

    const prompt = `Você é um especialista em aprendizado de idiomas e neurociência cognitiva.
Crie um plano de estudos PERSONALIZADO em português do Brasil para:

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

Gere um plano de 4 semanas, prático e realista no tempo diário informado. Linguagem acolhedora, sem clichês.`;

    const { experimental_output } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      experimental_output: Output.object({ schema: PlanSchema }),
      prompt,
    });

    return experimental_output as GeneratedPlan;
  });
