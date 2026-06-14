import { Search, Filter, Download, Upload, FileSpreadsheet, X } from "lucide-react";
import { useJobStore } from "../store/useJobStore";
import { PRIORITY_LEVELS, SORT_OPTIONS, STATUS_COLUMNS, FOLLOW_UP_FILTERS } from "../constants";
import { useMemo } from "react";

export default function FilterBar({ onExportJSON, onExportCSV, onImport, resumeOptions }) {
  const query = useJobStore((s) => s.query);
  const setQuery = useJobStore((s) => s.setQuery);
  const sortDirection = useJobStore((s) => s.sortDirection);
  const setSortDirection = useJobStore((s) => s.setSortDirection);
  const filterStatus = useJobStore((s) => s.filterStatus);
  const setFilterStatus = useJobStore((s) => s.setFilterStatus);
  const filterPriority = useJobStore((s) => s.filterPriority);
  const setFilterPriority = useJobStore((s) => s.setFilterPriority);
  const filterResume = useJobStore((s) => s.filterResume);
  const setFilterResume = useJobStore((s) => s.setFilterResume);
  const filterFollowUp = useJobStore((s) => s.filterFollowUp);
  const setFilterFollowUp = useJobStore((s) => s.setFilterFollowUp);

  const hasActiveFilters = filterStatus !== "all" || filterPriority !== "all" || filterResume !== "all" || filterFollowUp !== "all";

  const clearFilters = () => {
    setFilterStatus("all");
    setFilterPriority("all");
    setFilterResume("all");
    setFilterFollowUp("all");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="relative flex-1" style={{ minWidth: 200 }}>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          className="h-10 w-full rounded-md border border-zinc-200 bg-white pl-10 pr-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
          placeholder="Search company or role — press /"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      <select className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50" value={sortDirection} onChange={(e) => setSortDirection(e.target.value)} aria-label="Sort">
        {SORT_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
      </select>

      <select className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} aria-label="Filter by status">
        <option value="all">All Status</option>
        {STATUS_COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
      </select>

      <select className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} aria-label="Filter by priority">
        <option value="all">All Priority</option>
        {PRIORITY_LEVELS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
      </select>

      <select className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50" value={filterResume} onChange={(e) => setFilterResume(e.target.value)} aria-label="Filter by resume">
        <option value="all">All Resumes</option>
        {resumeOptions.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>

      <select className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50" value={filterFollowUp} onChange={(e) => setFilterFollowUp(e.target.value)} aria-label="Filter by follow-up">
        {FOLLOW_UP_FILTERS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}
      </select>

      {hasActiveFilters && (
        <button className="flex h-10 items-center gap-1 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800" onClick={clearFilters}>
          <X className="h-4 w-4" />
          Clear
        </button>
      )}

      <div className="flex items-center gap-1">
        <button className="flex h-10 items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800" onClick={onExportJSON} title="Export JSON">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">JSON</span>
        </button>
        <button className="flex h-10 items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800" onClick={onExportCSV} title="Export CSV">
          <FileSpreadsheet className="h-4 w-4" />
          <span className="hidden sm:inline">CSV</span>
        </button>
        <button className="flex h-10 items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800" onClick={onImport} title="Import JSON">
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Import</span>
        </button>
      </div>
    </div>
  );
}
