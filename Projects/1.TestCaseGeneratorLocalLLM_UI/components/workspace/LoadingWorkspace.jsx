"use client";

import { motion } from "framer-motion";
import { SparklesIcon } from "lucide-react";

export function LoadingWorkspace() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col items-center justify-center px-6 py-24 text-center"
    >
      <div className="relative mb-10">
        <div className="absolute inset-0 animate-pulse-glow rounded-full bg-primary/15 blur-3xl" />
        <div className="relative flex size-16 items-center justify-center rounded-2xl bg-card ring-1 ring-primary/20 shadow-lg">
          <SparklesIcon className="size-7 text-primary/60 animate-ai-pulse" />
        </div>
      </div>

      <h2 className="text-[15px] font-semibold tracking-tight text-foreground/85">
        Generating test plan
      </h2>
      <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
        Analyzing your PRD and creating a comprehensive test plan...
      </p>

      <div className="mt-8 flex items-center gap-1.5">
        <span
          className="size-1.5 rounded-full bg-primary/60 animate-dot-wave"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="size-1.5 rounded-full bg-primary/60 animate-dot-wave"
          style={{ animationDelay: "200ms" }}
        />
        <span
          className="size-1.5 rounded-full bg-primary/60 animate-dot-wave"
          style={{ animationDelay: "400ms" }}
        />
      </div>

      <div className="mt-10 w-full max-w-lg animate-shimmer-enterprise">
        <div className="mx-auto max-w-3xl rounded-xl border border-border bg-card/60 p-6">
          <div className="space-y-3">
            <div className="h-3 w-36 rounded bg-muted" />
            <div className="h-2 w-full rounded bg-muted/60" />
            <div className="h-2 w-5/6 rounded bg-muted/60" />
            <div className="h-2 w-4/6 rounded bg-muted/60" />
            <div className="mt-5 h-px w-full bg-border" />
            <div className="h-3 w-40 rounded bg-muted" />
            <div className="h-2 w-full rounded bg-muted/60" />
            <div className="h-2 w-3/4 rounded bg-muted/60" />
            <div className="h-2 w-5/6 rounded bg-muted/60" />
            <div className="mt-5 h-px w-full bg-border" />
            <div className="h-3 w-32 rounded bg-muted" />
            <div className="h-2 w-full rounded bg-muted/60" />
            <div className="h-2 w-2/3 rounded bg-muted/60" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
