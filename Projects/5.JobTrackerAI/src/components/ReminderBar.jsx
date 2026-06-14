import { useMemo } from "react";
import { useJobStore } from "../store/useJobStore";
import { Clock, AlertCircle } from "lucide-react";
import { isFollowUpDue, isFollowUpOverdue, daysSince } from "../utils/helpers";

export default function ReminderBar({ onView }) {
  const jobs = useJobStore((s) => s.jobs).filter((j) => !j.archived && !j.deleted);
  const updateJob = useJobStore((s) => s.updateJob);

  const reminders = useMemo(() => {
    return jobs
      .filter((j) => j.followUpDate)
      .sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate))
      .slice(0, 10);
  }, [jobs]);

  if (reminders.length === 0) return null;

  const overdue = reminders.filter((j) => isFollowUpOverdue(j.followUpDate));

  return (
    <div className="mx-auto max-w-[1800px] px-4 pt-2 sm:px-6">
      <div className="flex items-center gap-2 overflow-x-auto rounded-lg border border-amber-200/60 bg-amber-50/80 px-4 py-2 dark:border-amber-800/40 dark:bg-amber-500/5">
        {overdue.length > 0 && (
          <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <AlertCircle className="h-4 w-4" />
            {overdue.length} overdue
          </span>
        )}
        <div className="flex gap-2 overflow-x-auto">
          {reminders.map((j) => (
            <span
              key={j.id}
              className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition hover:bg-white dark:hover:bg-zinc-800 ${
                isFollowUpOverdue(j.followUpDate)
                  ? "text-rose-700 dark:text-rose-300"
                  : isFollowUpDue(j.followUpDate)
                    ? "text-amber-700 dark:text-amber-300"
                    : "text-zinc-600 dark:text-zinc-400"
              }`}
              onClick={() => onView(j)}
            >
              <Clock className="h-3 w-3 shrink-0" />
              <span className="whitespace-nowrap">
                {j.companyName} · {j.followUpDate}
              </span>
            </span>
          ))}
        </div>
        <span className="ml-auto shrink-0 text-xs text-zinc-400 dark:text-zinc-500">
          {reminders.length} reminders
        </span>
      </div>
    </div>
  );
}
