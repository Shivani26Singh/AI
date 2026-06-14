# Task Plan — Job Tracker AI

## North Star
A local-first, single-page Kanban tracker for job applications — no backend, no auth, just you and your job hunt.

## Phases

- [x] Phase 0: Initialize project memory (Objective.md, LLM.md, findings.md, task_plan.md, progress.md)
- [x] Phase 1: Scaffold — Vite + React + Tailwind + dependencies
- [x] Phase 2: IndexedDB layer — `idb` wrapper with CRUD operations
- [x] Phase 3: Constants — Kanban columns, status config, blank form factory
- [x] Phase 4: Core UI — Header, search bar, sort dropdown, Kanban board layout
- [x] Phase 5: Drag-and-drop — dnd-kit integration with column drops and card drags
- [x] Phase 6: Job CRUD — Add modal (slide-over), Edit modal, Delete confirmation
- [x] Phase 7: Nice-to-have — Light/dark mode, JSON export, JSON import
- [x] Phase 8: Build verification — `npm run build` passes clean
- [x] Phase 9: Zustand migration — Extract state from App.jsx into useJobStore
- [x] Phase 10: Archive system — archive/restore with ArchivedView, confirmation modal
- [x] Phase 11: Activity timeline — per-job activity log on archive/restore/edit
- [x] Phase 12: Job detail modal — full detail view with activity timeline
- [x] Phase 13: Dashboard — stats cards, resume performance, weekly activity
- [x] Phase 14: Reminders — follow-up date tracking, overdue detection, reminder bar
- [x] Phase 15: Color-coded cards, tooltips, status badges, seed data
- [x] Phase 16: Soft-delete with trash view — `deleted: true` field, DeletedView, restore/permanent-delete, undo toast
- [x] Phase 17: Resume file upload — PDF/DOCX (base64, max 2MB), download from detail modal
- [x] Phase 18: Follow-up time filter — Overdue/Due Today/This Week/This Month dropdown
- [x] Phase 19: ReminderBar click fix + Column + button tooltip
- [x] Phase 20: Seed data follow-up dates + JobFormModal centered with minimize/restore

## Component Tree
```
main.jsx → App.jsx (with ErrorBoundary)
├── Header (logo, tabs, theme toggle)
├── ReminderBar (overdue/due follow-ups, click to detail)
├── Kanban Board view
│   ├── FilterBar (search, sort, status/priority/resume/follow-up filters, import/export)
│   └── KanbanBoard (DndContext)
│       └── 6 × JobColumn (droppable zones)
│           └── JobCard[] (draggable cards)
├── ArchivedView (grid of archived jobs with restore)
├── DeletedView (grid of trashed jobs with restore + delete forever)
├── Dashboard (stats cards + resume performance bars)
├── JobFormModal (Add/Edit slide-over with resume file upload)
├── JobDetailModal (full detail + activity timeline + resume download)
├── DeleteModal (move to trash confirmation)
├── ArchiveModal (archive confirmation)
└── UndoToast (undo last soft-delete)
```

## Decisions
- Zustand over useState-in-App — cleaner separation, easier testing
- Separate archive/deleted views — togglable from board header, not separate routes
- `archived` and `deleted` as booleans on job object — no separate tables needed
- Soft-delete over hard-delete — data is never lost, permanent delete is explicit
- Resume files as base64 in IndexedDB — no external storage, works offline
- `PointerSensor` over `MouseSensor` — works on mouse and touch
- Slide-over modal for forms — native feel on tablet, board visible behind
- `<datalist>` for resume autocomplete — zero dependencies
