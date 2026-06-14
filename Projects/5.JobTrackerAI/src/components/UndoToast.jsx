import { useMemo } from "react";
import { useJobStore } from "../store/useJobStore";
import { RotateCcw, X } from "lucide-react";

export default function UndoToast() {
  const lastDeletedJob = useJobStore((s) => s.lastDeletedJob);
  const undoDelete = useJobStore((s) => s.undoDelete);
  const dismissUndo = useJobStore((s) => s.dismissUndo);

  if (!lastDeletedJob) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 shadow-soft dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-3">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          Moved <strong>{lastDeletedJob.companyName}</strong> to trash
        </span>
        <button
          className="flex items-center gap-1 rounded-md bg-zinc-950 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          onClick={undoDelete}
        >
          <RotateCcw className="h-3 w-3" /> Undo
        </button>
        <button className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300" onClick={dismissUndo}>
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
