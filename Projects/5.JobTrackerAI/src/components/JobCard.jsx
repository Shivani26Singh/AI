import { GripVertical, ExternalLink, Pencil, Trash2, Calendar, Archive, RotateCcw } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { PRIORITY_BY_ID, STATUS_BY_ID } from "../constants";
import { daysSince, isFollowUpOverdue, isFollowUpToday } from "../utils/helpers";

export default function JobCard({ job, onEdit, onDelete, onView, onArchive, isArchived = false }) {
  const { attributes, isDragging, listeners, setNodeRef, transform } = useDraggable({
    id: job.id,
    data: { job },
    disabled: isArchived,
  });

  const priority = PRIORITY_BY_ID[job.priority] || PRIORITY_BY_ID.medium;
  const status = STATUS_BY_ID[job.status] || STATUS_BY_ID.wishlist;
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
  const jobUrl = job.jobUrl || job.linkedinUrl || "";

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`touch-none ${isDragging ? "opacity-40" : ""}`}
      {...attributes}
      {...listeners}
    >
      <div
        className={`rounded-lg border-2 shadow-sm transition overflow-hidden cursor-pointer ${
          isArchived
            ? "border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900"
            : `${status.accent} ${status.cardBg}`
        } ${isDragging ? "" : "hover:scale-[1.02] hover:shadow-md"}`}
        onClick={() => onView(job)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter") onView(job); }}
      >
        {/* Colored header bar */}
        <div className={`flex items-center gap-2 px-4 py-2 ${isArchived ? "bg-zinc-200 dark:bg-zinc-800" : status.bgLight}`}>
          <span className={`text-xs font-semibold uppercase tracking-wider ${isArchived ? "text-zinc-500 dark:text-zinc-400" : status.textColor}`}>
            {isArchived ? "ARCHIVED" : status.title}
          </span>
          <span className="ml-auto">
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${priority.color}`}>
              {priority.label}
            </span>
          </span>
        </div>

        <div className="p-4">
          <div className="flex items-start gap-2">
            <div
              className="mt-0.5 h-4 w-4 shrink-0 cursor-grab text-zinc-300 active:cursor-grabbing dark:text-zinc-600"
              title="Drag to move card"
              aria-label="Drag to move card"
              onClick={(e) => e.stopPropagation()}
            >
              <GripVertical className="h-4 w-4" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-bold text-zinc-950 dark:text-zinc-50" title={`${job.companyName} — ${job.role}`}>
                {job.companyName}
              </h3>
              <p className="mt-0.5 truncate text-sm font-medium text-zinc-600 dark:text-zinc-300" title={job.role}>
                {job.role}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {job.resumeUsed && (
                  <span className="rounded-md bg-white/70 px-2 py-0.5 text-xs font-medium text-zinc-700 shadow-sm dark:bg-zinc-800/70 dark:text-zinc-300" title={`Resume: ${job.resumeUsed}`}>
                    {job.resumeUsed}
                  </span>
                )}
                <span className="rounded-md bg-white/70 px-2 py-0.5 text-xs font-medium text-zinc-700 shadow-sm dark:bg-zinc-800/70 dark:text-zinc-300" title={`Applied: ${job.appliedDate}`}>
                  {daysSince(job.appliedDate)}
                </span>
                {job.salaryRange && (
                  <span className="rounded-md bg-white/70 px-2 py-0.5 text-xs font-medium text-zinc-700 shadow-sm dark:bg-zinc-800/70 dark:text-zinc-300" title={`Salary: ${job.salaryRange}`}>
                    {job.salaryRange}
                  </span>
                )}
                {job.followUpDate && (
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-bold shadow-sm ${
                      isFollowUpOverdue(job.followUpDate) ? "bg-red-500 text-white"
                        : isFollowUpToday(job.followUpDate) ? "bg-amber-500 text-white"
                        : "bg-white/70 text-zinc-700 dark:bg-zinc-800/70 dark:text-zinc-300"
                    }`}
                    title={isFollowUpOverdue(job.followUpDate) ? `Follow-up overdue (was ${job.followUpDate})` : isFollowUpToday(job.followUpDate) ? "Follow-up due today" : `Follow-up on ${job.followUpDate}`}
                  >
                    <Calendar className="mr-0.5 inline h-3 w-3" />
                    {isFollowUpOverdue(job.followUpDate) ? "OVERDUE" : isFollowUpToday(job.followUpDate) ? "DUE TODAY" : job.followUpDate}
                  </span>
                )}
              </div>

              {job.notes && (
                <p className="mt-2.5 line-clamp-2 break-words text-xs leading-5 text-zinc-500 dark:text-zinc-400" title={job.notes}>
                  {job.notes}
                </p>
              )}
            </div>

            {/* Action icons — stop propagation so clicking them doesn't open the detail modal */}
            <div className="flex shrink-0 flex-col gap-0.5" onClick={(e) => e.stopPropagation()}>
              {jobUrl && (
                <a
                  className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-white hover:text-blue-600 dark:hover:bg-zinc-800 dark:hover:text-blue-400"
                  href={jobUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="Open job posting — click to open in new tab"
                  aria-label="Open job posting"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
              <button
                className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-white hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                title="Edit job details"
                aria-label="Edit job details"
                onClick={() => onEdit(job)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              {isArchived ? (
                <button
                  className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
                  title="Restore from archive"
                  aria-label="Restore from archive"
                  onClick={() => onArchive(job)}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              ) : (
                <>
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-white hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                    title="Archive job (hide from board)"
                    aria-label="Archive job (hide from board)"
                    onClick={() => onArchive(job)}
                  >
                    <Archive className="h-3.5 w-3.5" />
                  </button>
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
                    title="Move to trash"
                    aria-label="Move to trash"
                    onClick={() => onDelete(job)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
