import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus, Archive as ArchiveIcon, Trash2 } from "lucide-react";
import { useJobStore } from "./store/useJobStore";
import { todayInputValue } from "./constants";
import { normalizeImportedJobs, exportCSV } from "./utils/helpers";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import Header from "./components/Header";
import FilterBar from "./components/FilterBar";
import KanbanBoard from "./components/KanbanBoard";
import Dashboard from "./components/Dashboard";
import ArchivedView from "./components/ArchivedView";
import DeletedView from "./components/DeletedView";
import JobFormModal from "./components/JobFormModal";
import JobDetailModal from "./components/JobDetailModal";
import DeleteModal from "./components/DeleteModal";
import ArchiveModal from "./components/ArchiveModal";
import ReminderBar from "./components/ReminderBar";
import UndoToast from "./components/UndoToast";
import { ErrorBoundary } from "./components/ErrorBoundary";

function App() {
  const loadJobs = useJobStore((s) => s.loadJobs);
  const jobs = useJobStore((s) => s.jobs);
  const removeJob = useJobStore((s) => s.removeJob);
  const updateJob = useJobStore((s) => s.updateJob);
  const exportJobs = useJobStore((s) => s.exportJobs);
  const importJobs = useJobStore((s) => s.importJobs);
  const activeTab = useJobStore((s) => s.activeTab);
  const setActiveTab = useJobStore((s) => s.setActiveTab);
  const showArchived = useJobStore((s) => s.showArchived);
  const setShowArchived = useJobStore((s) => s.setShowArchived);
  const showTrash = useJobStore((s) => s.showTrash);
  const setShowTrash = useJobStore((s) => s.setShowTrash);

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("job-tracker-theme");
    return saved || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  });
  const [modalState, setModalState] = useState({ open: false, job: null, status: "wishlist" });
  const [detailJob, setDetailJob] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [archiveTarget, setArchiveTarget] = useState(null);
  const [toast, setToast] = useState("");
  const importInputRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("job-tracker-theme", theme);
  }, [theme]);

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const resumeOptions = useMemo(() => {
    const names = jobs.map((j) => j.resumeUsed).filter(Boolean);
    return [...new Set(names)].sort((a, b) => a.localeCompare(b));
  }, [jobs]);

  const archivedCount = useMemo(() => jobs.filter((j) => j.archived).length, [jobs]);
  const activeCount = useMemo(() => jobs.filter((j) => !j.archived && !j.deleted).length, [jobs]);
  const deletedCount = useMemo(() => jobs.filter((j) => j.deleted).length, [jobs]);
  const totalLabel = `${activeCount} active ${activeCount === 1 ? "job" : "jobs"}`;

  const openCreate = useCallback((status = "wishlist") => setModalState({ open: true, job: null, status }), []);
  const openEdit = (job) => setModalState({ open: true, job, status: job.status });
  const openView = (job) => setDetailJob(job);
  const closeModal = () => setModalState({ open: false, job: null, status: "wishlist" });
  const closeView = () => setDetailJob(null);

  useKeyboardShortcuts({ onOpenAdd: () => openCreate() });

  const handleDelete = async (job) => {
    const wasDetailOpen = detailJob?.id === job.id;
    await removeJob(job.id);
    if (wasDetailOpen) setDetailJob(null);
    setDeleteTarget(null);
  };

  const handleArchive = async (job) => {
    await updateJob(job.id, { archived: true });
    if (detailJob?.id === job.id) setDetailJob(null);
    setArchiveTarget(null);
  };

  const handleExportJSON = () => {
    const json = exportJobs();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `job-tracker-ai-${todayInputValue()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const csv = exportCSV(jobs);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `job-tracker-ai-${todayInputValue()}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => importInputRef.current?.click();

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const rawJobs = Array.isArray(parsed) ? parsed : parsed.jobs;
      if (!Array.isArray(rawJobs)) throw new Error("Invalid backup");
      const normalized = normalizeImportedJobs(rawJobs);
      if (!normalized.length) throw new Error("No valid jobs");
      const shouldReplace = window.confirm(`Import ${normalized.length} jobs and replace current board?`);
      if (!shouldReplace) return;
      await importJobs(normalized, true);
      setToast("Backup imported");
    } catch (err) {
      setToast(err.message || "Import failed");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <Header theme={theme} setTheme={setTheme} activeTab={activeTab} setActiveTab={setActiveTab} />

      <ReminderBar onView={openView} />

      <div className="mx-auto max-w-[1800px] px-4 py-4 sm:px-6">
        {activeTab === "kanban" && !showArchived && !showTrash && (
          <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{totalLabel}</p>
                {archivedCount > 0 && (
                  <button
                    className="flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    onClick={() => setShowArchived(true)}
                  >
                    <ArchiveIcon className="h-3.5 w-3.5" /> {archivedCount} archived
                  </button>
                )}
                {deletedCount > 0 && (
                  <button
                    className="flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    onClick={() => setShowTrash(true)}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> {deletedCount} trashed
                  </button>
                )}
              </div>
              <button
                className="flex h-10 items-center gap-2 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                onClick={() => openCreate()}
              >
                <Plus className="h-4 w-4" /> Add Job
              </button>
            </div>
            <FilterBar onExportJSON={handleExportJSON} onExportCSV={handleExportCSV} onImport={handleImport} resumeOptions={resumeOptions} />
            <input ref={importInputRef} className="hidden" type="file" accept="application/json,.json" onChange={handleImportFile} />
            <div className="mt-4">
              <KanbanBoard onAdd={openCreate} onEdit={openEdit} onDelete={setDeleteTarget} onView={openView} onArchive={setArchiveTarget} />
            </div>
          </>
        )}

        {activeTab === "kanban" && showArchived && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">Archived Jobs</h2>
              <button
                className="h-10 rounded-md border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
                onClick={() => setShowArchived(false)}
              >
                Back to Board
              </button>
            </div>
            <ArchivedView />
          </>
        )}

        {activeTab === "dashboard" && <Dashboard />}

        {activeTab === "kanban" && showTrash && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">Trash</h2>
              <button
                className="h-10 rounded-md border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900"
                onClick={() => setShowTrash(false)}
              >
                Back to Board
              </button>
            </div>
            <DeletedView />
          </>
        )}
      </div>

      {modalState.open && (
        <JobFormModal job={modalState.job} status={modalState.status} onClose={closeModal} />
      )}

      {detailJob && !modalState.open && (
        <JobDetailModal job={detailJob} onClose={closeView} onEdit={openEdit} onDelete={setDeleteTarget} />
      )}

      {deleteTarget && (
        <DeleteModal job={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={() => handleDelete(deleteTarget)} />
      )}

      {archiveTarget && (
        <ArchiveModal job={archiveTarget} onCancel={() => setArchiveTarget(null)} onConfirm={() => handleArchive(archiveTarget)} />
      )}

      <UndoToast />

      {toast && (
        <div className="fixed bottom-16 left-1/2 z-50 -translate-x-1/2 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white shadow-soft dark:bg-white dark:text-zinc-950">
          {toast}
        </div>
      )}
    </div>
  );
}

export default function AppWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
