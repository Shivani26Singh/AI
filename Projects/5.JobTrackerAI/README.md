# Job Tracker AI

A local-first Kanban tracker for job applications. Vite + React + IndexedDB via `idb`. No backend. No auth.

## Quick start

```bash
npm install
npm run dev
```

Open the URL in terminal. The app auto-seeds 20 demo jobs on first load (empty DB).

## Features

- 6 Kanban columns: Wishlist, Applied, Follow-up, Interview, Offer, Rejected
- Drag-and-drop cards between columns (`@dnd-kit`)
- Add / Edit / Delete / Archive / Restore jobs
- Filters: status, priority, resume
- Sort: newest, oldest, company A-Z, company Z-A
- Dashboard with stats, resume performance, conversion rate
- Duplicate LinkedIn URL detection
- Activity timeline per job
- Reminder bar for upcoming/overdue follow-ups
- Light/dark mode
- JSON + CSV export
- JSON import
- Undo delete
- Keyboard shortcuts: `n` add, `/` search, `d` dashboard, `t` theme, `Ctrl+Z` undo
- PWA — installable with offline support
- Error boundary
- Accessible — aria labels, roles, keyboard nav

## Build

```bash
npm run build
```

Outputs to `dist/`.

## Storage

All data in IndexedDB (`job-tracker-ai`). No external calls. Survives browser restart but not storage clearing.

## Reset demo data

Open DevTools → Application → IndexedDB → job-tracker-ai → Delete database. Reload the app.
