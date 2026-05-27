import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { generateTestPlan } from "@/lib/groq-client";
import { DEFAULT_MODEL } from "@/lib/constants";

export async function POST(request) {
  try {
    const body = await request.json();
    const { prdText, model, temperature, maxTokens, apiKey } = body;

    if (!prdText || typeof prdText !== "string" || !prdText.trim()) {
      return NextResponse.json(
        { success: false, error: "PRD text is required." },
        { status: 400 }
      );
    }

    const systemPrompt = await loadSystemPrompt();

    const markdown = await generateTestPlan({
      prdText: prdText.trim(),
      systemPrompt,
      model: model || DEFAULT_MODEL,
      temperature: temperature ?? 0.7,
      maxTokens: maxTokens || 4096,
      apiKey: apiKey || undefined,
    });

    return NextResponse.json({ success: true, markdown });
  } catch (err) {
    const status = err?.status || err?.statusCode || 500;
    let message = parseGroqErrorMessage(err);

    if (status === 429) {
      message = "Rate limit exceeded. Please wait a moment before generating again.";
    } else if (status === 401) {
      message = message ? `Authentication failed: ${message}` : "Authentication failed. Check your API key.";
    } else if (status === 404) {
      message = message ? `Model not available: ${message}` : "The selected model could not be found. It may have been decommissioned.";
    } else if (status === 400 || status === 422) {
      message = message || "The request was invalid. Check your settings.";
    }

    return NextResponse.json({ success: false, error: message }, { status });
  }
}

async function loadSystemPrompt() {
  const filePath = path.join(process.cwd(), "prompts", "TestPlan_Skill.md");
  const content = await fs.readFile(filePath, "utf-8");
  return content.trim();
}

function parseGroqErrorMessage(err) {
  if (!(err instanceof Error)) return "An unexpected error occurred.";

  const raw = err.message;

  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed?.error?.message || parsed?.message || raw;
    }
  } catch {
    // not JSON, use raw message
  }

  return raw;
}
