# How to Create These Agents in Atlassian Rovo

## Overview

You'll create **3 Rovo agents** in sequence. Each gets its own instructions (the code blocks from the solution doc) plus specific skill configuration.

**Prerequisites:** You need Rovo admin access in your Atlassian org. Go to `admin.atlassian.com` → Rovo → Agents.

---

## Agent 1 of 3: CURRENT SPRINT AGENT

This agent does the heavy lifting for the current sprint section.

### Creation Steps

1. **Go to** Rovo → Agents → **Create agent**
2. **Name:** `Current Sprint Agent`
3. **Description:** `Finds the user's active sprint on the specified board, returns sprint commitments, planned effort, and issue URLs.`
4. **Instructions:** Copy the entire code block from the solution doc under `## Agent 2: CURRENT SPRINT AGENT` — starting from `# Identity` through the last `# Edge Cases` line.

5. **Skills to enable** (check these boxes):
   - ☑ **Search Jira issues** — for running the JQL query
   - ☑ **Get issue** — for reading parent field, original estimate, status category
   - ☑ **Get board information** or **List sprints** — for finding the active sprint
   > If "List board sprints" is a separate skill, enable that instead. The exact skill names in Rovo may vary slightly.

6. **Knowledge sources:** None needed — everything comes from Jira live data.

7. **Save agent.**

### Test It

In the Rovo chat, type:
```
@Current Sprint Agent — find my active sprint on the OHPF board
```

Expected output:
```
OHPF Sprint: 24 June – 7 July

Tasks planned: 5d 3h

Current Sprint Commitments:
https://hptech.atlassian.net/browse/MDA-2043
https://hptech.atlassian.net/browse/MDA-2044
```

---

## Agent 2 of 3: PREVIOUS SPRINT AGENT

This agent handles the previous sprint — time logged and achievement status.

### Creation Steps

1. **Go to** Rovo → Agents → **Create agent**
2. **Name:** `Previous Sprint Agent`
3. **Description:** `Reports the user's previous sprint work — time logged via worklogs, achievement status via changelog, and identifies pulled-in-work.`
4. **Instructions:** Copy the entire code block from the solution doc under `## Agent 3: PREVIOUS SPRINT AGENT` — starting from `# Identity` through the last `# Edge Cases` line.

5. **Skills to enable:**
   - ☑ **Search Jira issues** — for `sprint = <ID>` JQL
   - ☑ **Get issue** — for reading assignee, status fields
   - ☑ **Get issue worklogs** — for summing time spent (CRITICAL — this is mandatory)
   - ☑ **Get issue changelog** — for historical status and sprint-field detection (CRITICAL — without this the agent cannot produce accurate historical reports)
   - ☑ **Get board information** or **List sprints** — for finding the previous sprint ID

6. **Knowledge sources:** None needed.

7. **Save agent.**

### Test It

```
@Previous Sprint Agent — show my previous sprint on the OHPF board
```

Expected output:
```
Previous Sprint Status:
Time Logged - 8d 7h 15m
Tasks Status:
https://hptech.atlassian.net/browse/MDA-1970 - Done
https://hptech.atlassian.net/browse/MDA-2017 - Done
https://hptech.atlassian.net/browse/MDA-2043 - In Progress
```

---

## Agent 3 of 3: SPRINT SUMMARY GENERATOR (Master)

This is the orchestrator — it calls the other two agents and concatenates their output.

### Creation Steps

1. **Go to** Rovo → Agents → **Create agent**
2. **Name:** `Sprint Summary Generator`
3. **Description:** `Orchestrates Current Sprint Agent and Previous Sprint Agent to produce a complete personal sprint summary. Never queries Jira directly.`
4. **Instructions:** Copy the entire code block from the solution doc under `## Agent 1: SPRINT SUMMARY GENERATOR (Master)` — starting from `# Identity` through the final example output block.

5. **Skills to enable:**
   - ☑ **Call agent** — Rovo's ability for one agent to invoke another
   > If Rovo doesn't have a "Call agent" skill, the master agent should use regular @-mention syntax in its instructions to invoke the subagents.

   - Do **NOT** enable any Jira skills. The master must never query Jira directly.

6. **Knowledge sources:** None needed.

7. **Save agent.**

### If Rovo's "Call Agent" Works

The master agent calls subagents programmatically. Test:
```
@Sprint Summary Generator — generate my sprint summary for the OHPF board
```

### If Rovo Doesn't Support Agent-to-Agent Calls

Modify the master agent instructions to use @-mention delegation instead. Replace the Step 1 and Step 2 instructions with:

```
## Step 1: Get the Current Sprint section

Reply with: @Current Sprint Agent find my active sprint on the <BOARD_NAME> board. Return only the output, no commentary.

Wait for the response. Do not modify it.

## Step 2: Get the Previous Sprint section

Reply with: @Previous Sprint Agent show my previous sprint on the <BOARD_NAME> board. Return only the output, no commentary.

Wait for the response. Do not modify it.
```

Then the user would interact with the master agent in a conversation thread where it can @-mention the subagents.

---

## Quick Reference: Skill Matrix

| Skill | Current Sprint | Previous Sprint | Master |
|---|---|---|---|
| Search Jira issues | ✅ | ✅ | ❌ |
| Get issue | ✅ | ✅ | ❌ |
| Get issue worklogs | ❌ | ✅ | ❌ |
| Get issue changelog | ❌ | ✅ | ❌ |
| List board sprints | ✅ | ✅ | ❌ |
| Call agent | ❌ | ❌ | ✅ |

---

## Troubleshooting Common Issues

| Symptom | Likely Cause | Fix |
|---|---|---|
| Agent returns "Data unavailable" | Missing skill or skill not enabled | Check skill configuration for that agent |
| Wrong issues in previous sprint | Agent used current status instead of changelog | Verify "Get issue changelog" skill is enabled on Previous Sprint Agent |
| Time logged is 0h | Worklog skill not enabled, or worklog date filter too strict | Enable "Get issue worklogs", check sprint dates |
| Duplicate worklog totals | Agent not deduplicating by worklog ID | Add explicit "track processed IDs in a set" to instructions |
| Commitment includes parent stories | Subtask exclusion not working | Verify "Get issue" skill is reading parent field correctly |
| "Pulled midway" never appears | Changelog sprint field detection failing | Check that Jira instance records sprint changes in changelog |
| Master agent adds Markdown formatting | Master agent reformatting output | Add stronger language: "You MUST output the subagent response exactly as received, character for character" |
| Sprint name/date header wrong | Wrong sprint selected (e.g., parallel sprint on different board) | Use board ID, not board name, to disambiguate |

---

## File Locations in This Project

```
Projects/7.ROVO_SPRINT_AGENT/
├── Input/
│   ├── ROVO_PROMPT.md              # Original requirements
│   └── Rovo_Design.md              # Design document (from .docx)
├── Output/
│   ├── ROVO_Sprint_Summary_Solution.md  # Complete solution design
│   └── ROVO_Implementation_Guide.md     # ← THIS FILE
├── task_plan.md                    # B.L.A.S.T. phase tracking
├── findings.md                     # B.L.A.S.T. discoveries
├── progress.md                     # B.L.A.S.T. progress log
└── LLM.md                          # B.L.A.S.T. project constitution
```
