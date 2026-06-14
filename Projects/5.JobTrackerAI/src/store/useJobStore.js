import { create } from "zustand";
import { getAllJobs, saveJob, deleteJob, replaceJobs } from "../db";
import { seedIfEmpty } from "../utils/seedData";

export const useJobStore = create((set, get) => ({
  jobs: [],
  loading: true,
  query: "",
  sortDirection: "newest",
  filterStatus: "all",
  filterPriority: "all",
  filterResume: "all",
  filterFollowUp: "all",
  showArchived: false,
  showDashboard: false,
  showTrash: false,
  activeTab: "kanban",
  selectedJobIds: [],
  lastDeletedJob: null,

  loadJobs: async () => {
    try {
      await seedIfEmpty();
      const storedJobs = await getAllJobs();
      set({ jobs: storedJobs, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  addJob: async (jobData) => {
    const timestamp = new Date().toISOString();
    const newJob = {
      ...jobData,
      id: crypto.randomUUID?.() ?? `job_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      createdAt: timestamp,
      updatedAt: timestamp,
      activityLog: [{ type: "created", timestamp, detail: "Job created" }],
    };
    await saveJob(newJob);
    set((state) => ({ jobs: [newJob, ...state.jobs] }));
    return newJob;
  },

  updateJob: async (id, updates) => {
    const { jobs } = get();
    const job = jobs.find((j) => j.id === id);
    if (!job) return;

    const timestamp = new Date().toISOString();
    const activityEntry = buildActivityEntry(job, updates, timestamp);
    const activityLog = [...(job.activityLog || []), activityEntry].slice(-50);

    const updated = { ...job, ...updates, updatedAt: timestamp, activityLog };
    await saveJob(updated);
    set((state) => ({
      jobs: state.jobs.map((j) => (j.id === id ? updated : j)),
    }));
    return updated;
  },

  removeJob: async (id) => {
    const { jobs } = get();
    const job = jobs.find((j) => j.id === id);
    if (!job) return;
    const timestamp = new Date().toISOString();
    const activityLog = [...(job.activityLog || []), { type: "deleted", timestamp, detail: "Job moved to trash" }].slice(-50);
    const updated = { ...job, deleted: true, archived: false, updatedAt: timestamp, activityLog };
    await saveJob(updated);
    set((state) => ({
      jobs: state.jobs.map((j) => (j.id === id ? updated : j)),
      lastDeletedJob: job,
    }));
  },

  restoreDeleted: async (id) => {
    const { jobs } = get();
    const job = jobs.find((j) => j.id === id);
    if (!job) return;
    const timestamp = new Date().toISOString();
    const activityLog = [...(job.activityLog || []), { type: "restored", timestamp, detail: "Job restored from trash" }].slice(-50);
    const updated = { ...job, deleted: false, updatedAt: timestamp, activityLog };
    await saveJob(updated);
    set((state) => ({
      jobs: state.jobs.map((j) => (j.id === id ? updated : j)),
    }));
  },

  permanentlyDelete: async (id) => {
    await deleteJob(id);
    set((state) => ({
      jobs: state.jobs.filter((j) => j.id !== id),
      lastDeletedJob: null,
    }));
  },

  undoDelete: async () => {
    const { lastDeletedJob } = get();
    if (!lastDeletedJob) return;
    const timestamp = new Date().toISOString();
    const activityLog = [...(lastDeletedJob.activityLog || []), { type: "restored", timestamp, detail: "Undo delete" }].slice(-50);
    const restored = { ...lastDeletedJob, deleted: false, archived: false, updatedAt: timestamp, activityLog };
    await saveJob(restored);
    set((state) => ({
      jobs: state.jobs.map((j) => (j.id === restored.id ? restored : j)),
      lastDeletedJob: null,
    }));
  },

  updateJobStatus: async (id, status) => {
    return get().updateJob(id, { status });
  },

  exportJobs: () => {
    const { jobs } = get();
    const payload = { exportedAt: new Date().toISOString(), version: 1, jobs };
    return JSON.stringify(payload, null, 2);
  },

  importJobs: async (normalizedJobs, replace) => {
    if (replace) {
      await replaceJobs(normalizedJobs);
      set({ jobs: normalizedJobs });
    } else {
      for (const job of normalizedJobs) {
        await saveJob(job);
      }
      set((state) => ({ jobs: [...normalizedJobs, ...state.jobs] }));
    }
  },

  setQuery: (query) => set({ query }),
  setSortDirection: (sortDirection) => set({ sortDirection }),
  setFilterStatus: (filterStatus) => set({ filterStatus }),
  setFilterPriority: (filterPriority) => set({ filterPriority }),
  setFilterResume: (filterResume) => set({ filterResume }),
  setFilterFollowUp: (filterFollowUp) => set({ filterFollowUp }),
  setShowArchived: (showArchived) => set({ showArchived }),
  setShowDashboard: (showDashboard) => set({ showDashboard }),
  setShowTrash: (showTrash) => set({ showTrash }),
  setActiveTab: (activeTab) => set({ activeTab }),
  toggleSelectedJob: (id) =>
    set((state) => ({
      selectedJobIds: state.selectedJobIds.includes(id)
        ? state.selectedJobIds.filter((jid) => jid !== id)
        : [...state.selectedJobIds, id],
    })),
  clearSelection: () => set({ selectedJobIds: [] }),
  dismissUndo: () => set({ lastDeletedJob: null }),
}));

function buildActivityEntry(job, updates, timestamp) {
  if (updates.status && updates.status !== job.status) {
    return { type: "status_change", timestamp, detail: `Status changed to ${updates.status}` };
  }
  if (updates.notes && updates.notes !== job.notes) {
    return { type: "notes_update", timestamp, detail: "Notes updated" };
  }
  if (updates.resumeUsed && updates.resumeUsed !== job.resumeUsed) {
    return { type: "resume_change", timestamp, detail: `Resume changed to ${updates.resumeUsed}` };
  }
  if (updates.priority && updates.priority !== job.priority) {
    return { type: "priority_change", timestamp, detail: `Priority set to ${updates.priority}` };
  }
  if (updates.archived !== undefined && updates.archived !== job.archived) {
    return {
      type: updates.archived ? "archived" : "restored",
      timestamp,
      detail: updates.archived ? "Job archived" : "Job restored",
    };
  }
  return { type: "edited", timestamp, detail: "Job details updated" };
}
