"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { useAppStore } from "@/lib/store";

export function useGeneration() {
  const files = useAppStore((s) => s.files);
  const extractedTexts = useAppStore((s) => s.extractedTexts);
  const settings = useAppStore((s) => s.settings);
  const isGenerating = useAppStore((s) => s.isGenerating);
  const setIsGenerating = useAppStore((s) => s.setIsGenerating);
  const setGeneratedMarkdown = useAppStore((s) => s.setGeneratedMarkdown);
  const setGenerationError = useAppStore((s) => s.setGenerationError);
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const addRecentGeneration = useAppStore((s) => s.addRecentGeneration);

  const canGenerate =
    files.length > 0 && extractedTexts.length > 0 && !isGenerating;

  const generate = useCallback(async () => {
    if (files.length === 0 || isGenerating) return;

    const combinedPrdText = extractedTexts
      .map((e) => e.text)
      .filter(Boolean)
      .join("\n\n---\n\n");

    if (!combinedPrdText.trim()) return;

    setIsGenerating(true);
    setActiveTab("preview");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prdText: combinedPrdText,
          model: settings.model,
          temperature: settings.temperature,
          maxTokens: settings.maxTokens,
          apiKey: settings.apiKey || undefined,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setGenerationError(data.error || "Generation failed.");
        toast.error(data.error || "Generation failed.");
        return;
      }

      setGeneratedMarkdown(data.markdown);
      toast.success("Test plan generated successfully");

      const wordCount = data.markdown.trim().split(/\s+/).length;
      addRecentGeneration({
        snippet: data.markdown.slice(0, 120),
        model: settings.model,
        wordCount,
        timestamp: Date.now(),
      });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to contact the API.";
      setGenerationError(msg);
      toast.error(msg);
    }
  }, [
    files.length,
    extractedTexts,
    isGenerating,
    settings,
    setIsGenerating,
    setActiveTab,
    setGeneratedMarkdown,
    setGenerationError,
    addRecentGeneration,
  ]);

  return { generate, isGenerating, canGenerate };
}
