# Flaky Test Analyzer — Project Overview

A complete end-to-end system that automatically detects flaky tests by comparing two
Playwright test runs using an AI agent powered by **LangFlow + Groq/OpenRouter LLM**,
with a **React UI** for drag-and-drop analysis.

---

## What Is LangFlow?

**LangFlow** is an open-source, **visual low-code builder for AI agents and LLM-powered apps**.
Think of it as a drag-and-drop canvas where you wire together components (models, prompts,
file loaders, API callers, tools, parsers) to create AI workflows — no Python or
JavaScript required for the agent logic.

| Aspect | Detail |
|--------|--------|
| **What it is** | Visual IDE for building and testing LLM pipelines |
| **License** | Open source (MIT) |
| **Runs on** | Local machine (Python), Docker, or cloud |
| **Key feature** | Publish a flow → exposes a **REST API endpoint** (`POST /api/v1/run/{flowId}`) |
| **Components** | File loaders, text inputs, LLMs (OpenAI, Groq, Ollama, any OpenAI-compatible), prompt templates, tools, parsers, output renderers |
| **File upload** | Built-in file upload endpoint: `POST /api/v1/files/upload/{flowId}` |
| **Model support** | Any model — OpenAI, Groq, DeepSeek, Anthropic, local Ollama, HuggingFace |
| **Why I used it** | No code needed for the AI pipeline, instant REST API, visual debugging, model-agnostic |

**How it works in this project:**
1. I drag **two File components** and one **LLM component** onto the canvas.
2. I connect them: File A → LLM, File B → LLM.
3. I write a system prompt: "Analyze these two Playwright runs. Identify flaky tests..."
4. I click **Publish** → LangFlow gives me a REST API endpoint.
5. My React UI and CLI script call that API — they never touch the LLM directly.

---

## 1. What I Built

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Playwright Test Suite** | Playwright + TypeScript | 16 E2E tests against TodoMVC with **deterministic flake simulation** |
| **Custom Reporter** | TypeScript (Playwright Reporter API) | Captures test results in a structured JSON format (`results.json`) |
| **LangFlow AI Agent** | LangFlow (low-code AI builder) | Compares two runs, identifies flaky tests vs consistent failures, generates a report |
| **React UI** | React 18 + Vite | Drag-and-drop two `results.json` files, view stat previews, run AI analysis, read markdown report |
| **CLI Script** | Node.js (ESM) | End-to-end pipeline: run tests → upload to LangFlow → print AI report in terminal |
| **Flake Simulation** | `.run-counter` file + `shouldFlake()` function | Rotates which tests fail per run so Build A and Build B always differ |

---

## 2. Why I Built It

### The Problem

- **Flaky tests** are tests that pass sometimes and fail other times without code changes.
  They erode trust in CI, waste engineering time on re-runs, and mask real bugs.
- Manual flake detection is tedious — you need to compare multiple test run outputs,
  cross-reference pass/fail statuses, and decide what's truly flaky vs consistently broken.

### The Goal

Build an **AI-powered tool** that:
1. Accepts two Playwright test result files (e.g., baseline build vs candidate build).
2. Automatically identifies which tests are **flaky** (passed in one run, failed in the other).
3. Identifies **consistent failures** (failed in both runs — these are real bugs, not flakes).
4. Provides **actionable recommendations** (quarantine, rerun, or escalate to engineering).
5. Works with a simple drag-and-drop UI — no CLI knowledge needed.

### Real-World Value

- Reduces triage time from hours to minutes.
- Separates signal (real bugs) from noise (flakes).
- Gives engineering managers visibility into test health trends.
- Can be plugged into CI/CD — run after every build, auto-generate a flake report.

---

## 3. How I Built It — Detailed Breakdown

### 3.1 Project Structure

```
6.FlakyTestAnalyzer/
├── Input/                          # Sample inputs + LangFlow flow JSON
│   ├── result1.json                # Build A (baseline) — 5 failures
│   ├── result2.json                # Build B (candidate) — 2 failures
│   ├── Flaky_Test_AIAgent.json     # LangFlow flow definition (importable)
│   └── screenshot.png
├── Playwright/                     # Test suite + scripts
│   ├── tests/
│   │   ├── e2e/todo/todo.spec.ts   # 16 TodoMVC E2E tests
│   │   ├── pages/
│   │   │   ├── base.page.ts        # Base Page Object (navigate, waitForPageLoad)
│   │   │   └── todo.page.ts        # TodoMVC Page Object (add, toggle, delete, filter)
│   │   ├── fixtures/
│   │   │   └── todo.fixture.ts     # Playwright fixture: auto-navigates to TodoMVC
│   │   └── utils/
│   │       ├── reporter.ts         # Custom JSON reporter
│   │       └── test-data.ts        # Test item data + random picker
│   ├── scripts/
│   │   ├── run-flaky.mjs           # Run Playwright twice, save result1.json + result2.json
│   │   └── run-and-analyze.mjs     # Full pipeline: test runs → upload → AI analysis
│   └── playwright.config.ts        # Playwright config
├── Project/ui/                     # React frontend
│   ├── src/
│   │   ├── App.jsx                 # Main app: layout, state, run pipeline
│   │   ├── components/
│   │   │   ├── UploadCard.jsx      # Drag-and-drop file card with stat preview
│   │   │   ├── Report.jsx          # Markdown report renderer + copy/download
│   │   │   └── Settings.jsx        # Connection settings panel
│   │   └── lib/
│   │       ├── api.js              # LangFlow upload + run + response parsing
│   │       └── playwright.js       # Parse results.json for stat preview
│   ├── vite.config.js              # Vite config with LangFlow proxy
│   └── package.json
├── steps.md                        # Step-by-step demo instructions
├── README.md                       # High-level overview
└── flaky_readme.md                 # This file
```

### 3.2 How the Flake Simulation Works

Real flaky tests are unpredictable. To reliably demonstrate the analyzer, I built a
**deterministic flake controller**:

1. A `.run-counter` file stores an integer (0 or 1).
2. The `shouldFlake(testIndex)` function reads this counter and uses modulo arithmetic:
   - **Run 0** (Build A, counter=1): Tests with index 0-3 fail → 4 failures
   - **Run 1** (Build B, counter=2): Tests with index 4-5 fail → 2 failures
3. Each run writes its counter before Playwright starts, producing a **different set of
   pass/fail tests** — exactly what the analyzer needs to compare.

```typescript
function shouldFlake(testIndex: number): boolean {
  const run = readRunNumber();
  if (run % 2 === 0) return testIndex < 4;   // Run 0: first 4 tests flake
  return testIndex >= 4 && testIndex < 6;     // Run 1: tests 4-5 flake
}
```

### 3.3 Custom Playwright Reporter

Playwright has built-in reporters (JSON, JUnit, HTML), but none produce the exact
output format that the LangFlow AI agent expects. I wrote a **custom reporter**
(`reporter.ts`) that:

1. Hooks into Playwright's `onBegin` and `onEnd` lifecycle events.
2. Walks the test suite tree to collect all test cases.
3. Groups tests by their parent suite title.
4. Tracks outcome status (expected/unexpected/skipped) and flaky detection
   (a test is flaky if it has both pass and fail results across retries).
5. Aggregates error messages per test.
6. Writes a structured JSON to `results/results.json`.

**Output format:**
```json
{
  "config": { "version": "1.61.0" },
  "suites": [
    {
      "title": "TodoMVC — Core functionality",
      "specs": [
        { "title": "should add a todo", "ok": false, "tests": [...] }
      ]
    }
  ],
  "errors": [
    { "spec": "Suite name", "test": "Test name", "message": "Error: Flaky — ..." }
  ],
  "stats": {
    "startTime": "...", "duration": 19273,
    "expected": 11, "skipped": 0, "unexpected": 5, "flaky": 0
  }
}
```

### 3.4 Page Object Model (POM)

The TodoMVC tests use a proper **Page Object Model** for maintainability:

- **BasePage** — Abstract class with `navigate()`, `waitForPageLoad()`, `getTitle()`.
- **TodoPage** — Extends BasePage with TodoMVC-specific methods:
  `addTodo()`, `toggleTodo()`, `deleteTodo()`, `editTodo()`, `filterByActive()`,
  `clearCompletedTodos()`, plus assertion helpers like `expectVisibleTodo()`.
- **TodoFixtures** — A Playwright fixture that auto-creates a TodoPage instance and
  navigates to the app before each test.

This separation means:
- Locators are defined once, used everywhere.
- If the TodoMVC UI changes, only the Page Object needs updating.
- Tests read like plain English: `await todoPage.addTodo('Buy groceries')`.

### 3.5 The LangFlow AI Agent

LangFlow is a **visual, low-code builder for LLM-powered agents**. The agent flow:

```
[File A Loader] ─┐
                 ├──► [LLM (Groq/DeepSeek)] ──► [Text Output]
[File B Loader] ─┘
```

**Components:**
- **Two File components** — Accept uploaded JSON files as input.
- **LLM component** — A Groq model (or any OpenRouter model) with a system prompt
  instructing it to analyze the two builds and produce a structured report.
- **Text Output** — Returns the AI-generated analysis.

**The prompt instructs the LLM to produce three sections:**
1. **FLAKY_TESTS** — Tests that passed in one build, failed in the other
2. **CONSISTENT_FAILURES** — Tests that failed in both builds (real bugs)
3. **RERUN_RECOMMENDATION** — What to do with each category

**Import/Export:** The flow is saved as `Input/Flaky_Test_AIAgent.json`, which can be
imported into any LangFlow instance via Settings → Import → Publish.

### 3.6 React UI Architecture

The UI is a **single-page React app** (Vite + React 18) with three key components:

**UploadCard** — Each card accepts a `results.json` file via drag-and-drop or file picker:
- Parses the JSON client-side to show a quick stat preview (passed/failed/flaky/skipped counts).
- Validates it's Playwright output (requires `stats` object).
- Shows file name, size, total tests, and duration.

**Settings** — Editable connection panel (persisted in `localStorage`):
- LangFlow base URL (blank = use Vite proxy for same-origin requests).
- API key (masked by default).
- Flow ID and File component IDs (change when you re-import the flow).
- Groq API key and model component ID.

**Report** — Renders the AI's markdown response:
- Uses `react-markdown` with GitHub Flavored Markdown (`remark-gfm`).
- Shows model name, token usage (input/output), and total latency.
- Copy to clipboard and download as `.md` file.

**CORS Workaround:** LangFlow's file-upload endpoint doesn't answer the browser's
CORS preflight (OPTIONS → 422). The Vite dev server proxies `/api/*` requests to
LangFlow, making them same-origin and bypassing CORS entirely.

**Analysis Pipeline (two API calls):**
1. **Upload** each file → `POST /api/v1/files/upload/{flowId}` → returns `file_path`.
2. **Run** the flow → `POST /api/v1/run/{flowId}?stream=false` with the two file paths
   injected as `tweaks` on the File components.

### 3.7 CLI Script (`run-and-analyze.mjs`)

For CI/CD or terminal-only use, a Node.js script runs the full pipeline:

1. Writes `.run-counter` = 1 → runs Playwright → saves `result1.json`.
2. Writes `.run-counter` = 2 → runs Playwright → saves `result2.json`.
3. Health-checks LangFlow (graceful skip if not running).
4. Uploads both files to LangFlow using `curl` (avoids Node.js FormData issues).
5. Runs the flow and extracts the AI report from the nested JSON response.
6. Prints the report with token usage and model info to the terminal.

**Environment variables for customization:**
- `LANGFLOW_URL` — Where LangFlow is running
- `LANGFLOW_KEY` — API key (or auto-login if blank)
- `GROQ_KEY` — Groq API key for the LLM component
- `FLOW_ID`, `FILE_ID_A`, `FILE_ID_B` — Component IDs from the imported flow

### 3.8 Demo Data

The `Input/` directory contains sample results:

| File | Failed Tests | Pattern |
|------|-------------|---------|
| `result1.json` (Build A) | 5 failures | add single/multiple, mark completed, delete, clear-completed visibility |
| `result2.json` (Build B) | 2 failures | edit todo, clear completed |

These produce clear flake detection: tests that fail only in one build are **flaky**,
and any test failing in both would be a **consistent failure**.

---

## 4. Technologies Used

| Layer | Technology | Why |
|-------|-----------|-----|
| Test Framework | Playwright 1.52 | Cross-browser E2E testing, reliable auto-waits, TypeScript support |
| Test Target | TodoMVC (demo.playwright.dev) | Standard benchmark app, no setup needed |
| AI Orchestration | LangFlow | Open-source visual AI builder, API-first, file upload native, model-agnostic (swap Groq → OpenAI → Ollama with a dropdown), flow JSON is version-controllable |
| LLM Provider | Groq / OpenRouter | Fast inference, supports DeepSeek V4 Flash, cost-effective |
| Frontend | React 18 + Vite 5 | Fast dev server, component model, CORS proxy |
| Markdown Rendering | react-markdown + remark-gfm | Renders AI output with tables, lists, bold |
| CLI Scripting | Node.js ESM | No extra deps, uses built-in fetch + curl |
| Reporter | Custom Playwright Reporter | Structured JSON output matching the analyzer's input contract |
| Flake Control | `.run-counter` file | Deterministic, repeatable flake simulation |

---

## 5. How to Run

### Quick Demo (Terminal Only)

```bash
# 1. Start LangFlow
cd Projects\6.FlakyTestAnalyzer
.\venv\Scripts\langflow.exe run --host 127.0.0.1 --port 7861

# 2. Generate results + analyze
cd Playwright
node scripts\run-and-analyze.mjs
```

### Full Demo (with UI)

```bash
# 1. Start LangFlow (same as above)

# 2. Generate fresh test results
cd Playwright
node scripts\run-flaky.mjs

# 3. Start the React UI
cd Project\ui
npm run dev

# 4. Open http://localhost:5173
#    - Drag Input/result1.json onto "Build A"
#    - Drag Input/result2.json onto "Build B"
#    - Click "Run Analysis"
```

### One-time Setup

```bash
cd Projects\6.FlakyTestAnalyzer
python -m venv .venv
.\venv\Scripts\pip install langflow

cd Playwright
npm install
npx playwright install chromium

cd Project\ui
npm install
```

---

## 6. Presentation Q&A — Anticipated Questions & Answers

### Architecture & Design

**Q: If LangFlow already has a UI, why build a separate React UI?**
A: LangFlow's UI is a **builder tool** for developers — it's a canvas where you wire
components together, test prompts, and publish flows. It is NOT an end-user interface
for running analyses. The React UI serves a completely different purpose:

1. **LangFlow = IDE for building AI agents.** You drag File components, connect them to
   LLMs, tweak prompts. The UI is the agent editor, not the agent's front-end.

2. **React UI = Purpose-built app for QA engineers/managers.** Drag-and-drop two result
   files, see instant stat previews (passed/failed/flaky/skipped counts), run analysis,
   read a formatted markdown report. No LangFlow knowledge needed — no one should have
   to open the flow builder to get a flake report.

3. **CORS handling is built in.** Vite proxies all `/api/*` requests to LangFlow,
   solving the browser's cross-origin upload failure. A direct LangFlow call from the
   browser would fail due to CORS.

4. **Persistence.** Connection settings (flow ID, file component IDs, API keys) are
   saved in `localStorage` — configure once, use forever. LangFlow's UI doesn't persist
   anything for end users.

5. **Single-purpose UX.** The React UI does one thing: compare two builds. LangFlow's
   UI does everything (build any agent). When you're triaging flaky tests in CI, you
   don't want a visual flow editor — you want one button.

**Q: Why use LangFlow instead of calling the LLM API directly? What are all the possible ways to build this?**
A: There are **5 different approaches** to building a flaky test analyzer, ranging from
simple to complex. Here's why I chose LangFlow and how each alternative works:

| Approach | How It Works | Pros | Cons |
|----------|-------------|------|------|
| **1. Direct LLM API call** (OpenAI/Groq SDK) | Write a Node.js/Python script that reads two JSON files, constructs a prompt, calls `openai.chat.completions.create()` directly | No extra tool to install, full control over prompt, cheapest infra | Must handle file uploads yourself, manual prompt engineering each time, hard to swap models, no visual debugging |
| **2. LangChain / LlamaIndex** | Build an agent chain: `JSONLoader → LLMChain → OutputParser`. Code the pipeline in Python/TypeScript | Reusable chain components, built-in output parsers, good for complex multi-step agents | Steep learning curve, heavy dependency, overkill for a 2-file comparison, verbose boilerplate |
| **3. LangFlow (chosen)** | Visual drag-drop: two File components + one LLM component. Publish → REST API endpoint | **Zero code** for the AI pipeline, visual debugging, instant API, swap models with dropdown, file upload handled natively, team can tweak flow without touching code | Requires LangFlow running locally, adds one dependency, flow IDs change on re-import |
| **4. CI-integrated script** (no AI) | Pure logic: diff the two JSON files with `jq` or a Node.js script — if a test passed in A and failed in B, mark it flaky | No LLM cost, deterministic, instant, works in any CI | No flake hypothesis/recommendation, no natural language report, can't explain *why* a test might be flaky, manual rule maintenance |
| **5. Custom ML model** | Train a classifier on historical test run data to predict flakiness probability | Learns patterns over time beyond pass/fail, can predict future flakes | Requires labeled training data, ML infra, model retraining, massive overkill for this use case |

**Why LangFlow was the right choice for this project:**
- I'm building an AI agent learning series — LangFlow demonstrates the pattern visually.
- The LLM doesn't just diff — it provides **flake hypotheses** ("timing race with localStorage"),
  **recommendations** ("quarantine this test"), and **natural language reports** stakeholders can read.
- Swapping models (Groq → OpenRouter → local Ollama) is a dropdown click, no code change.
- File upload, session management, and error handling are all built-in.
- The flow JSON can be exported, shared, and version-controlled.

**When would I choose a different approach?**
- CI-only, no AI needed → **Approach 4** (pure diff logic, instant, free).
- Need to embed in a larger Node.js service → **Approach 1** (direct SDK, no LangFlow dependency).
- Multiple complex AI steps (fetch API, query DB, then analyze) → **Approach 2** (LangChain chains).

**Q: Is LangFlow similar to Microsoft Copilot Studio?**
A: They are similar in concept — both are **low-code AI agent builders** — but they target
different audiences and ecosystems. Here's a direct comparison:

| Aspect | LangFlow | Copilot Studio |
|--------|----------|----------------|
| **Purpose** | Build & test LLM pipelines for developers | Build conversational AI bots for business users |
| **License** | Open source (MIT) — free, self-hosted | Proprietary — Microsoft 365 subscription, per-message pricing |
| **Where it runs** | Local machine, Docker, any cloud VM | Microsoft cloud only (Power Platform) |
| **Primary audience** | Developers, ML engineers, AI hobbyists | Business analysts, citizen developers, enterprise IT |
| **Interface style** | Drag-and-drop component canvas (nodes + edges) | Topic-based conversation designer (trigger phrases → actions → responses) |
| **Output** | REST API endpoint, Python/JSON export | Chatbot embedded in Teams, websites, mobile apps, Power Apps |
| **LLM support** | Any model — OpenAI, Groq, Ollama, Anthropic, local models | Azure OpenAI only (GPT models via Microsoft's managed service) |
| **Data handling** | Everything stays local — your machine, your data | Data flows through Microsoft's cloud (compliance: SOC 2, HIPAA) |
| **File handling** | Native file upload + processing components | Handled via Power Automate connectors |
| **Extensibility** | Write custom Python components, use any API, custom tools | Power Automate flows, connectors, custom connectors |
| **Dev experience** | Code-friendly — version control the flow JSON, CI/CD-friendly REST API | GUI-first — export/import solutions, managed environments, ALM via Power Platform |
| **Best for** | Developer tools, CI/CD pipelines, test automation, API-driven AI agents | Customer service bots, HR helpdesks, internal knowledge bots, enterprise chat |

**Key difference:** LangFlow is for **developers building AI-powered tools** — the output is an
API you call from code. Copilot Studio is for **business users building chatbots** — the output
is a conversational experience end-users interact with directly.

**When would you use each?**

| Scenario | Best Tool |
|----------|-----------|
| Flaky test analyzer calling AI from CI | **LangFlow** (API-first, local, free) |
| Customer support chatbot on your website | **Copilot Studio** (Teams/web embed, managed) |
| HR policy Q&A bot for employees | **Copilot Studio** (Teams integration, enterprise auth) |
| Code review AI agent in GitHub Actions | **LangFlow** (CI/CD-native, self-hosted, no per-message cost) |
| IT helpdesk auto-triage | **Copilot Studio** (Power Platform ecosystem, ticketing connectors) |
| QA automation agent (like this project) | **LangFlow** (API-driven, file processing, developer-owned) |

**Why LangFlow for this project specifically:**
1. The analyzer is called **programmatically** (from React UI and CLI script), not by a human chatting.
2. It processes **JSON files** — LangFlow's native file upload + parsing is purpose-built for this.
3. It needs to run **locally, in CI, or anywhere** — not tied to Microsoft's cloud.
4. **Zero cost** — open-source, self-hosted, no per-message pricing.
5. The flow JSON can be **version-controlled** in git alongside the test code.

If I were building an internal chatbot where QA engineers could ask "Which tests are flaky this
week?" and get a natural language response in Teams, Copilot Studio would be the better fit.

**Q: Why two API calls (upload + run) instead of one?**
A: LangFlow separates file upload from flow execution. The upload returns a server-side
`file_path`, which gets injected as a `tweak` into the File component during the run call.
This is LangFlow's standard pattern for file-based flows.

**Q: How does the Vite proxy handle CORS?**
A: LangFlow's `/api/v1/files/upload` endpoint returns HTTP 422 on CORS preflight
(OPTIONS request). The browser blocks cross-origin uploads as a result. Vite's dev server
proxies all `/api/*` requests to LangFlow, making them same-origin to the browser —
no CORS preflight needed.

**Q: Why a custom reporter instead of Playwright's built-in JSON reporter?**
A: The built-in reporter's schema is different from what the AI agent expects.
The custom reporter produces a cleaner, flat format with grouped suites, explicit
ok/status fields, and dedicated `errors[]` array — all optimized for LLM consumption.

**Q: Why simulate flakes deterministically instead of using real flaky tests?**
A: Real flakes are unpredictable by definition — you can't demo them reliably.
The `.run-counter` approach guarantees different pass/fail patterns every run,
making the analyzer's output predictable and demo-able. For production, you'd
run against real CI result files without the simulation.

### Security

**Q: Where are API keys stored?**
A: In the UI, keys are in `localStorage` (browser-only, never sent to any server
except LangFlow). In the CLI, they come from environment variables. Keys are never
committed to git. The UI's `.env` with `VITE_API_KEY` is gitignored.

**Q: Does the UI send test data anywhere besides LangFlow?**
A: No. All requests go to the configured LangFlow instance (either direct or via
Vite proxy). No telemetry, no third-party services.

### Scalability & Production

**Q: Can this handle 1000+ test results?**
A: Yes. The LLM is the bottleneck, not the pipeline. For large suites, you can:
- Split results by module and analyze in batches.
- Use a model with larger context windows (e.g., GPT-4 Turbo 128K).
- Summarize results before sending to the LLM.

**Q: How would you plug this into CI/CD?**
A: Run `node scripts/run-and-analyze.mjs` as a post-build step. Set `LANGFLOW_URL`
and `GROQ_KEY` as CI secrets. The script exits with code 0 after printing the report.
For GitHub Actions, post the markdown report as a PR comment.

**Q: What if LangFlow is down?**
A: The CLI script gracefully skips the AI analysis if LangFlow is unreachable and
prints a message. The test results are still saved. The UI shows a clear error with
troubleshooting hints.

### Technical Decisions

**Q: Why TodoMVC as the test target?**
A: It's a well-known, stable benchmark app hosted at `demo.playwright.dev` — no local
server setup needed. It has enough interactions (add, toggle, delete, filter, edit,
persistence) to write meaningful tests.

**Q: Why Groq/DeepSeek V4 Flash instead of GPT-4?**
A: Groq offers the fastest inference (tokens/second) of any provider, and
DeepSeek V4 Flash is cost-effective. The task (comparing two JSON files) doesn't
require a frontier model. But the flow works with any model LangFlow supports —
just change the model component.

**Q: Why React instead of a simpler framework?**
A: React's component model maps cleanly to the UI structure (independent cards,
report panel, settings). `react-markdown` with GFM handles the AI's markdown output
natively. Vite's proxy config is a one-liner.

**Q: Explain `run-and-analyze.mjs` — what does it do and how do I use it?**
A: `run-and-analyze.mjs` is the **end-to-end automation script** that runs the
entire flaky test analysis pipeline in one command — no UI, no manual steps.

#### What it does (4-step pipeline)

```
Step 1: Run Playwright twice
   ├── Writes .run-counter = 1 → runs npx playwright test → saves result1.json
   └── Writes .run-counter = 2 → runs npx playwright test → saves result2.json

Step 2: Health-check LangFlow
   ├── Pings GET /health with 3s timeout
   └── If unreachable → prints a message, exits gracefully (results still saved)

Step 3: Upload both files to LangFlow
   ├── Uses curl (not Node.js fetch) to avoid FormData multipart issues
   ├── POST /api/v1/files/upload/{flowId} for each file
   └── Returns server file_path for each

Step 4: Run the AI analysis
   ├── POST /api/v1/run/{flowId}?stream=false
   ├── Injects the two file_paths as tweaks on the File components
   └── Parses the nested JSON response to extract the markdown report

Output: Prints the formatted report with flake hypotheses, consistent failures,
        rerun recommendations, model info, and token usage.
```

#### How to use it

```bash
cd Playwright

# Basic usage (LangFlow must be running on localhost:7861)
node scripts/run-and-analyze.mjs

# With custom configuration via environment variables
set LANGFLOW_URL=http://192.168.1.50:7861
set GROQ_KEY=gsk_your_groq_api_key
set FLOW_ID=your-flow-id
set FILE_ID_A=File-XXXXX
set FILE_ID_B=File-YYYYY
node scripts/run-and-analyze.mjs

# If LangFlow is not running, it still generates result1.json and result2.json
# and prints: "Results saved. Start LangFlow and re-run."
```

#### Key design decisions in the script

| Detail | Why |
|--------|-----|
| **Uses `curl` for file upload** | Node.js `FormData` with `fetch()` has inconsistent boundary handling across platforms. `curl` via `execSync` is rock-solid for multipart uploads to LangFlow. |
| **Graceful skip if LangFlow is down** | Tests still run and results are still saved. The analysis step is optional — you can always analyze later from the UI. |
| **Tweaks injection** | File component IDs (`File-HtpAM`, `File-Nv50X`) are mapped to the uploaded file paths. If you have a Groq API key, it's injected into the model component's `api_key` field. |
| **Nested JSON parsing** | LangFlow's response is deeply nested: `outputs[0].outputs[0].results.message.text`. The script has fallback paths (`artifacts.message`, `outputs.message.message`) in case the structure changes. |
| **Unique session per run** | `cli-{timestamp}` session ID isolates each analysis run in LangFlow's history. |
| **Non-zero exit on playwright failure is expected** | `execSync` throws on non-zero exit, so it's wrapped in try/catch — test failures are normal in this demo. |

**Q: What is the `.mjs` extension and why use it?**

A: `.mjs` stands for **Module JavaScript**. It explicitly tells Node.js to treat
the file as an **ES module** (using `import`/`export` syntax) regardless of the
project's `package.json` settings.

| Extension | Meaning | Import syntax | When used |
|-----------|---------|---------------|-----------|
| `.js` | Depends on `package.json` `"type"` field | `"type": "module"` → `import` / `"type": "commonjs"` → `require()` | Regular project files |
| `.mjs` | **Always ES module** | Always `import`/`export` | Standalone scripts, mixed-module projects, CI scripts |
| `.cjs` | **Always CommonJS** | Always `require()` | Legacy scripts, config files |

**Why these scripts use `.mjs`:**
1. **Explicitness** — these scripts may be run from any directory (not just the
   Playwright project root). Without a nearby `package.json` setting the type,
   Node.js would default to CommonJS and throw `SyntaxError: Cannot use import
   statement outside a module`.
2. **Cross-platform clarity** — anyone reading the file instantly knows it's an
   ES module, no need to check the nearest `package.json`.
3. **Playwright itself uses ESM** — the project's `package.json` has `"type": "module"`,
   so `.js` works fine within the project. But `.mjs` makes these scripts self-documenting
   and runnable from anywhere.

**Important note:** The Playwright `package.json` already has `"type": "module"`, so
`.js` files in that directory also use ES module syntax. The `.mjs` extension is a
belt-and-suspenders approach — it works even if you copy the script to a non-module
project.

### Testing & Quality

**Q: Does the Flaky Test Analyzer tell HOW a test is flaky and the possible reason for failure? If yes, how does it figure that out?**

A: **Yes — and this is the core value of using AI instead of a simple diff script.**
The analyzer works at **two layers**:

#### Layer 1 — Test Code Simulation (deterministic flake messages)

During simulation (demo mode), each failing test throws an error with a **descriptive
message** that mimics real Playwright failures:

```typescript
// From todo.spec.ts — flake simulation
if (shouldFlake(0)) throw new Error('Flaky — add item race');
if (shouldFlake(3)) throw new Error('Flaky — delete race');
if (shouldFlake(9)) throw new Error('Flaky — localStorage persistence race');
```

These messages are captured by the **custom reporter** and stored in `results.json`:

```json
"errors": [
  { "spec": "TodoMVC — Core functionality",
    "test": "should add a single todo item",
    "message": "Error: Flaky — add item race" },
  { "spec": "TodoMVC — Core functionality",
    "test": "should persist todos after page reload",
    "message": "Error: Flaky — localStorage persistence race" }
]
```

#### Layer 2 — AI Agent Deep Reasoning (LangFlow LLM)

The **LLM receives both result files** (all test names, pass/fail statuses,
error messages) and is prompted to:

1. **Compare Build A vs Build B** — which tests failed only in one build? → those are flaky.
2. **Read the error messages** — what does each error say? → hints at root cause.
3. **Apply Playwright domain knowledge** — map error patterns to known flake categories.
4. **Generate a flake hypothesis** — explain WHY the test likely flakes.

The LLM prompt instructs it to produce three sections:
- **FLAKY_TESTS** — with **flake hypotheses**
- **CONSISTENT_FAILURES** — root cause analysis
- **RERUN_RECOMMENDATION** — what action to take

#### How the LLM Generates Hypotheses — The Reasoning Chain

The LLM looks at multiple signals and combines them:

| Signal from results.json | What the LLM infers |
|--------------------------|---------------------|
| Test name: *"should persist todos after page reload"* | This test involves `page.reload()` — likely a state/timing race with localStorage |
| Test passed in Build B but failed in Build A | Confirms non-deterministic behavior → this IS a flaky test, not a real bug |
| Error message: *"Flaky — localStorage persistence race"* | Direct diagnostic: the assertion races against the DOM re-render after reload |
| Duration: 1273ms in the flaky run | The test is near a timeout threshold, suggesting a race condition |
| Test name: *"should add a single todo item"* + error: *"add item race"* | Input + Enter key interaction before the TodoMVC app has finished processing the previous action |

The LLM then produces output like:

```markdown
**FLAKY_TESTS**

**should persist todos after page reload** (Build A: FAIL, Build B: PASS)
→ Flake hypothesis: localStorage persistence race.
  After `page.reload()`, the TodoMVC app re-renders from localStorage.
  The assertion `expectVisibleTodo()` races against the re-render cycle.
  In Build A, the assertion ran before the app had rehydrated state from
  localStorage. In Build B, the timing was favorable.

**should add a single todo item** (Build A: FAIL, Build B: PASS)
→ Flake hypothesis: add item race.
  `fill()` + `press('Enter')` may fire before the TodoMVC app has finished
  processing the previous keystroke or the Enter key event is dropped if
  the input field loses focus during the interaction.

**RERUN_RECOMMENDATION**
- Quarantine "should persist todos": add `waitForLoadState('networkidle')`
  and `waitForFunction()` to check localStorage before the assertion.
- Quarantine "should add a single todo": use `toPass()` with retries.
```

#### In Production (Real CI, Not Simulation)

In a real CI pipeline, the Playwright error messages would be **real diagnostic messages**:

| Real Playwright Error | What the LLM would diagnose |
|-----------------------|---------------------------|
| `"TimeoutError: page.waitForSelector: Timeout 30000ms exceeded"` | Element not rendered — suggests missing `waitFor`, slow network, or race condition with dynamic content |
| `"expect(locator).toBeVisible() failed: element is not visible"` | CSS transition/animation still in progress — suggests adding `waitFor({ state: 'visible' })` or checking `display:none` / `visibility:hidden` styles |
| `"Error: strict mode violation: locator resolved to 2 elements"` | Multiple matching elements — suggests the selector is too broad or needs `first()` / `nth()` |
| `"locator.click: Target closed"` | Page navigation destroyed the element — suggests `waitForNavigation` or handling page transitions before clicking |
| `"expect(received).toBe(expected)"` (assertion mismatch) | Expected vs actual mismatch — LLM analyzes the diff to suggest the correct assertion |

The LLM doesn't just repeat the error — it **reasons about the cause** using its
knowledge of:
- Playwright's auto-wait mechanics
- Common DOM race conditions
- Network timing issues
- React/Vue rendering lifecycles
- Browser event loop behavior

#### The Complete Chain

```
Test code throws error (simulated or real)
        │
        ▼
Custom Playwright Reporter captures it in results.json
        │
        ▼
result1.json + result2.json sent to LangFlow LLM
        │
        ▼
LLM cross-references: which tests flaked? what errors? what test names?
        │
        ▼
LLM applies Playwright domain knowledge → flake hypothesis
        │
        ▼
Report: "Test X is flaky. Likely cause: Y. Recommended fix: Z."
```

**Without AI** (Approach 4 — pure diff), you'd only get: *"test X failed in Build A, passed in Build B → flaky."*
No explanation, no hypothesis, no recommendation.

**With AI**, you get: *"test X failed with a localStorage race after page reload — add waitForLoadState and waitForFunction before the assertion → quarantine it."*

**Q: How do you know the flake detection is correct?**
A: The `shouldFlake()` function is deterministic — given counter=0, tests 0-3 always
fail. The analyzer identifies exactly those tests as flaky because they pass in Build B.
You can verify by checking `result1.json` vs `result2.json` manually.

**Q: What if the LLM hallucinates or produces wrong output?**
A: The prompt constrains the output to a structured format (three sections).
The LLM works with concrete data (actual test names, pass/fail statuses), not
abstract reasoning. In testing, the output has been consistently accurate.
For production, you can add a validation layer that cross-references the LLM's
output against the raw JSON.

### Business Value

**Q: How much time does this save?**
A: Manual flake triage for a 100-test suite takes ~30 minutes (opening two JSON files,
cross-referencing, categorizing). The analyzer does it in ~10 seconds. For teams running
5+ builds/day, that's ~2.5 engineering-hours saved per day.

**Q: What's the cost per analysis?**
A: Two ~300-line JSON files produce roughly:
- ~2000 input tokens
- ~800 output tokens
At DeepSeek V4 Flash pricing (~$0.14/M input, ~$0.28/M output): < $0.001 per analysis.

**Q: Can non-technical stakeholders use this?**
A: Yes — the React UI is drag-and-drop. Drop two files, click "Run Analysis", read the
report. No terminal, no config. The Connection panel only needs setup once by a developer.

### Troubleshooting

**Q: "Failed to fetch" when uploading from the UI?**
A: LangFlow's CORS issue. Use the Vite proxy (leave the base URL blank) or start
LangFlow with CORS headers enabled.

**Q: Upload returns 404?**
A: Wrong Flow ID. Check the URL in LangFlow after publishing the flow.

**Q: Analysis returns empty?**
A: The File component IDs in Settings don't match the imported flow. Open the flow in
LangFlow, check the File node IDs, update in Settings.

**Q: LangFlow won't start (port in use)?**
A: `netstat -ano | findstr 7861` to find the process, then kill it. Or use
`--port 7862` and update the URL.

---

## 7. Key Takeaways

1. **Flaky tests are a real CI problem** — They erode trust and waste engineering time.
   Automated detection with AI makes triage fast and accurate.

2. **LangFlow powers AI agents without coding** — An open-source, model-agnostic visual builder.
   Published flows become REST APIs. Unlike Copilot Studio (business chatbots), LangFlow is built
   for developer tools and CI/CD pipelines — the output is an API, not a conversation.

3. **Deterministic simulation enables reliable demos** — The `.run-counter` approach
   guarantees reproducible results while mimicking real flake behavior.

4. **CORS is a common obstacle with local AI tools** — Vite's proxy config is a
   one-line solution that works for any API that doesn't support CORS.

5. **Custom reporters unlock structured data pipelines** — Playwright's reporter API
   makes it easy to output test results in any format an AI agent or dashboard needs.

---

*Built as part of AI Agents with LangFlow learning series — Chapter 05*

---

## 8. Next Step — Self-Healing Agent in Playwright

### The Problem After Flake Detection

Once the Flaky Test Analyzer identifies a flaky test, the natural next question is:
**"Now what?"** Currently, a human must:
1. Read the flake hypothesis (e.g., "timing race with localStorage").
2. Open the test file, find the flaky test.
3. Diagnose the root cause (missing `waitFor`, race condition, stale selector).
4. Fix the code manually.
5. Re-run to verify.

This is manual, slow, and often requires context-switching between the analysis
report and the test code.

### What Is a Self-Healing Agent?

A **self-healing agent** is an AI system that:
1. Reads the flaky test analysis report (from the Flaky Test Analyzer).
2. Reads the actual Playwright test code for each identified flaky test.
3. Diagnoses the root cause using the LLM's knowledge of Playwright best practices.
4. **Proposes or applies a fix** — e.g., adding `waitForSelector`, increasing timeout,
   using `toPass()`, replacing a race-prone assertion.
5. Re-runs the test to verify the fix works.
6. If the fix fails, iterates — tries a different approach.

It turns **"test X is flaky"** into **"test X is fixed and verified"** without
human intervention.

### How a Self-Healing Agent Can Be Built

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Flaky Test       │────►│ Healing Agent    │────►│ Fixed Test      │
│ Analyzer Output  │     │ (LangFlow / LLM) │     │ (Playwright run) │
│ - test names     │     │                  │     │ ✅ all green     │
│ - flake reasons  │     │ Read code →      │     │                 │
│ - error messages │     │ Diagnose →       │     │                 │
└─────────────────┘     │ Fix → Verify     │     └─────────────────┘
                        └──────────────────┘
```

#### Architecture — 3 Components

**1. Code Reader Tool**
A LangFlow **Tool** component (or a simple Node.js function) that:
- Takes a test file path and test name.
- Reads the test file from disk.
- Extracts only the relevant test function (the `test('...', async ({...}) => {...})` block).
- Also reads the Page Object methods the test calls.
- Returns the code context to the LLM.

```typescript
// Example: Extract a specific test from a spec file
function extractTest(filePath: string, testName: string): {
  testCode: string,
  pageMethods: string[],
  imports: string
}
```

**2. Diagnosis & Fix Agent**
The core LLM prompt analyzes the test code against the flake error. It knows
Playwright's best practices:

| Flake Pattern | Common Root Cause | Typical Fix |
|---------------|-------------------|-------------|
| Timeout waiting for element | Page not fully loaded | Add `waitForSelector` or `waitForLoadState('networkidle')` |
| Element not visible | CSS transition/animation in progress | Use `toBeVisible()` instead of `toBeAttached()`, or add `{ visible: true }` |
| Stale element reference | DOM re-render between locate and act | Re-locate element before action, use `page.locator()` (auto-retry) |
| Race condition on input | `fill()` not awaited, or typing before input ready | Use `fill()` instead of `type()`, add `waitFor` before input |
| localStorage/state race | Page reload or navigation before state persisted | Add `page.waitForFunction()` to check localStorage, or use `toPass()` |
| Network response race | API call not completed before assertion | Use `page.waitForResponse()` or `waitForRequest()` |
| Flaky due to parallel execution | Test assumes isolated state but shares data | Set `fullyParallel: false` for the specific test, or use `test.describe.serial` |
| Random data collision | Hardcoded test data collides with other tests | Use unique IDs per run (`Date.now()`, `crypto.randomUUID()`) |

**3. Verification Runner**
After the agent proposes a fix, it:
- Writes the fix to the test file (or creates a temp copy).
- Runs `npx playwright test` for just that one test: `npx playwright test --grep "test name"`.
- If the test passes 3 consecutive times (to confirm flake is gone), marks it resolved.
- If it still fails, feeds the new error back to the LLM for another attempt.
- Maximum retry attempts: 3 fix attempts before flagging for human review.

### Implementation Approach (3 Options)

**Option A — LangFlow Healing Flow (Recommended for learning/demo)**

A second LangFlow flow that chains the Flaky Test Analyzer output into a healing pipeline:

```
[Flaky Analyzer Output] ──► [Code Reader Tool] ──► [LLM: Diagnose & Fix] ──► [Shell Tool: Run Test] ──► [Verification]
                                                                                                              │
                                                                                            ┌─────────────────┘
                                                                                            │ pass? → DONE
                                                                                            │ fail? → retry (max 3)
```

- **Pros:** Same LangFlow pattern, visual, easy to extend, no new dependencies.
- **Cons:** Limited for complex file editing, LangFlow tools are simple functions.

**Option B — CLI Script with LLM SDK (Practical)**

A Node.js script that:
1. Parses the Flaky Analyzer report → gets list of flaky tests.
2. For each flaky test:
   - Reads the test + page object code.
   - Sends to OpenAI/Groq SDK with a system prompt containing Playwright best practices.
   - Parses the LLM's suggested fix (expected format: `// FIX: <explanation>\n<code>`).
   - Applies the fix using `edit_file`-like logic (find & replace).
   - Shells out to `npx playwright test --grep "test name"` — retries up to 3 times.
   - If all retries pass, commits the fix; if not, logs the failure for human triage.

```javascript
// Pseudocode for the healing loop
for (const flakyTest of report.flakyTests) {
  let fixed = false;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const testCode = readTestCode(flakyTest.file, flakyTest.name);
    const fix = await llm.diagnoseAndFix(testCode, flakyTest.error, flakyTest.hypothesis);
    applyFix(flakyTest.file, flakyTest.name, fix);
    const { passed } = await runTest(flakyTest.name, { retries: 3 });
    if (passed) {
      console.log(`✅ Healed: ${flakyTest.name} (attempt ${attempt})`);
      fixed = true;
      break;
    }
  }
  if (!fixed) {
    console.log(`❌ Could not auto-heal: ${flakyTest.name} — needs manual review`);
    revertFix(flakyTest.file);
  }
}
```

- **Pros:** Full control, git-safe (can revert), works in CI, no LangFlow dependency.
- **Cons:** More code to write, no visual debugging.

**Option C — Playwright + AI Test Generation (Emerging)**

Playwright has built-in **codegen** and emerging AI features. An advanced approach:
- Use Playwright's `test.step` tracing to capture the exact DOM state at failure.
- Feed the trace + screenshot + error to a multimodal LLM (GPT-4 Vision).
- Let the LLM regenerate the specific test step that failed.
- Replace the step, re-run.

- **Pros:** Uses real failure context (DOM, network, screenshots), more accurate fixes.
- **Cons:** Requires multimodal model (higher cost), Playwright's AI features are still evolving.

### Example — Before & After a Self-Healing Fix

**Flaky Test (identified by analyzer):**
```typescript
test('should persist todos after page reload', async ({ todoPage, page }) => {
  await todoPage.addTodo('Persistent task');
  await page.reload();
  await todoPage.expectVisibleTodo('Persistent task'); // FLAKY!
});
```

**LLM Diagnosis:**
> "The test reloads the page but doesn't wait for the app to rehydrate from localStorage.
> The assertion races against the render cycle. This is a classic localStorage persistence race."

**Self-Healing Fix (auto-applied):**
```typescript
test('should persist todos after page reload', async ({ todoPage, page }) => {
  await todoPage.addTodo('Persistent task');
  await page.reload();
  await todoPage.waitForPageLoad();                    // ← Added: wait for network idle
  await page.waitForFunction(() =>                     // ← Added: wait for localStorage rehydration
    localStorage.getItem('todos') !== null
  );
  await todoPage.expectVisibleTodo('Persistent task');
});
```

### Guardrails — Preventing Bad Fixes

| Guardrail | How It Works |
|-----------|-------------|
| **Run 3 consecutive passes** | A flaky test is only "healed" if it passes 3 times in a row |
| **No changes to test intent** | The LLM is instructed to only add waits/retries, never change assertions or test logic |
| **Git diff review** | All auto-fixes are committed to a `healing/` branch for human review before merge |
| **Timeout cap** | Auto-added waits are capped at 30s to prevent the agent from papering over real bugs with long waits |
| **Revert on new failure** | If a "healed" test flakes again in future runs, the fix is automatically reverted and re-flagged |
| **Confidence threshold** | The LLM must explain its reasoning; fixes without clear rationale are skipped |

### How This Completes the Story

```
  Flaky Test Analyzer                    Self-Healing Agent
  (detects the problem)         ──►     (fixes the problem)
  ┌─────────────────────┐              ┌──────────────────────┐
  │ "test X is flaky"   │              │ Reads test code      │
  │ "race condition"    │              │ Diagnoses root cause │
  │ "quarantine it"     │              │ Applies fix          │
  └─────────────────────┘              │ Verifies 3x pass     │
                                       │ Reports "healed"     │
                                       └──────────────────────┘
```

This creates a **closed-loop CI system**: tests run → flaky tests auto-detected →
flaky tests auto-fixed → tests re-run → green build. Human intervention only needed
when the agent can't fix it after 3 attempts.

### Pre-requisites for a Healing Agent

1. Flaky Test Analyzer must produce structured output with test names, file paths,
   error messages, and flake hypotheses.
2. Page Object Model must be used (so the agent can read the called methods).
3. Tests must be in a git repo (so fixes can be committed, diffed, and reverted).
4. The LLM must have access to the test file code (read from disk or provided inline).
