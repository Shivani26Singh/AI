"use client";

import { motion } from "framer-motion";
import { FileTextIcon, SparklesIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGeneration } from "@/hooks/useGeneration";
import { useAppStore } from "@/lib/store";

export function ReadyToGenerate() {
  const files = useAppStore((s) => s.files);
  const extractedTexts = useAppStore((s) => s.extractedTexts);
  const { generate, isGenerating, canGenerate } = useGeneration();

  const totalWords = extractedTexts.reduce((sum, e) => {
    return sum + (e.text?.trim().split(/\s+/).length || 0);
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full flex-col items-center justify-center px-6 py-20 text-center"
    >
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-pulse-glow rounded-full bg-primary/15 blur-2xl" />
        <div className="relative flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 ring-1 ring-primary/20 shadow-lg">
          <FileTextIcon className="size-9 text-primary/60" />
        </div>
        <div className="absolute -right-2 -top-2 flex size-8 items-center justify-center rounded-full border-2 border-background bg-card shadow-md">
          <SparklesIcon className="size-4 text-primary/70 animate-ai-pulse" />
        </div>
      </div>

      <h2 className="text-[17px] font-semibold tracking-tight text-foreground">
        Ready to generate
      </h2>
      <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
        {files.length === 1
          ? `1 document uploaded — ${totalWords.toLocaleString()} words extracted.`
          : `${files.length} documents uploaded — ${totalWords.toLocaleString()} words extracted.`}
      </p>
      <p className="mt-1 text-[12px] text-muted-foreground/60">
        Click generate to create a comprehensive test plan from your PRD.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3">
        <Button
          onClick={generate}
          disabled={!canGenerate}
          size="lg"
          className="relative overflow-hidden rounded-xl bg-gradient-to-b from-primary to-primary/85 text-primary-foreground shadow-lg ring-1 ring-inset ring-white/10 transition-all duration-200 ease-enterprise hover:from-primary/95 hover:to-primary/75 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 disabled:from-muted disabled:to-muted disabled:text-muted-foreground/40 disabled:shadow-none disabled:ring-0 disabled:hover:translate-y-0"
        >
          {isGenerating ? (
            <Loader2Icon className="size-5 animate-spin" />
          ) : (
            <SparklesIcon className="size-5" />
          )}
          <span className="ml-2 text-[15px]">
            {isGenerating ? "Generating..." : "Generate Test Plan"}
          </span>
        </Button>

        <p className="text-[11px] text-muted-foreground/40">
          or press{" "}
          <kbd className="rounded border border-border bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            Ctrl+K
          </kbd>{" "}
          → Generate
        </p>
      </div>
    </motion.div>
  );
}
