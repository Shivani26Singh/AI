# Task Plan — STLC Agent Workflow

## Goal
Build an importable n8n JSON workflow: "STLC Agent - PRD to Test Plan, Test Cases and Playwright"

## Phases
- [x] Phase 0: Initialize project memory
- [x] Phase 1: Research existing n8n workflow JSON patterns
- [x] Phase 2: Build workflow JSON — 12-node chain with fork pattern
- [x] Phase 3: Validate JSON structure and generate output artifacts

## Node Chain
1. Form Trigger — "STLC Agent Form" (PDF upload, mimeType: application/pdf)
2. Extract From File — "Extract PRD Content" (PDF → text)
3. AI Agent — "Generate Test Plan" → Test Plan markdown
4. Convert To File — "Save Test Plan" → Test_Plan.md
5. Wait — "Wait 2s (TP→TC)" (rate-limit protection)
6. AI Agent — "Generate Test Cases" → Test Cases CSV
7. Convert To File — "Save Test Cases" → Test_Cases.csv
8. Wait — "Wait 2s (TC→PW)" (rate-limit protection)
9. AI Agent — "Generate Playwright Tests" → Playwright TypeScript
10. Convert To File — "Save Playwright Tests" → playwright_tests.ts
11. Brain (Groq) — llmChatGroq, shared across Agents 3, 6, 9
12. Merge Outputs → Combine Outputs (Code) → Download Files (Form Ending)

## Decisions
- LLM: llama-3.3-70b-versatile via Groq (shared across all 3 AI Agents)
- System prompts: inline (not separate Skill nodes)
- Skill content from TestPlan_From_PRD_WithTemplate_Skill.md, TC_Only_SKILL.md, playwright-e2e.SKILL.md embedded into respective AI Agent system prompts
- Fork pattern: each AI Agent output forks to Convert To File AND next AI Agent
- Rate-limit protection: 2-second Wait nodes between consecutive AI Agent calls
