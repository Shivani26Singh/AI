export const makeId = () => {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return `job_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export const dateToTime = (value) => {
  const t = new Date(value).getTime();
  return Number.isFinite(t) ? t : 0;
};

export const daysSince = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "No date";
  const today = new Date();
  const diff = Math.floor((new Date(today.getFullYear(), today.getMonth(), today.getDate()) - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 86_400_000);
  if (diff < 0) return "Future";
  if (diff === 0) return "Today";
  if (diff === 1) return "1 day";
  return `${diff} days`;
};

export const isValidUrl = (value) => {
  if (!value.trim()) return true;
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
};

export const isFollowUpDue = (followUpDate) => {
  if (!followUpDate) return false;
  const due = new Date(followUpDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return due <= today;
};

export const isFollowUpOverdue = (followUpDate) => {
  if (!followUpDate) return false;
  const due = new Date(followUpDate);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return due < today;
};

export const isFollowUpToday = (followUpDate) => {
  if (!followUpDate) return false;
  return followUpDate === new Date().toISOString().slice(0, 10);
};

export const isFollowUpThisWeek = (followUpDate) => {
  if (!followUpDate) return false;
  const due = new Date(followUpDate);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
  return due >= today && due <= endOfWeek;
};

export const isFollowUpThisMonth = (followUpDate) => {
  if (!followUpDate) return false;
  const due = new Date(followUpDate);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return due >= today && due <= endOfMonth;
};

export const getJobStats = (jobs) => {
  const total = jobs.length;
  const applied = jobs.filter((j) => j.status === "applied").length;
  const interviews = jobs.filter((j) => j.status === "interview").length;
  const offers = jobs.filter((j) => j.status === "offer").length;
  const rejected = jobs.filter((j) => j.status === "rejected").length;
  const conversionRate = applied > 0 ? Math.round((offers / applied) * 100) : 0;

  const resumeCounts = {};
  jobs.forEach((j) => {
    if (j.resumeUsed) {
      resumeCounts[j.resumeUsed] = (resumeCounts[j.resumeUsed] || 0) + 1;
    }
  });

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const jobsThisWeek = jobs.filter((j) => new Date(j.createdAt) >= weekAgo).length;

  return { total, applied, interviews, offers, rejected, conversionRate, resumeCounts, jobsThisWeek };
};

export const normalizeImportedJobs = (items) =>
  items
    .filter((item) => item && String(item.companyName || item.company || "").trim() && String(item.role || "").trim())
    .map((item) => ({
      id: item.id || makeId(),
      companyName: String(item.companyName || item.company || "").trim(),
      role: String(item.role || "").trim(),
      jobUrl: String(item.jobUrl || item.linkedinUrl || "").trim(),
      resumeUsed: String(item.resumeUsed || item.resume || "").trim(),
      resumeFileName: String(item.resumeFileName || "").trim(),
      resumeFile: String(item.resumeFile || ""),
      appliedDate: item.appliedDate || item.dateApplied || new Date().toISOString().slice(0, 10),
      salaryRange: String(item.salaryRange || item.salary || "").trim(),
      notes: String(item.notes || "").trim(),
      status: item.status || "wishlist",
      priority: item.priority || "medium",
      followUpDate: item.followUpDate || "",
      archived: item.archived || false,
      deleted: item.deleted || false,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString(),
      activityLog: item.activityLog || [],
    }));

export const exportCSV = (jobs) => {
  const headers = ["Company", "Role", "Status", "Priority", "Job URL", "Resume", "Applied Date", "Salary", "Follow-up Date", "Notes", "Created At"];
  const rows = jobs.map((j) => [
    j.companyName, j.role, j.status, j.priority, j.jobUrl,
    j.resumeUsed, j.appliedDate, j.salaryRange, j.followUpDate, j.notes, j.createdAt,
  ]);
  const csv = [headers, ...rows].map((row) => row.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  return csv;
};

export const detectDuplicate = (jobs, jobUrl) => {
  if (!jobUrl?.trim()) return null;
  return jobs.find((j) => (j.jobUrl || j.linkedinUrl)?.trim() === jobUrl.trim()) || null;
};
