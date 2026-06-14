import { Plus } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import JobCard from "./JobCard";

export default function JobColumn({ column, jobs, onAdd, onEdit, onDelete, onView, onArchive, isArchived = false }) {
  const { isOver, setNodeRef } = useDroppable({ id: column.id, disabled: isArchived });

  return (
    <section
      ref={setNodeRef}
      className={`flex h-[calc(100vh-250px)] min-h-[30rem] w-80 shrink-0 flex-col rounded-lg border border-zinc-200 bg-white transition dark:border-zinc-800 dark:bg-zinc-900 ${
        isOver ? column.drop : ""
      }`}
      role="region"
      aria-label={column.title}
    >
      <div className="shrink-0 rounded-t-lg overflow-hidden">
        <div className={`h-1.5 w-full ${column.cardTop}`} />
        <div className="flex h-12 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="truncate text-sm font-bold text-zinc-900 dark:text-zinc-50">{column.title}</h2>
            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${column.badge}`}>{jobs.length}</span>
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            aria-label={`Add job to ${column.title}`}
            title={`Add job to ${column.title}`}
            onClick={() => onAdd(column.id)}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3" role="list">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <JobCard key={job.id} job={job} onEdit={onEdit} onDelete={onDelete} onView={onView} onArchive={onArchive} isArchived={isArchived} />
          ))
        ) : (
          <div className="flex h-24 items-center justify-center rounded-md border border-dashed border-zinc-200 text-sm text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
            No cards
          </div>
        )}
      </div>
    </section>
  );
}
