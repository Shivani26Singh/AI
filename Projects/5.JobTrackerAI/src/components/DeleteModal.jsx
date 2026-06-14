import { useState } from "react";

export default function DeleteModal({ job, onCancel, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    await onConfirm();
    setDeleting(false);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-zinc-950/35 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Delete confirmation">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-soft dark:bg-zinc-950">
        <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">Move to Trash</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
          Move <strong>{job.companyName}</strong> - {job.role} to trash? You can restore it anytime from the trash view.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button className="h-10 rounded-md border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900" onClick={onCancel}>Cancel</button>
          <button className="h-10 rounded-md bg-rose-600 px-4 text-sm font-medium text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60" disabled={deleting} onClick={handleConfirm}>{deleting ? "Moving…" : "Move to Trash"}</button>
        </div>
      </div>
    </div>
  );
}
