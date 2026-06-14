# Findings — STLC Agent

## v10 Architecture (matches user spec)

### Node names
1. **STLC Agent Form** — `n8n-nodes-base.formTrigger` (v2.5)
2. **Extract PRD PDF** — `n8n-nodes-base.extractFromFile` (v1.1), `operation: "pdf"`
3. **Generate Test Plan** — `@n8n/n8n-nodes-langchain.agent` (v3.1)
4. **Save Test Plan** — `n8n-nodes-base.convertToFile` (v1.1), `operation: "toText"` → Test_Plan.md
5. **Generate Test Cases** — `@n8n/n8n-nodes-langchain.agent` (v3.1)
6. **Save Test Cases** — `n8n-nodes-base.convertToFile` (v1.1), `operation: "toText"` → Test_Cases.csv
7. **Generate Playwright Tests** — `@n8n/n8n-nodes-langchain.agent` (v3.1)
8. **Save Playwright Tests** — `n8n-nodes-base.convertToFile` (v1.1), `operation: "toText"` → playwright_tests.ts
9. **Brain (Groq)** — `@n8n/n8n-nodes-langchain.lmChatGroq` (v1), `model: "llama-3.3-70b-versatile"`
10. **Merge Outputs** — `n8n-nodes-base.merge` (v3.2), `mode: "append"`
11. **Combine Outputs** — `n8n-nodes-base.code` (v2)
12. **Download Files** — `n8n-nodes-base.form` (v2.5), `respondWith: "{{ \"file\" }}"`

### Correct fork pattern
- Extract PDF outputs `$json.text` — NOT `$json.data`
- TP Gen output forks to Save TP (binary) + TC Gen (text) simultaneously
- TC Gen references TP Gen directly: `{{ $node["Generate Test Plan"].json.output }}`
- TC Gen output forks to Save TC (binary) + PW Gen (text) simultaneously
- PW Gen references TC Gen directly: `{{ $node["Generate Test Cases"].json.output }}`
- All 3 Save nodes → Merge (3 inputs) → Code (combine binaries) → Form Ending (binary)

### Groq connection format (CRITICAL)
- Single array with all 3 agents:
```json
"ai_languageModel": [
  [
    { "node": "Generate Test Plan", "type": "ai_languageModel", "index": 0 },
    { "node": "Generate Test Cases", "type": "ai_languageModel", "index": 0 },
    { "node": "Generate Playwright Tests", "type": "ai_languageModel", "index": 0 }
  ]
]
```
- NOT 3 separate arrays — n8n only reads the first one

### ConvertToFile correct params
- `operation: "toText"` — required, otherwise defaults to CSV
- `sourceProperty: "output"` — reads AI Agent text output
- `fileName` — output filename
- `options.dataPropertyName` — NOT used in current JSON (binary flows through Merge/Combine)

### Prompt pattern (taste rule)
- Must have static text prefix: `"=Generate...\n\n{{ expression }}"`
- Bare `"={{ expression }}"` causes "No prompt specified" error

### Model
- `llama-3.3-70b-versatile`: current active model shared across all 3 agents
- `gemma2-9b-it`: used in generate_workflow.js as fallback
- `qwen/qwen3-32b`: 6000 TPM limit (on-demand tier) — previously used

### Output File Names (as generated)
- Test Plan: **Test_Plan.md** (note: Title Case, not lowercase)
- Test Cases: **Test_Cases.csv** (note: Title Case, not lowercase)
- Playwright: **playwright_tests.ts** (note: .ts extension, not .md)
