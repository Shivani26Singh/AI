"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { FileDownIcon, Loader2Icon, AlertTriangleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { markdownToDocx, downloadDocx } from "@/lib/markdown-to-docx";

export function DocxExportButton({ markdown }) {
  const [status, setStatus] = useState("idle");

  const handleExport = useCallback(async () => {
    if (!markdown || status === "exporting") return;

    setStatus("exporting");

    try {
      const blob = await markdownToDocx(markdown);
      const filename = `test-plan-${new Date().toISOString().slice(0, 10)}.docx`;
      downloadDocx(blob, filename);
      setStatus("idle");
      toast.success("DOCX exported successfully");
    } catch (err) {
      setStatus("error");
      toast.error("DOCX export failed — try again");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }, [markdown, status]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleExport}
          disabled={status === "exporting" || !markdown}
          aria-label={status === "exporting" ? "Generating DOCX" : "Export as DOCX"}
        >
          {status === "exporting" ? (
            <Loader2Icon className="size-4 animate-spin" aria-hidden="true" />
          ) : status === "error" ? (
            <AlertTriangleIcon className="size-4 text-destructive" aria-hidden="true" />
          ) : (
            <FileDownIcon className="size-4" aria-hidden="true" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {status === "exporting"
          ? "Generating DOCX..."
          : status === "error"
            ? "Export failed — try again"
            : "Download as DOCX"}
      </TooltipContent>
    </Tooltip>
  );
}
