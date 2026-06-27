# Findings — ROVO Sprint Summary Agent

## Context from Design Doc

- The solution generates a personal sprint summary for one engineer/QA.
- Current architecture: 1 master + 4 subagents.
- Known failures: wrong sprint issues, wrong estimates, wrong status, duplicate worklogs, master formatting output.

## Discovery

### Architecture
- Current 4-subagent design is fragile because Subagents 1-2 share an implicit contract (same issue set) with no enforcement
- Subagents 3-4 similarly share data (same previous sprint) but query independently, causing inconsistency
- Master agent over-trusted: coordinating sprint IDs and date ranges across agents is a form of calculation

### Redesigned Architecture
- **1 Master + 2 Subagents** (down from 4)
- Current Sprint Agent: atomic — resolves commitments AND planned effort from one issue set
- Previous Sprint Agent: atomic — resolves time logged AND achievement from one issue set
- Master only concatenates, passing only a board identifier

### Hidden Business Rules
- Sprint membership queries MUST use sprint ID (not date range) — multiple sprints can overlap
- Worklog deduplication by worklog ID is mandatory
- Changelog-based status lookup is the ONLY correct way to determine historical status
- Subtask estimates are independent — don't sum parent estimates for subtask issues
- "Pulled midway" detection requires changelog sprint field entries, not creation date
- Epics must be excluded from all sprint queries (they span multiple sprints)
- Issues where user logged work qualify even if never assigned
- Reassignment mid-sprint: the user qualifies for that sprint's report

### Jira Data Patterns
- Original Estimate stored in seconds (1d = 28800s)
- Worklog IDs are unique across Jira — use for dedup
- Changelog entries have timestamps — sort by created DESC for latest status
- Board Sprints list is the authoritative source for active/previous sprint identification
