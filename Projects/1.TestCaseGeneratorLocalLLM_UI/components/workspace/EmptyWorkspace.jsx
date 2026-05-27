"use client";

import { motion } from "framer-motion";
import { FileTextIcon, SparklesIcon } from "lucide-react";

export function EmptyWorkspace() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full flex-col items-center justify-center px-6 py-24 text-center"
    >
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-pulse-glow rounded-full bg-primary/10 blur-2xl" />
        <div className="relative flex size-20 items-center justify-center rounded-2xl bg-card ring-1 ring-border shadow-lg">
          <FileTextIcon className="size-9 text-foreground/25" />
        </div>
        <div className="absolute -right-2 -top-2 flex size-8 items-center justify-center rounded-full border-2 border-background bg-card shadow-md">
          <SparklesIcon className="size-4 text-primary/60" />
        </div>
      </div>

      <h2 className="text-[15px] font-semibold tracking-tight text-foreground/80">
        No test plan yet
      </h2>
      <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
        Upload a PRD or requirements document from the sidebar to generate your first AI-powered test plan.
      </p>

      <p className="mt-4 text-[11px] text-muted-foreground/40">
        or use{" "}
        <kbd className="rounded border border-border bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          Ctrl+K
        </kbd>{" "}
        to open the command palette
      </p>
    </motion.div>
  );
}
