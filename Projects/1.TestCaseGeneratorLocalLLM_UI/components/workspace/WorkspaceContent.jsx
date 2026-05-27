"use client";

import { AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { EmptyWorkspace } from "@/components/workspace/EmptyWorkspace";
import { ReadyToGenerate } from "@/components/workspace/ReadyToGenerate";
import { LoadingWorkspace } from "@/components/workspace/LoadingWorkspace";
import { ErrorWorkspace } from "@/components/workspace/ErrorWorkspace";
import { ContentToolbar } from "@/components/workspace/ContentToolbar";
import { useAppStore } from "@/lib/store";
import { useGeneration } from "@/hooks/useGeneration";

export function WorkspaceContent() {
  const files = useAppStore((s) => s.files);
  const extractedTexts = useAppStore((s) => s.extractedTexts);
  const isGenerating = useAppStore((s) => s.isGenerating);
  const generatedMarkdown = useAppStore((s) => s.generatedMarkdown);
  const generationError = useAppStore((s) => s.generationError);
  const activeTab = useAppStore((s) => s.activeTab);
  const hasContent = generatedMarkdown.length > 0 && !generationError && !isGenerating;
  const hasDocs = files.length > 0 && extractedTexts.length > 0;
  const showEmpty = !isGenerating && !generatedMarkdown && !generationError && !hasDocs;
  const showReady = !isGenerating && !generatedMarkdown && !generationError && hasDocs;
  const { generate } = useGeneration();

  return (
    <main
      className="flex flex-1 flex-col overflow-hidden bg-background"
      role="region"
      aria-label="Generated test plan"
    >
      {hasContent && <ContentToolbar />}

      <ScrollArea className="flex-1">
        <AnimatePresence mode="wait">
          {showEmpty && <EmptyWorkspace key="empty" />}

          {showReady && <ReadyToGenerate key="ready" />}

          {isGenerating && <LoadingWorkspace key="loading" />}

          {generationError && (
            <ErrorWorkspace
              key="error"
              message={generationError}
              onRetry={generate}
            />
          )}

          {!isGenerating && hasContent && (
            <div
              key="content"
              className="animate-fade-in px-4 py-6 sm:px-6 sm:py-8"
            >
              {activeTab === "preview" && (
                <div className="mx-auto max-w-[820px]">
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-10">
                    <MarkdownRenderer content={generatedMarkdown} />
                  </div>
                </div>
              )}
              {activeTab === "raw" && (
                <div className="mx-auto max-w-[820px]">
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-10">
                    <pre className="whitespace-pre-wrap break-words font-mono text-[13px] leading-relaxed text-foreground/80">
                      {generatedMarkdown}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </main>
  );
}
