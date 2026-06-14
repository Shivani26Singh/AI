Build a production-ready n8n Cloud workflow named:

STLC_Agent

Objective:
Accept a PRD PDF upload and generate three downloadable artifacts:

1. test_plan.md
2. test_cases.csv
3. playwright_test_cases.md

# Workflow Requirements

INPUT

Create an n8n Form Trigger.

Form Name:
STLC Agent

Add a required File Upload field:

Label:
Upload PRD PDF

Field Name:
prd_pdf

Accepted Types:
application/pdf

====================================

NODE 1

Name:
Extract PRD Content

Type:
Extract From File

Operation:
Extract From PDF

Input Binary Field:
prd_pdf

Output:
Extracted PDF text

====================================

NODE 2

Name:
Generate Test Plan

AI Agent using Groq.

Model:
llama-3.3-70b-versatile

Input:
Extracted PDF text

System Prompt:

You are a Senior QA Architect.

Analyze the PRD.

Generate a detailed enterprise-grade Test Plan.

Requirements:

* Preserve explicit requirements.
* Preserve workflows.
* Preserve business rules.
* Include functional testing.
* Include non-functional testing.
* Include accessibility testing.
* Include security testing.
* Include performance testing.
* Include scalability testing.
* Include integration testing.
* Include entry criteria.
* Include exit criteria.
* Include risks.
* Include assumptions.
* Include traceability.

Output only valid markdown.

Begin with:

# Test Plan

====================================

NODE 3

Name:
Save Test Plan

Convert To File

Operation:
Convert To Text File

Text Input:
AI output

Output File Name:
test_plan.md

Output Binary Field:
testPlanFile

====================================

NODE 4

Name:
Generate Test Cases

AI Agent using Groq.

Model:
llama-3.3-70b-versatile

Input:
Output from Generate Test Plan

System Prompt:

You are a Senior QA Engineer.

Generate exhaustive test cases from the provided Test Plan.

Requirements:

* Positive scenarios
* Negative scenarios
* Boundary scenarios
* Validation scenarios
* Accessibility scenarios
* Security scenarios
* Integration scenarios

Output ONLY CSV.

Columns:

TestCaseID,
Module,
Feature,
Scenario,
PreCondition,
TestSteps,
ExpectedResult,
Priority,
AutomationCandidate

Maximum:
100 test cases

====================================

NODE 5

Name:
Save Test Cases

Convert To File

Operation:
Convert To Text File

Text Input:
AI output

Output File Name:
test_cases.csv

Output Binary Field:
testCasesFile

====================================

NODE 6

Name:
Generate Playwright Tests

AI Agent using Groq.

Model:
llama-3.1-8b-instant

Input:
Output from Generate Test Cases

System Prompt:

You are a Senior SDET.

Generate Playwright TypeScript scripts.

Requirements:

* Playwright Test Framework
* TypeScript
* page.locator()
* expect assertions
* One section per test case
* Use stable selectors
* Follow Page Object Model concepts

Output ONLY markdown.

Maximum:
50 automation candidate test cases

====================================

NODE 7

Name:
Save Playwright Tests

Convert To File

Operation:
Convert To Text File

Text Input:
AI output

Output File Name:
playwright_test_cases.md

Output Binary Field:
playwrightFile

====================================

RATE LIMIT PROTECTION

Add Wait nodes:

Generate Test Plan
→ Wait 2 seconds
→ Generate Test Cases

Generate Test Cases
→ Wait 2 seconds
→ Generate Playwright Tests

This prevents Groq burst-rate issues.

====================================

WORKFLOW CONNECTIONS

Upload PRD Form
→ Extract PRD Content
→ Generate Test Plan

Generate Test Plan
→ Save Test Plan

Generate Test Plan
→ Wait 2 sec
→ Generate Test Cases

Generate Test Cases
→ Save Test Cases

Generate Test Cases
→ Wait 2 sec
→ Generate Playwright Tests

Generate Playwright Tests
→ Save Playwright Tests

====================================

OUTPUT REQUIREMENTS

Each generated file must be downloadable.

File names must be:

test_plan.md
test_cases.csv
playwright_test_cases.md

====================================

IMPORTANT

Generate a valid importable n8n workflow JSON.

Use correct n8n expressions between nodes.

Do not create placeholder connections.

Ensure binary file outputs are preserved.

Ensure compatibility with n8n Cloud.
