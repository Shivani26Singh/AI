import { useMemo } from "react";
import { useJobStore } from "../store/useJobStore";
import { RotateCcw, Archive as ArchiveIcon } from "lucide-react";
import { daysSince, isFollowUpDue } from "../utils/helpers";
import { PRIORITY_BY_ID } from "../constants";

export default function ArchivedView() {
  const jobs = useJobStore((s) => s.jobs);
  const updateJob = useJobStore((s) => s.updateJob);

  const archivedJobs = useMemo(() => jobs.filter((j) => j.archived), [jobs]);

  if (archivedJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-zinc-400 dark:text-zinc-500">
        <ArchiveIcon className="mb-3 h-12 w-12" />
        <p className="text-sm">No archived jobs</p>
        <p className="mt-1 text-xs">Archived jobs will appear here</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {archivedJobs.map((job) => (
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
          <button
            className="mt-3 flex items-center gap-1.5 text-xs font-medium text-zinc-500 transition hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400"
            onClick={() => updateJob(job.id, { archived: false })}
          >
            <RotateCcw className="h-3.5 w-3.5" /> Restore
          </button>
        </div>
      ))}
    </div>
  );
}
