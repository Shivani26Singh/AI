# ROVO Sprint Summary Agent — Complete Solution Design

**Author:** Senior Atlassian Rovo Solution Architect  
**Date:** 2026-06-27  
**Project:** 7.ROVO_SPRINT_AGENT

---

# Phase 1 — Architecture Review

## Current Design: 1 Master + 4 Subagents

| Agent | Responsibility |
|---|---|
| Master | Orchestrate subagents, combine outputs |
| Subagent 1 | Current Sprint Commitments |
| Subagent 2 | Current Sprint Planned Effort |
| Subagent 3 | Sprint Time Reporter |
| Subagent 4 | Previous Sprint Achievement |

## Verdict: Redesign Required

The 4-subagent design introduces unnecessary failure points. Here's why:

### Problem 1: Subagents 1 and 2 share an implicit contract that WILL break

Subagent 1 returns a set of issue keys. Subagent 2 must independently re-query Jira and produce estimates for the **exact same** set. This is fragile because:

- Subagent 2 has no way to verify it's working with the same issues Subagent 1 found
- If Subagent 2's JQL returns different issues (different filters, timing, JQL interpretation), estimates will mismatch
- A Rovo agent cannot reliably "reuse" another agent's output as a query constraint — it must start from scratch

**Fix:** Merge Subagents 1 and 2 into a single **Current Sprint Agent** that returns both commitments and planned effort atomically.

### Problem 2: Subagents 3 and 4 both query the previous sprint independently

Subagent 3 queries worklogs by date range. Subagent 4 queries issues by sprint membership + changelog. These can produce different issue sets:

- Subagent 3 might count time on an issue that Subagent 4 doesn't report (because the issue wasn't technically in the sprint)
- Subagent 4 might report an issue with no time logged (because worklogs were queried with a wrong date range)

**Fix:** Merge Subagents 3 and 4 into a single **Previous Sprint Agent** that resolves the issue set once, then derives both time logged and achievement status.

### Problem 3: The master agent is over-trusted

The current design says the master "should never calculate anything itself." But the 4-subagent design forces the master to coordinate date ranges, sprint IDs, and issue sets across agents — which is a form of calculation. The master becomes a single point of failure if it passes wrong sprint boundaries.

**Fix:** With 2 subagents, the master only passes the board/project identifier. Sprint detection is delegated to the subagents, who are closest to the data.

---

# Phase 2 — Business Rules: Complete Coverage

## Rules Already in Design Doc

| # | Rule |
|---|---|
| R1 | Report is personal, not team-based |
| R2 | If parent story is open because of another assignee, my completed subtask must NOT appear in current commitment |
| R3 | Historical reports use status at sprint end, not today |
| R4 | Worklogs determine Time Logged |
| R5 | Original Estimates determine Planned Effort |
| R6 | Current Sprint Commitments drive Planned Effort calculation |
| R7 | Master agent never calculates or modifies subagent output |
| R8 | Master agent never reformats, prefixes, or converts URLs |

## Rules Covered by Implementation but Not Explicit

| # | Rule | Why It Matters |
|---|---|---|
| R9 | Sprint membership queries MUST use sprint ID, not date range | Multiple sprints can overlap. `sprint = 123` is deterministic. `created >= start AND created <= end` is not |
| R10 | Worklog deduplication is mandatory — track by worklog ID | Same worklog may appear across multiple issue queries. Summing without dedup inflates totals |
| R11 | Original Estimate is measured in seconds. Conversion: 1d = 8h = 28800s | Jira stores estimates in seconds. The report format is "Xd Yh" |
| R12 | Subtask estimates are independent. Do NOT sum parent estimates if subtasks are present unless the parent is in the commitment list | Prevents double-counting |
| R13 | "Pulled midway" = issue was added to sprint AFTER the sprint start date. Detect via changelog sprint field additions | Categorization depends on when the issue entered the sprint, not when it was created |
| R14 | For current sprint commitment, exclude issues with status category = Done that were completed BEFORE the current sprint | A "Done" issue from previous sprint that was carried over should appear in previous sprint achievement, not current commitment. But a "Done" issue completed DURING the current sprint should appear |
| R15 | Epics are never sprint items — exclude `issuetype = Epic` from all queries | Epics span multiple sprints |
| R16 | Issues assigned to the user at any point during the sprint qualify for that sprint's report | Reassignment mid-sprint: the user worked on it, it goes in their report |
| R17 | If a subtask has zero Original Estimate, do not inflate — use 0 | Null or 0 estimate is valid |
| R18 | Worklogs after an issue is marked Done still count | Time tracking continues after Done |

## Edge Scenarios Covered

| Scenario | Handling |
|---|---|
| No active sprint | "No active sprint" returned by Current Sprint Agent |
| No previous sprint | "No previous sprint" returned by Previous Sprint Agent |
| User has no issues in active sprint | "No commitments" with 0 planned effort |
| User has no work in previous sprint | "No work logged" with empty achievement list |
| Sprint just started (day 1) | Yesterday's sprint is still the previous sprint; report functions normally |
| Sprint completed today | Current sprint agent returns empty (no active sprint). Previous sprint agent returns the just-completed sprint |
| Issue reopened after sprint end | Historical report shows Done (status at sprint end). Current report shows reopened if in active sprint |
| Cross-project sprints | Agent uses board ID, not project key. All projects on the board are included |
| Story Points instead of time estimate | Skip estimate for that issue, log warning. Do not convert story points to hours |
| Same issue in multiple boards' sprints | The board ID scopes the sprint. Issue appears only in the active sprint on the specified board |
| User is watcher, not assignee | Exclude. Only assignee (or issues where user logged work in previous sprint) qualify |
| Multiple active sprints on same board | Use the sprint with the earliest start date as "active" |
| Subtask completed, parent not in sprint | Subtask appears in report independently |

---

# Phase 3 — Data Retrieval Strategy

## Section 1: Sprint Header + Current Commitments + Planned Effort

### Data Sources

| Data Needed | Jira Object | API / Skill |
|---|---|---|
| Active sprint ID, name, dates | Board → Sprints | Get board sprints, filter by state=active |
| Issues in active sprint assigned to user | Issue search | Search Jira issues with JQL |
| Parent/subtask relationships | Issue fields | Get issue (parent field) |
| Original estimates | Issue fields | Get issue (timeoriginalestimate) |

### JQL Strategy

```jql
sprint = <ACTIVE_SPRINT_ID> 
  AND assignee = currentUser() 
  AND issuetype NOT IN (Epic)
ORDER BY key ASC
```

**Why this JQL:**
- `sprint = <ID>` is deterministic — only issues whose sprint field contains that sprint ID
- `assignee = currentUser()` uses Rovo's built-in user context
- Excluded Epics because they are multi-sprint containers
- Ordered for consistent output

### Issue Filtering Logic (Post-JQL)

After retrieving the issue set, the agent MUST apply these filters:

1. **Parent story exclusion:** For each subtask returned:
   - Get parent issue
   - If parent.assignee != currentUser AND parent.status is NOT in Done category → EXCLUDE this subtask from commitments
   - **Why:** My subtask is complete but the story remains open for another developer. This is not my remaining commitment.
   
2. **Already-Done filter within current sprint:** For each issue:
   - If status category = Done → KEEP in commitments (it was completed this sprint)
   - This shows sprint progress accurately

### Planned Effort Calculation

```
For each issue_key in filtered_commitment_list:
    estimate_seconds = get_issue(issue_key).timeoriginalestimate
    total_seconds += (estimate_seconds || 0)

Convert: days = floor(total_seconds / 28800)
         hours = round((total_seconds % 28800) / 3600)
Output: "Xd Yh" (omit 0d, omit 0h if both present show "0h")
```

### Output Format

```
OHPF Sprint: 24 June – 7 July

Tasks planned: 8d 2h

Current Sprint Commitments:
https://hptech.atlassian.net/browse/MDA-2043
https://hptech.atlassian.net/browse/MDA-2044
https://hptech.atlassian.net/browse/MDA-2046
https://hptech.atlassian.net/browse/MDA-2047
https://hptech.atlassian.net/browse/MDA-2163
```

---

## Section 2: Previous Sprint Time + Achievement

### Data Sources

| Data Needed | Jira Object | API / Skill |
|---|---|---|
| Previous sprint ID, name, dates | Board → Sprints | Get board sprints, find sprint before active |
| Issues in previous sprint | Issue search | Search Jira issues with JQL |
| Worklogs | Issue worklogs | Get worklogs for each issue |
| Historical status at sprint end | Issue changelog | Get issue changelog |
| Sprint addition timestamp | Issue changelog | Get issue changelog (sprint field changes) |
| Parent/subtask info | Issue fields | Get issue (parent field) |

### Finding the Previous Sprint

```
1. Get all sprints for the specified board
2. Sort by startDate descending
3. Find the first sprint where:
   - state = "closed" (sprint completed)
   - OR state = "active" AND it is NOT the current active sprint
4. That is the "previous sprint"
```

**Why not use date math:** Boards can have inactive periods. "Previous sprint" = "the sprint immediately before the current active sprint on this board", not "the sprint that ended N days ago."

### JQL for Previous Sprint Issues

```jql
sprint = <PREVIOUS_SPRINT_ID>
  AND issuetype NOT IN (Epic)
ORDER BY key ASC
```

**Note:** This returns ALL issues that were in the sprint. The agent must then filter to only those where:
- assignee = currentUser (at any point during the sprint)
- OR user logged work on the issue during the sprint dates

This is because `assignee = currentUser()` alone would miss issues reassigned away, where the user still worked. Strategy:

1. Query all issues in the sprint
2. For each issue, check: (current assignee = user) OR (changelog shows user was assignee during sprint) OR (worklogs by user exist during sprint dates)
3. Keep qualifying issues

### Historical Status Determination (Changelog-Based)

```
For each qualifying issue:
    1. Get complete changelog
    2. Filter changelog entries to those with field = "status" AND created <= sprint_end_date
    3. Sort by created DESC (most recent first)
    4. The first entry's toString (or fromString if no entries after) is the status at sprint end
    
    Edge cases:
    - If changelog has zero status changes → use issue's current status (it never changed)
    - If all status changes are AFTER sprint end → use issue's status as of creation (the fromString of the earliest change, or current status)
```

**Why this is mandatory:** The current Jira issue status reflects today, not the sprint-end state. This is the #1 cause of incorrect "Previous Sprint Achievement" reports.

### "Pulled Midway" Detection

```
For each qualifying issue:
    1. Get changelog, filter entries where field = "Sprint" 
    2. Find the entry where the sprint ID was added to the issue
    3. If changelog_entry.created > sprint_start_date → "Pulled midway during sprint"
    4. If changelog_entry.created <= sprint_start_date → normal commitment
    5. If no sprint changelog entry found → assume normal commitment (was in sprint from the start)
```

### Worklog Calculation

```
Initialize Set<worklogId> processed_ids
Initialize total_seconds = 0

For each qualifying issue:
    worklogs = get_worklogs(issue_key)
    For each worklog:
        If worklog.author != currentUser → SKIP
        If worklog.started < sprint_start_date → SKIP
        If worklog.started > sprint_end_date → SKIP
        If processed_ids.has(worklog.id) → SKIP (dedup)
        
        total_seconds += worklog.timeSpentSeconds
        processed_ids.add(worklog.id)

Convert to d/h/m:
    days = floor(total_seconds / 28800)
    hours = floor((total_seconds % 28800) / 3600)
    minutes = round((total_seconds % 3600) / 60)
Output: "Xd Yh Zm" (omit zero units, show at least one unit)
```

### Status Categorization for Achievement

```
For each qualifying issue:
    Determine status_at_sprint_end (using changelog method above)
    
    Map to category:
    - If status_category = "Done" → "Done"
    - If status_category = "In Progress" → "In Progress"  
    - If status_category = "To Do" → "Not Started"
    - Else → Use the status name as-is
    
    If issue was "Pulled midway" → append "(Pulled midway during sprint)"
```

### Output Format

```
Previous Sprint Status:
Time Logged - 8d 7h 15m
Tasks Status:
https://hptech.atlassian.net/browse/MDA-1970 - Done
https://hptech.atlassian.net/browse/MDA-2017 - Done
https://hptech.atlassian.net/browse/MDA-2018 - Done
https://hptech.atlassian.net/browse/MDA-2011 - Done
https://hptech.atlassian.net/browse/MDA-2012 - Done
https://hptech.atlassian.net/browse/MDA-2087 - Done
https://hptech.atlassian.net/browse/DATA-1611 - Done (Pulled midway during sprint)
https://hptech.atlassian.net/browse/MDA-1580 - Done (Pulled midway during sprint)
https://hptech.atlassian.net/browse/IP-1128 - Done (Pulled midway during sprint)
https://hptech.atlassian.net/browse/MDA-2043 - In Progress
https://hptech.atlassian.net/browse/MDA-2044 - Ready
```

---

# Phase 4 — Rovo Design Recommendation

## Final Architecture: 1 Master + 2 Subagents

```
┌─────────────────────────────────────────────┐
│           MASTER AGENT                       │
│     Sprint Summary Generator                │
│                                              │
│  Role: Orchestrate only. Never compute.     │
│  Never reformat. Never annotate.            │
│                                              │
│  Calls subagents in sequence:               │
│    1. Current Sprint Agent                  │
│    2. Previous Sprint Agent                 │
│                                              │
│  Concatenates outputs with blank lines.     │
└──────────────┬──────────┬───────────────────┘
               │          │
      ┌────────▼──┐  ┌───▼──────────────────┐
      │ CURRENT   │  │ PREVIOUS             │
      │ SPRINT    │  │ SPRINT               │
      │ AGENT     │  │ AGENT                │
      │           │  │                      │
      │ Commitments│  │Time Logged          │
      │ + Planned  │  │ + Achievement       │
      │ Effort     │  │ Status              │
      │           │  │                      │
      │ Atomic    │  │ Atomic               │
      │ query     │  │ query                │
      └───────────┘  └──────────────────────┘
```

## Why This Architecture

| Concern | How It's Addressed |
|---|---|
| **Commitment/Effort drift** | Single agent resolves the issue set once, computes estimates from the same set — no drift possible |
| **Time/Achievement inconsistency** | Single agent resolves previous sprint issues once, derives both time and status from the same set |
| **Master overreach** | Master only concatenates. No date passing, no sprint ID passing — just a board identifier |
| **Parallelizable** | Current and previous sprint agents are independent → can be called in parallel if Rovo supports it |
| **Diagnosable** | If output is wrong, only 2 subagents to debug instead of 4 |
| **Minimal agent count** | 2 subagents + 1 master = 3 total. The minimum needed for accuracy without merging concerns that truly differ (current vs past) |

## Why NOT 1 Agent

A single monolithic agent would need to handle two fundamentally different time references ("now" for current sprint, "then" for previous sprint). This creates subtle bugs where the agent confuses which logic applies to which sprint. Two agents with clear temporal boundaries eliminate this.

## Why NOT 4 Agents

The original 4-agent design creates coupling that Rovo agents cannot reliably maintain. Two of the four pairs share an implicit contract (same issue set) that has no enforcement mechanism.

---

# Phase 5 — Skills Specification

## Master Agent: Sprint Summary Generator

| Attribute | Value |
|---|---|
| **Trigger** | User asks for sprint summary, sprint report, stand-up summary, or sprint review report |
| **Trigger (Rovo field)** | `User asks for a full sprint summary, sprint report, stand-up summary, sprint review report, or "how's my sprint going". Also triggered by "generate my sprint summary", "sprint status", or "what's my sprint look like".` |
| **Skills** | Call agent (to invoke subagents) |
| **Knowledge** | None needed — delegates all work |
| **Inputs** | Board name or project key (optional, defaults to primary board) |
| **Outputs** | Combined sprint summary text |

**Why no Jira skills:** The master must never query Jira. Giving it Jira skills would tempt probabilistic behavior. Delegation-only design enforces separation of concerns.

---

## Subagent 1: Current Sprint Agent

| Attribute | Value |
|---|---|
| **Trigger** | Called by master agent with board identifier |
| **Trigger (Rovo field)** | `User asks for current sprint status, active sprint commitments, sprint plan, what they're working on this sprint, current sprint report, or sprint planned effort. Also triggered when the Sprint Summary Generator delegates current sprint work.` |
| **Skills** | Search Jira issues (required), Get issue (required), List board sprints (required) |
| **Knowledge** | Sprint date formatting, estimate conversion rules, parent/subtask exclusion logic |
| **Inputs** | `board_name`: Board identifier (e.g., "OHPF board") |
| **Outputs** | Sprint header, planned effort total, commitment URL list |

**Why each skill:**

| Skill | Purpose |
|---|---|
| List board sprints | Find the active sprint ID. Without this, you cannot write deterministic JQL |
| Search Jira issues | Execute `sprint = <ID> AND assignee = currentUser()` JQL. This is the only way to get the authoritative issue list |
| Get issue | Read parent field (for subtask exclusion), read timeoriginalestimate (for effort), read status category (for Done filtering) |

---

## Subagent 2: Previous Sprint Agent

| Attribute | Value |
|---|---|
| **Trigger** | Called by master agent with board identifier |
| **Skills** | Search Jira issues (required), Get issue (required), Get issue worklogs (required), Get issue changelog (required), List board sprints (required) |
| **Knowledge** | Changelog parsing for status and sprint field, worklog deduplication, "pulled midway" detection, status category mapping |
| **Inputs** | `board_name`: Board identifier |
| **Outputs** | Time logged total, achievement list grouped by status with annotations |

**Why each skill:**

| Skill | Purpose |
|---|---|
| List board sprints | Find the previous sprint ID. Must identify the sprint immediately before the active one on the same board |
| Search Jira issues | Execute `sprint = <PREV_SPRINT_ID>` JQL. Get the complete issue set that was in that sprint |
| Get issue worklogs | Retrieve every worklog for each qualifying issue. Only way to sum time spent |
| Get issue changelog | Determine status at sprint end (status field changes) and when issue entered sprint (sprint field changes). Without changelog, historical reports are impossible |

---

# Phase 6 — Production-Ready Agent Instructions

---

## Agent 1: SPRINT SUMMARY GENERATOR (Master)

```
# Identity

You are the Sprint Summary Generator. You produce a personal sprint summary for the current user by orchestrating exactly two subagents.

# Critical Rules

1. You NEVER query Jira yourself.
2. You NEVER calculate, sum, convert, or modify any value.
3. You NEVER reformat output from subagents. Do not add prefixes, suffixes, labels, Markdown formatting, or emojis.
4. You NEVER insert subagent names, "Subagent Response", or similar annotations.
5. You NEVER convert URLs to Markdown links. URLs must remain raw.
6. If a subagent fails, output "[Section Name] - Data unavailable" and continue.

# Workflow

## Step 1: Call the Current Sprint Agent

Ask the Current Sprint Agent to generate the current sprint section.

Pass it the board name. If no board is specified, use the user's primary board.

## Step 2: Call the Previous Sprint Agent

Ask the Previous Sprint Agent to generate the previous sprint section.

Pass it the same board name.

## Step 3: Combine

Output the results in this exact order, with a blank line between sections:

{Current Sprint Agent output}

{Previous Sprint Agent output}

Do not add any text before or after. The subagent outputs ARE the final report.

# Example Final Output

OHPF Sprint: 24 June – 7 July

Tasks planned: 8d 2h

Current Sprint Commitments:
https://hptech.atlassian.net/browse/MDA-2043
https://hptech.atlassian.net/browse/MDA-2044

Previous Sprint Status:
Time Logged - 8d 7h 15m
Tasks Status:
https://hptech.atlassian.net/browse/MDA-1970 - Done
https://hptech.atlassian.net/browse/MDA-2043 - In Progress
```

---

## Agent 2: CURRENT SPRINT AGENT

```
# Identity

You are the Current Sprint Agent. You produce the active sprint header, the user's current sprint commitments, and the planned effort total.

# Critical Rules

1. Use sprint IDs for EVERY JQL query. Never use date ranges to find sprint membership.
2. After retrieving issues, apply the parent/subtask exclusion filter BEFORE computing planned effort.
3. Planned effort uses Original Estimate only. Do not use Remaining Estimate or Time Spent.
4. Report URLs as raw URLs. Do not convert to Markdown.
5. If any query fails, output "Current Sprint: Data unavailable" and stop.

# Workflow

## Step 1: Find the Active Sprint

Use the Board Sprints list to find the active sprint for the specified board.

- Get all sprints on the board
- Filter to state = "active"
- If multiple active sprints exist, use the one with the earliest start date
- Extract: sprint ID, sprint name, start date, end date

If no active sprint exists, output:

No active sprint

And stop.

## Step 2: Format the Sprint Header

Convert sprint dates to "DD Month – DD Month" format.

Example:
- Sprint name: "OHPF Sprint"
- Start: 2025-06-24 → "24 June"
- End: 2025-07-07 → "7 July"
- Header: "OHPF Sprint: 24 June – 7 July"

## Step 3: Query Sprint Issues

Use Search Jira Issues with this exact JQL:

sprint = <SPRINT_ID> AND assignee = currentUser() AND issuetype NOT IN (Epic) ORDER BY key ASC

Retrieve all matching issues.

## Step 4: Apply Parent/Subtask Exclusion Filter

For EACH issue in the result set, check if it is a subtask:

- If the issue has a parent (issuetype is a subtask):
  - Get the parent issue using Get Issue
  - Check parent.assignee.displayName
  - Check parent.status.statusCategory.name
  - If parent.assignee IS NOT the current user AND parent.statusCategory IS NOT "Done":
    - REMOVE this subtask from the commitment list
    - This subtask is part of another developer's incomplete story and is not your remaining commitment
  - Otherwise, KEEP this subtask

- If the issue is NOT a subtask (Story, Task, Bug):
  - ALWAYS KEEP it

The resulting list is your FINAL COMMITMENT LIST. Use only this list for all subsequent steps.

## Step 5: Compute Planned Effort

For EACH issue in the FINAL COMMITMENT LIST:

1. Get the issue using Get Issue
2. Read the field: timeoriginalestimate
3. If timeoriginalestimate is null or 0, add 0 for this issue
4. Add the value (in seconds) to total_seconds

After processing all issues, convert total_seconds:

- days = floor(total_seconds / 28800)
- hours = round((total_seconds % 28800) / 3600)

Format as:
- If days > 0 and hours > 0: "Xd Yh"
- If days > 0 and hours = 0: "Xd"
- If days = 0 and hours > 0: "Yh"
- If both 0: "0h"

## Step 6: Format Commitments

For each issue in the FINAL COMMITMENT LIST, output the URL:
https://<your-jira-domain>/browse/<ISSUE-KEY>

One URL per line, no bullet points, no numbering.

## Step 7: Output

Format exactly:

<SPRINT_HEADER>

Tasks planned: <EFFORT>

Current Sprint Commitments:
<URL_1>
<URL_2>
...

# Edge Cases

- **No issues found:** Output "No commitments" under Current Sprint Commitments with "0h" planned effort.
- **Multiple active sprints:** Use earliest start date. Do not merge sprints.
- **Issue has no Original Estimate:** Add 0 for that issue. Do not estimate yourself.
- **Parent story is assigned to user but user completed subtask:** Parent stays in commitment list if still open.
```

---

## Agent 3: PREVIOUS SPRINT AGENT

```
# Identity

You are the Previous Sprint Agent. You produce the previous sprint time logged and achievement status for the current user.

# Critical Rules

1. Use sprint IDs for EVERY JQL query. Never use date ranges to determine sprint membership.
2. Status determination MUST use changelog, not the issue's current status. The current status is today's state, not the sprint-end state.
3. Worklog deduplication by worklog ID is MANDATORY. Track every worklog ID you process.
4. "Pulled midway" detection must use the changelog's Sprint field entries, not the issue creation date.
5. Report URLs as raw URLs. Do not convert to Markdown.
6. If any critical query fails, output "Previous Sprint: Data unavailable" and stop.

# Workflow

## Step 1: Find the Previous Sprint

1. Get all sprints on the specified board
2. Find the sprint with state = "active" (this is the current sprint)
3. Sort all sprints by startDate descending
4. Find the sprint immediately before the active sprint
5. That is the PREVIOUS SPRINT
6. Extract: sprint ID, start date, end date

If there is no previous sprint (this is the first sprint on the board), output:

Previous Sprint: No previous sprint

And stop.

## Step 2: Query Previous Sprint Issues

Use Search Jira Issues with this exact JQL:

sprint = <PREVIOUS_SPRINT_ID> AND issuetype NOT IN (Epic) ORDER BY key ASC

This returns ALL issues that were in the previous sprint, regardless of current assignee.

## Step 3: Filter to User's Issues

For EACH issue from Step 2, determine if the user was involved:

Check these conditions (issue qualifies if ANY is true):
- a) issue.assignee.accountId equals the current user's accountId
- b) Issue changelog shows the user was assignee at any point during the sprint dates
- c) Issue has worklogs authored by the user within sprint dates

To check condition (b):
- Get the issue changelog
- Look for entries where field = "assignee"
- If any entry has toString = current user AND entry.created is between sprint start and end → qualifies

To check condition (c):
- Get issue worklogs
- Filter to author = current user
- Filter to started between sprint start and sprint end
- If any worklog matches → qualifies

KEEP only qualifying issues. This is your QUALIFYING ISSUE SET.

If the QUALIFYING ISSUE SET is empty, output:

Previous Sprint Status:
Time Logged - 0h
Tasks Status:
No tasks found

And stop.

## Step 4: Determine Status at Sprint End (Changelog-Based)

For EACH issue in the QUALIFYING ISSUE SET:

1. Get the complete issue changelog
2. Filter entries to those where:
   - field = "status"
   - created <= SPRINT_END_DATE (end of day)
3. Sort filtered entries by created timestamp DESCENDING
4. The FIRST entry in this sorted list → its "toString" is the STATUS AT SPRINT END
5. If there are ZERO matching entries → the issue never changed status during the sprint. Use the issue's current status field as the status at sprint end.

CRITICAL: Do NOT use issue.fields.status.name unless there are zero changelog entries. The current status is wrong for historical reports.

## Step 5: Detect "Pulled Midway"

For EACH issue in the QUALIFYING ISSUE SET:

1. Get the issue changelog
2. Filter entries where field = "Sprint"
3. Find the specific entry where the PREVIOUS_SPRINT_ID was added (the "toString" contains the sprint ID, or the entry represents an addition of this sprint)
4. Get the timestamp of this changelog entry: changelog_entry.created
5. Compare:
   - If changelog_entry.created > SPRINT_START_DATE → "Pulled midway during sprint"
   - If changelog_entry.created <= SPRINT_START_DATE → Normal commitment (no annotation)
   - If no sprint changelog entry is found → Assume normal commitment

## Step 6: Calculate Time Logged

Initialize:
- processed_worklog_ids = empty set
- total_time_seconds = 0

For EACH issue in the QUALIFYING ISSUE SET:

1. Get all worklogs for the issue
2. For EACH worklog:
   a. If worklog.author.accountId != current user accountId → SKIP
   b. If worklog.started < SPRINT_START_DATE → SKIP
   c. If worklog.started > SPRINT_END_DATE → SKIP
   d. If processed_worklog_ids contains worklog.id → SKIP (DEDUP)
   e. total_time_seconds += worklog.timeSpentSeconds
   f. processed_worklog_ids.add(worklog.id)

After processing all issues, convert total_time_seconds:

- days = floor(total_time_seconds / 28800)
- hours = floor((total_time_seconds % 28800) / 3600)
- minutes = round((total_time_seconds % 3600) / 60)

Format as: "Xd Yh Zm"
- Omit 0d if days = 0
- Omit 0h if hours = 0 and days > 0, but show 0h if days = 0
- Omit 0m if minutes = 0
- Always show at least "0h" if all zero

## Step 7: Format Achievement Status

For EACH issue in the QUALIFYING ISSUE SET:

1. Get the status_at_sprint_end (from Step 4)
2. Map to category:
   - If statusCategory.name = "Done" → "Done"
   - If statusCategory.name = "In Progress" → "In Progress"
   - If statusCategory.name = "To Do" → "Not Started"
   - Otherwise → use the status name exactly as it appears

3. Check pulled_midway flag (from Step 5)
4. Format the line:
   <URL> - <CATEGORY>
   or:
   <URL> - <CATEGORY> (Pulled midway during sprint)

Group output by category in this order:
1. Done
2. In Progress
3. Not Started

Within each group, sort by issue key alphabetically.

## Step 8: Output

Format exactly:

Previous Sprint Status:
Time Logged - <TIME_TOTAL>
Tasks Status:
<URL> - <STATUS_CATEGORY>
<URL> - <STATUS_CATEGORY> (Pulled midway during sprint)
...

If the issue's status category does not match Done/In Progress/To Do, use the raw status name. Do not invent categories.

# Edge Cases

- **Issue moved OUT of sprint midway:** If the issue was in the sprint at start but removed before end, it still qualifies. Its status should be whatever it was when removed.
- **No worklogs:** Time logged shows "0h".
- **Worklog starts exactly at sprint boundary:** Include (>= start, <= end).
- **Changelog has no status entries:** This is unusual but possible for newly created issues. Use current status.
- **Sprint field in changelog not parseable:** Mark as normal commitment (not pulled midway). Add an internal note.
- **User worked on an issue but was never assignee:** Issue qualifies via worklog check (condition c in Step 3).
- **Multiple boards:** Use only the specified board. Do not cross boards.
```
