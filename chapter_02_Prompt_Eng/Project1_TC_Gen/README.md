# Project 1: VWO Login TestCase Generator (RICE-POT Framework)

Generate enterprise-grade functional + non-functional test cases from a **Product Requirements Document (PRD)** using the **RICE-POT prompting framework**.

## Overview

| Component | Details |
|-----------|---------|
| **Product Under Test** | VWO Login Dashboard (`app.vwo.com`) |
| **Input** | `Product Requirements Document_VWO.pdf` — 7-page PRD covering auth, UX, security, performance |
| **Prompt Framework** | RICE-POT (Role, Instructions, Context, Example, Parameters, Output, Tone) |
| **Output** | 21 CSV test cases — functional (18) + non-functional (3) |

## Files

```
RICE_POT_FRAMEWORK/
├── Product Requirements Document_VWO.pdf    # Source PRD (7 pages)
├── RICE-POT-TestCase-Prompt.md              # The RICE-POT prompt template
├── RICE_POT.md                              # Framework reference
├── Restful-booker.pdf                       # API testing PRD (bonus)
├── Restful_Booker_API_Test_Cases.md         # API test cases (bonus)
└── output/
    └── VWO_Login_TestCases.csv              # Generated: 21 test cases in CSV
```

## Test Coverage

- **Functional**: Valid/invalid login, email validation, empty fields, Remember Me, clickable labels, auto-focus, loading states, Forgot Password, registration link, responsive design, keyboard nav, ARIA/screen reader, Light/Dark theme, product banner, SSO, 2FA/MFA
- **Non-Functional**: Page load <2s, HTTPS/TLS enforcement, brute force rate limiting

## How to Use

1. Open `RICE-POT-TestCase-Prompt.md`
2. Copy the prompt starting from `### R — Role`
3. Paste into any AI tool (ChatGPT, Claude, Gemini) with the PRD PDF attached
4. Output is deterministic CSV with zero hallucinated content

## RICE-POT Anti-Hallucination Guardrails

- Every assertion must be traceable to a PRD requirement
- Missing info → `"Insufficient information to determine."`
- Inferred detail → labeled `"Inference (low confidence)"`
- Zero invented features, IDs, or APIs
