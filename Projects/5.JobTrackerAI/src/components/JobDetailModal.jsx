import { X, ExternalLink, Calendar, Briefcase, Tag, Clock, FileText, DollarSign, Bell, Pencil, Trash2, Download } from "lucide-react";
import { PRIORITY_BY_ID, STATUS_BY_ID } from "../constants";
import { daysSince, isFollowUpOverdue, isFollowUpToday } from "../utils/helpers";
import ActivityTimeline from "./ActivityTimeline";

export default function JobDetailModal({ job, onClose, onEdit, onDelete }) {
  const priority = PRIORITY_BY_ID[job.priority] || PRIORITY_BY_ID.medium;
  const status = STATUS_BY_ID[job.status] || STATUS_BY_ID.wishlist;
  const jobUrl = job.jobUrl || job.linkedinUrl || "";

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-zinc-950/35 p-0 backdrop-blur-sm sm:p-4" role="dialog" aria-modal="true" aria-label="Job details">
      <div className="flex h-full w-full max-w-xl flex-col bg-white shadow-soft dark:bg-zinc-950 sm:rounded-lg">
        {/* Header */}
        <div className={`flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800 ${status.bgLight}`}>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={`${status.textColor} text-xs font-bold uppercase tracking-wider`}>{status.title}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${priority.color}`}>{priority.label}</span>
            </div>
            <h2 className="mt-1 truncate text-lg font-bold text-zinc-950 dark:text-zinc-50">{job.companyName}</h2>
            <p className="truncate text-sm font-medium text-zinc-600 dark:text-zinc-300">{job.role}</p>
          </div>
          <div className="flex items-center gap-1">
            <button className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition hover:bg-white hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300" title="Edit job" aria-label="Edit job" onClick={() => onEdit(job)}>
              <Pencil className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-300" title="Move to trash" aria-label="Move to trash" onClick={() => onDelete(job)}>
              <Trash2 className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-300" onClick={onClose} aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Details grid */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {jobUrl && (
              <DetailBlock icon={ExternalLink} label="Job posting URL" wide>
                <a href={jobUrl} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400 break-all">
                  {jobUrl}
                </a>
              </DetailBlock>
            )}
            <DetailBlock icon={Briefcase} label="Status">
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{status.title}</span>
            </DetailBlock>
            <DetailBlock icon={Tag} label="Priority">
              <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${priority.color}`}>{priority.label}</span>
            </DetailBlock>
            {job.resumeUsed && (
              <DetailBlock icon={FileText} label="Resume">
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{job.resumeUsed}</span>
              </DetailBlock>
            )}
            {job.resumeFileName && job.resumeFile && (
              <DetailBlock icon={Download} label="Resume file">
                <a
                  href={`data:application/octet-stream;base64,${job.resumeFile}`}
                  download={job.resumeFileName}
                  className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  <Download className="h-3.5 w-3.5" />
                  {job.resumeFileName}
                </a>
              </DetailBlock>
            )}
            <DetailBlock icon={Calendar} label="Date applied">
              <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{job.appliedDate} ({daysSince(job.appliedDate)})</span>
            </DetailBlock>
            {job.salaryRange && (
              <DetailBlock icon={DollarSign} label="Salary range">
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{job.salaryRange}</span>
              </DetailBlock>
            )}
            {job.followUpDate && (
              <DetailBlock icon={Bell} label="Follow-up">
                <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                  isFollowUpOverdue(job.followUpDate) ? "bg-red-500 text-white"
                    : isFollowUpToday(job.followUpDate) ? "bg-amber-500 text-white"
                    : "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                }`}>
                  {job.followUpDate}
                  {isFollowUpOverdue(job.followUpDate) ? " (OVERDUE)" : isFollowUpToday(job.followUpDate) ? " (DUE TODAY)" : ""}
                </span>
              </DetailBlock>
            )}
            {job.notes && (
              <DetailBlock icon={Clock} label="Notes" wide>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap">{job.notes}</p>
              </DetailBlock>
            )}
          </div>

          <ActivityTimeline job={job} />
        </div>
      </div>
    </div>
  );
}

function DetailBlock({ icon: Icon, label, children, wide }) {
  return (
    <div className={`${wide ? "sm:col-span-2" : ""}`}>
      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-zinc-400 dark:text-zinc-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}
