Build a production-quality Local-First Job Tracker as a Single Page Application using React 18, Vite, Tailwind CSS, IndexedDB (via idb), and @dnd-kit for drag-and-drop.

The application must be fully client-side with zero backend, zero authentication, and all data persisted locally in IndexedDB.

CORE REQUIREMENTS

Data Model:

Each job contains:

* id
* companyName (required)
* role (required)
* linkedinUrl
* resumeUsed
* appliedDate
* salaryRange
* notes
* status
* priority (Low, Medium, High, Critical)
* followUpDate
* archived (boolean)
* createdAt
* updatedAt
* activityLog[]

Kanban Columns:

1. Wishlist
2. Applied
3. Follow-up
4. Interview
5. Offer
6. Rejected

Features:

* Drag-and-drop job cards between columns
* Add/Edit/Delete jobs
* Archive and Restore jobs
* Search jobs
* Filter by company, role, status, resume, priority
* Sort by newest, oldest, company name
* Duplicate detection for LinkedIn URLs
* IndexedDB persistence using idb
* Responsive design
* Light/Dark mode
* JSON export/import
* CSV export
* Installable PWA
* Offline support

Dashboard:

Display:

* Total Jobs
* Applications Submitted
* Interviews
* Offers
* Rejections
* Conversion Rate
* Resume Performance Metrics
* Jobs Added This Week

Job Card:

Show:

* Company
* Role
* Priority Badge
* Resume Tag
* Days Since Applied
* Follow-Up Status
* LinkedIn Link Icon

Activity Timeline:

Track:

* Created
* Edited
* Status Changes
* Notes Updates
* Resume Changes

Reminder System:

Highlight:

* Follow-up due today
* Follow-up overdue
* Upcoming follow-ups

Technical Requirements:

* React Hooks only
* Functional Components only
* Tailwind CSS
* idb package
* @dnd-kit/core
* Context API or Zustand
* No Redux
* No backend
* No API calls
* Clean folder structure
* Reusable components
* Accessibility support
* Form validation
* Error boundaries

Bonus Features:

* Multi-tab synchronization using BroadcastChannel
* Undo delete action
* Saved filter views
* Interview round tracker
* Local backup snapshots
* Keyboard shortcuts

Deliverables:

* Complete source code
* README
* Vercel deployment configuration
* Public GitHub repository
* Production-ready UI inspired by Linear and Trello
* Fully functional on desktop and tablet
* All features working without internet after first load
