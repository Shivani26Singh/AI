# Flaky Test Analyzer — Demo Steps

## Prerequisites

| Tool | Check |
|------|-------|
| Node.js | `node -v` → v18+ |
| Playwright browsers | Already installed (chromium) |
| LangFlow | See **Step 1** |

---

## Step 1 — Start LangFlow

```bash
cd Playwright
scripts\start-lf.bat
```

> **Verify:** Open http://localhost:7861 — you should see the LangFlow UI.

---

## Step 2 — Import the agent flow

In the LangFlow UI (http://localhost:7861):

1. Click **Settings** (gear icon, top-right)
2. **Import** → select `Input/Flaky_Test_AIAgent.json`
3. Once imported, click **Publish** (top-right)
4. Copy the **Flow ID** from the URL — it looks like `e6ac9777-4c92-4d49-927f-853e8899ffb8`

---

## Step 3 — Generate test results & run analysis (Option A — all-in-one)

```bash
cd Playwright
node scripts\run-and-analyze.mjs
```

This does everything:
1. Runs Playwright tests twice (Build A / Build B)
2. Uploads both result files to LangFlow
3. Runs the AI analysis
4. Prints the flaky test report to the terminal

**Output files:**
- `Input/result1.json` — Build A (baseline)
- `Input/result2.json` — Build B (candidate)

---

## Step 3 — Generate test results only (Option B — for UI demo)

```bash
cd Playwright
node scripts\run-flaky.mjs
```

Generates fresh results without calling LangFlow. Output goes to `Input/result1.json` and `Input/result2.json`.

---

## Step 4 — Start the React UI

```bash
cd Project\ui
npm run dev
```

Open the URL printed in the terminal (default http://localhost:5173).

### What you'll see

A clean two-card UI. On each card:
- Drag & drop a `results.json` file
- See a quick summary (passed / failed / flaky / skipped)

### Run analysis from the UI

1. Drag `Input/result1.json` onto the **Build A** card
2. Drag `Input/result2.json` onto the **Build B** card
3. Click **Run Analysis**
4. The AI report renders as formatted markdown showing:
   - **FLAKY_TESTS** — tests that passed in one build, failed in another
   - **CONSISTENT_FAILURES** — tests that failed in both builds
   - **RERUN_RECOMMENDATION** — what to do next

### Connection settings (if needed)

Click the gear icon in the UI to configure:
| Setting | Default Value |
|---------|---------------|
| LangFlow URL | `http://localhost:7861` |
| Flow ID | Your flow ID from Step 2 |
| API Key | (blank if auth is off) |
| File Component IDs | `File-HtpAM`, `File-Nv50X` (may differ by flow) |

---

## Quick demo script (direct terminal)

If you want to skip the UI entirely:

```bash
cd Playwright
node scripts\run-and-analyze.mjs
```

This runs everything end-to-end and prints the report to the terminal.

---

## Expected output

Run A and Run B each produce **1 failure on a different test** (the flake simulation rotates which test fails vs passes). The AI agent will identify:

- **FLAKY_TESTS** — tests that passed in one build and failed in the other
- **CONSISTENT_FAILURES** — tests that failed in both builds
- **RERUN_RECOMMENDATION** — which tests to rerun, quarantine, or escalate to engineering

### Sample output

```
FLAKY_TESTS
  • should persist todos after page reload     ── Build A: FAIL  / Build B: PASS
  • should not show clear-completed when ...   ── Build A: PASS  / Build B: FAIL

CONSISTENT_FAILURES — None

RERUN_RECOMMENDATION
  Rerun the two flaky tests; quarantine if they
  continue to fail intermittently.
```

The agent also provides **flake hypotheses** (e.g. "timing/race issue with localStorage") — good talking points for engineering handoff.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `ECONNREFUSED` on upload | LangFlow is not running → run `scripts\start-lf.bat` |
| `404` on upload | Wrong Flow ID → check the ID in the LangFlow URL after publishing |
| Upload fails (CORS) | Use the Vite proxy (don't open the UI directly from the filesystem) |
| No `x-api-key` | Leave it blank if LangFlow is running locally without auth |
| File component IDs wrong | Open the flow in LangFlow, check the **File** component IDs |
