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
4. **Trigger:** `User asks for current sprint status, active sprint commitments, sprint plan, what they're working on this sprint, current sprint report, or sprint planned effort. Also triggered when the Sprint Summary Generator delegates current sprint work.`
5. **Instructions:** Copy the entire code block from the solution doc under `## Agent 2: CURRENT SPRINT AGENT` — starting from `# Identity` through the last `# Edge Cases` line.

6. **Skills** — tick these exact checkboxes in the Rovo UI:
   - ☑ **Search for Jira issues** → needed to run `sprint = <ID> AND assignee = currentUser()` JQL
   - ☑ **Get Jira issue** → needed to read parent field, timeoriginalestimate, statuscategory
   - ☑ **Get board sprints** → needed to find the active sprint ID

   If "Get board sprints" isn't available, use **List sprints on board** or **Get sprints for board** — whichever appears.

7. **Knowledge sources:** None — all data comes live from Jira.

8. **Save agent.**

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
4. **Trigger:** `User asks for previous sprint summary, last sprint achievement, sprint retrospective, what they completed last sprint, previous sprint time logged, or sprint review report. Also triggered when the Sprint Summary Generator delegates previous sprint work.`
5. **Instructions:** Copy the entire code block from the solution doc under `## Agent 3: PREVIOUS SPRINT AGENT` — starting from `# Identity` through the last `# Edge Cases` line.

6. **Skills** — tick these exact checkboxes in the Rovo UI:
   - ☑ **Search for Jira issues** → to query all issues in the previous sprint
   - ☑ **Get Jira issue** → to read assignee, parent, and current status fields
   - ☑ **Get issue worklogs** → to sum time spent by the user (MANDATORY)
   - ☑ **Get issue changelog** → to determine historical status at sprint end (MANDATORY — without this, the report will use wrong statuses)
   - ☑ **Get board sprints** → to find the previous sprint ID

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
4. **Trigger:** `User asks for a full sprint summary, sprint report, stand-up summary, sprint review report, or "how's my sprint going". Also triggered by "generate my sprint summary", "sprint status", or "what's my sprint look like".`
5. **Instructions:** Copy the entire code block from the solution doc under `## Agent 1: SPRINT SUMMARY GENERATOR (Master)` — starting from `# Identity` through the final example output block.

6. **Skills** — tick this exact checkbox in the Rovo UI:
   - ☑ **Call agent** → to invoke Current Sprint Agent and Previous Sprint Agent

   Do NOT enable any Jira skills on this agent. The master must never query Jira.

   If "Call agent" doesn't exist in Rovo, skip it — the master will use @-mentions instead (see fallback below).

7. **Knowledge sources:** None.

8. **Save agent.**

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
