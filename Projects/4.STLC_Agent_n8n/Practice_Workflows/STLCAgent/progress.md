# Progress — STLC Agent

## v10 (Current — matches user spec)

### 12 Nodes
| # | Name | Type |
|---|------|------|
| 1 | STLC Agent Form | Form Trigger |
| 2 | Extract PRD PDF | Extract From File (PDF) |
| 3 | Generate Test Plan | AI Agent |
| 4 | Save Test Plan | Convert To File → Test_Plan.md |
| 5 | Generate Test Cases | AI Agent |
| 6 | Save Test Cases | Convert To File → Test_Cases.csv |
| 7 | Generate Playwright Tests | AI Agent |
| 8 | Save Playwright Tests | Convert To File → playwright_tests.ts |
| 9 | Brain (Groq) | LM Chat Groq (llama-3.3-70b-versatile) |
| 10 | Merge Outputs | Merge (append, 3 inputs) |
| 11 | Combine Outputs | Code (collects 3 binary fields) |
| 12 | Download Files | Form Ending (completion, respondWith: "file") |

### Connections
```
Form → Extract → Generate Test Plan → [Save Test Plan + Generate Test Cases]
                                        → Merge (input 0)
                   Generate Test Cases → [Save Test Cases + Generate Playwright Tests]
                                        → Merge (input 1)
                   Generate Playwright Tests → Save Playwright Tests
                                              → Merge (input 2)
Merge → Combine Outputs → Download Files
Brain → [Generate Test Plan, Generate Test Cases, Generate Playwright Tests]
```

### Wait nodes (rate-limit protection)
- Wait 2s (TP→TC): between Generate Test Plan and Generate Test Cases
- Wait 2s (TC→PW): between Generate Test Cases and Generate Playwright Tests

### Key fixes in v10
- Extract PDF → `$json.text` (not `$json.data`)
- TC/PW agents reference prior agents via `$node["Generate Test Plan"].json.output`
- ConvertToFile uses `operation: "toText"` and `sourceProperty: "output"`
- Groq in SINGLE array, not 3 separate
- Fork pattern preserves text flow between agents
- Merge (append) + Code → Form Ending for multi-file download
- Model: llama-3.3-70b-versatile shared across all 3 agents
- Output files: Test_Plan.md, Test_Cases.csv, playwright_tests.ts
