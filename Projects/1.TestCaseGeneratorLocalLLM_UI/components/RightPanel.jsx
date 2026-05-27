"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { FileTextIcon, CodeIcon, CopyIcon, DownloadIcon, CheckIcon, AlertTriangleIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { DocxExportButton } from "@/components/DocxExportButton";
import { useAppStore } from "@/lib/store";

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); toast.success("Copied to clipboard"); setTimeout(() => setCopied(false), 2000); }
    catch { toast.error("Failed to copy to clipboard"); }
  }, [text]);
  return (
    <Button variant="ghost" size="icon-sm" onClick={handleCopy} className="rounded-lg" aria-label={copied ? "Copied" : "Copy markdown"}>
      {copied ? <CheckIcon className="size-4 text-emerald-500" aria-hidden="true" /> : <CopyIcon className="size-4" aria-hidden="true" />}
    </Button>
  );
}

function DownloadButton({ text }) {
  const handleDownload = useCallback(() => {
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `test-plan-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Markdown file downloaded");
  }, [text]);
  return (
    <Button variant="ghost" size="icon-sm" onClick={handleDownload} className="rounded-lg" aria-label="Download as Markdown">
      <DownloadIcon className="size-4" aria-hidden="true" />
    </Button>
  );
}

export function RightPanel() {
  const isGenerating = useAppStore((s) => s.isGenerating);
  const generatedMarkdown = useAppStore((s) => s.generatedMarkdown);
  const generationError = useAppStore((s) => s.generationError);
  const activeTab = useAppStore((s) => s.activeTab);
  const setActiveTab = useAppStore((s) => s.setActiveTab);
  const hasContent = generatedMarkdown.length > 0;
  const showEmpty = !isGenerating && !hasContent && !generationError;

  return (
    <main className="flex flex-1 flex-col overflow-hidden bg-background surface-primary" role="region" aria-label="Generated test plan">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-1 flex-col overflow-hidden">
        {hasContent && (
          <div className="flex shrink-0 items-center justify-between border-b border-border/20 bg-background/50 px-4 py-2 backdrop-blur-xl sm:px-6">
            <TabsList variant="line">
              <TabsTrigger value="preview" className="gap-2 rounded-md">
                <FileTextIcon className="size-[15px]" aria-hidden="true" />Preview
              </TabsTrigger>
              <TabsTrigger value="raw" className="gap-2 rounded-md">
                <CodeIcon className="size-[15px]" aria-hidden="true" />Raw
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-1">
              <CopyButton text={generatedMarkdown} />
              <DownloadButton text={generatedMarkdown} />
              <DocxExportButton markdown={generatedMarkdown} />
            </div>
          </div>
        )}

        <ScrollArea className="flex-1">
          {isGenerating && <LoadingSkeleton />}
          {generationError && (
            <div className="flex flex-1 flex-col items-center justify-center gap-5 py-28 animate-fade-in" role="alert">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/[0.05] ring-1 ring-destructive/10">
                <AlertTriangleIcon className="size-6 text-destructive/50" aria-hidden="true" />
              </div>
              <div className="space-y-1.5 text-center">
                <p className="text-sm font-semibold tracking-tight">Generation failed</p>
                <p className="max-w-sm text-[13px] leading-relaxed text-muted-foreground/70">{generationError}</p>
              </div>
            </div>
          )}
          {showEmpty && (
            <EmptyState
              title="Your test plan will appear here"
              description="Upload your PRD or requirements document and click Generate to create a comprehensive, AI-powered test plan."
            />
          )}
          {!isGenerating && hasContent && (
            <div className="animate-fade-in">
              <TabsContent value="preview" className="mt-0 px-4 py-6 sm:px-6 sm:py-8">
                <div className="mx-auto max-w-4xl card-premium p-6 sm:p-10">
                  <MarkdownRenderer content={generatedMarkdown} />
                </div>
              </TabsContent>
              <TabsContent value="raw" className="mt-0 px-4 py-6 sm:px-6 sm:py-8">
                <div className="mx-auto max-w-4xl card-premium p-6 sm:p-10">
                  <pre className="whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed text-muted-foreground/80">{generatedMarkdown}</pre>
                </div>
              </TabsContent>
            </div>
          )}
        </ScrollArea>
      </Tabs>
    </main>
  );
}
