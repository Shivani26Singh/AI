"use client";

import {
  CopyIcon,
  DownloadIcon,
  FileDownIcon,
  CheckIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { markdownToDocx, downloadDocx } from "@/lib/markdown-to-docx";
import { useAppStore } from "@/lib/store";
import { useState } from "react";

export function ExportDropdown() {
  const generatedMarkdown = useAppStore((s) => s.generatedMarkdown);
  const [copying, setCopying] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedMarkdown);
      toast.success("Copied to clipboard");
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleDownloadMd = () => {
    const blob = new Blob([generatedMarkdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `test-plan-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Markdown file downloaded");
  };

  const handleExportDocx = async () => {
    try {
      const blob = await markdownToDocx(generatedMarkdown);
      const filename = `test-plan-${new Date().toISOString().slice(0, 10)}.docx`;
      downloadDocx(blob, filename);
      toast.success("DOCX exported successfully");
    } catch {
      toast.error("DOCX export failed — try again");
    }
  };

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="rounded-lg"
              aria-label="Export options"
            >
              {copying ? (
                <CheckIcon className="size-4 text-emerald-500" />
              ) : (
                <CopyIcon className="size-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Export &amp; share</TooltipContent>
      </Tooltip>

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={handleCopy}>
          <CopyIcon className="size-3.5" />
          Copy Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownloadMd}>
          <DownloadIcon className="size-3.5" />
          Download .md
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportDocx}>
          <FileDownIcon className="size-3.5" />
          Export .docx
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
