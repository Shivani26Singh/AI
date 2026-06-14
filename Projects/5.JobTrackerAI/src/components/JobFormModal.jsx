import { useState, useMemo, useRef } from "react";
import { X, AlertTriangle, Upload, FileText, Minimize2, Maximize2 } from "lucide-react";
import { blankJobForm, PRIORITY_LEVELS, STATUS_COLUMNS, todayInputValue } from "../constants";
import { isValidUrl, detectDuplicate } from "../utils/helpers";
import { useJobStore } from "../store/useJobStore";

const ACCEPTED_RESUME_TYPES = ".pdf,.doc,.docx";
const MAX_RESUME_SIZE = 2 * 1024 * 1024;

export default function JobFormModal({ job: initialJob, status: initialStatus, onClose }) {
  const jobs = useJobStore((s) => s.jobs);
  const addJob = useJobStore((s) => s.addJob);
  const updateJob = useJobStore((s) => s.updateJob);

  const [values, setValues] = useState(() =>
    initialJob
      ? { ...blankJobForm(), ...initialJob, jobUrl: initialJob.jobUrl || initialJob.linkedinUrl || "" }
      : blankJobForm(initialStatus || "wishlist")
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [resumeFileError, setResumeFileError] = useState("");
  const [minimized, setMinimized] = useState(false);
  const fileInputRef = useRef(null);

  const resumeOptions = useMemo(() => {
    const names = jobs.map((j) => j.resumeUsed).filter(Boolean);
    return [...new Set(names)].sort((a, b) => a.localeCompare(b));
  }, [jobs]);

  const isEdit = !!initialJob;

  const setField = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    if (field === "jobUrl") setDuplicateWarning(null);
  };

  const validate = () => {
    const e = {};
    if (!values.companyName.trim()) e.companyName = "Company name is required";
    if (!values.role.trim()) e.role = "Role is required";
    if (!isValidUrl(values.jobUrl)) e.jobUrl = "Enter a valid URL";
    if (!values.appliedDate) e.appliedDate = "Date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLinkedInBlur = () => {
    if (!isEdit && values.jobUrl.trim()) {
      const dup = detectDuplicate(jobs, values.jobUrl);
      if (dup) setDuplicateWarning(dup);
    }
  };

  const handleResumeFileChange = (e) => {
    const file = e.target.files?.[0];
    setResumeFileError("");
    if (!file) return;
    if (file.size > MAX_RESUME_SIZE) {
      setResumeFileError("File must be under 2 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setValues((prev) => ({
        ...prev,
        resumeFileName: file.name,
        resumeFile: reader.result.split(",")[1],
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeResumeFile = () => {
    setValues((prev) => ({ ...prev, resumeFileName: "", resumeFile: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const jobData = {
      companyName: values.companyName.trim(),
      role: values.role.trim(),
      jobUrl: values.jobUrl.trim(),
      resumeUsed: values.resumeUsed.trim(),
      resumeFileName: values.resumeFileName,
      resumeFile: values.resumeFile,
      appliedDate: values.appliedDate,
      salaryRange: values.salaryRange.trim(),
      notes: values.notes.trim(),
      status: values.status,
      priority: values.priority,
      followUpDate: values.followUpDate,
      archived: values.archived || false,
    };

    setSaving(true);
    if (isEdit) {
      await updateJob(initialJob.id, jobData);
    } else {
      await addJob(jobData);
    }
    setSaving(false);
    onClose();
  };

  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        <span className="max-w-48 truncate text-xs font-medium text-zinc-600 dark:text-zinc-400">
          {isEdit ? "Editing:" : "New:"} {values.companyName || "Untitled"} — {values.role || "No role"}
        </span>
        <button
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          title="Restore form"
          aria-label="Restore form"
          onClick={() => setMinimized(false)}
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
        <button
          className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
          title="Close form"
          aria-label="Close form"
          onClick={onClose}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center bg-zinc-950/35 p-4 pt-[8vh] backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={isEdit ? "Edit job" : "Add job"}>
      <div className="flex max-h-[85vh] w-full max-w-xl flex-col rounded-lg bg-white shadow-soft dark:bg-zinc-950">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 px-5 dark:border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">{isEdit ? "Edit Job" : "Add Job"}</h2>
          <div className="flex items-center gap-1">
            <button
              className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-300"
              title="Minimize form"
              aria-label="Minimize form"
              onClick={() => setMinimized(true)}
            >
              <Minimize2 className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-300" onClick={onClose} aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
          <div className="grid flex-1 gap-4 overflow-y-auto px-5 py-5 sm:grid-cols-2">
            <Field label="Company name" error={errors.companyName}>
              <input className={inputClass(errors.companyName)} value={values.companyName} onChange={(e) => setField("companyName", e.target.value)} autoFocus />
            </Field>
            <Field label="Job title / role" error={errors.role}>
              <input className={inputClass(errors.role)} value={values.role} onChange={(e) => setField("role", e.target.value)} />
            </Field>
            <Field label="Job posting URL" error={errors.jobUrl} wide>
              <input className={inputClass(errors.jobUrl)} value={values.jobUrl} onChange={(e) => setField("jobUrl", e.target.value)} onBlur={handleLinkedInBlur} placeholder="https://www.linkedin.com/jobs/view/..." inputMode="url" />
              {duplicateWarning && (
                <p className="mt-1 flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="h-3 w-3" />
                  Duplicate: {duplicateWarning.companyName} - {duplicateWarning.role}
                </p>
              )}
            </Field>
            <Field label="Resume used">
              <input className={inputClass()} value={values.resumeUsed} onChange={(e) => setField("resumeUsed", e.target.value)} list="resume-options" placeholder="SDE_Resume_v3" />
              <datalist id="resume-options">{resumeOptions.map((r) => <option key={r} value={r} />)}</datalist>
            </Field>
            <Field label="Resume file (PDF/DOCX)" wide>
              <input ref={fileInputRef} className="hidden" type="file" accept={ACCEPTED_RESUME_TYPES} onChange={handleResumeFileChange} />
              {values.resumeFileName ? (
                <div className="flex items-center gap-2">
                  <span className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400">
                    <FileText className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{values.resumeFileName}</span>
                  </span>
                  <button
                    type="button"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-zinc-200 text-zinc-400 transition hover:bg-rose-50 hover:text-rose-600 dark:border-zinc-800 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                    onClick={removeResumeFile}
                    title="Remove resume file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-dashed border-zinc-300 text-sm font-medium text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-700 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-300"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                  Upload resume
                </button>
              )}
              {resumeFileError && <span className="mt-1 block text-xs font-medium text-rose-600">{resumeFileError}</span>}
            </Field>
            <Field label="Date applied" error={errors.appliedDate}>
              <input className={inputClass(errors.appliedDate)} type="date" value={values.appliedDate} onChange={(e) => setField("appliedDate", e.target.value)} />
            </Field>
            <Field label="Salary range">
              <input className={inputClass()} value={values.salaryRange} onChange={(e) => setField("salaryRange", e.target.value)} placeholder="$150-180K or ₹25-30 LPA" />
            </Field>
            <Field label="Status">
              <select className={inputClass()} value={values.status} onChange={(e) => setField("status", e.target.value)}>
                {STATUS_COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </Field>
            <Field label="Priority">
              <select className={inputClass()} value={values.priority} onChange={(e) => setField("priority", e.target.value)}>
                {PRIORITY_LEVELS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
              </select>
            </Field>
            <Field label="Follow-up date" wide>
              <input className={inputClass()} type="date" value={values.followUpDate} onChange={(e) => setField("followUpDate", e.target.value)} />
            </Field>
            <Field label="Notes" wide>
              <textarea className={`${inputClass()} min-h-28 resize-y py-3`} value={values.notes} onChange={(e) => setField("notes", e.target.value)} placeholder="Recruiter, referral, next action" />
            </Field>
          </div>

          <div className="flex shrink-0 justify-end gap-2 border-t border-zinc-200 px-5 py-4 dark:border-zinc-800">
            <button className="h-10 rounded-md border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-900" type="button" onClick={onClose}>Cancel</button>
            <button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200" type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ children, error, label, wide }) {
  return (
    <label className={`block ${wide ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-200">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs font-medium text-rose-600">{error}</span>}
    </label>
  );
}

function inputClass(error) {
  return `h-11 w-full rounded-md border bg-white px-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:ring-2 dark:bg-zinc-900 dark:text-zinc-50 ${
    error
      ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100 dark:border-rose-500/60 dark:focus:ring-rose-500/20"
      : "border-zinc-200 focus:border-zinc-400 focus:ring-zinc-200 dark:border-zinc-800 dark:focus:border-zinc-600 dark:focus:ring-zinc-800"
  }`;
}
