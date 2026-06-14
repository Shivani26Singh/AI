# LLM.md — Job Tracker AI Constitution

## Data Schema

### Job Card (IndexedDB Store: `jobs`)
```json
{
  "id": "UUID v4 string",
  "companyName": "string (required)",
  "role": "string (required)",
  "jobUrl": "string (URL, optional)",
  "resumeUsed": "string (optional, autocomplete from history)",
  "resumeFileName": "string (optional, original filename of uploaded resume)",
  "resumeFile": "string (optional, base64-encoded PDF/DOCX, max 2MB)",
  "appliedDate": "string (YYYY-MM-DD, auto-set to today)",
  "salaryRange": "string (optional, e.g. '$150-180K or ₹25-30 LPA')",
  "notes": "string (optional, multiline)",
  "status": "wishlist | applied | follow-up | interview | offer | rejected",
  "priority": "low | medium | high | critical",
  "followUpDate": "string (YYYY-MM-DD, optional)",
  "archived": "boolean (default false)",
  "deleted": "boolean (default false)",
  "createdAt": "ISO 8601 timestamp",
  "updatedAt": "ISO 8601 timestamp",
  "activityLog": [
    {
      "type": "created | edited | status_change | notes_update | resume_change | priority_change | archived | restored | deleted",
      "timestamp": "ISO 8601",
      "detail": "string"
    }
  ]
}
```

### IndexedDB
- Database name: `job-tracker-ai`
- Version: 4
- Object store: `jobs` (keyPath: `id`)
- Indexes: `status`, `companyName`, `role`, `priority`, `archived`, `deleted`, `followUpDate`, `resumeUsed`
- Wrapper: `idb` npm package (v8+)

### Stores & UI State (Zustand)
```js
{
  jobs: [],               // Full job array (active + archived + deleted)
  loading: true,
  query: "",              // Search query
  sortDirection: "newest | oldest | company-asc | company-desc",
  filterStatus: "all | wishlist | applied | follow-up | interview | offer | rejected",
  filterPriority: "all | low | medium | high | critical",
  filterResume: "all | {resume name}",
  filterFollowUp: "all | overdue | due-today | this-week | this-month",
  showArchived: false,    // Toggle archived view
  showDashboard: false,
  showTrash: false,       // Toggle trash/deleted view
  activeTab: "kanban | dashboard",
  selectedJobIds: [],     // Multi-select (future use)
  lastDeletedJob: null,   // For undo toast
}
```

### Export/Import Format
```json
{
  "exportedAt": "ISO 8601 timestamp",
  "version": 1,
  "jobs": [ ...JobCard[] ]
}
```

## Kanban Column Statuses (6 columns)
| Status | Color | Accent Border | Card BG | Light BG |
|--------|-------|---------------|---------|----------|
| wishlist | amber | border-l-amber-500 | bg-amber-50 | bg-amber-100 |
| applied | sky | border-l-sky-500 | bg-sky-50 | bg-sky-100 |
| follow-up | yellow | border-l-yellow-500 | bg-yellow-50 | bg-yellow-100 |
| interview | indigo | border-l-indigo-500 | bg-indigo-50 | bg-indigo-100 |
| offer | emerald | border-l-emerald-500 | bg-emerald-50 | bg-emerald-100 |
| rejected | rose | border-l-rose-500 | bg-rose-50 | bg-rose-100 |

### Priority Levels
| Priority | Color Scheme |
|----------|-------------|
| low | slate |
| medium | blue |
| high | amber |
| critical | red |

### Activity Types
`created | edited | status_change | notes_update | resume_change | priority_change | archived | restored | deleted`

## Behavioral Rules
- All CRUD must persist instantly to IndexedDB (no batching, no caching)
- Never make external API calls — 100% browser-local
- Required fields: companyName, role, appliedDate, valid jobUrl — validated before save
- Job URL must pass `new URL()` validation (http/https only); empty is valid
- Date applied auto-sets to today on creation, editable via date picker
- Resume name field shows autocomplete from previously used names via `<datalist>`
- **Archive**: Sets `archived: true`, hides from board, restorable from ArchivedView
- **Soft-delete**: Sets `deleted: true`, moves to trash view (DeletedView), restorable or permanently deletable
- **Undo toast**: Shows after delete for 2.6s, calls `undoDelete()` which sets `deleted: false`
- **Resume file upload**: PDF/DOCX only, max 2MB, stored as base64 in `resumeFile`, downloadable from detail modal
- Column counts update in real-time in badge (archived + deleted excluded)
- Cards render: company name, role, drag handle, priority badge, resume tag, days since applied, salary, follow-up status, notes preview
- "Days since applied" handles: Today, 1 day, N days, Future, No date
- Follow-up tracking: overdue, due today, this week, this month via helper functions
- Drag-and-drop uses PointerSensor with 8px activation distance
- Reminder bar shows up to 10 upcoming/overdue follow-ups, clicking opens detail modal
- Reminders and dashboard exclude archived + deleted jobs

## Architectural Invariants
- React 18+ with functional components and hooks
- Vite build tooling, no CRA
- Tailwind CSS dark mode via `class` strategy
- **Zustand** for state management (not useState in App)
- `@dnd-kit/core` for drag-and-drop (not react-beautiful-dnd)
- `idb` for IndexedDB (not raw API)
- `lucide-react` for icons
- No React Router — single page with modals
- Toast notifications auto-dismiss after 2.6 seconds
- Theme preference in localStorage as `job-tracker-theme`
- Sort within columns: newest first (default), oldest first, company A-Z, company Z-A
- Columns: h-[calc(100vh-250px)], overflow-y-auto, horizontal scroll on narrow screens
- State shape and DB schema must stay in sync; any new field requires DB version bump
- Separate views: Kanban board → ArchivedView → DeletedView (trash), each toggleable from board header
- Follow-up time filter applies to jobs with followUpDate set; uses today's date for week/month windows
- Add/Edit modal is centered (not slide-over), with minimize button that collapses to floating bar preserving form state
