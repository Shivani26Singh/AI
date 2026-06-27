# Role

Act as a Senior Atlassian Rovo Solution Architect, Jira Expert, and AI Prompt Engineer.

Do not simply rewrite my prompts.

Instead, design the most reliable Rovo solution possible for my use case.

---

# Context

I have attached a design document that explains:

* the business problem
* the desired report
* the current architecture
* the responsibilities of each subagent
* the current problems
* my expected output

Please read it completely before proposing a solution.

---

# Goal

I need to build a production-quality Atlassian Rovo Agent that generates an accurate Sprint Summary for an individual user.

The current implementation is unreliable.

The problems are not limited to prompts—they may involve architecture, Rovo Skills, Jira data retrieval, JQL strategy, parent/sub-task relationships, sprint membership, historical status retrieval, worklogs, and orchestration.

I want the solution to be designed correctly from the beginning.

---

# Your Tasks

Please perform the following in order.

## Phase 1 — Architecture Review

Review my proposed architecture.

Determine whether the current design (1 master agent + 4 subagents) is appropriate.

If not, redesign it.

Explain why.

---

## Phase 2 — Business Rules

Identify every business rule that is currently missing.

Think about scenarios such as:

* sprint starts
* sprint midway
* sprint completed
* carried-over work
* parent stories
* subtasks
* reassignment
* multiple assignees
* work completed in previous sprint
* issue reopened
* work logged after Done
* issue moved between sprints
* issue removed from sprint
* issue added mid sprint
* issue completed by another assignee
* estimate changes
* historical status
* sprint overlap

Identify any missing scenarios that could produce incorrect reports.

---

## Phase 3 — Data Retrieval Strategy

For each report section, determine the correct Jira data source.

For example:

Current Sprint Commitments

* Which Jira objects should be queried?
* Which Skills should be used?
* What JQL strategy should be used?

Current Sprint Planned Effort

* Which fields should be used?
* How should estimates be calculated?
* Which issues qualify?

Sprint Time Reporter

* Which worklogs qualify?
* How should duplicates be prevented?

Previous Sprint Achievement

* How should historical status be determined?
* Should changelog be mandatory?
* How should parent/subtask relationships be handled?

---

## Phase 4 — Rovo Design

Recommend the best Rovo architecture.

For example:

* One master + four subagents
* One master + two subagents
* Single agent
* Different orchestration

Recommend the minimum number of agents required while maintaining accuracy.

---

## Phase 5 — Skills

For every agent specify exactly:

* Trigger
* Skills
* Knowledge
* Inputs
* Outputs

Explain why each Skill is required.

---

## Phase 6 — Instructions

After the architecture is finalized,

generate complete production-ready Rovo instructions for each agent.

Generate them one agent at a time.

Wait for my approval before generating the next agent.

---

# Important

Do not assume my current prompts are correct.

Challenge the design.

If you believe an agent should be removed, split, or redesigned, explain why.

If a business rule is missing, identify it.

If a Jira Skill cannot reliably provide the required information, explain the limitation and propose an alternative approach.

If deterministic behaviour cannot be achieved using prompts alone, explain exactly why.

I want the most reliable design possible rather than the shortest prompts.
