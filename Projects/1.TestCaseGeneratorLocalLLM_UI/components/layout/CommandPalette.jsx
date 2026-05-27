"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "@/components/ui/command";
import {
  UploadIcon,
  SparklesIcon,
  SettingsIcon,
  SunIcon,
  MoonIcon,
  SearchIcon,
  FileTextIcon,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useGeneration } from "@/hooks/useGeneration";
import { useAppStore } from "@/lib/store";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { generate, canGenerate } = useGeneration();
  const recentGenerations = useAppStore((s) => s.recentGenerations);
  const files = useAppStore((s) => s.files);

  useEffect(() => {
    const down = (e) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = useCallback((command) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-1.5 text-[12px] text-muted-foreground/70 transition-all duration-200 ease-enterprise hover:border-border hover:bg-muted/50 hover:text-muted-foreground"
      >
        <SearchIcon className="size-3.5 shrink-0" />
        <span className="hidden sm:inline">Search or run command...</span>
        <kbd className="pointer-events-none ml-2 hidden h-5 select-none items-center gap-0.5 rounded border border-border/60 bg-muted/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground/50 sm:inline-flex">
          <span className="text-[11px]">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => runCommand(() => canGenerate && generate())}
              disabled={!canGenerate}
            >
              <SparklesIcon />
              Generate test plan
              <CommandShortcut>⌘↵</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => {})}>
              <UploadIcon />
              Upload document...
              <CommandShortcut>⌘U</CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Preferences">
            <CommandItem onSelect={() => runCommand(toggleTheme)}>
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              Toggle {theme === "dark" ? "light" : "dark"} mode
              <CommandShortcut>⌘T</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => {})}>
              <SettingsIcon />
              Open settings...
              <CommandShortcut>⌘,</CommandShortcut>
            </CommandItem>
          </CommandGroup>

          {recentGenerations.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Recent generations">
                {recentGenerations.slice(0, 5).map((gen, i) => (
                  <CommandItem key={i} onSelect={() => runCommand(() => {})}>
                    <FileTextIcon />
                    <span className="truncate">{gen.snippet || "Test Plan"}</span>
                    <CommandShortcut>
                      {new Date(gen.timestamp).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </CommandShortcut>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {files.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Active documents">
                {files.map((file, i) => (
                  <CommandItem key={i} onSelect={() => runCommand(() => {})}>
                    <FileTextIcon />
                    {file.name}
                    <CommandShortcut>
                      {(file.size / 1024).toFixed(0)}KB
                    </CommandShortcut>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
