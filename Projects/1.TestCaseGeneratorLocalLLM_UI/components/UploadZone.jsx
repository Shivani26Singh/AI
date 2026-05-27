"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadIcon, SparklesIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateFiles } from "@/lib/validators";

export function UploadZone({ onFilesAccepted, onFilesRejected, className, maxFiles = 10 }) {
  const onDrop = useCallback((accepted, rejected) => {
    const { valid, errors } = validateFiles(accepted);
    const allRejected = [...rejected.map((r) => ({ file: r.file, error: r.errors?.[0]?.message || "File was rejected." })), ...errors];
    if (valid.length > 0 && onFilesAccepted) onFilesAccepted(valid);
    if (allRejected.length > 0 && onFilesRejected) onFilesRejected(allRejected);
  }, [onFilesAccepted, onFilesRejected]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop, maxFiles, maxSize: 10 * 1024 * 1024,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    noClick: true, noKeyboard: true,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        "group relative flex cursor-default flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition-all duration-500 ease-premium",
        isDragActive
          ? "scale-[1.01] border-primary/50 bg-primary/[0.06]"
          : "border-border bg-sidebar-accent/30 hover:border-primary/30 hover:bg-sidebar-accent/50",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className={cn(
        "flex size-12 items-center justify-center rounded-xl bg-sidebar-accent ring-1 ring-border shadow-sm transition-all duration-500 ease-premium",
        isDragActive ? "scale-110 ring-primary/30" : "group-hover:scale-[1.04] group-hover:ring-border/80"
      )}>
        {isDragActive ? <SparklesIcon className="size-5 text-primary" /> : <UploadIcon className="size-5 text-sidebar-foreground/50 transition-colors duration-300 group-hover:text-primary/60" />}
      </div>
      <div className="mt-3 space-y-1">
        {isDragActive ? <p className="text-[13px] font-semibold text-primary">Release to upload</p> : <p className="text-[13px] font-semibold text-sidebar-foreground/70">Drop your documents here</p>}
        <p className="text-[11px] text-sidebar-foreground/45">PDF, DOCX, or TXT — up to 10MB</p>
      </div>
      <button
        type="button" onClick={open}
        className="mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-sidebar-accent px-3 py-1.5 text-[11px] font-medium text-sidebar-foreground/70 shadow-sm transition-all duration-200 ease-premium hover:-translate-y-0.5 hover:border-primary/30 hover:text-sidebar-foreground/90 hover:shadow-md active:translate-y-0"
      >
        <UploadIcon className="size-3.5" />Browse files
      </button>
    </div>
  );
}
