# TestPlan AI

Enterprise-grade AI workspace for generating comprehensive test plans from PRDs and requirement documents. Built with Next.js 16, powered by Groq AI.

![Tech Stack](https://img.shields.io/badge/Next.js-16-black?logo=next.js) ![React](https://img.shields.io/badge/React-19-blue?logo=react) ![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss) ![Groq](https://img.shields.io/badge/Groq-API-orange)

---

## Features

- **Document Upload** — Drag & drop PDF, DOCX, or TXT files (up to 10MB each)
- **AI-Powered Generation** — Produces structured, comprehensive test plans from PRDs using Groq's LLM models
- **Model Selection** — Choose from Llama 3.3 70B, Llama 4 Scout 17B, Qwen 3 32B, or Llama 3.1 8B
- **Rich Markdown Preview** — Generated test plans render with styled headings, tables, code blocks, and syntax highlighting
- **Export Options** — Copy to clipboard, download as `.md`, or export as `.docx`
- **Command Palette** — `Ctrl+K` for quick actions: generate, toggle theme, search documents
- **Recent History** — Locally persisted generation history in the sidebar
- **Dark Mode** — High-contrast Linear-style dark workspace optimized for daily use
- **Settings** — Configurable API key, model, temperature, and max tokens (persisted to localStorage)
- **Error Handling** — Clean, contextual error messages for auth failures, rate limits, and model decommissioning

---

## Architecture

```
app/
├── page.js                      # Dashboard: TopNavbar + Sidebar + WorkspaceContent
├── layout.js                    # Root layout with LazyMotion, TooltipProvider, Toaster
├── globals.css                  # Design tokens + shadcn/ui theme
├── animations.css               # Enterprise animation keyframes
├── api/generate/route.js        # POST endpoint — Groq generation proxy
└── actions/extractors.js        # Server Action — PDF text extraction via pdfjs-dist

components/
├── layout/                      # App shell
│   ├── TopNavbar.jsx            # Brand, model selector, status badge, generate, export, theme
│   ├── Sidebar.jsx              # Collapsible sidebar with Framer Motion spring animation
│   ├── SidebarNav.jsx           # History, Templates, Settings navigation
│   ├── CommandPalette.jsx       # Ctrl+K modal with search, generate, theme toggle
│   ├── BrandLogo.jsx            # Gradient icon + "TestPlan AI"
│   └── UserProfile.jsx          # Guest user avatar pinned at sidebar bottom
├── workspace/                   # Content area
│   ├── WorkspaceContent.jsx     # AnimatePresence orchestrator for all states
│   ├── EmptyWorkspace.jsx       # No documents uploaded
│   ├── ReadyToGenerate.jsx      # Documents ready, primary "Generate Test Plan" CTA
│   ├── LoadingWorkspace.jsx     # AI generation in progress
│   ├── ErrorWorkspace.jsx       # Contextual error with retry
│   ├── ContentToolbar.jsx       # Preview/Raw tabs + export actions
│   ├── ExportDropdown.jsx       # Copy Markdown | Download .md | Export .docx
│   └── SectionNav.jsx           # H2-based sticky section navigation with scroll-spy
├── UploadZone.jsx               # Drag & drop upload (reused in Sidebar)
├── TextPreview.jsx              # Extracted text viewer per file
├── ModelSelector.jsx            # Model dropdown (reused in TopNavbar)
├── SettingsDialog.jsx           # API key + model + temp + tokens modal
├── MarkdownRenderer.jsx         # react-markdown + Prism syntax highlighting
├── DocxExportButton.jsx         # Standalone DOCX export
├── ThemeToggle.jsx              # Light/dark toggle
└── ui/                          # shadcn/ui primitives (button, card, dialog, select,
    │                              separator, skeleton, tabs, tooltip, scroll-area,
    │                              command, dropdown-menu, avatar, badge)

hooks/
├── useGeneration.js             # Reusable generate logic shared by TopNavbar + Sidebar
└── useTheme.js                  # Light/dark theme persistence

lib/
├── store.js                     # Zustand store — files, extraction, generation, history, settings
├── constants.js                 # Models, temperature presets, token presets, file types
├── groq-client.js               # Groq SDK singleton — chat completion wrapper
├── extractors.js                # Client-side file extraction (PDF→server, DOCX→mammoth, TXT→text)
├── validators.js                # File type + size validation
├── settings-validators.js       # API key format, model, temp, token validation
├── markdown-to-docx.js          # Markdown → .docx Blob converter
└── utils.js                     # Tailwind class merging (clsx + tailwind-merge)

prompts/
└── TestPlan_Skill.md            # System prompt — exhaustive test plan generation rules
```

---

## Data Flow

```
User drops files → UploadZone → validateFiles() → LeftPanel
                                             → extractFiles() (PDF server action / DOCX mammoth / TXT)
                                             → Zustand store (files[], extractedTexts[])

User clicks Generate → useGeneration().generate()
                    → POST /api/generate { prdText, model, temp, maxTokens, apiKey }
                    → route.js loads TestPlan_Skill.md as system prompt
                    → groq-client.js → Groq SDK → Groq API
                    → Response markdown → Zustand store (generatedMarkdown)
                    → WorkspaceContent renders MarkdownRenderer
                    → Export: Copy / Download .md / Export .docx
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Groq API key ([get one here](https://console.groq.com/keys))

### Setup

```bash
# Clone the repo
git clone https://github.com/Shivani26Singh/AI_TestPlan_Generator_Local.git
cd AI_TestPlan_Generator_Local

# Install dependencies
npm install

# Create environment file
echo "GROQ_API_KEY=gsk_your_key_here" > .env.local

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

---

## Usage

1. **Upload** a PRD or requirements document (PDF/DOCX/TXT) via the sidebar
2. **Select** your preferred AI model from the top navbar dropdown
3. **Configure** API key, temperature, and max tokens in Settings
4. **Click "Generate Test Plan"** — the center CTA appears once documents are ready
5. **Review** the generated test plan in the Preview tab
6. **Export** as Markdown or DOCX via the export dropdown

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, shadcn/ui, Radix UI |
| Animations | Framer Motion |
| State | Zustand (persisted to localStorage) |
| AI | Groq SDK (Llama 3.3 70B, Llama 4 Scout 17B, Qwen 3 32B, Llama 3.1 8B) |
| Markdown | react-markdown, remark-gfm, Prism syntax highlighting |
| File Extract | pdfjs-dist (server), mammoth (DOCX), native File API (TXT) |
| Export | docx library (Markdown → DOCX), Clipboard API |
| Toasts | Sonner |
