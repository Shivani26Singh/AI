# Task Plan — Test Strategy Generator

## North Star
A lightweight React UI that takes Jira config (email, token, base URL), GROQ API key, and a Jira issue ID, then fetches the issue from Jira and generates a .docx Test Strategy document using the GROQ LLM.

## Phases

1. **Scaffold** — Vite + React project with all dependencies
2. **Settings UI** — Config panel for Jira credentials and GROQ API key (stored in localStorage)
3. **Main UI** — Jira ID input, "Generate" button, loading state, download button
4. **API Service** — Jira REST API fetch + GROQ chat completion
5. **.docx Generator** — Build .docx matching the attached template format
6. **Theme** — Dark/light mode toggle with CSS variables
7. **Polish & Test** — Error handling, edge cases, final verification

## Checklist
- [ ] Vite + React scaffold
- [ ] Settings: Jira email, Jira token, Jira base URL, GROQ API key
- [ ] Main: Jira ID input + Generate + Download .docx
- [ ] Jira API: GET /rest/api/2/issue/{id}
- [ ] GROQ API: POST with system prompt from prompt.md
- [ ] .docx: Build structured document matching template
- [ ] Dark/light mode
- [ ] Test with KAN-4
