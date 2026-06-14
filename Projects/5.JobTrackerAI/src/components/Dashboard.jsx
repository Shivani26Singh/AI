import { useMemo } from "react";
import { useJobStore } from "../store/useJobStore";
import { getJobStats } from "../utils/helpers";
import { TrendingUp, Briefcase, Users, Trophy, XCircle, FileText, CalendarCheck, Activity } from "lucide-react";

export default function Dashboard() {
  const jobs = useJobStore((s) => s.jobs).filter((j) => !j.archived && !j.deleted);
  const stats = useMemo(() => getJobStats(jobs), [jobs]);

  const cards = [
    { label: "Total Jobs", value: stats.total, icon: Briefcase, color: "text-sky-600 bg-sky-50 dark:bg-sky-500/10 dark:text-sky-400" },
    { label: "Applied", value: stats.applied, icon: FileText, color: "text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400" },
    { label: "Interviews", value: stats.interviews, icon: Users, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400" },
    { label: "Offers", value: stats.offers, icon: Trophy, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400" },
    { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400" },
    { label: "Conv. Rate", value: `${stats.conversionRate}%`, icon: TrendingUp, color: "text-violet-600 bg-violet-50 dark:bg-violet-500/10 dark:text-violet-400" },
    { label: "This Week", value: stats.jobsThisWeek, icon: CalendarCheck, color: "text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400" },
    { label: "Activity", value: countActivities(jobs), icon: Activity, color: "text-pink-600 bg-pink-50 dark:bg-pink-500/10 dark:text-pink-400" },
  ];

  const topResumes = useMemo(
    () => Object.entries(stats.resumeCounts).sort((a, b) => b[1] - a[1]).slice(0, 5),
    [stats.resumeCounts],
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {cards.map((c) => (
          <div key={c.label} className="flex flex-col gap-1 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${c.color}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold text-zinc-950 dark:text-zinc-50">{c.value}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{c.label}</span>
          </div>
        ))}
      </div>

      {topResumes.length > 0 && (
        <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-3 text-sm font-semibold text-zinc-950 dark:text-zinc-50">Resume Performance</h3>
          <div className="space-y-2">
            {topResumes.map(([name, count]) => {
              const pct = Math.round((count / stats.total) * 100);
              return (
                <div key={name} className="flex items-center gap-3">
                  <span className="w-28 truncate text-sm text-zinc-600 dark:text-zinc-400">{name}</span>
                  <div className="flex-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div className="h-2 rounded-full bg-sky-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-10 text-right text-sm font-medium text-zinc-700 dark:text-zinc-300">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function countActivities(jobs) {
  return jobs.reduce((sum, j) => sum + (j.activityLog?.length || 0), 0);
}
