"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  UploadIcon,
  SparklesIcon,
  FileTextIcon,
  XIcon,
  Trash2Icon,
  PanelLeftCloseIcon,
  PanelLeftIcon,
  AlertTriangleIcon,
  Loader2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UploadZone } from "@/components/UploadZone";
import { TextPreview } from "@/components/TextPreview";
import { SettingsDialog } from "@/components/SettingsDialog";
import { useAppStore } from "@/lib/store";
import { extractFiles } from "@/lib/extractors";

export function LeftPanel() {
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
  const isGenerating = useAppStore((s) => s.isGenerating);
  const setIsGenerating = useAppStore((s) => s.setIsGenerating);
  const setGeneratedMarkdown = useAppStore((s) => s.setGeneratedMarkdown);
  const setGenerationError = useAppStore((s) => s.setGenerationError);
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const settings = useAppStore((s) => s.settings);
  const [collapsed, setCollapsed] = useState(false);
  const [rejectionMessages, setRejectionMessages] = useState([]);

  const handleFilesAccepted = useCallback(async (acceptedFiles) => {
    setRejectionMessages([]);
    addFiles(acceptedFiles);
    clearExtractionResults();
    setExtracting(true);
    try {
      const results = await extractFiles(acceptedFiles);
      let successCount = 0;
      for (const result of results) {
        if (result.success) { addExtractedText({ fileName: result.fileName, text: result.text }); successCount++; }
        else { addExtractionError({ fileName: result.fileName, error: result.error }); }
      }
      if (successCount > 0) toast.success(`Extracted ${successCount} file${successCount > 1 ? "s" : ""}`);
    } catch { toast.error("Extraction failed unexpectedly"); }
    finally { setExtracting(false); }
  }, [addFiles, addExtractedText, addExtractionError, clearExtractionResults, setExtracting]);

  const handleFilesRejected = useCallback((rejected) => {
    setRejectionMessages(rejected.map((r) => r.error));
    rejected.forEach((r) => toast.warning(r.error));
  }, []);

  const handleRemove = useCallback((index) => { removeFile(index); setRejectionMessages([]); }, [removeFile]);
  const handleClearAll = () => { clearFiles(); setRejectionMessages([]); };

  const handleGenerate = async () => {
    if (files.length === 0 || isGenerating) return;
    const combinedPrdText = extractedTexts.map((e) => e.text).filter(Boolean).join("\n\n---\n\n");
    if (!combinedPrdText.trim()) return;
    setIsGenerating(true);
    setActiveTab("preview");
    try {
      const response = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prdText: combinedPrdText, model: settings.model, temperature: settings.temperature, maxTokens: settings.maxTokens, apiKey: settings.apiKey || undefined }) });
      const data = await response.json();
      if (!data.success) { setGenerationError(data.error || "Generation failed."); toast.error(data.error || "Generation failed."); return; }
      setGeneratedMarkdown(data.markdown);
      toast.success("Test plan generated successfully");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to contact the API.";
      setGenerationError(msg);
      toast.error(msg);
    }
  };

  if (collapsed) {
    return (
      <aside className="flex w-10 shrink-0 flex-col items-center border-r border-border/30 bg-sidebar/50 py-4 backdrop-blur-xl">
        <Button variant="ghost" size="icon-sm" onClick={() => setCollapsed(false)} aria-label="Expand sidebar">
          <PanelLeftIcon className="size-4" aria-hidden="true" />
        </Button>
        <Separator className="my-3 w-5 opacity-30" />
        <span className="text-[9px] font-semibold tracking-[0.2em] text-muted-foreground/40 rotate-180" style={{ writingMode: "vertical-lr" }}>DOCS</span>
      </aside>
    );
  }

  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-border/30 bg-sidebar/40 backdrop-blur-xl sm:w-[17.5rem]" role="complementary" aria-label="Upload panel">
      <div className="flex items-center justify-between px-4 pt-4 pb-3 sm:px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg bg-muted/60 ring-1 ring-border/20">
            <UploadIcon className="size-3.5 text-muted-foreground/80" aria-hidden="true" />
          </div>
          <h2 className="text-[13px] font-semibold tracking-tight">Documents</h2>
        </div>
        <div className="flex items-center gap-2">
          {files.length > 0 && (
            <span className="inline-flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-muted/70 px-1.5 text-[9px] font-semibold tabular-nums text-muted-foreground">{files.length}</span>
          )}
          <Button variant="ghost" size="icon-xs" onClick={() => setCollapsed(true)} aria-label="Collapse sidebar" className="hidden sm:flex">
            <PanelLeftCloseIcon className="size-3" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="px-4 sm:px-5"><UploadZone onFilesAccepted={handleFilesAccepted} onFilesRejected={handleFilesRejected} /></div>

      {rejectionMessages.length > 0 && (
        <div className="mt-2.5 space-y-1 px-4 animate-slide-up" role="alert">
          {rejectionMessages.map((msg, i) => (
            <div key={i} className="flex items-start gap-2 rounded-lg bg-destructive/[0.03] px-3 py-2 text-[12px] text-destructive/80 ring-1 ring-destructive/8">
              <AlertTriangleIcon className="mt-0.5 size-3 shrink-0" aria-hidden="true" /><span>{msg}</span>
            </div>
          ))}
        </div>
      )}

      <Separator className="mx-5 mt-3 w-auto opacity-40" />

      <ScrollArea className="flex-1 px-4 py-3 sm:px-5">
        {files.length > 0 && (
          <div className="space-y-2.5">
            {files.map((file, index) => {
              const ext = extractedTexts.find((e) => e.fileName === file.name);
              const err = extractionErrors.find((e) => e.fileName === file.name);
              const extracting = isExtracting && !ext && !err && index >= files.length - extractedTexts.length - extractionErrors.length;
              return (
                <div key={`${file.name}-${index}`} className="animate-slide-up" style={{ animationDelay: `${index * 40}ms` }}>
                  <div className="group/file flex items-center justify-between rounded-xl border border-border/30 bg-card/30 px-3 py-2.5 shadow-sm backdrop-blur-sm transition-all duration-150 ease-premium hover:border-border/50 hover:bg-card/50 hover:shadow-md">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted/50 ring-1 ring-border/15">
                        <FileTextIcon className="size-3 text-muted-foreground/70" aria-hidden="true" />
                      </div>
                      <span className="truncate text-[12px] font-medium">{file.name}</span>
                    </div>
                    <Button variant="ghost" size="icon-xs" onClick={() => handleRemove(index)} disabled={isExtracting} aria-label={`Remove ${file.name}`} className="shrink-0 opacity-0 transition-opacity duration-150 group-hover/file:opacity-100 focus-visible:opacity-100">
                      <XIcon className="size-3" aria-hidden="true" />
                    </Button>
                  </div>
                  {(extracting || ext || err) && (
                    <div className="mt-1.5"><TextPreview fileName={file.name} text={ext?.text || ""} isExtracting={extracting} error={err?.error || null} /></div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {files.length === 0 && !isExtracting && (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <UploadIcon className="size-8 text-muted-foreground/15" aria-hidden="true" />
            <p className="text-[12px] leading-relaxed text-muted-foreground/45">Upload a PRD or spec document to generate a test plan.</p>
          </div>
        )}
      </ScrollArea>

      <div className="border-t border-border/30 p-3 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button
            className="group/generate relative w-full overflow-hidden bg-gradient-to-b from-primary to-primary/85 shadow-sm ring-1 ring-inset ring-white/10 transition-all duration-200 ease-premium hover:-translate-y-0.5 hover:shadow-md hover:from-primary/95 hover:to-primary/80 active:translate-y-0 disabled:from-muted disabled:to-muted disabled:shadow-none disabled:ring-0 disabled:hover:translate-y-0"
            onClick={handleGenerate}
            disabled={files.length === 0 || isExtracting || extractedTexts.length === 0 || isGenerating}
            aria-label="Generate test plan from uploaded documents"
          >
            {isGenerating ? <Loader2Icon className="size-4 animate-spin" aria-hidden="true" /> : <SparklesIcon className="size-4 transition-transform duration-300 group-hover/generate:rotate-12" aria-hidden="true" />}
            {isGenerating ? "Generating" : "Generate"}
          </Button>
          <Button variant="outline" className="w-full" onClick={handleClearAll} disabled={isExtracting || isGenerating} aria-label="Clear all uploaded documents">
            <Trash2Icon className="size-4" aria-hidden="true" />Clear
          </Button>
        </div>
        <SettingsDialog />
      </div>
    </aside>
  );
}
