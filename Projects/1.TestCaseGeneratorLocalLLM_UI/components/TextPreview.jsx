"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon, FileTextIcon, Loader2Icon, AlertCircleIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function TextPreview({ fileName, text, isExtracting, error, className }) {
  const [collapsed, setCollapsed] = useState(false);

  if (error) {
    return (
      <div className={cn("rounded-xl border border-destructive/15 bg-destructive/[0.02] px-4 py-3 animate-fade-in", className)}>
        <div className="flex items-start gap-2.5">
          <AlertCircleIcon className="mt-0.5 size-4 shrink-0 text-destructive/50" />
          <div className="min-w-0 space-y-0.5">
            <p className="text-xs font-medium">Failed to extract {fileName}</p>
            <p className="text-xs leading-relaxed text-muted-foreground/70">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (isExtracting) {
    return (
      <div className={cn("flex items-center gap-3 rounded-xl border border-border/30 bg-muted/15 px-4 py-3 animate-fade-in", className)}>
        <Loader2Icon className="size-4 animate-spin text-muted-foreground/60" />
        <div className="min-w-0">
          <p className="text-xs font-medium">Extracting {fileName}</p>
          <p className="text-xs text-muted-foreground/60">Reading document content…</p>
        </div>
      </div>
    );
  }

  if (!text) return null;

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border/30 bg-card/30 shadow-sm backdrop-blur-sm animate-fade-in", className)}>
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="flex w-full items-center justify-between px-4 py-2.5 transition-colors hover:bg-muted/30"
      >
        <div className="flex items-center gap-2 min-w-0">
          <FileTextIcon className="size-4 shrink-0 text-muted-foreground/50" />
          <span className="truncate text-xs font-medium">{fileName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-[11px] text-muted-foreground/60 sm:inline tabular-nums">{wordCount.toLocaleString()} words</span>
          {collapsed ? <EyeIcon className="size-3.5 text-muted-foreground/50" /> : <EyeOffIcon className="size-3.5 text-muted-foreground/50" />}
        </div>
      </button>
      <div className={cn("grid transition-all duration-300 ease-premium", collapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]")}>
        <div className="overflow-hidden">
          <ScrollArea className="max-h-52">
            <pre className="whitespace-pre-wrap border-t border-border/30 p-4 font-mono text-[11px] leading-relaxed text-muted-foreground/80">
              {text}
            </pre>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
