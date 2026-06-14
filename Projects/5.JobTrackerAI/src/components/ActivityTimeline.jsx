import { useMemo } from "react";
import { useJobStore } from "../store/useJobStore";
import { Clock, Edit3, ArrowRight, FileText, Tag, RotateCcw, Archive as ArchiveIcon, Trash2 } from "lucide-react";
import { ACTIVITY_TYPES } from "../constants";

const iconMap = {
  [ACTIVITY_TYPES.CREATED]: FileText,
  [ACTIVITY_TYPES.EDITED]: Edit3,
  [ACTIVITY_TYPES.STATUS_CHANGE]: ArrowRight,
  [ACTIVITY_TYPES.NOTES_UPDATE]: Edit3,
  [ACTIVITY_TYPES.RESUME_CHANGE]: Tag,
  [ACTIVITY_TYPES.PRIORITY_CHANGE]: Tag,
  [ACTIVITY_TYPES.ARCHIVED]: ArchiveIcon,
  [ACTIVITY_TYPES.RESTORED]: RotateCcw,
  [ACTIVITY_TYPES.DELETED]: Trash2,
};

const labelMap = {
  [ACTIVITY_TYPES.CREATED]: "Created",
  [ACTIVITY_TYPES.EDITED]: "Edited",
  [ACTIVITY_TYPES.STATUS_CHANGE]: "Status",
  [ACTIVITY_TYPES.NOTES_UPDATE]: "Notes",
  [ACTIVITY_TYPES.RESUME_CHANGE]: "Resume",
  [ACTIVITY_TYPES.PRIORITY_CHANGE]: "Priority",
  [ACTIVITY_TYPES.ARCHIVED]: "Archived",
  [ACTIVITY_TYPES.RESTORED]: "Restored",
  [ACTIVITY_TYPES.DELETED]: "Deleted",
};

export default function ActivityTimeline({ job }) {
  const log = (job?.activityLog || []).slice().reverse().slice(0, 20);

  if (log.length === 0) return null;

  return (
    <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        Activity
      </h4>
      <div className="space-y-1.5">
        {log.map((entry, i) => {
          const Icon = iconMap[entry.type] || Clock;
          const label = labelMap[entry.type] || entry.type;
          return (
            <div key={i} className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <Icon className="h-3 w-3 shrink-0" />
              <span className="font-medium">{label}</span>
              <span className="text-zinc-300 dark:text-zinc-600">·</span>
              <span className="truncate">{entry.detail}</span>
              <span className="ml-auto shrink-0 text-zinc-400 dark:text-zinc-500">
                {new Date(entry.timestamp).toLocaleDateString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
