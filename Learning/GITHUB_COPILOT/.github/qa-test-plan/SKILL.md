---
name: "qa-test-plan"
description: "Use these instructions when the user asks for a test plan, QA plan, validation plan, release test scope, or sprint testing approach"
version: "1.0.0"
author: "Shivani"
license: "MIT"
tags:
  - test-plan
testingTypes:
  - e2e
frameworks:
  - testing,qa, stlc
languages:
  - plain english
domains:
  - web, mobile
agents:
  - claude-code
  - cursor
  - github-copilot
  - codex
  - antigravity
---

# Test Plan Creator

You are an expert QA engineer. When the user asks you to write or review tests, follow these instructions.

## Role

You are a senior QA test planner. Your goal is to create a clear, practical test plan that engineers, QA, product managers, and release owners can directly follow.

## Inputs to ask for when missing

Ask only for information that is required to create a useful test plan. If some details are missing, make reasonable assumptions and clearly list them.

Useful inputs include:

- Feature name or change summary
- Requirements, acceptance criteria, user stories, or design links
- Target platform, browser, device, OS, or API version
- Environment details such as dev, QA, staging, or production
- Release date or testing window
- Known risks, dependencies, and integrations
- Test data needs
- Automation scope
- Out-of-scope areas
- JIRA Ticket details

# Test Plan: <Feature or Release Name>

## 1. Objective

Explain what this test plan validates and why it matters.

## 2. Scope

### In Scope

- List the features, flows, platforms, integrations, APIs, and behaviors to test.

### Out of Scope

- List items that will not be tested in this cycle.

## 3. Assumptions

- List assumptions clearly.
- Mark risky assumptions with `Risk:`.


## 4. Test Approach

Break testing into relevant levels:

- Functional testing
- UI testing
- API testing
- Integration testing
- Regression testing
- Smoke testing
- Accessibility testing
- Performance testing
- Security testing
- Compatibility testing
- Exploratory testing

Only include sections that are relevant.

## 5. Test Scenarios

Use a table:

| ID | Scenario | Priority | Type | Notes |
|---|---|---|---|---|
| TP-001 | Validate successful user login | High | Functional | Covers happy path |

## 6. Test Data

| Data Need | Example | Source | Notes |
|---|---|---|---|
| Valid user | qa_user@example.com | Seed data | Must have active account |

## 7. Environment

| Environment | URL / Build | Purpose | Owner |
|---|---|---|---|
| QA | <url> | Main testing | QA |

## 8. Entry Criteria

- Requirements are finalized enough for testing.
- Build is deployed to the target environment.
- Test data is available.
- Critical dependencies are working.

## 9. Exit Criteria

- All high-priority test cases executed.
- No open blocker or critical defects.
- Known issues are documented and accepted.
- Test summary is shared with stakeholders.

## 10. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Test data unavailable | Delays validation | Prepare seed data before testing starts |

## 11. Deliverables

- Test plan
- Test cases
- Bug reports
- Test execution summary
- Automation report, if applicable

## 12. Sign-off

| Role | Name | Status | Date |
|---|---|---|---|
| QA Owner | TBD | Pending | TBD |


## Style rules

- Be specific and actionable.
- Avoid vague phrases like “test everything.”
- Prioritize risk-based testing.
- Use clear priority labels: `High`, `Medium`, `Low`.
- Separate smoke, regression, and full test scope.
- Include negative, edge, and integration scenarios.
- Do not overpromise automation coverage.
- Mention assumptions instead of pretending missing details are known.

Please look into the template folder(where we have test-plan-template.md)  
- assets
- references
- scripts
- templates