# Progress — Job Tracker AI

## 2026-06-14

### Phase 0 — Initialization ✅
- Created memory files: Objective.md, LLM.md, findings.md, task_plan.md, progress.md
- Copied B.L.A.S.T.md and RICE_POT.md framework references into Input/
- Pulled complete source from blueprint3x `Project_Job_TRACKERAI`

### Phase 1 — Scaffold ✅
- Vite + React project with `npm install` (103 packages, 0 vulnerabilities)
- Tailwind CSS with Inter font, dark mode via `class` strategy
- All dependencies installed: `@dnd-kit/core`, `idb`, `lucide-react`

### Phase 2-7 — Full Implementation ✅ (from blueprint3x)
- **IndexedDB layer:** `idb` wrapper with CRUD + bulk replace
- **Kanban board:** 6 columns (Wishlist, Applied, Follow-up, Interview, Offer, Rejected)
- **Drag-and-drop:** dnd-kit with PointerSensor, 8px activation distance
- **Job CRUD:** Slide-over Add modal, Edit modal, Delete confirmation
- **Search/Filter:** By company name or role
- **Sort:** Newest first / Oldest first within each column
- **Theme:** Light/dark mode toggle, persisted in localStorage
- **Export:** JSON download with timestamp
- **Import:** JSON upload with validation, replaces entire board

### Phase 9-15 — Feature Expansion ✅
- **Zustand migration:** Extracted state from App.jsx into useJobStore for cleaner separation
- **Archive system:** ArchivedView with restore, confirmation modal, activity logging
- **Activity timeline:** Per-job activity log tracking status changes, edits, archive/restore
- **Job detail modal:** Full detail view with activity timeline and action buttons
- **Dashboard:** Stats cards (total, applied, interviews, offers, rejected, conv rate, weekly activity, total activity)
- **Resume performance:** Top 5 resume bars with click-through
- **Reminders:** Follow-up date tracking, overdue/due-today detection, ReminderBar
- **Color-coded cards:** Each status has distinct card bg, colored top strip, accent border
- **Tooltips:** All icons have tooltips showing action description
- **Status badges:** Status tag shown on every card
- **Archived cards:** Neutral grey styling, disabled drag
- **Seed data:** 20 demo jobs auto-seeded on first load (2 pre-archived)

### Phase 16-19 — Today's Changes ✅
- **Soft-delete → Trash system:** Delete now sets `deleted: true` instead of removing from DB. Added `restoreDeleted` and `permanentlyDelete` actions. Created DeletedView with restore + "Delete Forever" buttons. Trash count shown on board header. UndoToast still works (calls undoDelete which clears deleted flag).
- **Resume file upload:** PDF/DOCX file picker in JobFormModal, max 2MB, stored as base64. Download link shown in JobDetailModal with filename.
- **Column + button tooltip:** Added `title="Add job to {column.title}"` on each column header's plus button.
- **Follow-up time filter:** New dropdown in FilterBar: All, Overdue, Due Today, This Week, This Month. Added `isFollowUpThisWeek` and `isFollowUpThisMonth` helpers. Applied in KanbanBoard filtering.
- **ReminderBar click fix:** Changed from broken `document.querySelector` to proper `onView` callback prop. Reminders now open the job detail modal on click.
- **DB version bumped to v4** with new `deleted` index. `blankJobForm` updated with `resumeFileName`, `resumeFile`, `deleted` fields.
- **Import normalization** updated to preserve `resumeFileName`, `resumeFile`, and `deleted` fields.
- **DeleteModal** text updated to "Move to Trash" with appropriate messaging.
- **ActivityTimeline** updated with deleted activity type icon (Trash2) and label.

### Phase 20 — Seed Data + Modal UX ✅
- **Seed data follow-up dates:** Added `ahead(3)` and `ahead(4)` for "this week", `ahead(18)` and `ahead(20)` for "this month" on Netflix, Vercel, Microsoft, Canva entries. Ensures all follow-up filter buckets have sample data.
- **JobFormModal centered:** Changed from right slide-over to centered modal (top-aligned at 8vh). Modal now has Minimize button (Minimize2 icon) that collapses to a floating bar at bottom-right showing "New: Company — Role" with restore (Maximize2) and close (X) buttons. All form state is preserved during minimize/restore.

### Build Status
- `npm run build` passes clean ✅ (262KB JS + 31KB CSS)

### Source
- `Project_Job_TRACKERAI/`
- All subsequent phases built in-session
