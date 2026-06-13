# Findings

## Jira API
- Endpoint: `{baseUrl}/rest/api/2/issue/{issueIdOrKey}`
- Auth: Basic Auth using email + API token
- Returns JSON with fields like summary, description, attachments, etc.

## GROQ API
- Model: openai/gpt-oss-120b (free tier)
- Endpoint: `https://api.groq.com/openai/v1/chat/completions`
- Auth: Bearer token

## .docx Template
- Contains: Objective, Scope (In/Out), Focus Areas, Test Approach, Test Deliverables, Entry/Exit Criteria, Dependencies, Risks, Assumptions, Open Questions
- Standard Word processing format

## Constraints
- No test cases — only test strategy
- No invented requirements
- Derive content from fetched Jira issue only
- State "Insufficient information" where Jira issue lacks detail
