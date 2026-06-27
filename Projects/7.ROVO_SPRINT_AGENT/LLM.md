# LLM.md — Project Constitution: ROVO Sprint Summary Agent

## North Star

A deterministic, production-quality Atlassian Rovo Agent that generates an accurate personal Sprint Summary for an individual user — combining sprint commitments, planned effort, time logged, and previous sprint achievement.

## Behavioral Rules

1. The report is **personal**, not team-based.
2. If another developer keeps a parent story open, my completed sub-task must **not** appear in current sprint commitment.
3. Historical reports must represent the state **at sprint end date**, not today's Jira state.
4. **Worklogs** determine Time Logged.
5. **Original Estimates** determine Planned Effort.
6. **Current Sprint Commitments** determine which issues Planned Effort should include.
7. The master agent must **never** calculate or modify values returned by subagents.
8. The master agent must **never** reformat subagent output, insert labels, or convert URLs to Markdown.

## Architectural Invariants

- Deterministic results are required. The same inputs must produce the same outputs.
- Changelog-based status lookup is mandatory for historical sprint achievement (never rely on current status).
- Worklog deduplication is mandatory.
- Sprint membership queries must use exact sprint IDs, not date ranges.

## Data Schema

### Master Agent Output (Final Report)
```
<SPRINT_HEADER>
<blank line>
Tasks planned: <EFFORT>
<blank line>
Current Sprint Commitments:
<URL_1>
<URL_2>
...
<blank line>
Previous Sprint Status:
Time Logged - <TIME_TOTAL>
Tasks Status:
<URL_1> - <STATUS_CATEGORY>
<URL_2> - <STATUS_CATEGORY> (Pulled midway during sprint)
...
```

### Internal Data Shapes

**Sprint Object (from Board Sprints list):**
```json
{
  "id": 123,
  "name": "OHPF Sprint",
  "state": "active",
  "startDate": "2025-06-24",
  "endDate": "2025-07-07"
}
```

**Qualified Issue (for Current Sprint):**
```json
{
  "key": "MDA-2043",
  "issuetype": "Sub-task",
  "parent": { "key": "MDA-2000", "assignee": "other.user", "statusCategory": "In Progress" },
  "timeoriginalestimate": 28800,
  "statusCategory": "In Progress",
  "included": false
}
```

**Qualified Issue (for Previous Sprint):**
```json
{
  "key": "MDA-1970",
  "status_at_sprint_end": "Done",
  "pulled_midway": false,
  "worklogs": [
    { "id": "10001", "author": "currentUser", "started": "2025-06-25", "timeSpentSeconds": 14400 }
  ]
}
```
