"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  PanelLeftCloseIcon,
  SparklesIcon,
  Trash2Icon,
  Loader2Icon,
  FileTextIcon,
  XIcon,
  AlertTriangleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UploadZone } from "@/components/UploadZone";
import { TextPreview } from "@/components/TextPreview";
import { SettingsDialog } from "@/components/SettingsDialog";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { UserProfile } from "@/components/layout/UserProfile";
import { useGeneration } from "@/hooks/useGeneration";
import { useAppStore } from "@/lib/store";
import { extractFiles } from "@/lib/extractors";
import { cn } from "@/lib/utils";

export function Sidebar({ collapsed, onToggle }) {
  const files = useAppStore((s) => s.files);
  const addFiles = useAppStore((s) => s.addFiles);
  const removeFile = useAppStore((s) => s.removeFile);
  const clearFiles = useAppStore((s) => s.clearFiles);
  const extractedTexts = useAppStore((s) => s.extractedTexts);
  const addExtractedText = useAppStore((s) => s.addExtractedText);
  const extractionErrors = useAppStore((s) => s.extractionErrors);
  const addExtractionError = useAppStore((s) => s.addExtractionError);
  const clearExtractionResults = useAppStore((s) => s.clearExtractionResults);
  const isExtracting = useAppStore((s) => s.isExtracting);
  const setExtracting = useAppStore((s) => s.setExtracting);
  const { generate, isGenerating, canGenerate } = useGeneration();
  const [rejectionMessages, setRejectionMessages] = useState([]);

  const handleFilesAccepted = useCallback(
    async (acceptedFiles) => {
      setRejectionMessages([]);
      addFiles(acceptedFiles);
      clearExtractionResults();
      setExtracting(true);
      try {
        const results = await extractFiles(acceptedFiles);
        let successCount = 0;
        for (const result of results) {
          if (result.success) {
            addExtractedText({ fileName: result.fileName, text: result.text });
            successCount++;
          } else {
            addExtractionError({
              fileName: result.fileName,
              error: result.error,
            });
          }
        }
        if (successCount > 0)
          toast.success(
            `Extracted ${successCount} file${successCount > 1 ? "s" : ""}`
          );
      } catch {
        toast.error("Extraction failed unexpectedly");
      } finally {
        setExtracting(false);
      }
    },
    [
      addFiles,
      addExtractedText,
      addExtractionError,
      clearExtractionResults,
      setExtracting,
    ]
  );

  const handleFilesRejected = useCallback((rejected) => {
    setRejectionMessages(rejected.map((r) => r.error));
    rejected.forEach((r) => toast.warning(r.error));
  }, []);

  const handleRemove = useCallback(
    (index) => {
      removeFile(index);
      setRejectionMessages([]);
    },
    [removeFile]
  );

  const handleClearAll = () => {
    clearFiles();
    setRejectionMessages([]);
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 0 : 280 }}
      initial={{ width: 280 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "relative flex shrink-0 flex-col overflow-hidden border-r border-border bg-sidebar",
        collapsed && "border-r-0"
      )}
      role="complementary"
      aria-label="Sidebar"
    >
      <div className="flex h-full w-[280px] flex-col">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <BrandLogo />
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onToggle}
            className="text-sidebar-foreground/50 hover:text-sidebar-foreground"
            aria-label="Collapse sidebar"
          >
            <PanelLeftCloseIcon className="size-3.5" />
          </Button>
        </div>

        <div className="px-3 pb-3">
          <UploadZone
            onFilesAccepted={handleFilesAccepted}
            onFilesRejected={handleFilesRejected}
          />
        </div>

        {rejectionMessages.length > 0 && (
          <div className="mb-2 space-y-1 px-3" role="alert">
            {rejectionMessages.map((msg, i) => (
              <div
                key={i}
                className="flex items-start gap-2 rounded-lg bg-destructive/[0.06] px-3 py-2 text-[11px] text-destructive/80 ring-1 ring-destructive/10"
              >
                <AlertTriangleIcon
                  className="mt-0.5 size-3 shrink-0"
                  aria-hidden="true"
                />
                <span>{msg}</span>
              </div>
            ))}
          </div>
        )}

        <Separator className="mx-4 mb-3 w-auto bg-border" />

        <ScrollArea className="flex-1 px-3">
          {files.length > 0 && (
            <div className="mb-3 space-y-2">
              {files.map((file, index) => {
                const ext = extractedTexts.find(
                  (e) => e.fileName === file.name
                );
                const err = extractionErrors.find(
                  (e) => e.fileName === file.name
                );
                const extracting =
                  isExtracting &&
                  !ext &&
                  !err &&
                  index >=
                    files.length -
                      extractedTexts.length -
                      extractionErrors.length;

                return (
                  <div
                    key={`${file.name}-${index}`}
                    className="animate-fade-slide-up"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    <div className="group/file flex items-center justify-between rounded-lg border border-border bg-sidebar-accent/50 px-3 py-2.5 transition-all duration-150 ease-enterprise hover:border-border/80 hover:bg-sidebar-accent">
                      <div className="flex min-w-0 items-center gap-2">
                        <FileTextIcon className="size-3.5 shrink-0 text-sidebar-foreground/60" />
                        <span className="truncate text-[12px] font-medium text-sidebar-foreground/90">
                          {file.name}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => handleRemove(index)}
                        disabled={isExtracting}
                        aria-label={`Remove ${file.name}`}
                        className="shrink-0 opacity-0 transition-opacity duration-150 group-hover/file:opacity-100 focus-visible:opacity-100 text-sidebar-foreground/40 hover:text-sidebar-foreground"
                      >
                        <XIcon className="size-3" />
                      </Button>
                    </div>
                    {(extracting || ext || err) && (
                      <div className="mt-1">
                        <TextPreview
                          fileName={file.name}
                          text={ext?.text || ""}
                          isExtracting={extracting}
                          error={err?.error || null}
                        />
                      </div>
                    )}
                  </div>
                );
              })}

              {files.length > 1 && (
                <button
                  onClick={handleClearAll}
                  disabled={isExtracting || isGenerating}
                  className="mt-1 w-full rounded-lg py-1.5 text-center text-[11px] font-medium text-sidebar-foreground/40 transition-colors hover:text-destructive/80 disabled:opacity-40 disabled:hover:text-sidebar-foreground/40"
                >
                  Clear all documents
                </button>
              )}
            </div>
          )}

          <SidebarNav />
        </ScrollArea>

        <div className="border-t border-border px-3 py-2.5 space-y-2">
          <Button
            onClick={generate}
            disabled={!canGenerate}
            size="sm"
            className={cn(
              "w-full justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-all duration-200 ease-enterprise hover:bg-primary/20 hover:text-primary/90 hover:ring-primary/30 disabled:bg-sidebar-accent/50 disabled:text-sidebar-foreground/25 disabled:ring-0",
              canGenerate && "animate-pulse-glow"
            )}
          >
            {isGenerating ? (
              <Loader2Icon className="size-3.5 animate-spin" />
            ) : (
              <SparklesIcon className="size-3.5" />
            )}
            <span className="ml-1.5">
              {isGenerating ? "Generating..." : "Generate"}
            </span>
          </Button>
          <UserProfile />
        </div>
      </div>
    </motion.aside>
  );
}
