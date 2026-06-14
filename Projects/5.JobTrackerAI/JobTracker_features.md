# JobSail — Your Career Compass 🌊⛵

## 🏆 Why JobSail Wins

JobSail is a **fully local-first, zero-backend, zero-auth** Kanban job application tracker that runs entirely in your browser. No sign-ups, no cloud storage, no API calls — your data lives in your browser's IndexedDB and you own it completely. It's a **production-grade SPA** built with React 18, Zustand, and Tailwind CSS.

---

## 📋 Complete Feature List

### 🗂️ 1. Kanban Board with 6 Status Columns

| Column | Color | Purpose |
|--------|-------|---------|
| ⭐ Wishlist | Amber | Jobs you're interested in |
| 📤 Applied | Sky | Applications submitted |
| 📞 Follow-up | Yellow | Need to follow up |
| 🤝 Interview | Indigo | Interview pipeline |
| 🏆 Offer | Emerald | Offers received |
| ❌ Rejected | Rose | Closed opportunities |

- **Drag & Drop** between columns using `@dnd-kit` (8px activation distance prevents accidental drags)
- Each card is **color-coded** to its status — instantly recognizable
- **Tooltips** on every icon (drag handle, edit, archive, delete, LinkedIn)
- **Real-time column counts** in badges

### ✏️ 2. Full Job CRUD with Slide-Over Modal

- **Add/Edit Job** in a centered modal (not slide-over) with minimize/restore
- **Minimize button** collapses form to a floating bar at bottom-right — preserves all typed data
- **Required validation**: Company name, role, valid URL, date applied
- **Duplicate detection**: warns if LinkedIn URL already exists
- Fields: Company, Role, Job URL, Resume name, **Resume file upload**, Date applied, Salary range, Status, Priority, Follow-up date, Notes

### 📄 3. Resume File Upload (PDF/DOCX)

- Upload your actual resume file directly into the job card
- Max **2 MB**, stored as **base64** in IndexedDB
- Shows filename with ✅ green badge after upload
- **Remove button** to clear and re-upload
- **Download link** in Job Detail modal — click to get your resume back anytime
- No external storage needed — your resume travels with your job data

### 🗑️ 4. Soft-Delete with Trash View (NEW)

- Delete moves jobs to **Trash** (not permanent)
- **"N trashed"** button on the board header opens Trash view
- Trash view shows all deleted jobs with **Restore** and **Delete Forever** buttons
- **Undo Toast** appears for 2.6 seconds after delete — one-click undo
- Trash is persisted across browser sessions — your data is never accidentally lost

### 📦 5. Archive System

- Archive jobs you want to keep for reference but hide from the active board
- Archive confirmation modal prevents accidental archiving
- **Archived View** — grid of all archived jobs with **Restore** button
- Archived cards are styled in neutral grey, drag is disabled
- "N archived" button on the board header

### 🔔 6. Smart Reminder Bar

- Shows up to **10 upcoming/overdue follow-ups** at the top
- **Red badge** for overdue count
- Color-coded chips: 🔴 overdue, 🟠 due today, ⚪ upcoming
- **Click any chip to open** the full job detail — not just edit, full detail view
- Auto-excludes archived and trashed jobs

### 🔍 7. Powerful Filtering & Search

| Filter | Options |
|--------|---------|
| **Search** | Live search by company or role (keyboard shortcut: `/`) |
| **Sort** | Newest first, Oldest first, Company A-Z, Company Z-A |
| **Status** | 6 columns + All |
| **Priority** | Low, Medium, High, Critical |
| **Resume** | Auto-complete from previously used resume names |
| **Follow-up** ⭐ NEW | All, Overdue, Due Today, This Week, This Month |

- **Clear all filters** button appears when any filter is active
- All filters combine seamlessly — filter by status + priority + follow-up simultaneously

### 📊 8. Dashboard with Stats

| Stat | What it tracks |
|------|---------------|
| Total Jobs | Active job count |
| Applied | Applications submitted |
| Interviews | Interview pipeline |
| Offers | Offers received |
| Rejected | Closed opportunities |
| Conversion Rate | Offers ÷ Applied × 100 |
| This Week | Jobs created in last 7 days |
| Activity | Total activity log entries |

- **Resume Performance** — top 5 resumes ranked by success (bar chart)
- All stats exclude archived and trashed jobs

### 🕐 9. Activity Timeline

- Every job has a **full activity log** (last 50 entries)
- Tracks: Created, Edited, Status changes, Notes updates, Resume changes, Priority changes, Archived, Restored, Deleted
- Each entry shows icon + label + detail + date
- Shown in the **Job Detail modal** alongside all job fields

### ⚡ 10. Priority System

- **4 levels**: Low, Medium, High, Critical
- Color-coded badges on every card
- Filter by priority in the filter bar

### 🌙 11. Dark Mode

- Full light/dark theme support
- Toggle persists in `localStorage`
- Respects OS preference on first visit (`prefers-color-scheme`)
- Every component styled for both themes

### 💾 12. Import / Export

- **Export JSON** — full backup with timestamp
- **Export CSV** — spreadsheet-friendly format for analysis
- **Import JSON** — restore backup, replace current board
- All resume files (base64) are included in exports

### ⌨️ 13. Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `n` | Open Add Job modal |
| `/` | Focus search bar |
| `d` | Toggle Dashboard |
| `t` | Toggle Dark mode |
| `Escape` | Close modals |

### 🌱 14. Seed Data

- **20 realistic demo jobs** pre-loaded on first visit
- Includes: overdue, due today, this week, this month follow-up dates
- 2 pre-archived jobs
- Varied companies, roles, statuses, priorities, salaries (USD + INR), notes

### 📱 15. PWA Ready

- Service worker registration
- Web app manifest with JobSail branding
- Installable on desktop and mobile
- Works fully offline

---

## 🏗️ Technical Architecture

| Layer | Technology |
|-------|-----------|
| **Build Tool** | Vite 8 |
| **UI Library** | React 18 |
| **State Management** | Zustand 5 |
| **Drag & Drop** | @dnd-kit/core 6 |
| **Database** | IndexedDB via idb 8 |
| **Icons** | lucide-react |
| **Styling** | Tailwind CSS 3 (dark mode via `class` strategy) |
| **PWA** | Service worker + manifest |

### Data Flow
```
React Components → Zustand Store → IndexedDB (job-tracker-ai, v4)
                                    └── indexes: status, companyName, role,
                                        priority, archived, deleted,
                                        followUpDate, resumeUsed
```

### Component Tree (16 components)
```
App
├── Header (logo, tabs, theme toggle)
├── ReminderBar (follow-up chips)
├── FilterBar (search, 5 filter dropdowns, import/export)
├── KanbanBoard → 6 × JobColumn → JobCard (drag-n-drop)
├── ArchivedView (grid with restore)
├── DeletedView (grid with restore + delete forever)
├── Dashboard (8 stat cards + resume performance)
├── JobFormModal (add/edit with minimize/restore + file upload)
├── JobDetailModal (full detail + activity timeline + resume download)
├── DeleteModal, ArchiveModal (confirmation dialogs)
├── UndoToast (bottom toast)
└── ActivityTimeline (per-job log)
```

### IndexedDB Schema
- **Database**: `job-tracker-ai`, version 4
- **Store**: `jobs` (keyPath: `id`)
- **Fields**: id, companyName, role, jobUrl, resumeUsed, resumeFileName, resumeFile, appliedDate, salaryRange, notes, status, priority, followUpDate, archived, deleted, createdAt, updatedAt, activityLog[]

---

## 🎯 What Makes JobSail Unique

| Feature | JobSail | Other Trackers |
|---------|---------|----------------|
| **100% Local** | ✅ No backend, no sign-up | ❌ Most require accounts |
| **Resume Upload** | ✅ PDF/DOCX base64 inline | ❌ Rare in job trackers |
| **Soft-Delete + Trash** | ✅ Restore anytime | ❌ Most are hard-delete only |
| **Archive System** | ✅ Separate archived view | ❌ Most just hide |
| **Follow-up Filters** | ✅ Overdue/Today/Week/Month | ❌ Rare |
| **Smart Reminder Bar** | ✅ Click to detail, color-coded | ❌ Usually just dates |
| **Minimizable Form** | ✅ Keep editing while browsing board | ❌ Modal blocks everything |
| **Activity Timeline** | ✅ Full audit log per job | ❌ Uncommon |
| **Dark Mode** | ✅ Full support | ❌ Often missing |
| **PWA / Offline** | ✅ Installable, works offline | ❌ Requires internet |
| **Export CSV + JSON** | ✅ Full backup with files | ❌ Often JSON only |
| **Zero Dependencies** | ✅ No accounts, APIs, auth | ❌ Cloud-dependent |

---

## 🚀 Quick Start

```bash
cd Projects/5.JobTrackerAI
npm install
npm run dev        # Development server on localhost:5173
npm run build      # Production build to dist/
```

JobSail is a single `dist/` folder — deploy anywhere. No environment variables, no database, no secrets.

---

## 🔒 Privacy

- **Zero telemetry** — nothing leaves your browser
- **No external APIs** — no analytics, no tracking
- **IndexedDB** — data survives browser close, but you can clear it anytime
- **Export anytime** — full JSON backup including uploaded resumes

---

**JobSail — Your Career Compass. Navigate your job hunt with confidence.** ⛵
