# Findings — Job Tracker AI

## Architecture

### Tech Stack
| Layer | Technology |
|---|---|
| Build Tool | Vite 8 |
| UI Library | React 18 |
| State Management | Zustand 5 |
| Drag & Drop | @dnd-kit/core 6 |
| Database | IndexedDB (via idb 8) |
| Icons | lucide-react |
| Styling | Tailwind CSS 3 |
| PWA | Service worker + manifest |

### Data Flow
```
React Components (App, KanbanBoard, JobCard, ArchivedView, DeletedView, etc.)
        │ read/write via Zustand selectors
        ▼
Zustand Store (useJobStore.js)
  ├── jobs[]              (single source of truth)
  ├── filters/sort/UI state
  └── actions (CRUD + archive + soft-delete)
        │ calls db.js functions
        ▼
IndexedDB (job-tracker-ai, v4)
  └── Object Store: jobs (keyPath: id)
       Indexes: status, companyName, role, priority, archived, deleted, followUpDate, resumeUsed
```

### Zustand Store Shape
```js
{
  jobs, loading, query, sortDirection,
  filterStatus, filterPriority, filterResume, filterFollowUp,
  showArchived, showDashboard, showTrash, activeTab,
  selectedJobIds, lastDeletedJob,
  // Actions
  loadJobs, addJob, updateJob, removeJob (soft), undoDelete,
  restoreDeleted, permanentlyDelete, updateJobStatus,
  exportJobs, importJobs, dismissUndo, etc.
}
```

### DB Functions (db.js)
- `getAllJobs()` — returns full array
- `saveJob(job)` — put single
- `saveJobs(jobs[])` — batch put
- `deleteJob(id)` — hard delete by ID
- `replaceJobs(jobs[])` — clear + bulk insert
- `archiveJobs(ids[])` — batch archive (set archived: true)
- `restoreJob(id)` — clear archived flag
- `getJobCount()` — total count

### Component Tree (full)
```
App.jsx (with ErrorBoundary)
├── Header.jsx
│   ├── Logo/title
│   ├── Kanban / Dashboard tabs
│   └── Theme toggle (light/dark, persisted in localStorage)
├── ReminderBar.jsx
│   ├── Overdue count badge
│   ├── Up to 10 follow-up chips (click → open detail)
│   └── Total reminder count
├── FilterBar.jsx
│   ├── Search input (company/role)
│   ├── Sort dropdown (newest/oldest/A-Z/Z-A)
│   ├── Status filter (6 columns + all)
│   ├── Priority filter (low/medium/high/critical)
│   ├── Resume filter (autocomplete from existing)
│   ├── Follow-up filter (all/overdue/due-today/this-week/this-month)
│   ├── Clear filters button
│   └── Import/Export buttons (JSON, CSV)
├── KanbanBoard.jsx (DndContext)
│   └── 6 × JobColumn.jsx (droppable, with add button tooltip)
│       └── JobCard.jsx (draggable, disabled for archived)
│           ├── Drag handle (GripVertical)
│           ├── Company name + role
│           ├── Action icons: LinkedIn link, Edit, Archive/Delete, Restore (if archived)
│           ├── Badges: Priority, Status, Resume name, Days since, Salary, Follow-up
│           └── Notes preview
├── ArchivedView.jsx (grid, shown when showArchived=true)
│   └── Archived job cards with Restore button
├── DeletedView.jsx (grid, shown when showTrash=true)
│   └── Trashed job cards with Restore + Delete Forever buttons
├── Dashboard.jsx
│   ├── 8 stat cards (total, applied, interviews, offers, rejected, conv rate, this week, activity)
│   └── Resume performance bars (top 5)
├── JobFormModal.jsx (slide-over, Add/Edit)
│   ├── Company name (required), Role (required)
│   ├── Job posting URL (validated, duplicate detection)
│   ├── Resume used (with datalist autocomplete)
│   ├── Resume file upload (PDF/DOCX, max 2MB, base64)
│   ├── Date applied (required), Salary range
│   ├── Status (dropdown), Priority (dropdown)
│   ├── Follow-up date, Notes (textarea)
│   └── Save/Cancel
├── JobDetailModal.jsx (slide-over with activity timeline + resume download)
├── DeleteModal.jsx ("Move to Trash" confirmation)
├── ArchiveModal.jsx ("Archive" confirmation)
├── UndoToast.jsx (bottom toast: "Undo" for soft-delete)
├── ActivityTimeline.jsx (last 20 activity entries per job)
└── ErrorBoundary.jsx (class-based)

Utils:
├── helpers.js — date utils, URL validation, stats, CSV export, import normalization
└── seedData.js — 20 demo jobs (2 pre-archived)
```

### Soft-Delete System
- Delete button sets `deleted: true` (not removing from DB)
- UndoToast appears for 2.6s → calls `undoDelete()` → sets `deleted: false`
- If user doesn't undo, job stays in trash
- Trash button on board header ("N trashed") opens DeletedView
- DeletedView has "Restore" (clears deleted flag) and "Delete Forever" (hard delete from DB)
- Permanent delete removes the job entirely from IndexedDB

### Follow-Up Filtering
- Works on jobs that have `followUpDate` set
- `isFollowUpOverdue(date)` → date is before today
- `isFollowUpToday(date)` → date equals today (YYYY-MM-DD)
- `isFollowUpThisWeek(date)` → date between today and Saturday this week
- `isFollowUpThisMonth(date)` → date between today and last day of current month
- Filter applied in KanbanBoard's filteredJobs memo

### Resume File Upload
- File input accepts `.pdf`, `.doc`, `.docx`
- Max size: 2MB
- Read via FileReader.readAsDataURL → stored as base64 in `resumeFile`
- Original filename stored in `resumeFileName`
- Shown as download link in JobDetailModal
- Remove button in form clears both fields

### JobFormModal UX
- Centered modal (not slide-over), top-aligned at 8vh, max height 85vh
- Minimize button collapses to floating bar at bottom-right preserving all form state
- Restore button (Maximize2 icon) reopens full form without data loss
- Close (X) button discards the form
- Works for both Add and Edit modes

### Constraints
- No backend, no API calls — 100% browser-local
- No authentication system
- All data in IndexedDB (survives browser close, not clearing storage)
- Export/Import uses Blob + download link (no File System Access API)
- Theme preference in localStorage
