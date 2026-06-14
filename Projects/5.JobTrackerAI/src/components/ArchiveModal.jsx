import { useState } from "react";

export default function ArchiveModal({ job, onCancel, onConfirm }) {
  const [archiving, setArchiving] = useState(false);

  const handleConfirm = async () => {
    setArchiving(true);
    await onConfirm();
    setArchiving(false);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-zinc-950/35 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Archive confirmation">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-soft dark:bg-zinc-950">
        <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">Archive Job</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
          Archive <strong>{job.companyName}</strong> — {job.role}? It will be hidden from the board but can be restored anytime.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button className="h-10 rounded-md border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900" onClick={onCancel}>Cancel</button>
          <button className="h-10 rounded-md bg-zinc-800 px-4 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200" disabled={archiving} onClick={handleConfirm}>{archiving ? "Archiving…" : "Archive"}</button>
        </div>
      </div>
    </div>
  );
}
