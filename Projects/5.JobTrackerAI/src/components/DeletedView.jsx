import { useMemo, useState } from "react";
import { useJobStore } from "../store/useJobStore";
import { RotateCcw, Trash2, Trash2Icon } from "lucide-react";
import { daysSince } from "../utils/helpers";
import { PRIORITY_BY_ID, STATUS_BY_ID } from "../constants";

export default function DeletedView() {
  const jobs = useJobStore((s) => s.jobs);
  const restoreDeleted = useJobStore((s) => s.restoreDeleted);
  const permanentlyDelete = useJobStore((s) => s.permanentlyDelete);
  const [deletingId, setDeletingId] = useState(null);

  const deletedJobs = useMemo(() => jobs.filter((j) => j.deleted), [jobs]);

  const handlePermanentDelete = async (id) => {
    setDeletingId(id);
    await permanentlyDelete(id);
    setDeletingId(null);
  };

  if (deletedJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-zinc-400 dark:text-zinc-500">
        <Trash2Icon className="mb-3 h-12 w-12" />
        <p className="text-sm">Trash is empty</p>
        <p className="mt-1 text-xs">Deleted jobs will appear here</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {deletedJobs.map((job) => {
        const status = STATUS_BY_ID[job.status] || STATUS_BY_ID.wishlist;
        return (
          <div key={job.id} className="rounded-lg border border-zinc-200 bg-white p-4 transition dark:border-zinc-800 dark:bg-zinc-950">
            <h3 className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">{job.companyName}</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">{job.role}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {job.resumeUsed && (
                <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">{job.resumeUsed}</span>
              )}
              <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">{daysSince(job.appliedDate)}</span>
              <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 capitalize">{job.status}</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <button
                className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
                onClick={() => restoreDeleted(job.id)}
              >
                <RotateCcw className="h-3.5 w-3.5" /> Restore
              </button>
              <button
                className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 disabled:opacity-50"
                disabled={deletingId === job.id}
                onClick={() => handlePermanentDelete(job.id)}
              >
                <Trash2 className="h-3.5 w-3.5" /> {deletingId === job.id ? "Deleting…" : "Delete Forever"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
