"use client";

import {
  SparklesIcon,
  PanelLeftOpenIcon,
  Loader2Icon,
  AlertCircleIcon,
  CircleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModelSelector } from "@/components/ModelSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { ExportDropdown } from "@/components/workspace/ExportDropdown";
import { useGeneration } from "@/hooks/useGeneration";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function TopNavbar({ sidebarCollapsed, onToggleSidebar }) {
  const model = useAppStore((s) => s.settings.model);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const isGenerating = useAppStore((s) => s.isGenerating);
  const generationError = useAppStore((s) => s.generationError);
  const generatedMarkdown = useAppStore((s) => s.generatedMarkdown);
  const { generate, canGenerate } = useGeneration();

  const statusVariant = generationError
    ? "danger"
    : isGenerating
      ? "warning"
      : "success";

  const StatusIcon = generationError
    ? AlertCircleIcon
    : isGenerating
      ? Loader2Icon
      : CircleIcon;

  return (
    <header className="sticky top-0 z-50 flex h-12 shrink-0 items-center gap-3 border-b border-border bg-background/90 px-3 backdrop-blur-xl saturate-150 sm:px-4">
      {sidebarCollapsed && (
        <>
          <BrandLogo size="sm" />
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onToggleSidebar}
            aria-label="Open sidebar"
          >
            <PanelLeftOpenIcon className="size-3.5" />
          </Button>
        </>
      )}

      <div className="flex flex-1 items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CommandPalette />
          <div className="hidden sm:block">
            <ModelSelector
              value={model}
              onChange={(v) => updateSettings({ model: v })}
            />
          </div>
          <Badge variant={statusVariant} className="hidden sm:inline-flex gap-1">
            <StatusIcon
              className={cn(
                "size-2",
                isGenerating && "animate-spin"
              )}
            />
            {generationError
              ? "Error"
              : isGenerating
                ? "Generating"
                : "Ready"}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <div className="sm:hidden">
            <ModelSelector
              value={model}
              onChange={(v) => updateSettings({ model: v })}
            />
          </div>

          {generatedMarkdown.length > 0 && <ExportDropdown />}

          <Button
            onClick={generate}
            disabled={!canGenerate}
            size="sm"
            className={cn(
              "relative overflow-hidden rounded-lg bg-gradient-to-b from-[#5B5BFF] to-[#4A4AE0] text-white shadow-sm ring-1 ring-inset ring-white/10 transition-all duration-200 ease-enterprise hover:from-[#6F6FFF] hover:to-[#5B5BFF] hover:shadow-md hover:shadow-[#5B5BFF]/20 disabled:from-muted disabled:to-muted disabled:text-muted-foreground disabled:shadow-none disabled:ring-0",
              canGenerate && "animate-pulse-glow"
            )}
          >
            {isGenerating ? (
              <Loader2Icon className="size-3.5 animate-spin" />
            ) : (
              <SparklesIcon className="size-3.5" />
            )}
            <span className="hidden sm:inline ml-1.5">
              {isGenerating ? "Generating..." : "Generate"}
            </span>
          </Button>

          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
