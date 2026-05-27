"use client";

import { FileTextIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ModelSelector } from "@/components/ModelSelector";
import { useAppStore } from "@/lib/store";

export function Navbar() {
  const model = useAppStore((s) => s.settings.model);
  const updateSettings = useAppStore((s) => s.updateSettings);

  return (
    <header className="sticky top-0 z-40 flex h-12 shrink-0 items-center gap-3 border-b border-border/30 bg-background/70 px-4 backdrop-blur-2xl saturate-150 sm:px-6">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground ring-1 ring-inset ring-white/10 shadow-sm">
          <FileTextIcon className="size-3.5" aria-hidden="true" />
        </div>
        <span className="hidden text-[13px] font-semibold tracking-tight text-foreground/90 sm:inline-block">
          TestPlan AI
        </span>
      </div>
      <Separator orientation="vertical" className="h-5 opacity-40" />
      <div className="flex flex-1 items-center justify-between gap-3">
        <ModelSelector
          value={model}
          onChange={(newModel) => updateSettings({ model: newModel })}
        />
        <ThemeToggle />
      </div>
    </header>
  );
}
