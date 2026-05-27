import Groq from "groq-sdk";
import { DEFAULT_MODEL } from "@/lib/constants";

let client = null;

function getClient(apiKey) {
  const key = apiKey || process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error(
      "Groq API key is not configured. Set GROQ_API_KEY in your environment or provide an API key in settings."
    );
  }
  if (!client || client.apiKey !== key) {
    client = new Groq({ apiKey: key });
  }
  return client;
}

export async function generateTestPlan({
  prdText,
  systemPrompt,
  model = DEFAULT_MODEL,
  temperature = 0.7,
  maxTokens = 4096,
  apiKey,
}) {
  const groq = getClient(apiKey);

  const completion = await groq.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prdText },
    ],
    temperature,
    max_tokens: maxTokens,
  });

  const content = completion.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Groq API returned an empty response. Try again.");
  }

  return content;
}
