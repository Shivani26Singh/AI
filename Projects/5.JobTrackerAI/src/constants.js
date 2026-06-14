export const PRIORITY_LEVELS = [
  { id: "low", label: "Low", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  { id: "medium", label: "Medium", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  { id: "high", label: "High", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
  { id: "critical", label: "Critical", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
];

export const PRIORITY_BY_ID = Object.fromEntries(PRIORITY_LEVELS.map((p) => [p.id, p]));

export const STATUS_COLUMNS = [
  {
    id: "wishlist",
    title: "Wishlist",
    accent: "border-l-amber-500",
    badge: "bg-amber-500 text-white dark:bg-amber-500 dark:text-white",
    drop: "bg-amber-100/80 dark:bg-amber-500/15",
    icon: "Star",
    cardBg: "bg-amber-50 border-amber-300 dark:bg-amber-950/40 dark:border-amber-600/30",
    cardTop: "bg-amber-500",
    bgLight: "bg-amber-100 dark:bg-amber-900/30",
    textColor: "text-amber-800 dark:text-amber-200",
  },
  {
    id: "applied",
    title: "Applied",
    accent: "border-l-sky-500",
    badge: "bg-sky-500 text-white dark:bg-sky-500 dark:text-white",
    drop: "bg-sky-100/80 dark:bg-sky-500/15",
    icon: "Send",
    cardBg: "bg-sky-50 border-sky-300 dark:bg-sky-950/40 dark:border-sky-600/30",
    cardTop: "bg-sky-500",
    bgLight: "bg-sky-100 dark:bg-sky-900/30",
    textColor: "text-sky-800 dark:text-sky-200",
  },
  {
    id: "follow-up",
    title: "Follow-up",
    accent: "border-l-yellow-500",
    badge: "bg-yellow-500 text-white dark:bg-yellow-500 dark:text-white",
    drop: "bg-yellow-100/80 dark:bg-yellow-500/15",
    icon: "Phone",
    cardBg: "bg-yellow-50 border-yellow-300 dark:bg-yellow-950/40 dark:border-yellow-600/30",
    cardTop: "bg-yellow-500",
    bgLight: "bg-yellow-100 dark:bg-yellow-900/30",
    textColor: "text-yellow-800 dark:text-yellow-200",
  },
  {
    id: "interview",
    title: "Interview",
    accent: "border-l-indigo-500",
    badge: "bg-indigo-500 text-white dark:bg-indigo-500 dark:text-white",
    drop: "bg-indigo-100/80 dark:bg-indigo-500/15",
    icon: "Users",
    cardBg: "bg-indigo-50 border-indigo-300 dark:bg-indigo-950/40 dark:border-indigo-600/30",
    cardTop: "bg-indigo-500",
    bgLight: "bg-indigo-100 dark:bg-indigo-900/30",
    textColor: "text-indigo-800 dark:text-indigo-200",
  },
  {
    id: "offer",
    title: "Offer",
    accent: "border-l-emerald-500",
    badge: "bg-emerald-500 text-white dark:bg-emerald-500 dark:text-white",
    drop: "bg-emerald-100/80 dark:bg-emerald-500/15",
    icon: "Trophy",
    cardBg: "bg-emerald-50 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-600/30",
    cardTop: "bg-emerald-500",
    bgLight: "bg-emerald-100 dark:bg-emerald-900/30",
    textColor: "text-emerald-800 dark:text-emerald-200",
  },
  {
    id: "rejected",
    title: "Rejected",
    accent: "border-l-rose-500",
    badge: "bg-rose-500 text-white dark:bg-rose-500 dark:text-white",
    drop: "bg-rose-100/80 dark:bg-rose-500/15",
    icon: "XCircle",
    cardBg: "bg-rose-50 border-rose-300 dark:bg-rose-950/40 dark:border-rose-600/30",
    cardTop: "bg-rose-500",
    bgLight: "bg-rose-100 dark:bg-rose-900/30",
    textColor: "text-rose-800 dark:text-rose-200",
  },
];

export const STATUS_BY_ID = Object.fromEntries(STATUS_COLUMNS.map((c) => [c.id, c]));

export const SORT_OPTIONS = [
  { id: "newest", label: "Newest first" },
  { id: "oldest", label: "Oldest first" },
  { id: "company-asc", label: "Company A-Z" },
  { id: "company-desc", label: "Company Z-A" },
];

export const FOLLOW_UP_FILTERS = [
  { id: "all", label: "All Follow-ups" },
  { id: "overdue", label: "Overdue" },
  { id: "due-today", label: "Due Today" },
  { id: "this-week", label: "This Week" },
  { id: "this-month", label: "This Month" },
];

export const todayInputValue = () => new Date().toISOString().slice(0, 10);

export const nowISO = () => new Date().toISOString();

export const blankJobForm = (status = "wishlist") => ({
  companyName: "",
  role: "",
  jobUrl: "",
  resumeUsed: "",
  resumeFileName: "",
  resumeFile: "",
  appliedDate: todayInputValue(),
  salaryRange: "",
  notes: "",
  status,
  priority: "medium",
  followUpDate: "",
  archived: false,
  deleted: false,
});

export const ACTIVITY_TYPES = {
  CREATED: "created",
  EDITED: "edited",
  STATUS_CHANGE: "status_change",
  NOTES_UPDATE: "notes_update",
  RESUME_CHANGE: "resume_change",
  PRIORITY_CHANGE: "priority_change",
  ARCHIVED: "archived",
  RESTORED: "restored",
  DELETED: "deleted",
};

export const KEYBOARD_SHORTCUTS = {
  ADD_JOB: "n",
  SEARCH: "/",
  TOGGLE_DASHBOARD: "d",
  TOGGLE_DARK_MODE: "t",
  ESCAPE: "Escape",
};
