import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { useState, useMemo } from "react";
import { useJobStore } from "../store/useJobStore";
import { STATUS_COLUMNS } from "../constants";
import { isFollowUpOverdue, isFollowUpToday, isFollowUpThisWeek, isFollowUpThisMonth } from "../utils/helpers";
import JobColumn from "./JobColumn";
import JobCard from "./JobCard";

export default function KanbanBoard({ onAdd, onEdit, onDelete, onView, onArchive }) {
  const jobs = useJobStore((s) => s.jobs);
  const query = useJobStore((s) => s.query);
  const sortDirection = useJobStore((s) => s.sortDirection);
  const filterStatus = useJobStore((s) => s.filterStatus);
  const filterPriority = useJobStore((s) => s.filterPriority);
  const filterResume = useJobStore((s) => s.filterResume);
  const filterFollowUp = useJobStore((s) => s.filterFollowUp);
  const updateJobStatus = useJobStore((s) => s.updateJobStatus);

  const [activeJob, setActiveJob] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const filteredJobs = useMemo(() => {
    let result = jobs.filter((j) => !j.archived && !j.deleted);
    if (filterStatus !== "all") result = result.filter((j) => j.status === filterStatus);
    if (filterPriority !== "all") result = result.filter((j) => j.priority === filterPriority);
    if (filterResume !== "all") result = result.filter((j) => j.resumeUsed === filterResume);
    if (filterFollowUp !== "all") {
      switch (filterFollowUp) {
        case "overdue": result = result.filter((j) => isFollowUpOverdue(j.followUpDate)); break;
        case "due-today": result = result.filter((j) => isFollowUpToday(j.followUpDate)); break;
        case "this-week": result = result.filter((j) => isFollowUpThisWeek(j.followUpDate)); break;
        case "this-month": result = result.filter((j) => isFollowUpThisMonth(j.followUpDate)); break;
      }
    }
    const needle = query.trim().toLowerCase();
    if (needle) result = result.filter((j) => [j.companyName, j.role].some((v) => v.toLowerCase().includes(needle)));
    return result;
  }, [jobs, query, filterStatus, filterPriority, filterResume, filterFollowUp]);

  const jobsByStatus = useMemo(() => {
    const grouped = Object.fromEntries(STATUS_COLUMNS.map((c) => [c.id, []]));
    for (const job of filteredJobs) {
      const status = grouped[job.status] ? job.status : "wishlist";
      grouped[status].push(job);
    }
    for (const col of STATUS_COLUMNS) {
      grouped[col.id].sort((a, b) => {
        switch (sortDirection) {
          case "oldest": return new Date(a.appliedDate) - new Date(b.appliedDate);
          case "company-asc": return a.companyName.localeCompare(b.companyName);
          case "company-desc": return b.companyName.localeCompare(a.companyName);
          default: return new Date(b.appliedDate) - new Date(a.appliedDate);
        }
      });
    }
    return grouped;
  }, [filteredJobs, sortDirection]);

  const dragStart = ({ active }) => {
    const job = jobs.find((j) => j.id === active.id);
    setActiveJob(job || null);
  };

  const dragEnd = async ({ active, over }) => {
    setActiveJob(null);
    if (!over) return;
    const validStatus = STATUS_COLUMNS.find((c) => c.id === over.id);
    if (!validStatus) return;
    const job = jobs.find((j) => j.id === active.id);
    if (!job || job.status === over.id) return;
    await updateJobStatus(active.id, over.id);
  };

  return (
    <DndContext sensors={sensors} onDragStart={dragStart} onDragEnd={dragEnd} onDragCancel={() => setActiveJob(null)}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUS_COLUMNS.map((col) => (
          <JobColumn key={col.id} column={col} jobs={jobsByStatus[col.id]} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} onView={onView} onArchive={onArchive} />
        ))}
      </div>
      <DragOverlay>
        {activeJob ? (
          <div className="w-80">
            <JobCard job={activeJob} onEdit={() => {}} onDelete={() => {}} onView={() => {}} onArchive={() => {}} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
