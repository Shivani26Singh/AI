# LLM.md — Project Constitution

## Data Schemas

### Jira Issue (Input)
```json
{
  "key": "KAN-4",
  "fields": {
    "summary": "string",
    "description": "string",
    "issuetype": { "name": "string" },
    "status": { "name": "string" },
    "priority": { "name": "string" }
  }
}
```

### Test Strategy (Output)
```json
{
  "objective": "string",
  "scope": { "in": ["string"], "out": ["string"] },
  "focusAreas": ["string"],
  "testApproach": ["string"],
  "testDeliverables": ["string"],
  "teamAndSchedule": "string",
  "entryCriteria": ["string"],
  "exitCriteria": ["string"],
  "dependencies": ["string"],
  "risks": ["string"],
  "assumptions": ["string"],
  "openQuestions": ["string"]
}
```

## Behavioral Rules
- Use ONLY information from the fetched Jira issue
- Never invent requirements, integrations, or targets
- State "Insufficient information to determine" when data is missing
- Follow the RICEPO output structure strictly
- No test cases, no markdown tables

## Architecture Invariants
- Jira fetch: Basic Auth (email + API token)
- GROQ: Bearer auth, model = openai/gpt-oss-120b
- .docx: Uses docx npm package
- Settings: Stored in localStorage
